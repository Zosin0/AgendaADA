import { Component, signal } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Formulario } from './lista-contatos/formulario/formulario';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('AgendaADA');



  constructor(
    private modalService: NgbModal,
  ) { }

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
