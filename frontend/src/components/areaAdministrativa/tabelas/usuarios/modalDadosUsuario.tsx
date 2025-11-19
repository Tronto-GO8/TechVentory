import { Button } from "@/components/ui/button";
import { Box, User, Image } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

// O que é esperado

interface ModalProps {
    idCliente: number;
    setMostrarDados: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ComprasCliente {
    Produto: String;
    Quantidade: number;
    valor: number;
    Canal: String;
    Data: String;
}

interface DadosUsuario {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereço: string;
    numeroChamados: string;
    rua: string;
    numero: number;
    bairro: string;
    cidade: String;
    estado: String;
    cep: string;
    totalPedifo: number;
    totalgasto: number;
    totalChamados: number;
    foto: string;
}

export default function ModalDadosUsuario({ setMostrarDados, idCliente }: ModalProps) {

    const usuarioExemplo = {
        nome: "Mariana Alves Costa",
        cpf: "123.456.789-10",
        email: "mariana.costa@example.com",
        telefone: "(11) 98876-5432",
        endereco: "Rua das Flores, 120",
        rua: "Rua das Flores",
        numero: 120,
        bairro: "Jardim Primavera",
        cidade: "São Paulo",
        estado: "SP",
        cep: "04567-890",
        numeroChamados: "5",
        totalPedido: 2,
        totalGasto: 3478.50,
        totalChamados: 1
    }

    const compraExemplo = {
        Produto: "Pc gamer",
        Quantidade: 1,
        valor: 1555.00,
        Canal: "Na loja",
        Data: "10/11/2024",
    }

    const compraExemplo1 = {
        Produto: "Tablet",
        Quantidade: 2,
        valor: 5700.00,
        Canal: "Na loja",
        Data: "8/7/2024",
    }

    const [abaAtiva, setAbaAtiva] = useState<"informacoes" | "pedidos">("informacoes");
    const [cliente, setCliente] = useState<any>(usuarioExemplo);
    const [camprasDoCliente, setCamprasDoCliente] = useState<ComprasCliente[]>([
        compraExemplo,
        compraExemplo1,
    ]);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    /*
        useEffect(() => {
            async function carregarCliente() {
                setLoading(true)
                try {
                    const response = await fetch(`/api/clientes/${idCliente}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    if (!response.ok) throw new Error("Erro ao carregar cliente");
                    const data = await response.json();
                    setCliente(data);
                } catch (err: unknown) {
                    setErro(err instanceof Error ? err.message : "Erro desconhecido");
                } finally {
                    setLoading(false);
                }
            }
    
            carregarCliente();
        }, [idCliente]);

        useEffect(() => {
            async function ComprasCliente() {
                setLoading(true)
                try {
                    const response = await fetch(`/api/clientes/${idCliente}`, {
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        },
                    });
                    if (!response.ok) throw new Error("Erro ao carregar Lista de compras do cliente");
                    const data = await response.json();
                    setCamprasDoCliente(data);
                } catch (err: unknown) {
                    setErro(err instanceof Error ? err.message : "Erro desconhecido");
                } finally {
                    setLoading(false);
                }
            }
    
            ComprasCliente();
        }, [idCliente]);
        


        */

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-30">
            <div className="bg-white w-[90vw] sm:w-[70vw] md:w-[50vw] h-[70vh] md:h-[70vh] rounded shadow-lg dark:bg-[#202020] dark:text-gray-200 dark:border-[#303030]">
                <div className="flex flex-col h-full gap-2">
                    <div className="relative w-full flex-row p-3">
                        <Button onClick={() => { setMostrarDados(false) }} className="absolute top-1 right-1 text-xl">X</Button>
                    </div>
                    <div className="w-full flex justify-center">
                        <div className="w-[70%] grid grid-cols-2 gap-1">
                            <Button onClick={() => { setAbaAtiva("informacoes") }} variant="secondary" className="focus:bg-gray-300 w-full"><User />Informações</Button>
                            <Button onClick={() => { setAbaAtiva("pedidos") }} variant="secondary" className="focus:bg-gray-300 w-full"><Box />Pedidos</Button>
                        </div>
                    </div>

                    <div className="flex flex-col h-full gap-2 overflow-hidden">
                        {loading ? (
                            <p>Carregando dados do cliente...</p>
                        ) : erro ? (
                            <p className="text-red-500">{erro}</p>
                        ) : (
                            <>
                                {!loading && !erro && cliente && (
                                    <>
                                        {abaAtiva === "informacoes" ? (
                                            <div className="pl-2">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-black ml-2">
                                                        {cliente?.foto ? (
                                                            <img
                                                                src={cliente.foto}
                                                                alt={`Foto de ${cliente.nome}`}
                                                                className="h-full object-cover"
                                                                onError={(e) => (e.currentTarget.style.display = 'none')} // caso a URL da imagem quebre
                                                            />
                                                        ) : (
                                                            <span className="text-gray-500 text-3xl font-bold">
                                                                <Image className="w-16 h-16 rounded-full object-cover" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-lg font-semibold">{cliente.nome}</p>
                                                        <p className="text-lg font-semibold">CPF: {cliente.cpf}</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-[1fr_1fr]">
                                                    <div>
                                                        <p className="text-lg font-semibold">Informações de contado</p>
                                                        <p>{cliente?.email || "Não informado"}</p>
                                                        <p>{cliente?.telefone || "Não informado"}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-semibold" >Estatisticas</p>
                                                        <p className="text-lg font-semibold">Estatísticas</p>
                                                        <p>Total de pedidos: {cliente?.totalPedido ?? 0}</p>
                                                        <p>Total de gasto: R${cliente?.totalGasto?.toFixed(2) ?? "0.00"}</p>
                                                        <p>Chamados de Suporte: {cliente?.totalChamados ?? 0}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-semibold" >Endereço</p>
                                                    <p>{cliente?.rua || "—"}, {cliente?.numero ?? "—"}</p>
                                                    <p>{cliente?.bairro || "—"}</p>
                                                    <p>{cliente?.cidade || "—"} / {cliente?.estado || "—"}</p>
                                                    <p>CEP: {cliente?.cep || "—"}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex flex-col flex-1 p-4 overflow-hidden h-full">
                                                    <p className="text-lg font-semibold mb-2">Histórico de Compras</p>
                                                    <Card className="flex-1 border border-black overflow-hidden">
                                                        <div className="overflow-auto h-full">
                                                            <table className="min-w-full border-collapse">
                                                                <thead className="sticky top-0 dark:bg-gray-900 bg-white z-10">
                                                                    <tr>
                                                                        <th className="p-2 text-center">Produto</th>
                                                                        <th className="p-2 text-center">Quantidade</th>
                                                                        <th className="p-2 text-center">Valor</th>
                                                                        <th className="p-2 text-center">Canal</th>
                                                                        <th className="p-2 text-center">Data</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {camprasDoCliente.map((compra: ComprasCliente, index: number) => (
                                                                        <tr key={index}>
                                                                            <td className="p-2 text-center">{compra.Produto}</td>
                                                                            <td className="p-2 text-center">{compra.Quantidade}</td>
                                                                            <td className="p-2 text-center">R${compra.valor.toFixed(2)}</td>
                                                                            <td className="p-2 text-center">{compra.Canal}</td>
                                                                            <td className="p-2 text-center">{compra.Data}</td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </Card>
                                                </div>
                                            </>
                                        )}
                                    </>
                                )}
                            </>

                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}