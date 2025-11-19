import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowDownToLine, Trash2 } from "lucide-react";
import { Modulos } from "@/components/ui/modulos";
import { useEffect, useState } from "react";
import ModalDadosEstoque from "./modalDadosEstoque";
import FiltroItens from "@/components/ui/filtroItens";

// TOKEN
const token = localStorage.getItem("token");

interface TabelaUsuariosProps {
  moduloAtivo: Modulos;
  selecionarModulo: (modulo: Modulos) => void;
}

interface Itens {
  id: number;
  produto: string;
  categorias: string[];
  preco: number;
  estoque: number;
  estoqueMinimo: number;
}

export default function TabelaEstoque({
  moduloAtivo,
  selecionarModulo,
}: TabelaUsuariosProps) {
  const [mostrarDadosItens, setMostrarDadosItens] = useState(false);
  const [itemSelecionadoId, setitemSelecionadoId] = useState<number | null>(null);
  const [pesquisa, setPesquisa] = useState("");
  const [erroPesquisa, setErroPesquisa] = useState<string | null>(null);
  const [loadingTabela, setLoadingTabela] = useState(false);
  const [errorTabela, setErrorTabela] = useState<string | null>(null);
  const [filtroCategoria, setFiltroCategoria] = useState<string>("");
  const [filtroEstoque, setFiltroEstoque] = useState<string>("");

  const [produtos, setprodutos] = useState<Itens[]>([
    {
      id: 1,
      produto: "Notebook Gamer X-15",
      categorias: ["Informática", "Notebook"],
      preco: 6499.9,
      estoque: 12,
      estoqueMinimo: 5,
    },
    {
      id: 2,
      produto: "Camiseta Preta",
      categorias: ["Moda", "Roupas"],
      preco: 49.9,
      estoque: 3,
      estoqueMinimo: 5,
    },
    {
      id: 3,
      produto: "Mouse Wireless",
      categorias: ["Informática", "Acessórios"],
      preco: 129.9,
      estoque: 20,
      estoqueMinimo: 5,
    },
    {
      id: 4,
      produto: "Teclado Mecânico RGB",
      categorias: ["Informática", "Gamer"],
      preco: 349.9,
      estoque: 8,
      estoqueMinimo: 5,
    },
    {
      id: 5,
      produto: "Tênis Esportivo",
      categorias: ["Moda", "Esporte"],
      preco: 199.9,
      estoque: 15,
      estoqueMinimo: 10,
    },
    {
      id: 6,
      produto: "Smartphone X200",
      categorias: ["Eletrônicos", "Celulares"],
      preco: 2899.9,
      estoque: 25,
      estoqueMinimo: 10,
    },
  ]);
  const [produtosFiltrados, setProdutosFiltrados] = useState<Itens[]>(produtos);



  async function getProdutos() {

    /*
    setLoadingTabela(true);
    try {
      const response = await fetch(`/api/produtos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Falha ao buscar dados");

      const data = await response.json();
      if (data.length === 0) {
        setErrorTabela("Nenhum produto encontrado.");
        return;
      }
      setprodutos(data);
      setProdutosFiltrados(data);
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

    */
  }


  useEffect(() => {
    getProdutos();
  }, []);



  async function getDadosNome() {
    /*
    if (!pesquisa.trim()) {
      setErroPesquisa(null);
      setProdutosFiltrados(produtos);
      return;
    }

    setLoadingTabela(true);
    try {
      const response = await fetch(`/api/produtos?nome=${encodeURIComponent(pesquisa)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Falha ao buscar dados");

      const data = await response.json();
      if (data.length === 0) {
        setErrorTabela("Nenhum produto encontrado.");
        return;
      }
      setprodutos(data);
      setProdutosFiltrados(data);
      setErrorTabela(null);
    } catch (err: unknown) {
      if (err instanceof TypeError) {
        setErrorTabela("Erro de conexão: não foi possível buscar os dados.");
      } else {
        setErrorTabela((err as Error).message);
      }
    } finally {
      setLoadingTabela(false);
    }*/
  }

  useEffect(() => {
    const filtrados = produtos
      .filter((p) => {
        if (!filtroCategoria) return true;
        return p.categorias.some((cat) =>
          cat.toLowerCase().includes(filtroCategoria.toLowerCase())
        );
      })
      .filter((p) => {
        if (filtroEstoque === "baixo") return p.estoque < p.estoqueMinimo;
        if (filtroEstoque === "alto") return p.estoque >= p.estoqueMinimo;
        return true;
      })
      .sort((a, b) => {
        if (filtroEstoque === "ordenarMenor") return a.estoque - b.estoque;
        if (filtroEstoque === "ordenarMaior") return b.estoque - a.estoque;
        return 0;
      });

    setProdutosFiltrados(filtrados);
  }, [filtroCategoria, filtroEstoque, produtos]);

  async function deletarProduto(id: number) {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const response = await fetch(`/api/produtos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao excluir produto");
      setprodutos((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Falha ao excluir o produto.");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-2 h-full absolute sm:top-0 left-0 right-0 bottom-0 z-50 sm:relative sm:z-auto bg-white dark:bg-gray-900">
        <Card className="flex flex-col sm:flex-row flex-wrap sm:flex-nowrap justify-between items-center w-full p-2 gap-3 border border-black dark:bg-gray-900 dark:border-white">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full justify-start">
            <Button onClick={() => selecionarModulo("vazio")} className="block sm:hidden w-auto bg-transparent dark:bg-transparent">
              <ArrowDownToLine />
            </Button>

            <Button
              onClick={() => { setMostrarDadosItens(true), setitemSelecionadoId(null); }}
              className="w-auto bg-[#13678A] hover:bg-[#0F4F6C] text-white"
            >
              + Adicionar
            </Button>

            <div className="max-w-[140px] text-black">
              <FiltroItens value={filtroCategoria} onChange={setFiltroCategoria} />
            </div>

            <div>
              <select
                className="min-w-[150px] border rounded-md px-1 py-2 bg-white dark:bg-gray-800 dark:text-gray-200 dark:border-white"
                value={filtroEstoque}
                onChange={(e) => setFiltroEstoque(e.target.value)}
              >
                <option value="">Estoque</option>
                <option value="ordenarMenor">▼ Menor estoque</option>
                <option value="ordenarMaior">▲ Maior estoque</option>
                <option value="baixo">Baixo do mínimo</option>
                <option value="alto">Acima do mínimo</option>
              </select>
            </div>
          </div>

          <div className="flex flex-row flex-1 gap-2 justify-end w-full sm:w-auto border border-black">
            <Input
              onChange={(event) => setPesquisa(event.target.value)}
              placeholder="Pesquisar produto"
              className="w-full sm:w-[60%] md:w-[50%] dark:bg-[#202020] dark:text-gray-200 dark:border-[#303030] min-w-[700px]"
            />
            <Button onClick={getDadosNome} className="w-auto bg-[#13678A] hover:bg-[#0F4F6C] text-white">
              <Search />
            </Button>
          </div>
        </Card>

        <Card
          className={`w-full p-2 gap-2 border border-black dark:border-white dark:bg-gray-900 flex-1 overflow-hidden ${loadingTabela || errorTabela ? "flex justify-center items-center" : ""
            }`}
        >
          {loadingTabela ? (
            <p className="text-center p-4">Carregando...</p>
          ) : errorTabela ? (
            <p className="text-center p-4 text-red-500">{errorTabela}</p>
          ) : produtosFiltrados.length === 0 ? (
            <p className="text-center p-4">Nenhum produto encontrado</p>
          ) : (
            <div className="overflow-auto dark:bg-gray-900 h-full">
              <table className="min-w-full dark:bg-gray-900 border-collapse table-auto">
                <thead className="sticky top-0 bg-white dark:bg-gray-900 z-10">
                  <tr>
                    <th className="p-2 text-center dark:text-gray-200">Produto</th>
                    <th className="p-2 text-center dark:text-gray-200">Categoria</th>
                    <th className="p-2 text-center dark:text-gray-200">Preço</th>
                    <th className="p-2 text-center dark:text-gray-200">Estoque</th>
                    <th className="p-2 text-center dark:text-gray-200">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtosFiltrados.map((user) => (
                    <tr
                      key={user.id}
                      className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800"
                    >
                      <td className="p-2 text-center dark:text-gray-200 bg-[inherit]">{user.produto}</td>
                      <td className="p-2 text-center dark:text-gray-200 bg-[inherit]">
                        {user.categorias[0]}
                        {user.categorias.length > 1 && (
                          <span className="text-gray-500 dark:text-black">
                            (+{user.categorias.length - 1})
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center dark:text-gray-200 bg-[inherit]">
                        R$ {user.preco.toFixed(2)}
                      </td>
                      <td className="p-2 text-center dark:text-gray-200 bg-[inherit]">
                        {user.estoque}
                      </td>
                      <td className="p-2 text-center bg-[inherit]">
                        <div className="flex gap-2 justify-center">
                          <Button
                            className="bg-[#13678A] hover:bg-[#0F4F6C] text-white"
                            onClick={() => {
                              setitemSelecionadoId(user.id);
                              setMostrarDadosItens(true);
                            }}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => deletarProduto(user.id)}
                            className="dark:text-gray-300 hover:text-red-500"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          )}
        </Card>

        {mostrarDadosItens && (
          <ModalDadosEstoque
            idItem={itemSelecionadoId ?? undefined}
            setMostrarDados={setMostrarDadosItens}
            atualizarLista={getProdutos}
          />
        )}
      </div>
    </>
  );
}
