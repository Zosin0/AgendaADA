import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Contato } from '../../core/models/contato.model';
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
  @Input() id?: string;

  constructor(
    @Optional() protected activeModal: NgbActiveModal,
    //protected activeModal: NgbActiveModal,
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private ContatoService: ContatoService,
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
      celular: [null, [Validators.required]],
      dataNascimento: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  private popularFormularioComDados(): void {
    if (!this.contatoParaEditar) return;

    const {
      nome,
      celular,
      dataNascimento,
      email,
    } = this.contatoParaEditar;

    this.formulario.patchValue({
      nome: nome ?? '',
      celular: celular ?? '',
      dataNascimento: new Date(dataNascimento),
      email: email ?? '',
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
    return this.contatoParaEditar && this.contatoParaEditar.id ? "Editar Contato" : "Criar Contato";
  }

  enviarDados(): void {

    if (this.contatoParaEditar && this.contatoParaEditar.id) {
      this.ContatoService.atualizarContato(this.formulario.value, this.contatoParaEditar.id).subscribe({
        next: (contatoCriado) => {
          // Sucesso
          console.log('Contato editado com sucesso!', contatoCriado);
          if (this.activeModal) {
            this.activeModal.close(true);
          }
          this.toastrService.success('Contato editado com sucesso!');
        },
        error: (erro) => {

          console.error('Erro ao editar contato:', erro);
          this.toastrService.error(`Erro ao criar contato: ${erro}`);
        },
        complete: () => {
          console.log('Requisição de edição de contato finalizada.');
        }
      });
    } else {
      this.ContatoService.criarContato(this.formulario.value).subscribe({
        next: (contatoCriado) => {
          // Sucesso
          console.log('Contato criado com sucesso!', contatoCriado);
          if (this.activeModal) {
            this.activeModal.close(true);
          }
          this.toastrService.success('Contato criado com sucesso!');
        },
        error: (erro) => {

          console.error('Erro ao criar contato:', erro);
          this.toastrService.error(`Erro ao criar contato: ${erro}`);
        },
        complete: () => {
          console.log('Requisição de criação de contato finalizada.');
        }
      });
    }
  }
}
