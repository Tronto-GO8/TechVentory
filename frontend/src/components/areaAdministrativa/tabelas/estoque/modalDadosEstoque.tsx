import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FiltroItens from "@/components/ui/filtroItens";
import InputError from "@/components/InputError";
import { useAuth } from "@/contexts/AuthContext";

interface ModalProps {
  idItem?: number;
  setMostrarDados: React.Dispatch<React.SetStateAction<boolean>>;
  atualizarLista: () => void;
}
interface Produto {
  nome: string;
  preco: number;
  quantidade: number;
  quantidadeMinima: number;
  descricao: string;
  imagens: (File | string)[];
  categorias: string[];
}

export default function ModalDadosEstoque({ setMostrarDados, idItem, atualizarLista }: ModalProps) {
  const { usuarioAtual } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState<"informacoes" | "imagens">("informacoes");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");
  const [categorias, setCategorias] = useState<string[]>([]);
  const [imagens, setImagens] = useState<(File | string)[]>([]);
  const idVendedor = usuarioAtual.id;
  const [errosCard, setErrosCard] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    quantidadeMinima: "",
    categorias: "",
    descricao: "",
  });

  const [produto, setproduto] = useState<Produto>({
    nome: "",
    preco: 0,
    quantidade: 0,
    quantidadeMinima: 0,
    descricao: "",
    imagens: [],
    categorias: [],
  });

  // Adicionar imagem
  const adicionarImagens = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const novasImagens = Array.from(e.target.files);
      setImagens([...imagens, ...novasImagens]);
    }
  };

  // Remover imagem
  const removerImagem = (index: number) => {
    setImagens(imagens.filter((_, i) => i !== index));
  };

  // Categorias
  const adicionarCategoria = () => {
    if (categoriaSelecionada && !categorias.includes(categoriaSelecionada)) {
      setCategorias([...categorias, categoriaSelecionada]);
      setCategoriaSelecionada("");
    }
  };

  const removerCategoria = (cat: string) => {
    setCategorias(categorias.filter((c) => c !== cat));
  };
/*
  useEffect(() => {
    const data = produto;
    setImagens(Array.isArray(data.imagens) ? data.imagens : []);
  }, [produto]);
*/
  // Erro dos campos obrigatórios
  const validarCampos = () => {
    const novosErros = {
      nome: produto.nome.trim() === "" ? "O nome é obrigatório." : "",

      preco:
        produto.preco === undefined || produto.preco === null
          ? "O preço é obrigatório."
          : produto.preco <= 0
            ? "O preço deve ser maior que zero."
            : "",

      quantidade:
        produto.quantidade === undefined || produto.quantidade === null
          ? "A quantidade é obrigatória."
          : produto.quantidade <= 0
            ? "A quantidade deve ser maior que zero."
            : produto.quantidade > 99999
              ? "A quantidade não pode ultrapassar 99.999 unidades."
              : "",

      quantidadeMinima:
        produto.quantidadeMinima === undefined || produto.quantidadeMinima === null
          ? "A quantidade mínima é obrigatória."
          : produto.quantidadeMinima <= 0
            ? "A quantidade mínima deve ser maior que zero."
            : produto.quantidadeMinima > produto.quantidade
              ? "A quantidade mínima não pode ser maior que o estoque."
              : "",

      categorias:
        categorias.length === 0 ? "Selecione pelo menos uma categoria." : "",

      descricao:
        produto.descricao.trim() === "" ? "A descrição deve ser preenchida." : "",
    };

    setErrosCard(novosErros);

    // Retorna true se todos os erros estiverem vazios
    return Object.values(novosErros).every((erro) => erro === "");
  };

  const [mockCarregado, setMockCarregado] = useState(false);

