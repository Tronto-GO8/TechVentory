export interface Chamado {
   id: number | string; 
  titulo: string;
  descricao?: string;
  dataAbertura: string;
  status: "em_analise" | "concertado" | "cancelado";
}
