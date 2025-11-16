import { useEffect, useState } from "react";
import DadosGerais from "@/components/areaAdministrativa/dadosGerais";
import PainelDeControle from "@/components/areaAdministrativa/paneilDecontrole";
import CentralTabelas from "@/components/areaAdministrativa/centralTabelas";
import { Modulos } from "@/components/ui/modulos";

export default function Adiministracao() {
  const [algumModuloCelecionado, setAlgumModuloCelecionado] = useState(false);
  const [moduloSelecionado, setModuloSelecionado] =
    useState<Modulos>("usuarios");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640 && !algumModuloCelecionado) {
        setModuloSelecionado("vazio");
      } else if (moduloSelecionado === "vazio") {
        setModuloSelecionado("usuarios");
      }
    };

    window.addEventListener("resize", handleResize);
    setAlgumModuloCelecionado(true);

    return () => window.removeEventListener("resize", handleResize);
  }, [moduloSelecionado, algumModuloCelecionado]);

  return (
    <>
      <div className="flex flex-col w-full dark:bg-gray-900 h-screen max-h-100vh">
        {/* Grid principal */}
        <div className="flex flex-col flex-1 border overflow-hidden">
          <div className=" flex flex-col sm:flex-[0_0_40%] p-2">
            <DadosGerais />
          </div>
          <div className="flex-[0_0_50px] sm:h-[50px]">
            <PainelDeControle
              selecionarModulo={setModuloSelecionado}
              moduloAtivo={moduloSelecionado}
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <CentralTabelas
              selecionarModulo={setModuloSelecionado}
              moduloAtivo={moduloSelecionado}
            />
          </div>
        </div>
      </div>
    </>
  );
}
