import { Headset, LogOut, Settings, ShoppingBag, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { iconeComParagrafo } from "@/styles/variaveisTailwind/Reutilizaveis";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function () {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const sair = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2">
          <UserIcon />
          Perfil
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link to="/app/conta">
          <DropdownMenuItem className={iconeComParagrafo}>
            <UserIcon />
            Informações
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem className={iconeComParagrafo}>
          <ShoppingBag />
          Pedidos
        </DropdownMenuItem>
        <DropdownMenuItem className={iconeComParagrafo}>
          <Headset />
          Chamados
        </DropdownMenuItem>
        <DropdownMenuItem className={iconeComParagrafo}>
          <Settings />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuItem className={iconeComParagrafo} onClick={sair}>
          <LogOut className="h-4 w-4 text-red-500" />
          <span className="text-red-500">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  );
}
