import React, { useState, useEffect } from "react";
import { Chamado } from "../types/Chamado";
import { getChamados } from "../services/chamadoService";

export default function MeusChamados() {
  const [filtroStatus, setFiltroStatus] = useState("");
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const token = "TOKEN_DO_USUARIO_AQUI";


  useEffect(() => {
  // 🔧 MODO APRESENTAÇÃO — sem backend
  const chamadosFake: Chamado[] = [
    {
      id: "CHM_001",
      titulo: "Troca de tela",
      dataAbertura: "2024-11-10",
      status: "em_analise",
    },
    {
      id: "CHM_002",
      titulo: "Problema no carregador",
      dataAbertura: "2024-11-15",
      status: "concertado",
    },
    {
      id: "CHM_003",
      titulo: "Notebook não liga",
      dataAbertura: "2024-11-20",
      status: "cancelado",
    },
  ];

  setChamados(chamadosFake);
  setLoading(false);
}, []);
/*
  useEffect(() => {
    async function carregarChamados() {
      try {
        const dados = await getChamados(token);
        setChamados(dados);
      } catch (error) {
        console.error("Erro ao carregar chamados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarChamados();
  }, [token]);

  */

  const chamadosFiltrados = chamados.filter((chamado) => {
    if (filtroStatus === "") return true;
    return chamado.status === filtroStatus;
  });

  if (loading) {
    return (
      <p className="text-center mt-8 text-gray-700 dark:text-gray-300">
        Carregando chamados...
      </p>
    );
  }

  return (
    <main className="dark:bg-gray-900 dark:text-gray-100">
      <section className="border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-sm p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">
          <label>
            <h2 className="text-xl font-semibold">Histórico de chamados</h2>
            <h3 className="text-l text-gray-700 dark:text-gray-300">
              Acompanhe seus pedidos de assistência técnica
            </h3>
          </label>

          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="border border-gray-800 dark:border-gray-600 px-4 py-2 rounded text-gray-800 dark:text-gray-100 dark:bg-gray-800"
          >
            <option value="">Todos os status</option>
            <option value="em_analise">Em análise</option>
            <option value="concertado">Concertado</option>
          </select>
        </div>

        {chamadosFiltrados.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Nenhum chamado encontrado.
          </p>
        ) : (
          chamadosFiltrados.map((chamado) => (
            <div
              key={chamado.id}
              className="border border-gray-400 dark:border-gray-700 rounded-lg p-4 mb-2 bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg text-gray-800 dark:text-gray-200">
                    Chamado {chamado.id}
                  </h3>
                  <p className="text-l text-gray-800 dark:text-gray-300">
                    {chamado.titulo}
                  </p>
                  <p className="text-l text-gray-800 dark:text-gray-300">
                    {new Date(chamado.dataAbertura).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="text-right">
                  <p
                    className={`border-2 px-2 rounded-lg text-l ${chamado.status === "em_analise"
                        ? "border-yellow-500 text-yellow-600"
                        : chamado.status === "concertado"
                          ? "border-green-500 text-green-600"
                          : "border-gray-500 text-gray-600"
                      }`}
                  >
                    {chamado.status === "em_analise"
                      ? "Em análise"
                      : chamado.status === "concertado"
                        ? "Concertado"
                        : "Cancelado"}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}
