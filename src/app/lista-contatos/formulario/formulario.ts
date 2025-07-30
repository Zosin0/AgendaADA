import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contato } from '../../shared/interface';
import { ContatoService } from '../../core/contato-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-formulario',
  standalone: false,
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss'
})
export class Formulario {

  @Input() contatoParaEditar?: Contato;
  @Input() idContatoParaEditar?: string; // ID do contato para edição

  constructor(
    protected activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private contatoService: ContatoService,
    private toastr: ToastrService
  ) { }

  formulario!: FormGroup;

  ngOnInit() {

    this.inicializarFormulario();
    this.formulario.markAllAsTouched();

    if (this.contatoParaEditar) {
      this.popularFormularioComDados();
    }
  }

  private formatarData(data: Date | null | undefined): string {
    if (!data) {
      return '';
    }

    const dataFormatada = this.datePipe.transform(data, 'yyyy-MM-dd');
    return dataFormatada ?? '';
  }

  private inicializarFormulario(): void {
    this.formulario = this.fb.group({
      nome: [null, [Validators.required, Validators.maxLength(30), Validators.minLength(1)]],
      sobrenome: [null, [Validators.required, Validators.maxLength(70), Validators.minLength(1)]],
      celular: [null, [Validators.required]],
      dataNascimento: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  private popularFormularioComDados(): void {
    if (!this.contatoParaEditar) return;

    const { nome, sobrenome, celular, dataNascimento, email } = this.contatoParaEditar;

    this.formulario.patchValue({
      nome: nome ?? '',
      sobrenome: sobrenome ?? '',
      celular: celular ?? '',
      dataNascimento: new Date(dataNascimento),
      email: email ?? ''
    });
  }


  definirMensagemErro(campo: string): string | undefined {
    const control = this.formulario.get(campo);

    if (!control || !control.errors) return undefined;

    if (control.hasError('required')) return 'Campo obrigatório.';

    if (control.hasError('email')) return 'Email inválido.';

    if (control.hasError('maxlength')) {
      const erro = control.getError('maxlength');
      return `Máximo de ${erro.requiredLength} caracteres permitidos.`;
    }

    if (control.hasError('minlength')) {
      const erro = control.getError('minlength');
      return `Mínimo de ${erro.requiredLength} caracteres exigidos.`;
    }

    return undefined;
  }

  definirToolTipBtnSalvar(): string | null {
    return !this.formulario.valid ? "O formulário está inválido." : null;
  }

  definirTituloFormulario(): string {
    return this.contatoParaEditar ? "Editar Contato" : "Criar Contato";
  }
  definirTextoBotaoSalvar(): string {
    return this.contatoParaEditar ? "Atualizar contato" : "Cadastrar contato";
  }

  enviarDados(): void {
    if (!this.formulario.valid) {
      this.toastr.error('Formulário inválido. Verifique os campos.', 'Erro');
      return;
    }

    // Preparar os dados do formulário
    const dadosFormulario = this.formulario.value;
    const contatoData: Contato = {
      nome: dadosFormulario.nome,
      sobrenome: dadosFormulario.sobrenome,
      apelido: null, // Pode ser expandido futuramente
      dataNascimento: this.formatarData(dadosFormulario.dataNascimento),
      celular: dadosFormulario.celular,
      email: dadosFormulario.email
    };

    if (this.contatoParaEditar && this.idContatoParaEditar) {
      // Modo de edição - atualizar contato existente
      this.atualizarContato(contatoData);
    } else {
      // Modo de criação - criar novo contato
      this.criarContato(contatoData);
    }
  }
  private atualizarContato(contato: Contato): void {
    if (!this.idContatoParaEditar) {
      this.toastr.error('ID do contato não encontrado.', 'Erro');
      return;
    }

    const contatoAtualizado = {
      ...contato,
      id: this.idContatoParaEditar
    };

    this.contatoService.atualizarContato(this.idContatoParaEditar, contatoAtualizado).subscribe({
      next: (contatoAtualizado) => {
        this.toastr.success('Contato atualizado com sucesso!', 'Sucesso');
        this.activeModal.close(contatoAtualizado); // Retorna o contato atualizado
      },
      error: (erro) => {
        console.error('Erro ao atualizar contato:', erro);
        this.toastr.error('Erro ao atualizar contato. Tente novamente.', 'Erro');
      }
    });
  }private criarContato(contato: Contato): void {
    // Gerar um ID único para o novo contato
    const novoContato = {
      ...contato,
      id: Date.now().toString() // ID simples baseado em timestamp
    };

    this.contatoService.criarContato(novoContato).subscribe({
      next: (contatoCriado) => {
        this.toastr.success('Contato criado com sucesso!', 'Sucesso');
        this.activeModal.close(contatoCriado); // Retorna o contato criado
      },
      error: (erro) => {
        console.error('Erro ao criar contato:', erro);
        this.toastr.error('Erro ao criar contato. Tente novamente.', 'Erro');
      }
    });
  }
}
