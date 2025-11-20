import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputError from "@/components/InputError";
import { useState, useEffect } from "react";
import { ListaPermissoesCargo } from "./CekcListFuncionarios";

interface ModalProps {
  idItem?: number;
  setMostrarDados: React.Dispatch<React.SetStateAction<boolean>>;
  atualizarLista: () => void;
}

interface Funcionario {
  id: number;
  nome: string;
  cargo: "Gerente" | "Técnico" | "Vendedor";
  dataAdmissao: Date;
  email: string;
  telefone: number;
}

export default function ModalDadosFuncionarios({
  idItem,
  setMostrarDados,
  atualizarLista,
}: ModalProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [funcionario, setFuncionario] = useState<Funcionario>({
    id: 1,
    nome: "",
    cargo: "Vendedor",
    dataAdmissao: new Date(),
    email: "",
    telefone: 0,
  });

  const [erros, setErros] = useState({
    nome: "",
    cargo: "",
    dataAdmissao: "",
    email: "",
    telefone: "",
  });

  // 🟦 Validação
  const validarCampos = () => {
    const novosErros = {
      nome: funcionario.nome.trim() === "" ? "O nome é obrigatório." : "",
      cargo: !funcionario.cargo ? "O cargo é obrigatório." : "",
      dataAdmissao: !funcionario.dataAdmissao ? "A data de admissão é obrigatória." : "",
      email: funcionario.email.trim() === "" ? "O e-mail é obrigatório." : "",
      telefone:
        !funcionario.telefone || funcionario.telefone.toString().length < 8
          ? "Telefone inválido."
          : "",
    };
    setErros(novosErros);
    return Object.values(novosErros).every((erro) => erro === "");
  };

  // 🟦 Buscar dados se for edição


  useEffect(() => {
    if (!idItem) return;
    async function getFuncionario() {
      setLoading(true);
      try {
        const response = await fetch(`/api/funcionarios/${idItem}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao carregar dados do funcionário");
        const data = await response.json();
        setFuncionario({
          ...data,
          dataAdmissao: new Date(data.dataAdmissao),
        });
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    getFuncionario();
  }, [idItem]);

  // 🟦 Salvar (novo ou edição)
  const salvarFuncionario = async () => {
    if (!validarCampos()) return;

    const metodo = idItem ? "PUT" : "POST";
    const url = idItem ? `/api/funcionarios/${idItem}` : "/api/funcionarios";

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(funcionario),
      });

      if (!response.ok) throw new Error("Erro ao salvar funcionário");
      alert(idItem ? "Funcionário atualizado com sucesso!" : "Funcionário criado com sucesso!");
      setMostrarDados(false);
      atualizarLista();
    } catch (err) {
      alert("Falha ao salvar os dados.");
      console.error(err);
    }
  };
  

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-30">
      <div className="bg-white rounded-lg shadow-lg w-[90vw] sm:w-[70vw] md:w-[50vw] h-[60vh] overflow-hidden flex flex-col dark:bg-gray-900 dark:border-white">
        <div className="flex justify-between items-center p-2">
          <div>
            <h2 className="text-lg font-semibold">
              {idItem ? "Editar Funcionário" : "Adicionar Funcionário"}
            </h2>
            <p>{idItem ? "" : "Cadastre um novo funcionário no sistema"}</p>
          </div>
        </div>

        <div className="h-full overflow-auto p-2">
          {loading ? (
            <p>Carregando...</p>
          ) : erro ? (
            <p className="text-red-500">{erro}</p>
          ) : (
            <div className="flex flex-col gap-2 h-full dark:bg-gray-900 dark:border-white ">
              <div className="grid grid-cols-2 grid-rows-3 gap-2 p-2 rounded-md">
                <div>
                  <p>Nome</p>
                  <Input
                    className="dark:bg-gray-900 dark:border-white"
                    value={funcionario.nome}
                    onChange={(e) => {
                      setFuncionario({ ...funcionario, nome: e.target.value });
                      setErros({ ...erros, nome: "" });
                    }}
                  />
                  <InputError message={erros.nome} />
                </div>

                <div>
                  <p className="dark:bg-gray-900 dark:border-white">Cargo</p>
                  <select
                    className="w-full rounded-md p-1.5 dark:bg-gray-900 dark:border-white"
                    value={funcionario.cargo}
                    onChange={(e) =>
                      setFuncionario({
                        ...funcionario,
                        cargo: e.target.value as "Gerente" | "Técnico" | "Vendedor",
                      })
                    }
                  >
                    <option value="Gerente">Gerente</option>
                    <option value="Técnico">Técnico</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                  <InputError message={erros.cargo} />
                </div>

                <div>
                  <p>Data de Admissão</p>
                  <Input
                    className="dark:bg-gray-900 dark:border-white"
                    type="date"
                    value={funcionario.dataAdmissao.toISOString().split("T")[0]}
                    onChange={(e) =>
                      setFuncionario({
                        ...funcionario,
                        dataAdmissao: new Date(e.target.value),
                      })
                    }
                  />
                  <InputError message={erros.dataAdmissao} />
                </div>

                <div className="dark:bg-gray-900 dark:border-white dark:bg-gray-900 ">
                  <p>Email</p>
                  <Input
                    type="email"
                    className="dark:bg-gray-900 dark:border-white"
                    value={funcionario.email}
                    onChange={(e) => {
                      setFuncionario({ ...funcionario, email: e.target.value });
                      setErros({ ...erros, email: "" });
                    }}
                  />
                  <InputError message={erros.email} />
                </div>

                <div>
                  <p>Telefone</p>
                  <Input
                    type="number"
                    className="dark:bg-gray-900 dark:border-white"
                    value={funcionario.telefone || ""}
                    onChange={(e) => {
                      setFuncionario({ ...funcionario, telefone: Number(e.target.value) });
                      setErros({ ...erros, telefone: "" });
                    }}
                  />
                  <InputError message={erros.telefone} />
                </div>
              </div>
              <div className="top-0 left-0 w-full bg-white pl-2">
                <div className="dark:bg-gray-900 dark:border-white text-black">
                  <ListaPermissoesCargo cargo={funcionario.cargo} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setMostrarDados(false)}>
            Cancelar
          </Button>
          <Button onClick={salvarFuncionario}>
            {idItem ? "Salvar alterações" : "Adicionar funcionário"}
          </Button>
        </div>
      </div>
    </div>
  );
}
