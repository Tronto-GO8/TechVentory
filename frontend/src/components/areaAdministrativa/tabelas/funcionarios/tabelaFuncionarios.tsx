import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowDownToLine } from "lucide-react";
import { Modulos } from "@/components/ui/modulos";
import { useEffect, useState } from "react";
import ModalDadosFuncionarios from "./modalDadosFuncionarios";

// TOKEN
const token = localStorage.getItem("token");

interface TabelaFuncionariosProps {
  moduloAtivo: Modulos;
  selecionarModulo: (modulo: Modulos) => void;
}

// 🔹 Modelo atualizado de Funcionário
interface Funcionario {
  id: number;
  nome: string;
  cargo: "Gerente" | "Técnico" | "Vendedor";
  dataAdmissao: Date;
  email: string;
  telefone: number;
}

export default function TabelaFuncionarios({
  moduloAtivo,
  selecionarModulo,
}: TabelaFuncionariosProps) {
  const [mostrarDadosFuncionario, setMostrarDadosFuncionario] = useState(false);
  const [funcionarioSelecionadoId, setFuncionarioSelecionadoId] = useState<number | null>(null);
  const [pesquisarFuncionario, setPesquisarFuncionario] = useState("");
  const [erroPesquisarFuncionario, setErroPesquisarFuncionario] = useState<string | null>(null);
  const [loadingTabela, setLoadingTabela] = useState(false);
  const [errorTabela, setErrorTabela] = useState<string | null>(null);
  const [filtroCargo, setFiltroCargo] = useState<string>("todos");
  const [valorFiltro, setValorFiltro] = useState<string>("");

  // 🔹 Dados de exemplo
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([
    {
      id: 1,
      nome: "Lucas Andrade",
      cargo: "Técnico",
      dataAdmissao: new Date("2022-03-15"),
      email: "lucas.andrade@email.com",
      telefone: 11987654321,
    },
    {
      id: 2,
      nome: "Beatriz Souza",
      cargo: "Gerente",
      dataAdmissao: new Date("2020-08-10"),
      email: "beatriz.souza@email.com",
      telefone: 11999887766,
    },
    {
      id: 3,
      nome: "Marcos Pereira",
      cargo: "Vendedor",
      dataAdmissao: new Date("2023-05-02"),
      email: "marcos.pereira@email.com",
      telefone: 11988776655,
    },
  ]);

  const [funcionariosFiltrados, setFuncionariosFiltrados] = useState<Funcionario[]>(funcionarios);

  // 🔹 Buscar funcionários (inicial)
  async function getFuncionarios() {
    setLoadingTabela(true);
    try {
      const response = await fetch(`/api/funcionarios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Falha ao buscar dados");

      const data = await response.json();
      if (data.length === 0) {
        setErrorTabela("Nenhum funcionário encontrado.");
        return;
      }
      setFuncionarios(data);
      setFuncionariosFiltrados(data);
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
  /*
  useEffect(() => {
    getFuncionarios();
  }, []);
  */

  // 🔹 Buscar funcionário por nome ou ID
  async function getFuncionarioPorNomeOuId() {
    if (!pesquisarFuncionario.trim()) {
      setErroPesquisarFuncionario(null);
      setFuncionariosFiltrados(funcionarios);
      return;
    }

    const termo = pesquisarFuncionario.toLowerCase();

    // Se o termo for número → busca por ID
    const filtrados = funcionarios.filter(
      (func) =>
        func.nome.toLowerCase().includes(termo) ||
        func.id.toString().includes(termo)
    );

    if (filtrados.length === 0) {
      setErrorTabela("Nenhum funcionário encontrado.");
    } else {
      setErrorTabela(null);
    }

    setFuncionariosFiltrados(filtrados);
  }

  // 🔹 Filtro e ordenação lógica
  useEffect(() => {
    const filtrados = funcionarios
      .filter((func) => {
        if (!valorFiltro) return true;
        const busca = valorFiltro.toLowerCase();
        return (
          func.nome.toLowerCase().includes(busca) ||
          func.id.toString().includes(busca)
        );
      })
      .filter((func) => {
        if (filtroCargo === "todos" || !filtroCargo) return true;
        return func.cargo.toLowerCase() === filtroCargo.toLowerCase();
      })
      .sort((a, b) => {
        const ordemCargo: Funcionario["cargo"][] = [
          "Gerente",
          "Técnico",
          "Vendedor",
        ];
        const indexA = ordemCargo.indexOf(a.cargo);
        const indexB = ordemCargo.indexOf(b.cargo);
        return indexA - indexB;
      });

    setFuncionariosFiltrados(filtrados);
  }, [valorFiltro, filtroCargo, funcionarios]);

  return (
    <>
      <div className="flex flex-col gap-2 h-full absolute sm:top-0 top-[0px] left-0 right-0 bottom-0 z-50 sm:relative sm:z-auto bg-white dark:bg-gray-900">
        <Card className="flex flex-col dark:bg-gray-900 dark:border-white sm:flex-row flex-wrap sm:flex-nowrap justify-between items-center w-full p-2 gap-3 border border-black">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full justify-start">
            <Button
              onClick={() => selecionarModulo("vazio")}
              className="block sm:hidden w-auto bg-transparent dark:bg-transparent"
            >
              <ArrowDownToLine />
            </Button>

            <Button
              onClick={() => {
                setMostrarDadosFuncionario(true);
                setFuncionarioSelecionadoId(null);
              }}
              className="w-auto bg-[#13678A] hover:bg-[#0F4F6C] text-white"
            >
              + Novo Funcionário
            </Button>

            <div>
              <select
                className="min-w-[150px] border rounded-md px-1 py-2 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-white"
                value={filtroCargo}
                onChange={(e) => setFiltroCargo(e.target.value)}
              >
                <option value="todos">Todos os cargos</option>
                <option value="Gerente">Gerente</option>
                <option value="Técnico">Técnico</option>
                <option value="Vendedor">Vendedor</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row flex-1 gap-2 justify-end w-full sm:w-auto">
            <Input
              onChange={(event) => {
                setPesquisarFuncionario(event.target.value);
                if (erroPesquisarFuncionario) setErroPesquisarFuncionario(null);
              }}
              placeholder="Digite o ID ou nome"
              className={`w-full dark:bg-[#202020] dark:text-gray-200 dark:border-[#303030] min-w-[700px] ${
                erroPesquisarFuncionario ? "border-red-500 focus:ring-red-500" : ""
              }`}
            />
            <Button onClick={getFuncionarioPorNomeOuId} className="w-auto bg-[#13678A] hover:bg-[#0F4F6C] text-white">
              <Search />
            </Button>
          </div>
        </Card>

        <Card
          className={`w-full p-2 gap-2 dark:bg-gray-900 dark:border-white border border-black flex-1 overflow-hidden ${
            loadingTabela || errorTabela ? "flex justify-center items-center" : ""
          }`}
        >
          {loadingTabela ? (
            <p className="text-center p-4">Carregando...</p>
          ) : errorTabela ? (
            <p className="text-center p-4 text-red-500">{errorTabela}</p>
          ) : funcionariosFiltrados.length === 0 ? (
            <p className="text-center p-4">Nenhum funcionário encontrado</p>
          ) : (
            <div className="overflow-auto dark:bg-gray-900 h-full">
              <table className="min-w-full dark:bg-gray-900 border-collapse">
                <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <tr>
                    <th className="dark:bg-gray-900 p-2 text-center dark:text-gray-200">ID</th>
                    <th className="dark:bg-gray-900 p-2 text-center dark:text-gray-200">Nome</th>
                    <th className="dark:bg-gray-900 p-2 text-center dark:text-gray-200">Cargo</th>
                    <th className="dark:bg-gray-900 p-2 text-center dark:text-gray-200">Data de Admissão</th>
                    <th className="dark:bg-gray-900 p-2 text-center dark:text-gray-200">Visualizar</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionariosFiltrados.map((func) => (
                    <tr key={func.id} className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800">
                      <td className="p-2 text-center dark:text-gray-200">{func.id}</td>
                      <td className="p-2 text-center dark:text-gray-200">{func.nome}</td>
                      <td className="p-2 text-center dark:text-gray-200">{func.cargo}</td>
                      <td className="p-2 text-center dark:text-gray-200">
                        {func.dataAdmissao.toLocaleDateString("pt-BR")}
                      </td>
                      <td className="p-2 text-center">
                        <Button
                          onClick={() => {
                            setFuncionarioSelecionadoId(func.id);
                            setMostrarDadosFuncionario(true);
                          }}
                          className="bg-[#13678A] hover:bg-[#0F4F6C] text-white"
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

        {mostrarDadosFuncionario && (
          <ModalDadosFuncionarios
            idItem={funcionarioSelecionadoId ?? undefined}
            setMostrarDados={setMostrarDadosFuncionario}
            atualizarLista={getFuncionarios}
          />
        )}
      </div>
    </>
  );
}
