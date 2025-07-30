import { Component, Input, Inject } from '@angular/core';
import { Contato } from '../../core/models/contato.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Formulario } from '../formulario/formulario';
import { ContatoService } from '../../core/contato-service';
import { ToastrService } from 'ngx-toastr';

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
    private contatoService: ContatoService,
    private toastr: ToastrService
  ) {}

  getIniciais(): string {
    if (!this.contato?.nome) return '?';
    const nomes = this.contato.nome.trim().split(' ');
    return nomes.map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
  // TODO: @ Gabriel - mexe nisso tambem, por favor
  editarPerfil(): void {
    // Fechar o dialog atual
    this.dialogRef.close();
    
    // Abrir o modal de formulário para edição
    const modalRef = this.modalService.open(Formulario, { size: 'lg' });
    
     // Preparar os dados para o formulário
    // Separar nome completo em nome e sobrenome
    const nomeCompleto = this.contato.nome.trim();
    const partesNome = nomeCompleto.split(' ');
    const nome = partesNome[0] || '';
    const sobrenome = partesNome.slice(1).join(' ') || '';
    // Converter o contato do modelo da API para o modelo do formulário
    const contatoParaFormulario = {
      nome: this.contato.nome,
      sobrenome: '', // Assumindo que o nome completo está em 'nome'
      apelido: null,
      dataNascimento: this.contato.dataNascimento,
      celular: this.contato.telefone,
      email: this.contato.email
    };

    modalRef.componentInstance.contatoParaEditar = contatoParaFormulario;
    modalRef.componentInstance.idContatoParaEditar = this.contato.id;

    // Escutar o resultado do modal
    modalRef.result.then((contatoAtualizado) => {
      if (contatoAtualizado) {
        //this.toastr.success('Contato atualizado com sucesso!', 'Sucesso');
        this.dialogRef.close('updated');
        this.contatoService.emitirAtualizacao();
        // Aqui você pode emitir um evento para atualizar a lista principal
        // ou implementar uma lógica de refresh
      }
    }).catch((erro) => {
      // Modal foi fechado sem salvar (cancelado)
      console.log('Modal de edição cancelado');
    });
  }

  excluirPerfil(): void {
    // Criar uma confirmação mais robusta
    const nomeContato = this.contato.nome;
    const confirmacao = this.confirmarExclusao(nomeContato);

    
    
    if (confirmacao) {
      this.toastr.info('Excluindo contato...', 'Aguarde');
      
      this.contatoService.deletarContato(this.contato.id).subscribe({
        next: () => {
          this.toastr.success(`Contato "${nomeContato}" excluído com sucesso!`, 'Sucesso');
          // Fechar o dialog e informar que houve exclusão
          this.dialogRef.close('deleted');
        },
        error: (erro) => {
          console.error('Erro ao excluir contato:', erro);
          
          // Tratamento mais específico de erros
          let mensagemErro = 'Erro ao excluir contato. Tente novamente.';
          
          if (erro.status === 404) {
            mensagemErro = 'Contato não encontrado.';
          } else if (erro.status === 0) {
            mensagemErro = 'Erro de conexão. Verifique sua internet.';
          } else if (erro.status >= 500) {
            mensagemErro = 'Erro interno do servidor. Tente novamente mais tarde.';
          }
          
          this.toastr.error(mensagemErro, 'Erro');
        }
      });
    }
  }
  private confirmarExclusao(nomeContato: string): boolean {
    const mensagem = `⚠️ ATENÇÃO!\n\nVocê tem certeza que deseja excluir o contato:\n"${nomeContato}"\n\nEsta ação não pode ser desfeita.`;
    return confirm(mensagem);
  }
  
  /**
   * Método para fechar o dialog sem ações
   */
  fecharDialog(): void {
    this.dialogRef.close();
  }
}


