import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contato } from '../../shared/interface';

@Component({
  selector: 'app-formulario',
  standalone: false,
  templateUrl: './formulario.html',
  styleUrl: './formulario.scss'
})
export class Formulario {

  @Input() contatoParaEditar?: Contato;

  constructor(
    protected activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private datePipe: DatePipe,
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

  enviarDados(): void {
    console.log(this.formatarData(this.formulario.get('dataNascimento')?.value));
    console.log(this.formulario.get('nome')?.value);
    // this.activeModal.close();
  }
}
