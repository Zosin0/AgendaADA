import { Component, signal, OnInit } from '@angular/core';
import { Contato, Conexao } from './lista-contatos/contato-perfil/contato-perfil';
import { ContatoService } from '../app/core/contato-service';

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


  }
}
