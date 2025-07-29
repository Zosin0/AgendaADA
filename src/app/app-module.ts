import { LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Formulario } from './lista-contatos/formulario/formulario';
import { Lista } from './lista-contatos/lista/lista';
import { ContatoItem } from './lista-contatos/contato-item/contato-item';
import { ContatoPerfil } from './lista-contatos/contato-perfil/contato-perfil';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(localePt);

export const MY_DATE_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'dd/MM/yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd/MM/yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  }
};

@NgModule({
  declarations: [
    App,
    Formulario,
    Lista,
    ContatoItem,
    ContatoPerfil,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    MatTooltipModule,
    MatNativeDateModule,
    NgxMaskDirective,
    FormsModule,
    MatIconModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideNgxMask(),
    provideHttpClient(),
    DatePipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  bootstrap: [App]
})
export class AppModule { }