useEffect(() => {
  if (mockCarregado) return; // impede duplicação

  if (idVendedor) {
    setproduto({
      nome: "Notebook Gamer X-15",
      preco: 6499.90,
      quantidade: 12,
      quantidadeMinima: 5,
      descricao: "Um notebook voltado para jogos",
      imagens: [],
      categorias: [],
    });
  }

  setCategorias(["Informática", "Notebook"]);
  setImagens([
    "https://cdn.awsli.com.br/600x450/954/954868/produto/68626025/5d150286dc.jpg"
  ]);

  setMockCarregado(true);
}, [idVendedor]);



  /*
    // Buscar dados se necessário
    useEffect(() => {
      if (!idItem) {
        setproduto({
          nome: "",
          preco: 0,
          quantidade: 0,
          quantidadeMinima: 0,
          descricao: "",
          imagens: [],
          categorias: [],
        });
        setCategorias([]);
        setImagens([]);
        return;
      }
  
      async function getDadosProduto() {
        setLoading(true);
        try {
          const response = await fetch(`/api/produtos/${idItem}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          });
          if (!response.ok) throw new Error("Erro ao carregar dados do produto");
  
          const data = await response.json();
          setproduto(data);
          setCategorias(Array.isArray(data.categorias) ? data.categorias : []);
          setImagens(data.imagens || []);
        } catch (err: unknown) {
          setErro(err instanceof Error ? err.message : "Erro desconhecido");
        } finally {
          setLoading(false);
        }
      }
  
      getDadosProduto();
    }, [idItem]);
  
    */

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-30">
      <div
        className={`bg-white rounded shadow-lg dark:bg-[#202020] rounded-lg dark:text-gray-200 ${abaAtiva == "informacoes"
          ? "w-[90vw] sm:w-[80vw] md:w-[50vw] h-[70vh]"
          : "w-[90vw] sm:w-[70vw] md:w-[50vw] h-[70vh]"
          }`}
      >
        <div className="flex h-full flex-col gap-2">
          <div className="flex flex-col flex-grow gap-2 overflow-hidden m-4 h-full">
            {loading ? (
              <p>Carregando dados dos produtos...</p>
            ) : erro ? (
              <p className="text-red-500">{erro}</p>
            ) : (
              <>
                {!loading && !erro && produto && (
                  <>
                    {abaAtiva === "informacoes" ? (
                      <div className="grid grid-rows-[auto_1fr_auto] h-full p-2 gap-2">
                        {/* Título */}
                        <div>
                          <h2 className="text-lg font-semibold">Informações do produto</h2>
                        </div>

                        {/* Área principal */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Coluna 1 */}
                          <div className="grid grid-cols-1 md:grid-rows-3 gap-2 w-full">
                            <div>
                              <p>Nome do produto</p>
                              <Input
                                className="w-[80%] border border-black"
                                value={produto.nome}
                                onChange={(e) => {
                                  setproduto({ ...produto, nome: e.target.value });
                                  if (errosCard.nome)
                                    setErrosCard({ ...errosCard, nome: "" });
                                }}
                              />
                              <InputError message={errosCard.nome} />
                            </div>
                            <div>
                              <p>Quantidade em estoque</p>
                              <Input
                                className="w-[80%] border border-black"
                                type="number"
                                value={produto.quantidade}
                                onChange={(e) => {
                                  setproduto({ ...produto, quantidade: Number(e.target.value) });
                                  if (errosCard.quantidade)
                                    setErrosCard({ ...errosCard, quantidade: "" });
                                }}
                              />
                              <InputError message={errosCard.quantidade} />
                            </div>
                            <div>
                              <p>Quantidade mínima</p>
                              <Input
                                className="w-[80%] border border-black"
                                type="number"
                                value={produto.quantidadeMinima}
                                onChange={(e) => {
                                  setproduto({ ...produto, quantidadeMinima: Number(e.target.value) });
                                  if (errosCard.quantidadeMinima)
                                    setErrosCard({ ...errosCard, quantidadeMinima: "" });
                                }}
                              />
                              <InputError message={errosCard.quantidadeMinima} />
                            </div>
                          </div>

                          {/* Coluna 2 */}
                          <div className="grid grid-cols-1 md:grid-rows-3 gap-2 w-full ">
                            <div>
                              <p>Preço</p>
                              <Input
                                className="w-[80%] border border-black"
                                type="number"
                                value={produto.preco}
                                onChange={(e) => {
                                  setproduto({
                                    ...produto,
                                    preco: Number(e.target.value),
                                  });
                                  if (errosCard.preco)
                                    setErrosCard({ ...errosCard, preco: "" });
                                }}
                              />
                              <InputError message={errosCard.preco} />
                            </div>

                            <div className="row-span-2 flex flex-col gap-2 h-full">

                              <div>
                                <p>Categoria</p>
                                <div className="flex items-center gap-2 text-sm sm:text-md md:text-md ">
                                  <div className="text-black w-[80%]">
                                    <FiltroItens
                                      value={categoriaSelecionada}
                                      onChange={setCategoriaSelecionada}

                                    />
                                    <InputError message={errosCard.categorias} />
                                  </div>
                                  <Button onClick={() => {
                                    adicionarCategoria();
                                    if (errosCard.categorias)
                                      setErrosCard({ ...errosCard, categorias: "" });
                                  }}
                                  >Add</Button>
                                </div>
                              </div>

                              <div className="flex-1 border border-black rounded-md overflow-y-auto h-full">
                                <div
                                  className={`flex flex-wrap gap-1 p-2 ${categorias.length <= 0 ? "justify-center items-center" : ""
                                    }`}
                                >
                                  {categorias.length > 0 ? (
                                    categorias.map((cat) => (
                                      <div
                                        key={cat}
                                        className="flex items-center text-[10px] px-2 py-0.5 rounded-full bg-black text-white border border-white/10 shrink-0"
                                      >
                                        <span className="truncate">{cat}</span>
                                        <button
                                          onClick={() => removerCategoria(cat)}
                                          className="ml-1 text-[10px] text-gray-300 hover:text-gray"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))
                                  ) : (
                                    <p className="text-gray-500 text-sm text-center">
                                      Nenhuma categoria adicionada
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Descrição */}
                        <div className="w-full">
                          <p>Descrição do produto</p>
                          <textarea
                            placeholder="Descreva detalhadamente o produto"
                            className="text-lg w-full h-[120px] pl-2 pt-2 pr-2 border border-black rounded-lg text-sm resize-none dark:bg-gray-800 dark:text-gray-200"
                            value={produto.descricao}
                            onChange={(e) =>
                              setproduto({ ...produto, descricao: e.target.value })
                            }
                          />
                          <InputError message={errosCard.descricao} />
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Seção de imagens */}
                        <div className="col-span-2 mt-2 grid grid-rows-[10%_90%] h-full">
                          <div className="flex items-center">
                            <p className="font-semibold text-lg">Imagens do produto</p>
                          </div>

                          <div className="h-full flex justify-center items-center">
                            <div className="flex h-[80%] w-[90%] gap-2 border border-black rounded-md p-2 overflow-y-auto max-h-[400px]">
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-wrap gap-2 justify-center items-center p-2 rounded-md min-h-[150px] w-full border">
                                  {imagens.map((img, index) => (
                                    <div
                                      key={index}
                                      className="relative w-24 h-24 border rounded-md overflow-hidden"
                                    >
                                      <img
                                        src={typeof img === "string" ? img : URL.createObjectURL(img)}
                                        alt={`Imagem ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />

                                      <button
                                        onClick={() => removerImagem(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}

                                  {imagens.length < 5 && (
                                    <label className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                                      <span className="text-2xl text-gray-500">+</span>
                                      <span className="text-xs text-gray-500">Adicionar</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={adicionarImagens}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>

                                <div className="flex justify-center items-center p-2 bg-gray-50">
                                  <p className="text-gray-500 text-sm text-center">
                                    Selecione ou arraste as imagens aqui (JPG, JPEG) — até 5MB cada
                                    — ({imagens.length}/5)
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* Botões */}
          <div className="w-full flex justify-end">
            <div className="w-[40%] grid grid-cols-2 gap-2 mr-4 mb-2">
              <Button onClick={() => setMostrarDados(false)} variant="secondary" className="w-full">
                Cancelar
              </Button>

              <Button
                onClick={async () => {
                  if (abaAtiva === "informacoes") {
                    if (!validarCampos()) return;
                    setAbaAtiva("imagens");
                    return;
                  }

                  // Agora sim: aba IMAGENS → ENVIAR
                  const metodo = idItem ? "PUT" : "POST";
                  const url = idItem
                    ? `http://localhost:8080/Techventory/api/produtos/${idItem}`
                    : "http://localhost:8080/Techventory/api/produtos/adicionar";

                  const formData = new FormData();
                  formData.append("idVendedor", String(idVendedor));
                  formData.append("nome", produto.nome);
                  formData.append("quantidade", String(produto.quantidade));
                  formData.append("quantidadeMinima", String(produto.quantidadeMinima));
                  formData.append("preco", String(produto.preco).replace(",", "."));
                  formData.append("descricao", produto.descricao);
                  /*
                                    categorias.forEach(cat => formData.append("categorias", cat));
                                    imagens.forEach(img => img instanceof File && formData.append("imagens", img));
                  */
                  console.log(FormData)
                  console.log(idItem)

                  const response = await fetch(url, {
                    method: "POST",
                    body: formData,
                  });

                  if (!response.ok) { alert("Erro ao salvar"); return; }

                  setMostrarDados(false);
                  atualizarLista();
                }}
              >

                {abaAtiva == "informacoes"
                  ? "Continuar"
                  : idItem
                    ? "Salvar alterações"
                    : "Adicionar produto"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}