import { tagsStyle } from "@/styles/variaveisTailwind/Reutilizaveis";
import { CardContent } from "../../ui/card";
import formatarPrecoBRL from "@/utils/FormatarPrecoBRL";

type CardProdutoProps = {
  nome: string;
  preco: number;
  empresa?: string;
  tags?: { nome: string }[];
};

const MAX_VISIVEL = 6;

export default function ConteudoProduto({
  nome,
  empresa,
  preco,
  tags,
}: CardProdutoProps) {
  const tagsOcultas = tags ? Math.max(0, tags.length - MAX_VISIVEL) : 0;
  const precoFormatado = formatarPrecoBRL(preco);
  return (
    <CardContent className="absolute left-0 right-0 bottom-0 z-10 p-0 rounded-t-md pointer-events-auto bg-gradient-to-t from-black/95 via-black/70 to-transparente">
      <div className="bg-gradient-to-t from-white/95 via-gray/70 to-transparent dark:from-black/95 dark:via-black/70 dark:to-transparent p-3 sm:p-2 space-y-2">
        <h3 className="text-white font-semibold text-base sm:text-lg md:text-xl leading-tight line-clamp-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {nome}
        </h3>

        <div className="flex justify-between items-center">
          <p className="text-white font-medium text-xs sm:text-sm truncate">
            {empresa}
          </p>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg sm:text-xl text-white dark:text-gray-300">
              {precoFormatado}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {(tags ?? []).slice(0, MAX_VISIVEL).map((t, i) => (
            <span key={i} className={tagsStyle} title={t.nome}>
              {t.nome}
            </span>
          ))}
          {tagsOcultas > 0 && <span className={tagsStyle}>+{tagsOcultas}</span>}
        </div>
      </div>
    </CardContent>
  );
}
