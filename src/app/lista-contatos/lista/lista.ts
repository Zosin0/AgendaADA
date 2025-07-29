import { Component, OnInit } from '@angular/core';
import { ContatoService } from '../../core/contato-service';
import { Contato } from '../../core/models/contato.model';

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

  constructor(private contatoService: ContatoService) {}

  ngOnInit(): void {
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
}
