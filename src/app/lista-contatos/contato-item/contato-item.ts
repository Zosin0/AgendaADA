import { Component, Input, OnInit } from '@angular/core';
import { Contato } from '../../core/models/contato.model';

@Component({
  selector: 'app-contato-item',
  standalone: false,
  templateUrl: './contato-item.html',
  styleUrl: './contato-item.scss'
})

export class ContatoItem {
  @Input() contato!: Contato;

  constructor() { }

  /**
   * Gera as iniciais do nome para serem usadas no avatar.
   * @returns
  */
  getIniciais(): string {
    if (!this.contato?.nome) {
      return '?';
    }
    const nomes = this.contato.nome.trim().split(' ');
    const iniciais = nomes.map(n => n[0]).join('');
    return iniciais.substring(0, 2).toUpperCase();
  }
}
