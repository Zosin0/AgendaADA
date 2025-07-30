import { Component, OnInit, signal } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Contato } from './core/models/contato.model';
import { ContatoService } from './core/contato-service';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';
import { Formulario } from './lista-contatos/formulario/formulario';
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
  private filterSubject = new BehaviorSubject<string>('');

  sortOrder$ = this.sortOrderSubject.asObservable();

  sortedContatos$: Observable<Contato[]> = combineLatest([
    this.contatosSubject.asObservable(),
    this.sortOrder$,
    this.filterSubject.asObservable()
  ]).pipe(
    map(([contatos, sortOrder, filterTerm]) => {
      let filteredContatos = [...contatos];

      if (filterTerm) {
        const lowerCaseFilter = filterTerm.toLowerCase().trim();
        filteredContatos = filteredContatos.filter(contato =>
          Object.values(contato).some(valor =>
            String(valor).toLowerCase().includes(lowerCaseFilter)
          )
        );
      }

      if (sortOrder === 'asc') {
        return filteredContatos.sort((a, b) => a.nome.localeCompare(b.nome));
      }
      if (sortOrder === 'desc') {
        return filteredContatos.sort((a, b) => b.nome.localeCompare(a.nome));
      }

      return filteredContatos;
    })
  );

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


  onFilterChange(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterSubject.next(filterValue);
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
