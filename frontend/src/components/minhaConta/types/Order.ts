export interface OrderItem {
  nome: string;
  quantidade: number;
  preco: number;
}

export interface Order {
  id: number | string;
  data: string;
  itens: OrderItem[];
  valorTotal: number;
  status: "Entregue" | "Em trânsito" | "Cancelado" | "Preparando" | "Aguardando pagamento";
}