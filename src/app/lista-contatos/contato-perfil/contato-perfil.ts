import { Component, Input, Inject } from '@angular/core';
import { Contato } from '../../core/models/contato.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-contato-perfil',
  standalone: false,
  templateUrl: './contato-perfil.html',
  styleUrl: './contato-perfil.scss',

})
export class ContatoPerfil {

  constructor(
    public dialogRef: MatDialogRef<ContatoPerfil>,
    @Inject(MAT_DIALOG_DATA) public contato: Contato
  ) {}

  getIniciais(): string {
    if (!this.contato?.nome) return '?';
    const nomes = this.contato.nome.trim().split(' ');
    return nomes.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  // TODO: @ Gabriel - mexe nisso tambem, por favor
  editarPerfil(): void {
    console.log('Implementar lógica de edição para:', this.contato);
  }

  excluirPerfil(): void {
    console.log('Implementar lógica de exclusão para:', this.contato);
  }

}
