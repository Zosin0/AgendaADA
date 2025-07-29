import { Component, Input } from '@angular/core';
import { Contato } from '../../core/models/contato.model';


@Component({
  selector: 'app-contato-perfil',
  standalone: false,
  templateUrl: './contato-perfil.html',
  styleUrl: './contato-perfil.scss',

})
export class ContatoPerfil {
  @Input() contato: Contato | null = null;

  constructor() { }

}
