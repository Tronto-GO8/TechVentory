import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowDownToLine } from "lucide-react";
import { Modulos } from "@/components/ui/modulos";
import { useEffect, useState } from "react";
import ModalDadosAssistenciaProduto from "./modalDadosAssistenciaProduto";

const token = localStorage.getItem("token");

interface TabelaUsuariosProps {
  moduloAtivo: Modulos;
  selecionarModulo: (modulo: Modulos) => void;
}

interface Chamados {
  id: number;
  produto: string;
  status: "Na loja" | "Fora da loja" | "Finalizado" | "cancelado" | "Em andamento";
  dataDoPedido: Date;
  descricao: string;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: number;
}

export default function TabelaPedidosdeAssistencia({
  moduloAtivo,
  selecionarModulo,
}: TabelaUsuariosProps) {
  const [mostrarDadoschamados, setmostrarDadoschamados] = useState(false);
  const [itemSelecionadoId, setitemSelecionadoId] = useState<number | null>(null);
  const [pesquisarChamado, setpesquisarChamado] = useState("");
  const [erropesquisarChamado, setErropesquisarChamado] = useState<string | null>(null);
  const [loadingTabela, setLoadingTabela] = useState(false);
  const [errorTabela, setErrorTabela] = useState<string | null>(null);
  const [filtroStatus, setFiltroStatus] = useState<string>("");
  const [valorFiltro, setValorFiltro] = useState<string>("");
  const [pedidos, setpedidos] = useState<Chamados[]>([
    {
      id: 1,
      produto: "Notebook Gamer X-15",
      status: "Em andamento",
      dataDoPedido: new Date("2025-10-20"),
      descricao:
        "Cliente relatou superaquecimento durante jogos pesados. Foi feita a limpeza interna e troca de pasta térmica.",
      nomeCliente: "Lucas Andrade",
      emailCliente: "lucas.andrade@email.com",
      telefoneCliente: 11987654321,
    },
    {
      id: 2,
      produto: "Smartphone Galaxy S22",
      status: "Na loja",
      dataDoPedido: new Date("2025-10-25"),
      descricao:
        "Tela trincada após queda. Aguardando aprovação de orçamento para substituição da tela e calibração do touch.",
      nomeCliente: "Beatriz Souza",
      emailCliente: "beatriz.souza@email.com",
      telefoneCliente: 11999887766,
    },
    {
      id: 3,
      produto: "Headset HyperSound V2",
      status: "Finalizado",
      dataDoPedido: new Date("2025-09-28"),
      descricao:
        "Problema de som no lado esquerdo resolvido após substituição do cabo interno. Testado e entregue ao cliente.",
      nomeCliente: "Marcos Pereira",
      emailCliente: "marcos.pereira@email.com",
      telefoneCliente: 11988776655,
    },
  ]);

  const [chamadosFiltrados, setChamadosFiltrados] = useState<Chamados[]>(pedidos);

  async function getpedidos() {
    setLoadingTabela(true);
    try {
      const response = await fetch(`/api/pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Falha ao buscar dados");

      const data = await response.json();
      if (data.length === 0) {
        setErrorTabela("Nenhum produto encontrado.");
        return;
      }
      setpedidos(data);
      setChamadosFiltrados(data);
      setErrorTabela(null);
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setErrorTabela("Erro de conexão: não foi possível buscar os dados.");
      } else {
        setErrorTabela((err as Error).message);
      }
    } finally {
      setLoadingTabela(false);
    }
  }

  useEffect(() => {
    getpedidos();
  }, []);

  useEffect(() => {
    const filtrados = pedidos
      .filter((chamado) => {
        if (!valorFiltro) return true;
        const busca = valorFiltro.toLowerCase();
        return (
          chamado.nomeCliente.toLowerCase().includes(busca) ||
          chamado.id.toString().includes(busca)
        );
      })
      .filter((chamado) => {
        if (!filtroStatus || filtroStatus === "todos") return true;
        return chamado.status.toLowerCase() === filtroStatus.toLowerCase();
      });
    setChamadosFiltrados(filtrados);
  }, [valorFiltro, filtroStatus, pedidos]);

  return (
    <div className="flex flex-col dark:bg-gray-900  gap-2 h-full absolute sm:top-0 top-[0px] left-0 right-0 bottom-0 z-50 sm:relative sm:z-auto bg-white text-gray-200">
      {/* BARRA DE CONTROLE */}
      <Card className="flex flex-col dark:bg-gray-900 dark:border-white sm:flex-row flex-wrap sm:flex-nowrap justify-between items-center w-full p-2 gap-3 bg-white border-black border shadow-md">
        <div className="flex flex-wrap sm:flex-nowrap dark:border-white items-center gap-2 w-full justify-start">
          <Button
            onClick={() => selecionarModulo("vazio")}
            className="block sm:hidden w-auto bg-[#13678A] hover:bg-[#178FB5] text-white"
          >
            <ArrowDownToLine />
          </Button>

          <Button
            onClick={() => {
              setmostrarDadoschamados(true);
              setitemSelecionadoId(null);
            }}
            className="w-auto bg-[#13678A] hover:bg-[#178FB5] text-white"
          >
            + Novo chamado
          </Button>

          <select
            className="min-w-[150px] bg-white text-black border border-[#303030] rounded-md px-2 py-2 text-gray-200 focus:ring-[#13678A] focus:border-[#13678A]"
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="todos">Todos os chamados</option>
            <option value="Na loja">Na loja</option>
            <option value="Fora da loja">Fora da loja</option>
            <option value="Finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
            <option value="Em andamento">Em andamento</option>
          </select>
        </div>

        {/* Campo de busca */}
        <div className="flex flex-row dark:bg-gray-900 flex-1 gap-2 justify-end w-full sm:w-auto">
          <Input
            onChange={(event) => {
              setpesquisarChamado(event.target.value);
              if (erropesquisarChamado) setErropesquisarChamado(null);
            }}
            placeholder="Digite o código ou cliente"
            className={`w-full min-w-[500px] bg-white text-gray-200 border border-[#303030] focus:border-[#13678A] focus:ring-[#13678A] ${
              erropesquisarChamado ? "border-red-500 focus:ring-red-500" : ""
            }`}
          />
          <Button
            onClick={() => getpedidos()}
            className="w-auto bg-[#13678A] hover:bg-[#178FB5] text-white"
          >
            <Search />
          </Button>
        </div>
      </Card>

      {/* TABELA */}
      <Card className="w-full dark:bg-gray-900 dark:border-white p-2 gap-2 bg-white border-black text-gray-200 flex-1 overflow-hidden">
        {loadingTabela ? (
          <p className="text-center p-4">Carregando...</p>
        ) : errorTabela ? (
          <p className="text-center p-4 text-red-400">{errorTabela}</p>
        ) : chamadosFiltrados.length === 0 ? (
          <p className="text-center p-4">Nenhum produto encontrado</p>
        ) : (
          <div className="overflow-auto dark:bg-gray-900 h-full">
            <table className="min-w-full dark:bg-gray-900 border-collapse text-gray-200">
              <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10 text-[#13678A] uppercase">
                <tr>
                  <th className="dark:bg-gray-900 p-2 text-center">Chamado</th>
                  <th className="dark:bg-gray-900 p-2 text-center">Cliente</th>
                  <th className="dark:bg-gray-900 p-2 text-center">Produto</th>
                  <th className="dark:bg-gray-900 p-2 text-center">Status</th>
                  <th className="dark:bg-gray-900 p-2 text-center">Visualizar</th>
                </tr>
              </thead>
              <tbody>
                {chamadosFiltrados.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white transition-colors"
                  >
                    <td className="dark:bg-gray-900 bg-white p-2 text-center">{user.id}</td>
                    <td className="dark:bg-gray-900 bg-white p-2 text-center">{user.nomeCliente}</td>
                    <td className="dark:bg-gray-900 bg-white p-2 text-center">{user.produto}</td>
                    <td className="dark:bg-gray-900 bg-white p-2 text-center">{user.status}</td>
                    <td className="dark:bg-gray-900 bg-white p-2 text-center">
                      <Button
                        className="bg-[#13678A] hover:bg-[#178FB5] text-white px-3 py-1"
                        onClick={() => {
                          setitemSelecionadoId(user.id);
                          setmostrarDadoschamados(true);
                        }}
                      >
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {mostrarDadoschamados && (
        <ModalDadosAssistenciaProduto
          idItem={itemSelecionadoId ?? undefined}
          setMostrarDados={setmostrarDadoschamados}
          atualizarLista={getpedidos}
        />
      )}
    </div>
  );
}
