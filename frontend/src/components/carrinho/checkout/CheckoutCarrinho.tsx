import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import OuSeparador from "@/components/ui/OuSeparador";
import type {
  CartItem,
  Address,
  PaymentMethod as PaymentMethodType,
} from "@/type/ProdutosType";
import { AddressForm } from "./sessaoEndereco/AddressForm";
import { useMemo, useState } from "react";
import SumarioOrdenado from "./SumarioOrdenado";
import CheckoutProduto from "./CheckoutProduto";
import CheckoutConfirmarVoltarBtn from "./CheckoutConfirmarVoltarBtn";
import { Pagamento } from "./Pagamento";
import CardEnderecoDeEntrega from "./sessaoEndereco/CardEnderecoDeEntrega";
import OpcoesDeEntrega from "./sessaoEndereco/OpcoesDeEntrega";
import EnderecoHeader from "./sessaoEndereco/EnderecoHeader";
import { CartaoForm, type CardData } from "../CartaoForm";

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];

  address: Address | null;
  onAddressUpdate: (address: Address) => void;

  selectedPayment: PaymentMethodType | null;
  onPaymentSelect: (method: PaymentMethodType) => void;

  shippingMethod: "pickup" | "shipping";
  onShippingMethodChange: (method: "pickup" | "shipping") => void;

  shippingPrice: number;
  totalPrice: number;

  onConfirmPurchase: () => void;
}

export function CheckoutCarrinho({
  open,
  onOpenChange,
  items,
  address,
  onAddressUpdate,
  selectedPayment,
  onPaymentSelect,
  shippingMethod,
  onShippingMethodChange,
  shippingPrice,
  totalPrice,
  onConfirmPurchase,
}: CheckoutModalProps) {
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [cardData, setCardData] = useState<CardData | undefined>(undefined);
  const [cardAccepted, setCardAccepted] = useState(false); // novo estado

  const subtotal = useMemo(() => {
    return items.reduce((acc, it) => {
      const qty = (it as any).quantity ?? (it as any).quantidade ?? 1;
      const price = (it as any).preco ?? (it as any).price ?? 0;
      return acc + price * qty;
    }, 0);
  }, [items]);

  const cartaoSelecionado =
    selectedPayment === "credit" || selectedPayment === "debit";

  const handleAddressSubmit = (newAddress: Address) => {
    onAddressUpdate(newAddress);
    setIsEditingAddress(false);
  };

  const handleCartaoSubmit = (dados: CardData) => {
    setCardData(dados);
    setCardAccepted(true);
  };

  const handleCartaoBlurChange = (dados: CardData) => {
    setCardData(dados);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-50 max-w-4x max-h-[90vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Finalizar Pedido
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Revise seus produtos, endereço e forma de pagamento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 w-full mt-4 min-w-0 overflow-x-hidden">
          {/* Products Summary */}
          <CheckoutProduto items={items} />

          <OuSeparador />

          {/* Address Section */}
          <div>
            <EnderecoHeader
              endereco={address}
              estaEditandoEndereco={isEditingAddress}
              metodoDeEntrega={shippingMethod}
              editarEndereco={(valor) => setIsEditingAddress(valor)}
            />

            <OpcoesDeEntrega
              metodoDeEntrega={shippingMethod}
              quandoMetodoDeEntregaAlterar={onShippingMethodChange}
            />

            {shippingMethod === "shipping" && (
              <div>
                {isEditingAddress || !address ? (
                  <div className="mb-4">
                    <AddressForm
                      onAddressSubmit={handleAddressSubmit}
                      initialAddress={address ?? undefined}
                      compact
                    />
                    {address && (
                      <div className="mt-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 bg-transparent"
                          onClick={() => setIsEditingAddress(false)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <CardEnderecoDeEntrega
                    titulo={address?.nome ?? "Endereço de Entrega"}
                    endereco={address}
                  />
                )}
              </div>
            )}

            {shippingMethod === "pickup" && (
              <CardEnderecoDeEntrega
                titulo="Retirada na Loja"
                linhasExtras={[
                  "Av. Exemplo, 123 - Centro, São Paulo - SP",
                  "Horário: Seg–Sex, 10:00–18:00",
                ]}
              />
            )}
          </div>

          <OuSeparador />

          {/* Payment Method */}
          <Pagamento
            selectedMethod={selectedPayment}
            onSelectMethod={onPaymentSelect}
          />

          {cartaoSelecionado && !cardAccepted && (
            <>
              <OuSeparador />
              <div className="border-t border-zinc-700 pt-6">
                <h3 className="font-semibold text-lg text-zinc-50 mb-4">
                  Dados do Cartão
                </h3>

                <CartaoForm
                  defaultValue={cardData}
                  onSubmit={handleCartaoSubmit}
                  onBlurChange={handleCartaoBlurChange}
                />
              </div>
            </>
          )}

          {cartaoSelecionado && cardAccepted && cardData && (
            <>
              <OuSeparador />
              <div className="border-t border-zinc-700 pt-6">
                <h3 className="font-semibold text-lg text-zinc-50 mb-2">
                  Cartão selecionado
                </h3>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-zinc-400">
                      {cardData.name ?? "—"}
                    </p>
                    <p className="font-medium text-zinc-50 mt-1">
                      **** **** **** {cardData.number.slice(-4)}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">
                      Validade: {cardData.expiry}
                    </p>
                  </div>
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-zinc-700 bg-transparent"
                      onClick={() => setCardAccepted(false)}
                    >
                      Editar
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <OuSeparador />

          {/* Order Summary */}
          <SumarioOrdenado
            subtotal={subtotal}
            totalPrice={totalPrice}
            shippingPrice={shippingPrice}
            mostrarTitulo={true}
          />

          {/* Action Buttons */}
          <CheckoutConfirmarVoltarBtn
            onOpenChange={onOpenChange}
            onConfirm={onConfirmPurchase}
            selectedPayment={selectedPayment}
            shippingMethod={shippingMethod}
            address={address}
            cardData={cardData ?? null}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
