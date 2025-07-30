import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../../core/contato-service';
import { Contato } from '../../core/models/contato.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Formulario } from '../formulario/formulario';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista',
  standalone: false,
  templateUrl: './lista.html',
  styleUrl: './lista.scss'
})
export class Lista implements OnInit {
  contatos: Contato[] = [];
  contatosFiltrados: Contato[] = [];
  filtro: string = '';

  constructor(private contatoService: ContatoService,
              private modalService: NgbModal,
              private toastr: ToastrService) {}

              ngOnInit(): void {
                this.carregarContatos();
              }
            
              private carregarContatos(): void {
                this.contatoService.getContatos().subscribe(dados => { // Faz uma requisição HTTP para buscar os contatos
                  this.contatos = dados;// Salva os dados completos
                  this.contatosFiltrados = this.ordenarContatos(dados);
                });
              }
 // Método chamado sempre que o usuário digita no campo de busca
  filtrarContatos(): void {
    const filtro = this.filtro.toLowerCase().trim();
    this.contatosFiltrados = this.contatos.filter(c =>
      Object.values(c).some(valor =>
        valor.toLowerCase().includes(filtro)
      )
    );
    this.contatosFiltrados = this.ordenarContatos(this.contatosFiltrados);
  }
// Método para ordenar a lista alfabeticamente pelo nome
  ordenarContatos(lista: Contato[]): Contato[] {
    return lista.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  abrirWhatsApp(numero: string) {
    const numeroFormatado = numero.replace(/\D/g, '');  // Remove o que nao for numero
    window.open(`https://wa.me/${numeroFormatado}`, '_blank');
  }
  // Novo método para abrir o modal de edição de contato
  editarContato(contato: Contato): void {
    const modalRef = this.modalService.open(Formulario, { size: 'lg' });
    
    // Converter o contato do modelo da API para o modelo do formulário
    const contatoParaFormulario = {
      nome: contato.nome,
      sobrenome: '', // Assumindo que o nome completo está em 'nome'
      apelido: null,
      dataNascimento: contato.dataNascimento,
      celular: contato.telefone,
      email: contato.email
    };

    modalRef.componentInstance.contatoParaEditar = contatoParaFormulario;
    modalRef.componentInstance.idContatoParaEditar = contato.id;

    // Escutar o resultado do modal
    modalRef.result.then((contatoAtualizado) => {
      if (contatoAtualizado) {
        // Recarregar a lista de contatos após a atualização
        this.carregarContatos();
      }
    }).catch((erro) => {
      // Modal foi fechado sem salvar (cancelado)
      console.log('Modal de edição cancelado');
    });
  }

  // Novo método para deletar um contato
  deletarContato(contato: Contato): void {
    // Confirmar a exclusão com o usuário
    const confirmacao = confirm(`Tem certeza que deseja excluir o contato "${contato.nome}"?`);
    
    if (confirmacao) {
      this.contatoService.deletarContato(contato.id).subscribe({
        next: () => {
          this.toastr.success('Contato excluído com sucesso!', 'Sucesso');
          // Recarregar a lista de contatos após a exclusão
          this.carregarContatos();
        },
        error: (erro) => {
          console.error('Erro ao excluir contato:', erro);
          this.toastr.error('Erro ao excluir contato. Tente novamente.', 'Erro');
        }
      });
    }
  }

  // Método para abrir o modal de criação de novo contato
  criarNovoContato(): void {
    const modalRef = this.modalService.open(Formulario, { size: 'lg' });

    // Escutar o resultado do modal
    modalRef.result.then((novoContato) => {
      if (novoContato) {
        // Recarregar a lista de contatos após a criação
        this.carregarContatos();
      }
    }).catch((erro) => {
      // Modal foi fechado sem salvar (cancelado)
      console.log('Modal de criação cancelado');
    });
  }
}
