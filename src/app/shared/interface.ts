export interface Contato {
    nome: string;
    sobrenome: string;
    apelido: string | null;
    dataNascimento: string;
    celular: string;
    email: string;
    telefone?: string;   // <-- torne esses dois opcionais
    whatsapp?: string;   // <-- assim eles não causam erro
}