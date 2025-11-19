import { Button } from "@/components/ui/button";
import type {
  Address,
  PaymentMethod as PaymentMethodType,
} from "@/type/ProdutosType";
import { useMemo } from "react";
import { CardData } from "../CartaoForm";

interface CheckoutConfirmarVoltarBtnProps {
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  selectedPayment: PaymentMethodType | null;
  shippingMethod: "pickup" | "shipping";
  address: Address | null;
  cardData?: CardData | null;
}

export default function CheckoutConfirmarVoltarBtn({
  onOpenChange,
  onConfirm,
  selectedPayment,
  shippingMethod,
  address,
  cardData,
}: CheckoutConfirmarVoltarBtnProps) {
  const isCreditOrDebit =
    selectedPayment === "credit" || selectedPayment === "debit";

  const canConfirm = useMemo(() => {
    if (!selectedPayment) return false;
    if (shippingMethod === "shipping" && !address) return false;
    // quando for cartão, exige cardData (form já validado antes de setar)
    if (isCreditOrDebit && !cardData) return false;
    return true;
  }, [selectedPayment, shippingMethod, address, isCreditOrDebit, cardData]);

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm();
  };

  const buttonLabel = useMemo(() => {
    if (!selectedPayment) return "Selecione o pagamento";
    if (shippingMethod === "shipping" && !address)
      return "Adicione um endereço";
    if (isCreditOrDebit && !cardData) return "Preencha os dados do cartão";
    return "Confirmar Compra";
  }, [selectedPayment, shippingMethod, address, isCreditOrDebit, cardData]);

  return (
    <div className="flex flex-col-reverse md:flex-row gap-3 pt-4">
      <Button
        variant="outline"
        className="flex-1 border-zinc-700 hover:bg-zinc-800 bg-transparent"
        onClick={() => onOpenChange(false)}
      >
        Voltar ao Carrinho
      </Button>

      <Button
        className="flex-1 bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
        disabled={!canConfirm}
        onClick={handleConfirm}
      >
        {buttonLabel}
      </Button>
    </div>
  );
}
