import { Component, signal, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { Formulario } from './lista-contatos/formulario/formulario';
import { Contato } from './core/models/contato.model';
import { ContatoService } from './core/contato-service';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';

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
    this.dialog.open(ContatoPerfil, {
      width: '400px',
      panelClass: 'profile-dialog-container',
      data: contato
    });
  }

  abrirFormularioCadastro(): void {
    this.abrirModalDeCadastro();
  }


  abrirModalDeCadastro() {
    const modalRef: NgbModalRef = this.modalService.open(Formulario, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.contatoParaEditar = {
      nome: 'Fulano',
      celular: '(99) 99999-9999',
      sobrenome: "Silva",
      email: "email@email.com",
      dataNascimento: "2000-10-31"
    };
  }

  abrirFormularioEdicao(contato?: Contato): void {
    const dialogRef = this.dialog.open(Formulario, {
      width: '800px',
      data: contato
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'salvo') {
        this.carregarContatos();
      }
    });
  }

  confirmarExclusao(contato: Contato): void {
    console.log('Abrir modal de confirmação para excluir:', contato.nome);
  }
}
