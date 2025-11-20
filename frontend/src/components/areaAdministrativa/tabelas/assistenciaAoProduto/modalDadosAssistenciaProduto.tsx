
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/InputError";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ModalProps {
  idItem?: number;
  setMostrarDados: React.Dispatch<React.SetStateAction<boolean>>;
  atualizarLista: () => void;
}

interface Chamados {
  id: number;
  produto: string;
  status: "Na loja" | "Fora da loja" | "Finalizado" | "cancelado" | "Em andamento";
  dataDoPedido: Date;
  descricao: string;
  nomeCliente: string;
  emailCliente: string;
  telefoneCliente: string;
}

export default function ModalDadosAssistenciaProduto({
  idItem,
  setMostrarDados,
  atualizarLista,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [chamado, setChamado] = useState<Chamados>({
    id: 0,
    produto: "Notebook Gamer X-15",
    status: "Em andamento",
    dataDoPedido: new Date(),
    descricao: "depois de uma queda não liga mais",
    nomeCliente: "Lucas Andrade",
    emailCliente: "lucasandre65@gmail.com",
    telefoneCliente: "1194827-3652",
  });


  const [erros, setErros] = useState({
    produto: "",
    descricao: "",
    nomeCliente: "",
    emailCliente: "",
    telefoneCliente: "",
  });

  // 🟦 Validação
  const validarCampos = () => {
    const novosErros = {
      produto: chamado.produto.trim() === "" ? "O produto é obrigatório." : "",
      descricao: chamado.descricao.trim() === "" ? "A descrição é obrigatória." : "",
      nomeCliente: chamado.nomeCliente.trim() === "" ? "O nome do cliente é obrigatório." : "",
      emailCliente: chamado.emailCliente.trim() === "" ? "O e-mail é obrigatório." : "",
      telefoneCliente:
        !chamado.telefoneCliente || chamado.telefoneCliente.toString().length < 8
          ? "Telefone inválido."
          : "",
    };
    setErros(novosErros);
    return Object.values(novosErros).every((erro) => erro === "");
  };
/*
  // 🟦 Buscar dados se for edição
  useEffect(() => {
    if (!idItem) return;
    async function getChamado() {
      setLoading(true);
      try {
        const response = await fetch(`/api/chamados/${idItem}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao carregar dados do chamado");
        const data = await response.json();
        setChamado({
          ...data,
          dataDoPedido: new Date(data.dataDoPedido),
        });
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    getChamado();
  }, [idItem]);
  */

  // 🟦 Salvar (novo ou edição)
  const salvarChamado = async () => {
    if (!validarCampos()) return;

    const metodo = idItem ? "PUT" : "POST";
    const url = idItem ? `/api/chamados/${idItem}` : "/api/chamados";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(chamado),
      });

      if (!response.ok) throw new Error("Erro ao salvar o chamado");
      alert(idItem ? "Chamado atualizado com sucesso!" : "Chamado criado com sucesso!");
      setMostrarDados(false);
      atualizarLista();
    } catch (err) {
      alert("Falha ao salvar os dados.");
      console.error(err);
    }
  };

  return (
     <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-30 p-4">
    <div className="
      bg-white dark:bg-gray-900 dark:text-white text-black 
      rounded-lg shadow-lg 
      w-full max-w-4xl 
      h-[60vh]
      flex flex-col
      overflow-hidden
    ">
      
      {/* Cabeçalho */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {idItem ? "Editar Chamado" : "Criar Novo Chamado"}
        </h2>
        {!idItem && <p className="opacity-70">Registre um novo pedido de assistência técnica</p>}
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-auto p-4">
        {loading ? (
          <p>Carregando...</p>
        ) : erro ? (
          <p className="text-red-500">{erro}</p>
        ) : (
          <div className="flex flex-col gap-4">

            {/* Grid principal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <p className="mb-1">Produto</p>
                <Input
                  className="text-black dark:text-white"
                  value={chamado.produto}
                  onChange={(e) => {
                    setChamado({ ...chamado, produto: e.target.value });
                    setErros({ ...erros, produto: "" });
                  }}
                />
                <InputError message={erros.produto} />
              </div>

              <div>
                <p className="mb-1">Status</p>
                <select
                  className="w-full p-2 rounded-md 
                  text-black dark:text-white 
                  dark:bg-gray-800 dark:border-gray-600"
                  value={chamado.status}
                  onChange={(e) =>
                    setChamado({ ...chamado, status: e.target.value as Chamados["status"] })
                  }
                >
                  <option value="Na loja">Na loja</option>
                  <option value="Fora da loja">Fora da loja</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div>
                <p className="mb-1">Nome do Cliente</p>
                <Input
                  className="text-black dark:text-white"
                  value={chamado.nomeCliente}
                  onChange={(e) => {
                    setChamado({ ...chamado, nomeCliente: e.target.value });
                    setErros({ ...erros, nomeCliente: "" });
                  }}
                />
                <InputError message={erros.nomeCliente} />
              </div>

              <div>
                <p className="mb-1">Email do Cliente</p>
                <Input
                  type="email"
                  className="text-black dark:text-white"
                  value={chamado.emailCliente}
                  onChange={(e) => {
                    setChamado({ ...chamado, emailCliente: e.target.value });
                    setErros({ ...erros, emailCliente: "" });
                  }}
                />
                <InputError message={erros.emailCliente} />
              </div>

              <div>
                <p className="mb-1">Telefone</p>
                <Input
                  className="text-black dark:text-white"
                  value={chamado.telefoneCliente || ""}
                  onChange={(e) => {
                    setChamado({ ...chamado, telefoneCliente: String(e.target.value) });
                    setErros({ ...erros, telefoneCliente: "" });
                  }}
                />
                <InputError message={erros.telefoneCliente} />
              </div>

            </div>

            {/* Descrição — ocupa mais espaço */}
            <div className="flex flex-col flex-1">
              <p className="mb-1">Descrição do problema</p>
              <textarea
                className="
                  flex-1 p-3 rounded-lg border 
                  text-black dark:text-white 
                  dark:bg-gray-800 dark:border-gray-600 
                  resize-none
                "
                value={chamado.descricao}
                onChange={(e) => {
                  setChamado({ ...chamado, descricao: e.target.value });
                  setErros({ ...erros, descricao: "" });
                }}
              />
              <InputError message={erros.descricao} />
            </div>

          </div>
        )}
      </div>

      {/* Rodapé com botões */}
      <div className="p-4 border-t flex justify-end gap-2 bg-white dark:bg-gray-900">
        <Button variant="secondary" onClick={() => setMostrarDados(false)}>
          Cancelar
        </Button>
        <Button onClick={salvarChamado}>
          {idItem ? "Salvar alterações" : "Adicionar chamado"}
        </Button>
      </div>

    </div>
  </div>
  );
}
