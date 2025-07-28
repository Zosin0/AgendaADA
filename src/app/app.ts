import { Component, signal, OnInit } from '@angular/core';
import { Contato, Conexao } from './lista-contatos/contato-perfil/contato-perfil';
import { ContatoService } from '../app/core/contato-service';

import { Component, signal } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Formulario } from './lista-contatos/formulario/formulario';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})

export class App {

  title = 'agendaada';

  constructor(private contatoService: ContatoService) {}


  meuContatoFicticio: Contato = {
    id: 1,
    nome: 'Lucas Zoser',
    email: 'lucaszoser1@gmail.com',
    telefone: '+5561999695902',
    avatarUrl: 'https://cdn-icons-png.flaticon.com/512/709/709699.png',
    conexoes: []
  };

  ngOnInit(): void {
    const dadosBase = {
      nome: this.meuContatoFicticio.nome,
      email: this.meuContatoFicticio.email,
      telefone: this.meuContatoFicticio.telefone,
    };

    const conexoesGeradas = this.contatoService.gerarConexoes(dadosBase);

    this.meuContatoFicticio.conexoes = conexoesGeradas;


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
