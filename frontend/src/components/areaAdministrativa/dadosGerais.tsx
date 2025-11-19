import { Card, CardTitle } from "../ui/card";
import InputError from "../InputError";
import { useState, useEffect } from "react";
import { Box, Headphones, User, Users, DollarSign, Package } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "@/services/api";

export default function DadosGerais() {

  const { usuarioAtual } = useAuth();
  // Estados de dados
  const [totalProdutos, setTotalProdutos] = useState(6);
  const [totalProdutosIsLoading, setTotalProdutosIsLoading] = useState(true);
  const [errorTotalProdutos, setErrorTotalProdutos] = useState<string | null>(null);

  const [totalClientes, setTotalClientes] = useState(5);
  const [totalClientesIsLoading, setTotalClientesIsLoading] = useState(true);
  const [errorTotalClientes, setErrorTotalClientes] = useState<string | null>(null);

  const [chamadosPendentes, setChamadosPendentes] = useState(2);
  const [chamadosPendentesIsLoading, setChamadosPendentesIsLoading] = useState(true);
  const [errorChamadosPendentes, setErrorChamadosPendentes] = useState<string | null>(null);

  const [totalFuncionarios, setTotalFuncionarios] = useState(5);
  const [totalFuncionariosIsLoading, setTotalFuncionariosIsLoading] = useState(true);
  const [errorTotalFuncionarios, setErrorTotalFuncionarios] = useState<string | null>(null);

  const [receitaMensal, setReceitaMensal] = useState(5000);
  const [receitaMensalIsLoading, setReceitaMensalIsLoading] = useState(true);
  const [errorReceitaMensal, setErrorReceitaMensal] = useState<string | null>(null);

  const [pedidosDoDia, setPedidosDoDia] = useState(2);
  const [pedidosDoDiaIsLoading, setPedidosDoDiaIsLoading] = useState(true);
  const [errorPedidosDoDia, setErrorPedidosDoDia] = useState<string | null>(null);
/*
  // Função genérica de fetch
  const fetchData = async (
  url: string,
  setData: any,
  setIsLoading: any,
  fallbackMessage: string
) => {
  try {
    const response = await api.get(url);
    setData(response.data);
  } catch (err: any) {
    if (!err.response) {
      setError("Erro de conexão");
    } else {
      setError(err.response.data?.message || fallbackMessage);
    }
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  if (!usuarioAtual) return;

  const id = usuarioAtual.id;

  fetchData(`/vendedores/${id}/dashboard/total-produtos`,
    setTotalProdutos,
    setTotalProdutosIsLoading,
    setErrorTotalProdutos,
    "Erro ao buscar total de produtos"
  );

  fetchData(`/vendedores/${id}/dashboard/total-clientes`,
    setTotalClientes,
    setTotalClientesIsLoading,
    setErrorTotalClientes,
    "Erro ao buscar clientes"
  );

  fetchData(`/vendedores/${id}/dashboard/chamados-pendentes`,
    setChamadosPendentes,
    setChamadosPendentesIsLoading,
    setErrorChamadosPendentes,
    "Erro ao buscar chamados"
  );

  fetchData(`/vendedores/${id}/dashboard/total-funcionarios`,
    setTotalFuncionarios,
    setTotalFuncionariosIsLoading,
    setErrorTotalFuncionarios,
    "Erro ao buscar funcionários"
  );

  fetchData(`/vendedores/${id}/dashboard/receita-mensal`,
    setReceitaMensal,
    setReceitaMensalIsLoading,
    setErrorReceitaMensal,
    "Erro ao buscar receita"
  );

  fetchData(`/vendedores/${id}/dashboard/pedidos-dia`,
    setPedidosDoDia,
    setPedidosDoDiaIsLoading,
    setErrorPedidosDoDia,
    "Erro ao buscar pedidos"
  );
  

}, [usuarioAtual]);

*/

  // Array de cards para simplificar renderização
  const cards = [
    { title: "Total de Produtos", value: totalProdutos, loading: false, error: null, icon: <Box className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Produtos Cadastrados" },
    { title: "Total de Clientes", value: totalClientes, loading: false, error: null, icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Clientes Cadastrados" },
    { title: "Chamados Pendentes", value: chamadosPendentes, loading: false, error: null, icon: <Headphones className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Assistência Técnica" },
    { title: "Total de Funcionários", value: totalFuncionarios, loading: false, error: null, icon: <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Funcionários Cadastrados" },
    { title: "Receita Mensal", value: `R$ ${receitaMensal}`, loading: false, error: null, icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Receita do Mês" },
    { title: "Pedidos em Processamento", value: pedidosDoDia, loading: false, error: null, icon: <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8" />, label: "Pedidos em andamento" },
  ];

  return (
    <div className="p-2 h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full justify-items-center items-center">
        {cards.map((card, idx) => (
          <Card
            key={idx}
            className="border dark:bg-gray-900 dark:border-white border-black p-3 flex flex-col justify-between w-full h-full min-h-[60px] sm:min-h-[70px] md:min-h-[80px] box-border max-w-[90%]"
          >
            {/* Cabeçalho do Card */}
            <div className="flex justify-between items-start mb-1">
              <CardTitle className="text-xs sm:text-sm md:text-base break-words">
                {card.title}
              </CardTitle>
              <div className="flex-shrink-0">{card.icon}</div>
            </div>

            {/* Corpo do Card */}
            <div className="mt-auto text-xs sm:text-sm md:text-base break-words">
              {card.loading ? (
                <p>Carregando...</p>
              ) : card.error ? (
                <InputError message={card.error || undefined} />
              ) : (
                <p className="text-lg md:text-xl lg:text-2xl font-bold pb-7">{card.value}</p>
              )}
              <p className="text-gray-500 dark:text-gray-300">{card.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>

  );
}
