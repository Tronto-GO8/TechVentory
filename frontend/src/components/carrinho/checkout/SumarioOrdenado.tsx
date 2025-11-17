import OuSeparador from "../../ui/OuSeparador";

interface SumarioOrdenadoProps {
  shippingPrice: number;
  subtotal: number;
  totalPrice: number;
  mostrarTitulo: boolean;
}

export default function SumarioOrdenado({
  shippingPrice,
  subtotal,
  totalPrice,
  mostrarTitulo,
}: SumarioOrdenadoProps) {
  return (
    <div>
      {mostrarTitulo && (
        <h3 className="text-lg font-semibold text-zinc-50 mb-4">
          Resumo do Pedido
        </h3>
      )}

      <div className="space-y-3">
        <div className="flex justify-between text-gray-800 dark:text-zinc-300">
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-800 dark:text-zinc-300">
          <span>Frete</span>
          <span>R$ {shippingPrice.toFixed(2)}</span>
        </div>
        <OuSeparador />
        <div className="flex justify-between text-xl font-bold text-black dark:text-zinc-50">
          <span>Total</span>
          <span>R$ {totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
