import { Component, Input, Inject, Optional } from '@angular/core';
import { Contato } from '../../core/models/contato.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Formulario } from '../formulario/formulario';
import { ContatoService } from '../../core/contato-service';

@Component({
  selector: 'app-contato-perfil',
  standalone: false,
  templateUrl: './contato-perfil.html',
  styleUrl: './contato-perfil.scss',

})
export class ContatoPerfil {

  constructor(
    public dialogRef: MatDialogRef<ContatoPerfil>,
    @Inject(MAT_DIALOG_DATA) public contato: Contato,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private contatoService: ContatoService,
  ) { }

  getIniciais(): string {
    if (!this.contato?.nome) return '?';
    const nomes = this.contato.nome.trim().split(' ');
    return nomes.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  excluirPerfil(): void {
    if (this.contato.id) {
      this.contatoService.deletarContato(this.contato.id).subscribe({
        next: () => {
          this.toastrService.success('Contato excluído com sucesso!');
          this.dialogRef.close(true);
        },
        error: (erro) => {
          this.toastrService.error(`Erro ao excluir contato: ${erro}`);
        }
      });
    }
  }

}
