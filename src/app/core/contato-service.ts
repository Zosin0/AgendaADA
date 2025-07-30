import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Contato } from '../core/models/contato.model';


@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contacts';

  constructor(private http: HttpClient) {}

  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl);
  }
  // Novo método para buscar um contato específico por ID
  getContatoPorId(id: string): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

  // Novo método para criar um contato
  criarContato(contato: Contato): Observable<Contato> {
    return this.http.post<Contato>(this.apiUrl, contato);
  }

  // Novo método para atualizar um contato existente
  atualizarContato(id: string, contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${id}`, contato);
  }

  // Novo método para deletar um contato
  deletarContato(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

   //  EVENTO GLOBAL DE ATUALIZAÇÃO
   private _contatoAtualizado = new Subject<void>();
   contatoAtualizado$ = this._contatoAtualizado.asObservable();
 
   emitirAtualizacao(): void {
     this._contatoAtualizado.next();
   }
}
