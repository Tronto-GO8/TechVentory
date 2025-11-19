import { createContext, useContext, useEffect, useState } from "react";

type User = {
  nome?: string;
  email: string;
  isVendedor?: boolean;
  dadosVendedor?: {
    nomeDaLoja: string;
    cnpj: string;
  };
};

type RawUser = {
  nome?: string;
  email: string;
  senha: string;
};

type AuthContextType = {
  usuarioAtual: User | null;
  estaAutenticado: boolean;
  loading: boolean;
  login: (
    email: string,
    senha: string
  ) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  register: (payload: RawUser) => Promise<{ ok: boolean; message?: string }>;
  setUserComoVendedor: (dadosVendedor: {
    nomeDaLoja: string;
    cnpj: string;
  }) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "app_users_v1";
const TOKEN_KEY = "authToken";
const AUTH_USER_KEY = "authUser";
const VENDOR_DATA_KEY = "vendor_data";

function getUsers(): RawUser[] {
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
function setUsers(users: RawUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(() => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  const estaAutenticado = Boolean(localStorage.getItem(TOKEN_KEY));

   useEffect(() => {
    const users = getUsers();
    const existeTeste = users.some((u) => u.email === "teste@teste.com");

    if (!existeTeste) {
      const novoUsuario = {
        nome: "Usuário Teste",
        email: "teste@teste.com",
        senha: "123456",
      };
      users.push(novoUsuario);
      setUsers(users);
      console.log("✅ Usuário de teste criado:", novoUsuario);

    }
  }, []);

  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      // Simula chamada assincrona (faça fetch para sua API aqui)
      await new Promise((r) => setTimeout(r, 500));
      const users = getUsers();
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (!found) return { ok: false, message: "Usuário não encontrado." };
      if (found.senha !== senha)
        return { ok: false, message: "Senha incorreta." };

      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem(TOKEN_KEY, token);

      const dadosDoUsuarioSalvo = localStorage.getItem(VENDOR_DATA_KEY);
      const usuarioSalvo = dadosDoUsuarioSalvo
        ? JSON.parse(dadosDoUsuarioSalvo)
        : {};

      const userVendorData = usuarioSalvo[email];

      const authUser = {
        nome: found.nome,
        email: found.email,
        isVendedor: userVendorData ? true : false,
        dadosVendedor: userVendorData || undefined,
      };

      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      setUsuarioAtual(authUser);
      return { ok: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUsuarioAtual(null);
  };

  const register = async (payload: RawUser) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const users = getUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === payload.email.toLowerCase()
      );
      if (exists)
        return { ok: false, message: "Já existe uma conta com esse e-mail." };

      users.push(payload);
      setUsers(users);
      return { ok: true };
    } finally {
      setLoading(false);
    }
  };

  const setUserComoVendedor = (dadosVendedor: {
    nomeDaLoja: string;
    cnpj: string;
  }) => {
    if (!usuarioAtual) return;
    //Recupera dados existentes ou cria objeto vazio
    const vendorData = JSON.parse(
      localStorage.getItem(VENDOR_DATA_KEY) || "{}"
    );

    // Salva os dados do vendedor indexados pelo email
    vendorData[usuarioAtual.email] = dadosVendedor;
    localStorage.setItem(VENDOR_DATA_KEY, JSON.stringify(vendorData));

    const updatedUser = {
      ...usuarioAtual,
      isVendedor: true,
      dadosVendedor,
    };

    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
    setUsuarioAtual(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioAtual,
        estaAutenticado,
        loading,
        login,
        logout,
        register,
        setUserComoVendedor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
