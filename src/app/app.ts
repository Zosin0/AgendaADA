import { Formulario } from './lista-contatos/formulario/formulario';
import { Component, signal, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Contato } from './core/models/contato.model';
import { ContatoService } from './core/contato-service';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';
import { ToastrService } from 'ngx-toastr';

type SortOrder = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('AgendaADA');

  private contatosSubject = new BehaviorSubject<Contato[]>([]);
  private sortOrderSubject = new BehaviorSubject<SortOrder>('none');

  sortOrder$ = this.sortOrderSubject.asObservable();
  sortedContatos$: Observable<Contato[]> = combineLatest([
    this.contatosSubject.asObservable(),
    this.sortOrder$
  ]).pipe(
    map(([contatos, sortOrder]) => {
      if (sortOrder === 'asc') {
        return [...contatos].sort((a, b) => a.nome.localeCompare(b.nome));
      }
      if (sortOrder === 'desc') {
        return [...contatos].sort((a, b) => b.nome.localeCompare(a.nome));
      }
      return contatos;
    })
  );

  // TODO: @Gabriel - ARRUMAR A LOGICA DE EDIÇÃO
  constructor(
    private dialog: MatDialog,
    private contatoService: ContatoService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos() {
    this.contatoService.getContatos().subscribe(contatos => {
      this.contatosSubject.next(contatos);
    });
  }

  toggleSort() {
    const current = this.sortOrderSubject.value;
    if (current === 'none') this.sortOrderSubject.next('asc');
    else if (current === 'asc') this.sortOrderSubject.next('desc');
    else this.sortOrderSubject.next('none');
  }

  abrirPerfil(contato: Contato): void {
    const dialogRef = this.dialog.open(ContatoPerfil, {
      width: '400px',
      panelClass: 'profile-dialog-container',
      data: contato
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado) {
        this.carregarContatos();
      }
    });
  }

  abrirFormularioCadastro(): void {
    this.abrirModalDeCadastro();
  }


  abrirModalDeCadastro(contato: Contato | null = null) {
    const modalRef: NgbModalRef = this.modalService.open(Formulario, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    if (contato) {
      modalRef.componentInstance.contatoParaEditar = contato;
    }

    modalRef.result.then(
      (resultado) => {
        if (resultado) {
          this.carregarContatos();
        }
      }
    );
  }

  confirmarExclusao(contato: Contato): void {
    if (contato.id) {
      this.contatoService.deletarContato(contato.id).subscribe({
        next: () => {
          this.toastrService.success('Contato excluído com sucesso!');
          this.carregarContatos();
        },
        error: (erro) => {
          this.toastrService.error(`Erro ao excluir contato: ${erro}`);
        }
      });
    }
  }
}
