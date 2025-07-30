export interface Contato {
  id: string | undefined ;
  nome: string;
  celular: string;
  email: string;
  dataNascimento: string;
  conexoes?: Conexoes;
}

export interface Conexoes {
    telefone: string;
    whatsapp: string;
    emailPadrao: string;
    gmail: string;
    github: string;
    teams: string;
    linkedin: string;
}
