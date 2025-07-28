import { Component, Input } from '@angular/core';

export interface Conexao {
  servico: string;
  usuario: string;
  url: string;
  iconUrl: string;
}

export interface Contato {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  avatarUrl?: string;
  conexoes?: Conexao[];
}

@Component({
  selector: 'app-contato-perfil',
  standalone: false,
  templateUrl: './contato-perfil.html',
  styleUrl: './contato-perfil.scss'
})
export class ContatoPerfil {
  @Input() contato: Contato | null = null;

  constructor() { }

}
