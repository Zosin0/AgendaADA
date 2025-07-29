import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
}
