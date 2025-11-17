import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, ArrowDownToLine } from "lucide-react";
import { Modulos } from "@/components/ui/modulos";
import { useEffect, useState } from "react";
import ModalDadosUsuario from "./modalDadosUsuario";

// TOKEN
const token = localStorage.getItem("token");

// NESCESSÁRIO PARA RODAR
interface TabelaUsuariosProps {
    moduloAtivo: Modulos;
    selecionarModulo: (modulo: Modulos) => void;
}

// NESCESSÁRIO para o modal de usuários rodar

//MADELO DE USUÁRIOS

interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    numeroChamados: string;
}

export default function TabelaUsiarios({ moduloAtivo, selecionarModulo }: TabelaUsuariosProps) {
    const [mostrarDadosCliente, setmostrarDadosCliente] = useState(false)
    const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);
    const [pesquisa, setPesquisa] = useState("")
    const [loadingTabela, setLoadingTabela] = useState(false);
    const [errorTabela, setErrorTabela] = useState<string | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([{ id: 1, nome: "Ana Souza", email: "ana@email.com", telefone: "55 51 984213", numeroChamados: "5" },
    { id: 1, nome: "Ana Souza", email: "ana@email.com", telefone: "55 51 984213", numeroChamados: "5" },
    { id: 1, nome: "Ana Souza", email: "ana@email.com", telefone: "55 51 984213", numeroChamados: "5" },
    { id: 1, nome: "Ana Souza", email: "ana@email.com", telefone: "55 51 984213", numeroChamados: "5" },
    { id: 1, nome: "Ana Souza", email: "ana@email.com", telefone: "55 51 984213", numeroChamados: "5" }
    ]);

    //Pesquisa clientes para lista, padrão de iniciar a página
    useEffect(() => {
        async function getClientes() {
            try {
                const response = await fetch(`/api/clientes`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Falha ao buscar dados");

                const data = await response.json();
                if (data.length === 0) {
                    setErrorTabela("Nenhum cliente encontrado.");
                    return;
                }
                setUsuarios(data);
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

        //getClientes();
    }, []);





    //Filtrar clientes
    async function filtrarDados() {
        let FiltroDeClientes = "";
        let valorFiltro = pesquisa.trim(); // valor que será enviado na URL
        setUsuarios([]);
        setErrorTabela(null);

        if (pesquisa.includes("@")) {
            FiltroDeClientes = "email";
        } else if (/^\d+$/.test(pesquisa.replace(/\s/g, ""))) {
            FiltroDeClientes = "telefone";
        } else if (pesquisa.trim().length > 0) {
            FiltroDeClientes = "nome";
        } else {
            setErrorTabela("Digite algo para pesquisar.");
            return;
        }

        setLoadingTabela(true); // mostrar tela de carregamento

        try {
            const response = await fetch(`/api/clientes?${FiltroDeClientes}=${encodeURIComponent(valorFiltro)}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error("Falha ao buscar dados");

            const data = await response.json();
            if (data.length === 0) {
                setErrorTabela("Nenhum cliente encontrado.");
                return;
            }
            setUsuarios(data);
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

    //Mudar texto do campo de pesquisa

    const [placeholder, setPlaceholder] = useState(
        window.innerWidth < 640
            ? "Buscar cliente"
            : "Buscar por identificador, nome ou telefone"
    );
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setPlaceholder("Buscar...");
            } else {
                setPlaceholder("Buscar por identificador, nome ou telefone");
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Mapear tabelas

    return (
        <>
            <div className="flex flex-col gap-2 h-full dark:bg-gray-900 absolute sm:top-0 top-[0px] left-0 right-0 bottom-0 z-50 sm:relative sm:z-auto bg-white">
                <Card className="flex justify-between dark:bg-gray-900 dark:border-white items-center w-full p-2 gap-2 border border-black">
                    {/* Botão à esquerda */}
                    <Button onClick={() => selecionarModulo("vazio")} className="block sm:hidden">
                        <ArrowDownToLine />
                    </Button>
                    {/* Input + botão de pesquisa agrupados */}
                    <div className="flex flex-1 gap-2 justify-end">
                        <Input onChange={(event) => setPesquisa(event.target.value)}
                            placeholder={placeholder}
                            className="sm:w-[60%] w-[60%] md:w-[50%] dark:bg-[#202020] dark:text-gray-200 dark:border-[#303030]"
                        />
                        <Button onClick={filtrarDados} className="bg-[#13678A] hover:bg-[#0F4F6C] text-white">
                            <Search />
                        </Button>
                    </div>
                </Card>

                <Card className={`w-full dark:bg-gray-900 dark:border-white p-2 gap-2  border border-black flex-1 overflow-hidden ${loadingTabela || errorTabela ? "flex justify-center items-center" : ""}`}>
                    {loadingTabela ? (
                        <p className="text-center p-4">Carregando...</p>
                    ) : errorTabela ? (
                        <p className="text-center p-4 text-red-500">{errorTabela}</p>
                    ) : usuarios.length === 0 ? (
                        <p className="text-center p-4">Nenhum cliente encontrado</p>
                    ) : (
                        <div className="overflow-auto dark:bg-gray-900 h-full">
                            <table className="min-w-full dark:bg-gray-900 border-collapse">
                                <thead className="sticky top-0 dark:bg-gray-900 bg-white z-10">
                                    <tr>
                                        <th className="dark:bg-gray-900 p-2 text-center">ID</th>
                                        <th className="dark:bg-gray-900 p-2 text-center">Nome</th>
                                        <th className="dark:bg-gray-900 p-2 text-center">Email</th>
                                        <th className="dark:bg-gray-900 p-2 text-center">Telefone</th>
                                        <th className="dark:bg-gray-900 p-2 text-center">Chamado</th>
                                        <th className="dark:bg-gray-900 p-2 text-center">Visualizar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.map((user) => (
                                        <tr key={user.id}>
                                            <td className="dark:bg-gray-900 p-2 text-center text-sm sm:text-base md:text-lg">{user.id}</td>
                                            <td className="dark:bg-gray-900 p-2 text-center text-sm sm:text-base md:text-lg">{user.nome}</td>
                                            <td className="dark:bg-gray-900 p-2 text-center text-sm sm:text-base md:text-lg">{user.email}</td>
                                            <td className="dark:bg-gray-900 p-2 text-center text-sm sm:text-base md:text-lg">{user.telefone}</td>
                                            <td className="dark:bg-gray-900 p-2 text-center text-sm sm:text-base md:text-lg">{user.numeroChamados}</td>
                                            <td className="dark:bg-gray-900 p-2 text-center">
                                                <Button className="bg-[#13678A] hover:bg-[#0F4F6C] text-white w-[70%]" onClick={() => { setClienteSelecionadoId(user.id); setmostrarDadosCliente(true); }}>Ver</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
                {mostrarDadosCliente && clienteSelecionadoId !== null ? (
                    <ModalDadosUsuario
                        idCliente={clienteSelecionadoId}
                        setMostrarDados={setmostrarDadosCliente}
                    />
                ) : null}

            </div>
        </>
    );

}

// 🔹 TODO LIST — API de Pesquisa de Clientes

// ✅ 1. Criar rota GET
// Exemplo: GET /api/clientes?email=..., /api/clientes?telefone=..., ou /api/clientes?nome=...

// ✅ 2. Implementar middleware de autenticação (autenticar)
// - Ler o header "Authorization".
// - Validar o token JWT.
// - Identificar qual vendedor está logado (por ex: req.user.id_vendedor).

// ✅ 3. Ler o parâmetro de busca recebido na URL
// - Pode ser ?email=, ?telefone= ou ?nome=.
// - Só um deles virá por vez.
// - Salvar em variáveis como: const { email, telefone, nome } = req.query;

// ✅ 4. Montar a query SQL com base no tipo de filtro
// - Se tiver "email", buscar clientes por email.
// - Se tiver "telefone", buscar por telefone.
// - Se tiver "nome", usar LIKE '%nome%' para buscas parciais.
// - Exemplo:
//   SELECT * FROM clientes
//   WHERE id_vendedor = req.user.id_vendedor
//   AND (email = ? OR telefone = ? OR nome LIKE ?)

// ✅ 5. Executar a consulta no banco de dados
// - Usar parâmetros seguros (prepared statements) para evitar SQL Injection.

// ✅ 6. Tratar erros
// - Caso não encontre nenhum cliente → retornar [].
// - Caso ocorra erro → retornar status 500 e mensagem "Erro ao buscar clientes".

// ✅ 7. Retornar o resultado em formato JSON
// - Exemplo: res.json(listaDeClientes);

// ✅ 8. Testar com requisições como:
//   GET /api/clientes?email=ana@email.com
//   GET /api/clientes?telefone=51999999999
//   GET /api/clientes?nome=ana
//   (com o token JWT válido no header Authorization: Bearer <token>)