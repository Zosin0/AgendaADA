import { Conexoes } from './../../shared/interface';

export interface Contato {
  id: string | undefined ;
  nome: string;
  sobrenome: string;
  celular: string;
  email: string;
  dataNascimento: string;
  conexoes?: Conexoes;
}
