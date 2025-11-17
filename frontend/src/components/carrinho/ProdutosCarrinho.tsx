import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import formatarPrecoBRL from "@/utils/FormatarPrecoBRL";
import { Produtos } from "../ProdutosInfo";

type ProdutosCarrinhoProps = {
  produtoTeste: Produtos & { quantidade?: number };
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
};

export default function ProdutosCarrinho({
  produtoTeste,
  onIncrease,
  onDecrease,
  onRemove,
}: ProdutosCarrinhoProps) {
  const fallback = "https://via.placeholder.com/600x400?text=No+Image";
  const imagens = produtoTeste.imagem?.map((i) => i.url) ?? [];
  const imageUrl = imagens.length > 0 ? imagens[0] : fallback;
  return (
    <div className={"space-y-4"}>
      <Card className="bg-white dark:bg-zinc-900 border-zinc-400 dark:border-zinc-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start">
          <div className="relative sm:w-24 sm:h-24 md:w-32 md:h-32 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
            <img
              className="w-full h-full object-contain"
              src={imageUrl}
              alt={produtoTeste.nome}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallback;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-black dark:text-zinc-50 mb-1 truncate">
              {produtoTeste.nome}
            </h3>
            {produtoTeste.empresa && (
              <p className="text-sm text-gray-700 dark:text-zinc-400 mb-2">
                {produtoTeste.empresa}
              </p>
            )}
            <p className={"text-base sm:text-lg font-bold text-black dark:text-zinc-50"}>
              {formatarPrecoBRL(produtoTeste.preco)}
            </p>
          </div>
        </div>
        {/* aumetar e diminuir qantd, preço e remover */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-zinc-700 hover:bg-zinc-800 bg-transparent"
              onClick={onDecrease}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="text-black dark:text-zinc-50 font-medium w-8 text-center">
              {produtoTeste.quantidade ?? 1}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 border-zinc-700 hover:bg-zinc-800 bg-transparent"
              onClick={onIncrease}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <p className={"text-base sm:text-lg font-bold text-black dark:text-zinc-50"}>
              {formatarPrecoBRL(
                produtoTeste.preco * (produtoTeste.quantidade ?? 1)
              )}
            </p>
            <Button
              size="icon"
              variant="ghost"
              className="text-red-400 hover:text-red-300 hover:bg-red-950/20 h-8 w-8"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
