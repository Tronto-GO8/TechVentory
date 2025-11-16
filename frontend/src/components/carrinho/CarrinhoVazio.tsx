import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export default function CarrinhoVazio() {
  return (
    <div className="min-h-screen bg-[#BCDBE8] dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20">
          <ShoppingBag className="w-24 h-24 text-zinc-700 mb-6" />
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">
            Seu carrinho está vazio
          </h2>
          <p className="text-black dark:text-zinc-400 mb-8">
            Adicione produtos para começar suas compras
          </p>
          <Link to="/app/inicial">
            <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
              Continuar comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
