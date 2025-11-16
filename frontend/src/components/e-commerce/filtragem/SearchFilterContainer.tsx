import CarouselCategorias from "./categoria/CarouselCategorias";
import { useState } from "react";
import FiltrarPreco from "./preco/FiltrarPreco";
import AplicarOuCancelar from "./AplicarOuCancelar";
import BtnCategoria from "./categoria/BtnCategoria";
import SearchESugestoes from "./pesquisa/SearchESugestoes";

interface SearchFilterContainerProps {
  pesquisar: string;
  setPesquisar: (valor: string) => void;
  aoAplicar?: (filtrosAplicados: Filtros) => void;
  faixaDePreco: {
    min?: number;
    max?: number;
  };
}

type Filtros = {
  categoria: string | null;
  faixaDePreco?: {
    min?: number;
    max?: number;
  };
};

export default function SearchFilterContainer({
  pesquisar,
  setPesquisar,
  aoAplicar,
  faixaDePreco,
}: SearchFilterContainerProps) {
  const [mostrarCarousel, setMostrarCarousel] = useState(false);
  const [filtros, setFiltros] = useState<Filtros>({
    categoria: null,
    faixaDePreco: undefined,
  });
  const [aplicado, setAplicado] = useState(false);
  const normalizeCategoria = (cat: string | null | undefined) =>
    cat === "Todos" ? null : cat ?? null;
  const aoAtualizarFiltros = (novoFiltro: Filtros) => {
    const antigaCategoria = filtros.categoria ?? null;
    const novaCategoria = novoFiltro.categoria ?? null;
    const mudouCategoria = antigaCategoria !== novaCategoria;

    if (mudouCategoria && aplicado) {
      setAplicado(false);
    }

    setFiltros({ ...novoFiltro, categoria: novaCategoria });
  };

  const aplicar = () => {
    setMostrarCarousel(false);
    setAplicado(true);

    if (aoAplicar) aoAplicar(filtros);
    const categoriaParaAplicar = normalizeCategoria(filtros.categoria);
    const filtrosParaAplicar = { ...filtros, categoria: categoriaParaAplicar };

    setMostrarCarousel(false);
    setAplicado(true);
    setFiltros(filtrosParaAplicar);

    if (aoAplicar) aoAplicar(filtrosParaAplicar);
  };

  const cancelar = () => {
    setFiltros({ categoria: null });
    setMostrarCarousel(false);
    setAplicado(false);
    if (aoAplicar) aoAplicar({ categoria: null });
  };
  const temSelecionado = !!filtros.categoria;

  const quantidadeSelecionada = filtros.categoria ? 1 : 0;

  const precoAplicado = (range: { min: number; max: number }) => {
    const novo = { ...filtros, faixaDePreco: range };
    setFiltros(novo);
    setAplicado(true);
    if (aoAplicar) aoAplicar(novo);
  };
  return (
    <div className="bg-[#BCDBE8] dark:bg-gray-900 p-3 md:p-4 w-full overflow-x-auto">
      <div className="flex flex-col space-y-3 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex-1 min-w-0">
            <SearchESugestoes
              pesquisar={pesquisar}
              setPesquisar={setPesquisar}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 sm:flex-initial">
              <BtnCategoria
                mostrarCarousel={() => setMostrarCarousel(!mostrarCarousel)}
                quantidadeSelecionada={quantidadeSelecionada}
              />
            </div>
            <div className="flex-1 sm:flex-initial">
              <FiltrarPreco
                preco={faixaDePreco ?? { min: 0, max: 0 }}
                aplicarFiltroDePreco={precoAplicado}
              />
            </div>
          </div>
        </div>

        {mostrarCarousel && (
          <div className="w-full">
            <CarouselCategorias
              filters={filtros}
              atualizarFiltros={aoAtualizarFiltros}
            />
          </div>
        )}

        {temSelecionado && !aplicado && (
          <div className="w-full pt-2">
            <AplicarOuCancelar
              cancelar={cancelar}
              aplicar={aplicar}
              aplicarLabel="Aplicar"
              cancelarLabel="Cancelar"
              btnCancelarClassName="text-black dark:text-white dark:hover:bg-slate-800 flex-1"
              btnAplicarClassName="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
              className="flex gap-3 w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
