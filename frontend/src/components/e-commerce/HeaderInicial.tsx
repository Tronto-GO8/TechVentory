import { Headset } from "lucide-react";
import { Button } from "../ui/button";
import DropDownPerfil from "./DropDownPerfil";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import ModalSeTornarVendedor from "./ModalSeTornarVendedor";

export default function HeaderInicial() {
  const navigate = useNavigate();
  const { estaAutenticado, usuarioAtual, setUserComoVendedor } = useAuth();
  const [mostrarModalVendedor, setMostrarModalVendedor] = useState(false);

  const entrarNaAreaAdmOuAbrirModal = () => {
    if (!usuarioAtual?.isVendedor) {
      setMostrarModalVendedor(true);
    } else {
      navigate("/app/areaAdmnistrativa");
    }
  };

  const confirmarCriacaoDeVendedor = async (dados: {
  nomeDaLoja: string;
  cnpj?: string;
  contaBancaria: string;
}) => {
  try {
    await setUserComoVendedor(dados);
    setMostrarModalVendedor(false);
    navigate("/app/areaAdmnistrativa");
  } catch (error) {
    console.error(error);
    alert("Erro ao criar vendedor");
  }
};

  return (
    <header className="flex justify-between p-2 items-center bg-[#303030]">
      <Link to={"/app/inicial"}>
        <Button
          variant={"ghost"}
          className="text-xl font-semibold font-sans text-white"
        >
          LOGO
        </Button>
      </Link>

      <div className="flex flex-row items-center gap-1 md:gap-2">
        {estaAutenticado ? (
          <>
            <Button>
              <DropDownPerfil />
            </Button>
            <Link to={"/app/AssistenciaAoProduto"}>
              <Button>
                <Headset />
                <p>Assitência</p>
              </Button>
            </Link>
            <Button onClick={entrarNaAreaAdmOuAbrirModal}>
              Área admnistrativa
            </Button>
          </>
        ) : (
          <Button onClick={() => navigate("/login")} className="text-white">
            Entrar
          </Button>
        )}
      </div>
      <ModalSeTornarVendedor
        mostrarModalVendedor={mostrarModalVendedor}
        fecharModal={() => setMostrarModalVendedor(false)}
        confirmar={confirmarCriacaoDeVendedor}
      />
    </header>
  );
}
