import { useEffect, useState } from "react";
import SearchFilterContainer from "@/components/e-commerce/filtragem/SearchFilterContainer";
import BtnCarrinho from "@/components/e-commerce/BtnCarrinho";
import { ProdutoInfo } from "@/components/ProdutosInfo";
import { Card, CardTitle } from "@/components/ui/card";
import PaginacaoProdutos from "@/components/e-commerce/PaginacaoProdutos";
import useHandleMudarPagina from "@/hooks/useHandleMudarPagina";
import useFiltrarProdutos from "@/hooks/useFiltrarProdutos";
import ContainerProduto from "@/components/e-commerce/produto/ContainerProduto";
import useFiltradosPorPreco from "@/hooks/useFiltradosPorPreco";
import OuSeparador from "@/components/ui/OuSeparador";

const PRODUTOS_POR_PAGINA = 10;

export default function Inicial() {
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pesquisar, setPesquisar] = useState("");

  const [categoriaAplicada, setCategoriaAplicada] = useState<string | null>(
    null
  );

  const [faixaPrecoAplicada, setFaixaPrecoAplicada] = useState<
    | {
        min?: number;
        max?: number;
      }
    | undefined
  >(undefined);

  const produtosFiltrados = useFiltrarProdutos({
    produtos: ProdutoInfo,
    pesquisar,
    categoriaAplicada,
  });

  const { filtradosComPreco, precoMin, precoMax } = useFiltradosPorPreco({
    faixaPrecoAplicada,
    produtosFiltrados,
  });

const authUser = localStorage.getItem("authUser");

 useEffect(() => {
  if (!authUser) return; // ainda não logou

  const usuarioRaw = localStorage.getItem("usuario");
  if (!usuarioRaw) return; // usuário ainda não salvo

  const usuario = JSON.parse(usuarioRaw);

  const usuarioAtualizado = {
    ...usuario,
    isVendedor: true,
    dadosVendedor: {
      nomeDaLoja: "patos",
      cnpj: ""
    }
  };

  localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  console.log("Usuário atualizado:", usuarioAtualizado);

}, [authUser]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtradosComPreco.length / PRODUTOS_POR_PAGINA)
  );
  const indiceInicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const indiceFim = indiceInicio + PRODUTOS_POR_PAGINA;
  const produtosPaginaAtual = filtradosComPreco.slice(indiceInicio, indiceFim);

  const handleMudarPagina = useHandleMudarPagina(setPaginaAtual, totalPaginas);

  return (
    <div className="w-full bg-[#BCDBE8] dark:bg-[#13678A]">
      <div className="w-full grid">
        <SearchFilterContainer
          pesquisar={pesquisar}
          setPesquisar={setPesquisar}
          aoAplicar={(tipoDeFiltro) => {
            setCategoriaAplicada(tipoDeFiltro.categoria ?? null);
            setFaixaPrecoAplicada(tipoDeFiltro.faixaDePreco);
          }}
          faixaDePreco={{ min: precoMin, max: precoMax }}
        />
        <Card className="p-6 bg-[#BCDBE8] dark:bg-gray-900 border-none space-y-6 rounded-none">
          <div className="space-y-2">
            <CardTitle className="text-[#074964] dark:text-white">
              Populares ({filtradosComPreco.length} produtos)
            </CardTitle>
            <OuSeparador />
          </div>

          <div className="flex flex-wrap gap-4 bg-[#BCDBE8] text-black dark:bg-gray-900 justify-center">
            <ContainerProduto produtos={produtosPaginaAtual} />
          </div>
          <PaginacaoProdutos
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onMudarPagina={handleMudarPagina}
          />
        </Card>
        <BtnCarrinho
          className="fixed z-50 bottom-4 right-4 flex items-center gap-2 px-4 py-2 shadow-lg"
          mostrarTotal={true}
          redirecionarPara="/app/carrinho"
        >
          <span className="text-lg text-black dark:text-white">Carrinho</span>
        </BtnCarrinho>
      </div>
    </div>
  );
}
