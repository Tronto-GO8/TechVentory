import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";

export type User = {
  id?: number;
  nome?: string;
  email: string;
  jwt?: string;
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

  register: (payload: RawUser) => Promise<{ ok: boolean; message?: string }>;
  login: (email: string, senha: string) => Promise<{ ok: boolean; message?: string }>;
  loginGoogle: (token: string, user: User) => Promise<void>;
  logout: () => void;

  // <── ADICIONAR
  setUserComoVendedor: (dados: {
    nomeDaLoja: string;
    cnpj?: string;
    contaBancaria: string;
  }) => Promise<void>;
};



const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = "authUser";
const TOKEN_KEY = "authToken";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuarioAtual, setUsuarioAtual] = useState<User | null>(null);
  const [estaAutenticado, setEstaAutenticado] = useState(
    Boolean(localStorage.getItem(TOKEN_KEY))
  );
  const [loading, setLoading] = useState(false);

  const setUserComoVendedor = async (dados: {
  nomeDaLoja: string;
  cnpj?: string;
  contaBancaria: string;
}) => {
  if (!usuarioAtual) return;

  try {
    const token = localStorage.getItem(TOKEN_KEY);

    const res = await api.post(
      "/vendedores/promover",
      {
        idUsuario: usuarioAtual.id,
        ...dados,
        cargo: "gerente",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const vendedorCriado = res.data;

    const updatedUser: User = {
      ...usuarioAtual,
      isVendedor: true,
      dadosVendedor: {
        nomeDaLoja: dados.nomeDaLoja,
        cnpj: dados.cnpj ?? "",
      },
    };

    setUsuarioAtual(updatedUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Erro ao criar vendedor:", error);
  }
};

  // LOGIN LOCAL
  const login = async (email: string, senha: string) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, senha });

      const { token, user } = res.data;

      if (!token || !user)
        return { ok: false, message: "Resposta inválida do servidor." };

      // salvar nos storages
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

      setUsuarioAtual(user);
      setEstaAutenticado(true);

      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.message ?? "Erro ao logar" };
    } finally {
      setLoading(false);
    }
  };

  // LOGIN GOOGLE
const loginGoogle = async (token: string, user: User) => {
  setLoading(true);
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));

    setUsuarioAtual(user);
    setEstaAutenticado(true);
  } catch (e) {
    console.error("Erro ao processar login Google:", e);
  } finally {
    setLoading(false);
  }
};

  // LOGOUT
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setUsuarioAtual(null);
    setEstaAutenticado(false);
  };

  
  // carregar usuário salvo
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_USER_KEY);
    if (savedUser) setUsuarioAtual(JSON.parse(savedUser));
  }, []);

  // REGISTRO
  const register = async (payload: RawUser) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", payload);
      return { ok: true };
    } catch (err: any) {
      return { ok: false, message: err?.response?.data?.message ?? "Erro ao registrar" };
    } finally {
      setLoading(false);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        usuarioAtual,
        estaAutenticado,
        loading,
        register,
        login,
        loginGoogle,
        logout,
        setUserComoVendedor,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
};
