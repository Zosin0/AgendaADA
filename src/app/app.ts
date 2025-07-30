import { Component, signal, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject, combineLatest, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Formulario } from './lista-contatos/formulario/formulario';
import { Contato } from './core/models/contato.model';
import { ContatoService } from './core/contato-service';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';

type SortOrder = 'asc' | 'desc' | 'none';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss',
})

export class App implements OnInit {
  protected readonly title = signal('AgendaADA');

  private contatosSubject = new BehaviorSubject<Contato[]>([]);
  private sortOrderSubject = new BehaviorSubject<SortOrder>('none');

  sortOrder$ = this.sortOrderSubject.asObservable();
  sortedContatos$: Observable<Contato[]> = combineLatest([
    this.contatosSubject.asObservable(),
    this.sortOrder$
  ]).pipe(
    map(([contatos, sortOrder]) => {
      if (sortOrder === 'asc') {
        return [...contatos].sort((a, b) => a.nome.localeCompare(b.nome));
      }
      if (sortOrder === 'desc') {
        return [...contatos].sort((a, b) => b.nome.localeCompare(a.nome));
      }
      return contatos;
    })
  );

  // TODO: @Gabriel - ARRUMAR A LOGICA DE EDIÇÃO
  constructor(
    private dialog: MatDialog,
    private contatoService: ContatoService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.carregarContatos();

    this.contatoService.contatoAtualizado$.subscribe(() => {
      this.carregarContatos();
      this.toastr.success('Lista atualizada com sucesso!', 'Sucesso');
    });
  }

  

  carregarContatos() {
    this.contatoService.getContatos().subscribe(contatos => {
      this.contatosSubject.next(contatos);
    });
  }

  toggleSort() {
    const current = this.sortOrderSubject.value;
    if (current === 'none') this.sortOrderSubject.next('asc');
    else if (current === 'asc') this.sortOrderSubject.next('desc');
    else this.sortOrderSubject.next('none');
  }

  abrirPerfil(contato: Contato): void {
    const dialogRef =this.dialog.open(ContatoPerfil, {
      width: '400px',
      panelClass: 'profile-dialog-container',
      data: contato
    });

    // Escutar o resultado do dialog
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado === 'deleted') {
        // Contato foi excluído, recarregar lista
        this.carregarContatos();
        this.toastr.success('Lista atualizada após exclusão', 'Sucesso');
      } else if (resultado === 'updated') {
        // Contato foi atualizado, recarregar lista
        this.carregarContatos();
        this.toastr.success('Lista atualizada após edição', 'Sucesso');
      }
      // Se resultado for undefined ou null, dialog foi apenas fechado
    });
  }

  abrirFormularioCadastro(): void {
    this.abrirModalDeCadastro();
  }


  abrirModalDeCadastro() {
    const modalRef: NgbModalRef = this.modalService.open(Formulario, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    modalRef.componentInstance.contatoParaEditar = {
      nome: 'Fulano',
      celular: '(99) 99999-9999',
      sobrenome: "Silva",
      email: "email@email.com",
      dataNascimento: "2000-10-31"
    };
  }

  abrirFormularioEdicao(contato: Contato): void {
    const modalRef: NgbModalRef = this.modalService.open(Formulario, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false
    });
  
    const nomeCompleto = contato.nome?.trim();
    const partesNome = nomeCompleto.split(' ');
    const nome = partesNome[0] || '';
    const sobrenome = partesNome.slice(1).join(' ') || '';
  
    modalRef.componentInstance.contatoParaEditar = {
      nome: nome,
      sobrenome: sobrenome,
      apelido: null,
      dataNascimento: contato.dataNascimento,
      celular: contato.telefone || '',
      email: contato.email
    };
    modalRef.componentInstance.idContatoParaEditar = contato.id;
  
    modalRef.result.then((resultado) => {
      if (resultado) {
        this.carregarContatos();
        this.toastr.success('Contato atualizado!', 'Sucesso');
      }
    }).catch((erro) => {
      console.log('Modal de edição cancelado:', erro);
    });
  }

    
  

  confirmarExclusao(contato: Contato): void {
    const confirmacao = confirm(`⚠️ ATENÇÃO!\n\nDeseja excluir o contato "${contato.nome}"?\n\nEsta ação não pode ser desfeita.`);
    
    if (confirmacao) {
      this.toastr.info('Excluindo contato...', 'Aguarde');
      
      this.contatoService.deletarContato(contato.id).subscribe({
        next: () => {
          this.toastr.success(`Contato "${contato.nome}" excluído!`, 'Sucesso');
          this.carregarContatos();
        },
        error: (erro: any) => {
          console.error('Erro ao excluir contato:', erro);
          
          let mensagemErro = 'Erro ao excluir contato. Tente novamente.';
          if (erro.status === 404) {
            mensagemErro = 'Contato não encontrado.';
          } else if (erro.status === 0) {
            mensagemErro = 'Erro de conexão. Verifique sua internet.';
          }
          
          this.toastr.error(mensagemErro, 'Erro');
        }
      });
    }
}
}