import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contato } from '../../core/models/contato.model';

@Component({
  selector: 'app-contato-item',
  standalone: false,
  templateUrl: './contato-item.html',
  styleUrl: './contato-item.scss'
})

export class ContatoItem {
  @Input() contato!: Contato;

  @Output() viewProfile = new EventEmitter<Contato>();
  @Output() editContact = new EventEmitter<Contato>();
  @Output() deleteContact = new EventEmitter<Contato>();

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

  onViewProfile(): void {
    this.viewProfile.emit(this.contato);
  }

  // @Gabriel - mexe nisso tambem, por favor
  onEdit(event: MouseEvent): void {
    event.stopPropagation();
    this.editContact.emit(this.contato);
  }

  onDelete(event: MouseEvent): void {
    event.stopPropagation();
    this.deleteContact.emit(this.contato);
  }
}
