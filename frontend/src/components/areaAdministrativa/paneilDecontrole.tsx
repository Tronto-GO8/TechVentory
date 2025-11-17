import { Button } from "../ui/button"
import { Box, Headphones, User, Users } from "lucide-react";
import { Modulos } from "../ui/modulos";

interface PainelDeControleProps {
  moduloAtivo: Modulos;
  selecionarModulo: (modulo: Modulos) => void;
}

export default function PainelDeControle({moduloAtivo, selecionarModulo}: PainelDeControleProps) {
    return (
        <>
            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-5 sm:gap-2">
                <Button onClick={() => selecionarModulo("usuarios")} className="w-full bg-black text-white sm:flex-1 text-sm sm:text-base py-2 sm:py-3 hover:bg-gray-700 focus:bg-gray-600 "><Users /> Usuários</Button>
                <Button onClick={() => selecionarModulo("estoque")} className="w-full  bg-black text-white  sm:flex-1 text-sm sm:text-base py-2 sm:py-3 hover:bg-gray-700  focus:bg-gray-600"><Box />Estoque</Button>
                <Button onClick={() => selecionarModulo("assistencia")} className="w-full  bg-black text-white sm:flex-1 text-sm sm:text-base py-2 sm:py-3 hover:bg-gray-700 focus:bg-gray-600"><Headphones />Assistência</Button>
                <Button onClick={() => selecionarModulo("funcionarios")} className="w-full  bg-black text-white  sm:flex-1 text-sm sm:text-base py-2 sm:py-3 hover:bg-gray-700  focus:bg-gray-600"><User />Funcionários</Button>
            </div>
        </>
    )
}