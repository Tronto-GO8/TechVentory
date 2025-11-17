import { Button } from "../../../ui/button";
import { useCarousel } from "@/hooks/useCarousel";
import { CarouselBtn } from "../CarouselBtn";
import { categoriasProdutos } from "@/components/CategoriasProdutos";

interface CarouselFilterContainerProps {
  filters: {
    categoria: string | null;
  };
  atualizarFiltros: (filters: { categoria: string | null }) => void;
}

export default function CarouselCategorias({
  filters,
  atualizarFiltros,
}: CarouselFilterContainerProps) {
  const itens = categoriasProdutos;
  const {
    refViewport,
    refTrilha,
    refPrimeiroItem,
    indiceInicio,
    passoPx,
    indiceMaxInicio,
    irAnterior,
    irProximo,
    mostrarControles,
  } = useCarousel(itens.length);

  const aoSelecionarCategoria = (categoria: string) => {
    atualizarFiltros({ categoria: categoria });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CarouselBtn
          direcao="esquerda"
          onClick={irAnterior}
          esconder={!mostrarControles || indiceInicio === 0}
        />

        {/* Viewport do carrossel */}
        <div ref={refViewport} className="flex overflow-hidden w-full">
          <div
            ref={refTrilha}
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${passoPx}px)` }}
          >
            {itens.map((item, idx) => {
              const isPrimeiro = idx === 0;
              const selecionado = filters.categoria === item;

              return (
                <div
                  key={item}
                  data-item
                  ref={isPrimeiro ? refPrimeiroItem : null}
                  className="flex-shrink-0 mr-2"
                >
                  <Button
                    variant={selecionado ? "default" : "outline"}
                    onClick={() => aoSelecionarCategoria(item)}
                    className={`flex-shrink-0 whitespace-nowrap ${
                      selecionado
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-transparent border-slate-600 text-black dark:text-white hover:bg-[#2D7C9D] dark:hover:bg-slate-800"
                    }`}
                  >
                    {item}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        <CarouselBtn
          direcao="direita"
          onClick={irProximo}
          esconder={!mostrarControles || indiceInicio === indiceMaxInicio}
        />
      </div>
    </div>
  );
}
