import { useAuth } from "@/contexts/AuthContext";
import { useCarrinho } from "@/contexts/ProdutoCarrinhoContext";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BtnCarrinhoProps {
  adicionarAoCarrinho?: () => void;
  visivel?: boolean;
  children?: React.ReactNode;
  className?: string;
  mostrarTotal?: boolean;
  redirecionarPara: string;
}

export default function BtnCarrinho({
  adicionarAoCarrinho,
  children,
  className,
  mostrarTotal = false,
  redirecionarPara,
}: BtnCarrinhoProps) {
  const { totalAdicionado } = useCarrinho();
  const navigate = useNavigate();
  const { estaAutenticado } = useAuth();

  const handleClick = (e: React.MouseEvent) => {
    if (adicionarAoCarrinho) {
      adicionarAoCarrinho();
    }

    if (redirecionarPara) {
      if (!estaAutenticado) {
        navigate("/login");
      } else {
        navigate(redirecionarPara);
      }
      return;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${className} rounded-full bg-white dark:bg-black/80 hover:bg-gray-200 dark:hover:bg-black/90 transition-all duration-300`}
    >
      <ShoppingCart size={22} className="text-black dark:text-white" />

      {mostrarTotal && totalAdicionado > 0 && (
        <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full bg-red-600">
          {totalAdicionado}
        </span>
      )}
      {children}
    </button>
  );
}
