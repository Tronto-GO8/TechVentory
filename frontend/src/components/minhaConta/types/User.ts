export interface Endereco {
  cep: string;
  numero: string;
  cidade: string;
  rua: string;
  complemento?: string;
  bairro: string;
  estado: string;
}

export interface User {
  id_usuario?: number;
  nome: string;
  email: string;
  cpf: string;
  endereco: Endereco;
}
