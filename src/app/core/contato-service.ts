import { Injectable } from '@angular/core';
import { Contato, Conexao } from '../../app/lista-contatos/contato-perfil/contato-perfil';

@Injectable({
  providedIn: 'root'
})
export class ContatoService {

  constructor() { }

  /**
   * Recebe os dados base de um contato e retorna uma lista de conexões geradas.
   * @param dadosBase - Objeto com nome, email e telefone.
   * @returns Um array de Conexao[] com URLs interpoladas.
   */

  gerarConexoes(dadosBase: { nome: string, email: string, telefone: string }): Conexao[] {
    const { nome, email, telefone } = dadosBase;
    const conexoes: Conexao[] = [];


    if (telefone) {
      const numeroLimpo = telefone.replace(/\D/g, '');
      conexoes.push({
        servico: 'WhatsApp',
        usuario: telefone,
        url: `https://wa.me/${numeroLimpo}`,
        iconUrl: 'https://www.svgrepo.com/show/271149/whatsapp.svg'
      });
      conexoes.push({
        servico: 'Ligar para o celular',
        usuario: telefone,
        url: `tel:${numeroLimpo}`,
        iconUrl: 'https://www.svgrepo.com/show/522681/telephone-outgoing.svg'
      });
    }

    if (email) {
      conexoes.push({
        servico: 'Gmail',
        usuario: 'Abrir no Gmail',
        url: `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
        iconUrl: 'https://www.svgrepo.com/show/452213/gmail.svg'
      });
      conexoes.push({
        servico: 'Enviar Email',
        usuario: 'Abrir app padrão',
        url: `mailto:${email}`,
        iconUrl: 'https://www.svgrepo.com/show/501173/email.svg'
      });
    }

    if (email) {
      conexoes.push({
        servico: 'Microsoft Teams',
        usuario: 'Iniciar chat',
        url: `msteams:lanchat?users=${email}`,
        iconUrl: 'https://www.svgrepo.com/show/452111/teams.svg'
      });
    }

    conexoes.push({
        servico: 'Discord',
        usuario: 'Adicionar Amigo',
        url: 'https://discord.com/channels/@me',
        iconUrl: 'https://www.svgrepo.com/show/452188/discord.svg'
    });


    if (nome) {
      conexoes.push({
        servico: 'LinkedIn',
        usuario: `Buscar "${nome}"`,
        url: `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(nome)}`,
        iconUrl: 'https://www.svgrepo.com/show/157006/linkedin.svg'
      });
    }

    if (email) {
       const username = email.split('@')[0];
       conexoes.push({
        servico: 'GitHub',
        usuario: `Buscar por "${username}"`,
        url: `https://github.com/search?q=${encodeURIComponent(username)}&type=users`,
        iconUrl: 'https://www.svgrepo.com/show/512317/github-142.svg'
      });
    }

    return conexoes;
  }
}
