export interface Conexoes {
    telefone: string;
    whatsapp: string;
    emailPadrao: string;
    gmail: string;
    github: string;
    teams: string;
    linkedin: string;
}

export interface Contato {
    nome: string;
    dataNascimento: string;
    celular: string;
    email: string;
    conexoes: Conexoes
}