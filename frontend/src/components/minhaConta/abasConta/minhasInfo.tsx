import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import InputError from "@/components/InputError";

export default function MinhasInfo() {
  const { usuarioAtual } = useAuth();
  const [editando, setEditando] = useState(false);
  const [mostraSenha, setMostraSenha] = useState(false);

  const [user, setUser] = useState({
    nome: "",
    email: "",
    cpf: "",
    endereco: {
      cep: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  });

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    cpf: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // ============================================================
  // VALIDAÇÃO
  // ============================================================
  function validarCampos() {
    const e = user.endereco;
    const novoErro: any = {};

    // Nome
    if (!user.nome.trim()) novoErro.nome = "Nome obrigatório";

    // Email
    if (!user.email.trim()) novoErro.email = "E-mail obrigatório";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))
      novoErro.email = "E-mail inválido";

    // CPF
    const cpfLimpo = user.cpf.replace(/\D/g, "");
    if (!cpfLimpo) novoErro.cpf = "CPF obrigatório";
    else if (!/^\d{11}$/.test(cpfLimpo))
      novoErro.cpf = "CPF inválido (use apenas números)";

    // CEP
    if (!e.cep.trim()) novoErro.cep = "CEP obrigatório";
    else if (!/^\d{5}-?\d{3}$/.test(e.cep))
      novoErro.cep = "CEP inválido";

    // Rua
    if (!e.rua.trim()) novoErro.rua = "Rua obrigatória";

    // Número
    if (!e.numero.trim()) novoErro.numero = "Número obrigatório";

    // Cidade
    if (!e.cidade.trim()) novoErro.cidade = "Cidade obrigatória";

    // Estado
    if (!e.estado.trim()) novoErro.estado = "Estado obrigatório";
    else if (!/^[A-Z]{2}$/.test(e.estado))
      novoErro.estado = "UF deve ter 2 letras maiúsculas (ex: SP, RJ)";

    setErrors(novoErro);
    return Object.keys(novoErro).length === 0;
  }

  // ============================================================
  // CARREGAR DADOS DO BACKEND
  // ============================================================
  useEffect(() => {
    if (!usuarioAtual) return;

    async function carregar() {
      try {
        const res = await fetch(
          `http://localhost:8080/Techventory/api/usuarios/${usuarioAtual.id}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Erro ao carregar usuário");

        const dados = await res.json();

        // 🔥 Converter o formato FLAT vindo do backend para DTO correto
        setUser({
          nome: dados.nome ?? "",
          email: dados.email ?? "",
          cpf: dados.cpf ?? "",
          endereco: {
            cep: dados.cep ?? "",
            rua: dados.rua ?? "",
            numero: dados.numero ?? "",
            complemento: dados.complemento ?? "",
            bairro: dados.bairro ?? "",
            cidade: dados.cidade ?? "",
            estado: dados.estado ?? "",
          }
        });

      } catch (e) {
        console.error(e);
      }
    }

    carregar();
  }, [usuarioAtual]);

  // ============================================================
  // SALVAR ALTERAÇÕES
  // ============================================================
  async function handleSalvarMudancas() {
    if (!validarCampos()) {
      alert("Preencha todos os campos corretamente.");
      return;
    }

    if (!usuarioAtual) return;

    const body = {
      nome: user.nome,
      email: user.email,
      cpf: user.cpf,
      endereco: user.endereco
    };

    try {
      const res = await fetch(
        `http://localhost:8080/Techventory/api/usuarios/${usuarioAtual.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Erro ao atualizar usuário");

      alert("Informações atualizadas!");
      setEditando(false);

    } catch (e) {
      console.error(e);
      alert("Erro ao atualizar usuário");
    }
  }

  // ============================================================
  // ALTERAR SENHA
  // ============================================================
  async function handleAlterarSenha() {
    if (novaSenha !== confirmarSenha)
      return alert("As senhas não conferem!");

    if (!usuarioAtual) return;

    try {
      const res = await fetch(
        `http://localhost:8080/Techventory/api/usuarios/${usuarioAtual.id}/senha`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
          },
          body: JSON.stringify({
            senhaAtual,
            novaSenha
          })
        }
      );

      if (!res.ok) throw new Error("Erro ao alterar senha");

      alert("Senha alterada!");
      setMostraSenha(false);

    } catch (e) {
      console.error(e);
      alert("Erro ao alterar senha");
    }
  }

  // ============================================================
  // UI
  // ============================================================
  return (
    <main className="dark:bg-gray-900 dark:text-gray-100">
      <section className="border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-100 rounded-lg shadow-sm p-6 max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">
          <h2 className="text-xl font-semibold">Minhas Informações</h2>

          <button
            onClick={() => { setEditando(!editando); setMostraSenha(false); }}
            className="text-gray-800 dark:text-gray-200 border border-gray-800 dark:border-gray-600 px-4 py-2 rounded hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white transition"
          >
            {editando ? "Cancelar" : "Editar"}
          </button>
        </div>

        {/* Form */}
        <form className="space-y-5 md:col-span-2">

          {/* Nome */}
          <label className="block">
            Nome
            <input
              type="text"
              value={user.nome}
              readOnly={!editando}
              onChange={(e) => setUser({ ...user, nome: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <InputError message={errors.nome} />
          </label>

          {/* Email */}
          <label className="block">
            Email
            <input
              type="text"
              value={user.email}
              readOnly={!editando}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <InputError message={errors.email} />
          </label>

          {/* CPF */}
          <label className="block">
            CPF
            <input
              type="text"
              value={user.cpf}
              readOnly={!editando}
              onChange={(e) => setUser({ ...user, cpf: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <InputError message={errors.cpf} />
          </label>

          {/* ENDEREÇO */}
          <h3 className="text-lg font-semibold mt-4">Endereço</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CEP */}
            <label className="block">
              CEP
              <input
                type="text"
                value={user.endereco.cep}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, cep: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.cep} />
            </label>

            {/* Número */}
            <label className="block">
              Número
              <input
                type="text"
                value={user.endereco.numero}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, numero: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.numero} />
            </label>

            {/* Cidade */}
            <label className="block">
              Cidade
              <input
                type="text"
                value={user.endereco.cidade}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, cidade: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.cidade} />
            </label>

            {/* Rua */}
            <label className="block">
              Rua
              <input
                type="text"
                value={user.endereco.rua}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, rua: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.rua} />
            </label>

            {/* Complemento */}
            <label className="block">
              Complemento
              <input
                type="text"
                value={user.endereco.complemento}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, complemento: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.complemento} />
            </label>

            {/* Bairro */}
            <label className="block">
              Bairro
              <input
                type="text"
                value={user.endereco.bairro}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, bairro: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.bairro} />
            </label>

            {/* Estado */}
            <label className="block">
              Estado (UF)
              <input
                type="text"
                value={user.endereco.estado}
                readOnly={!editando}
                onChange={(e) =>
                  setUser({
                    ...user,
                    endereco: { ...user.endereco, estado: e.target.value }
                  })
                }
                className="w-full p-2 border rounded"
              />
              <InputError message={errors.estado} />
            </label>

          </div>
        </form>

        {/* BOTÕES */}
        {editando && (
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSalvarMudancas}
              className="px-4 py-2 border rounded bg-blue-600 text-white"
            >
              Salvar
            </button>

            <button
              onClick={() => setMostraSenha(true)}
              className="px-4 py-2 border rounded"
            >
              Alterar Senha
            </button>
          </div>
        )}

        {/* MODAL DE SENHA */}
        {mostraSenha && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow-xl z-50 w-80">
            <h3 className="text-lg font-semibold mb-4">Alterar Senha</h3>

            <label className="block mb-2">
              Senha atual
              <input
                value={senhaAtual}
                type="password"
                onChange={(e) => setSenhaAtual(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>

            <label className="block mb-2">
              Nova senha
              <input
                value={novaSenha}
                type="password"
                onChange={(e) => setNovaSenha(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>

            <label className="block mb-4">
              Confirmar senha
              <input
                value={confirmarSenha}
                type="password"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </label>

            <div className="flex gap-2">
              <button
                onClick={() => setMostraSenha(false)}
                className="px-4 py-2 border rounded"
              >
                Cancelar
              </button>

              <button
                onClick={handleAlterarSenha}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Alterar senha
              </button>
            </div>
          </div>
        )}

      </section>
    </main>
  );
}
