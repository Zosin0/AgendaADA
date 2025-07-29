import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contato } from './models/contato.model'; // Importe a interface Contato

@Injectable({
  providedIn: 'root'
})
export class ContatoService {
  private apiUrl = 'http://localhost:3000/contacts'; 

 
  
  constructor(private http: HttpClient) { }

 
  criarContato(novoContato: Contato): Observable<Contato> {
    console.log('Enviado contato para a API:', novoContato);
   // delete novoContato.id;
    return this.http.post<Contato>(this.apiUrl, novoContato);
    


  }

  
  getContatos(): Observable<Contato[]> {
    return this.http.get<Contato[]>(this.apiUrl);
  }


  getContatoById(id: string): Observable<Contato> {
    return this.http.get<Contato>(`${this.apiUrl}/${id}`);
  }

 
  atualizarContato(contato: Contato): Observable<Contato> {
    return this.http.put<Contato>(`${this.apiUrl}/${contato.id}`, contato);
  }

 
  deletarContato(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}