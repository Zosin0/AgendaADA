import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Formulario } from './lista-contatos/formulario/formulario';
import { Lista } from './lista-contatos/lista/lista';
import { ContatoItem } from './lista-contatos/contato-item/contato-item';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';

@NgModule({
  declarations: [
    App,
    Formulario,
    Lista,
    ContatoItem,
    ContatoPerfil
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
