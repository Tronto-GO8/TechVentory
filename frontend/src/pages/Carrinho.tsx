import { useMemo, useState } from "react";
import SumarioCard from "@/components/carrinho/SumarioCard";
import CarrinhoVazio from "@/components/carrinho/CarrinhoVazio";
import ProdutosCarrinho from "@/components/carrinho/ProdutosCarrinho";
import { useModoMobile } from "@/hooks/useModoMobile";
import { useCarrinho } from "@/contexts/ProdutoCarrinhoContext";
import { ProdutoInfo } from "@/components/ProdutosInfo";
import { CheckoutCarrinho } from "@/components/carrinho/checkout/CheckoutCarrinho";
import type {
  Address,
  PaymentMethod as PaymentMethodType,
} from "@/type/ProdutosType";

export default function Carrinho() {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const modoMobile = useModoMobile();
  const {
    carrinho,
    adicionarNoCarrinho,
    definirQuantidade,
    removerDoCarrinho,
    limparCarrinho,
  } = useCarrinho();

  const [address, setAddress] = useState<Address | null>(null);
  const [shippingMethod, setShippingMethod] = useState<"pickup" | "shipping">(
    "pickup"
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType | null>(
    null
  );

  const items = useMemo(() => {
    return Object.entries(carrinho)
      .map(([idStr, qtd]) => {
        const id = Number(idStr);
        const produto = ProdutoInfo.find((p) => p.id === id);
        if (!produto) return null;
        return { ...produto, quantidade: qtd };
      })
      .filter(Boolean) as any[];
  }, [carrinho]);

  // subtotal
  const subtotal = useMemo(() => {
    return items.reduce(
      (acc, it) => acc + (it.preco ?? 0) * ((it.quantidade ?? 1) as number),
      0
    );
  }, [items]);

  const shippingPrice = useMemo(() => {
    return shippingMethod === "pickup" ? 0 : 19.9;
  }, [shippingMethod]);

  const totalPrice = subtotal + shippingPrice;

  const handleConfirmPurchase = () => {
    if (shippingMethod === "shipping" && !address) {
      alert("Por favor, adicione um endereço para entrega.");
      return;
    }
    if (!paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }

    alert("Compra confirmada! Obrigado.");
    limparCarrinho();
    setIsCheckoutModalOpen(false);
  };

  if (items.length === 0) {
    return <CarrinhoVazio />;
  }

  return (
    <div className="min-h-screen  bg-[#BCDBE8] dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-[#074964] dark:text-zinc-50 mb-8">
          Carrinho de Compras
        </h1>

        <div className="min-h-screen lg:grid lg:grid-cols-3 gap-8">
          <div className={"lg:col-span-2 border-none space-y-2"}>
            {items.map((p) => (
              <ProdutosCarrinho
                key={p.id}
                produtoTeste={p}
                onIncrease={() => adicionarNoCarrinho(p, 1)}
                onDecrease={() =>
                  definirQuantidade(
                    p.id,
                    Math.max(0, (carrinho[p.id] ?? 1) - 1)
                  )
                }
                onRemove={() => removerDoCarrinho(p.id)}
              />
            ))}
          </div>

          {!modoMobile && (
            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-8">
                <SumarioCard
                  items={items}
                  subtotal={subtotal}
                  totalPrice={totalPrice}
                  shippingPrice={shippingPrice}
                  onCheckout={() => setIsCheckoutModalOpen(true)}
                  onClear={() => limparCarrinho()}
                  mobile={false}
                />
              </div>
            </div>
          )}
        </div>

        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none">
          <div className="max-w-7xl mx-auto pointer-events-auto">
            <SumarioCard
              items={items}
              subtotal={subtotal}
              totalPrice={totalPrice}
              shippingPrice={shippingPrice}
              mobile={true}
              className="max-w-3xl mx-auto"
              onCheckout={() => setIsCheckoutModalOpen(true)}
              onClear={() => limparCarrinho()}
            />
          </div>
        </div>

        <CheckoutCarrinho
          open={isCheckoutModalOpen}
          onOpenChange={setIsCheckoutModalOpen}
          items={items}
          address={address}
          onAddressUpdate={setAddress}
          selectedPayment={paymentMethod}
          onPaymentSelect={setPaymentMethod}
          shippingMethod={shippingMethod}
          onShippingMethodChange={setShippingMethod}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
          onConfirmPurchase={handleConfirmPurchase}
        />
      </div>
    </div>
  );
}
