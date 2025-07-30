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
    this.contatoService.getContatos().subscribe(dados => { 
      this.contatos = dados;
      this.contatosFiltrados = this.ordenarContatos(dados);
    });
  }

  filtrarContatos(): void {
    const filtro = this.filtro.toLowerCase().trim();
    this.contatosFiltrados = this.contatos.filter(c =>
      Object.values(c).some(valor =>
        valor.toLowerCase().includes(filtro)
      )
    );
    this.contatosFiltrados = this.ordenarContatos(this.contatosFiltrados);
  }

  ordenarContatos(lista: Contato[]): Contato[] {
    return lista.sort((a, b) => a.nome.localeCompare(b.nome));
  }

  abrirWhatsApp(numero: string) {
    const numeroFormatado = numero.replace(/\D/g, '');
    window.open(`https://wa.me/${numeroFormatado}`, '_blank');
  }
}
