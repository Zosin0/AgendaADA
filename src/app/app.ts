import { Component, signal, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Formulario } from './lista-contatos/formulario/formulario';
// add do service para buscar contatos
import { Contato } from './core/models/contato.model';
import { ContatoService } from './core/contato-service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})

export class App implements OnInit {
  protected readonly title = signal('AgendaADA');

  constructor(
    private contatoService: ContatoService,
    private modalService: NgbModal,
  ) { }

  contatos$!: Observable<Contato[]>;

  ngOnInit(): void {
    this.carregarContatos();
  }

  carregarContatos() {
    this.contatos$ = this.contatoService.getContatos();
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
}
