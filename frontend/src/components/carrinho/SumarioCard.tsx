import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OuSeparador from "@/components/ui/OuSeparador";
import { ChevronDown } from "lucide-react";
import CompactoMobileHeader from "./CompactoMobileHeader";
import { Produtos } from "../ProdutosInfo";
import SumarioOrdenado from "./checkout/SumarioOrdenado";

type Props = {
  items?: Produtos[];
  subtotal: number;
  shippingPrice: number;
  totalPrice: number;
  onCheckout?: () => void;
  onClear?: () => void;
  mobile?: boolean;
  className?: string;
};

export default function SumarioCard({
  items,
  subtotal,
  shippingPrice,
  totalPrice,
  onCheckout,
  onClear,
  mobile = false,
  className = "",
}: Props) {
  const [expanded, setExpanded] = useState(!mobile); // no desktop já expande; no mobile começa recolhido

  const base = "bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-800 p-4";
  const mobileStyles = mobile
    ? "fixed bottom-0 left-0 right-0 rounded-t-xl shadow-2xl mx-4 mb-2"
    : "sticky top-8";

  return (
    <div className={className}>
      <Card className={`${base} ${mobile ? mobileStyles : "relative"}`}>
        {/* Se mobile e não expandido -> mostra versão compacta */}
        {mobile && !expanded ? (
          <CompactoMobileHeader
            total={totalPrice}
            onCheckout={onCheckout}
            expandido={() => setExpanded(true)}
          />
        ) : (
          // versão completa (desktop ou mobile expandido)
          <div>
            {!mobile && (
              <h2 className="text-xl font-bold  text-black dark:text-zinc-50 mb-4">
                Resumo do Pedido
              </h2>
            )}

            {/* botão de recolher para mobile */}
            {mobile && (
              <div className="flex justify-end mb-2">
                <Button
                  aria-label="Recolher resumo"
                  onClick={() => setExpanded(false)}
                  className="w-9 bg-zinc-800 hover:bg-zinc-700"
                >
                  <ChevronDown size={18} />
                </Button>
              </div>
            )}

            <SumarioOrdenado
              subtotal={subtotal}
              totalPrice={totalPrice}
              shippingPrice={shippingPrice}
              mostrarTitulo={false}
            />

            <Button
              className="w-full bg-zinc-50 text-zinc-950 hover:bg-zinc-200 mb-3"
              onClick={onCheckout}
            >
              Continuar
            </Button>
            <Button
              variant="outline"
              className={`w-full border-zinc-700 hover:bg-zinc-800 bg-transparent ${
                mobile ? "hidden" : ""
              }`}
              onClick={onClear}
            >
              Limpar Carrinho
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
