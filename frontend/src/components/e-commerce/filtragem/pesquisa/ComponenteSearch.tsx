import { Search } from "lucide-react";
import { forwardRef } from "react";

export interface ComponenteSearchProps {
  valorPesquisado: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  abrirContainerDeSugestoes: boolean;
}

const ComponenteSearch = forwardRef<HTMLInputElement, ComponenteSearchProps>(
  (
    { valorPesquisado, onChange, onKeyDown, abrirContainerDeSugestoes = false },
    refDeInputParaFocar
  ) => {
    return (
      <div className="relative">
        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          ref={refDeInputParaFocar}
          value={valorPesquisado}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Pesquisar produtos..."
          className="w-full pl-3 pr-10 py-2 rounded-md bg-white dark:bg-[#202020] text-gray-600 dark:text-gray-200 border border-gray-400 dark:border-[#303030] outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-600"
          aria-autocomplete="list"
          aria-haspopup="true"
          aria-expanded={abrirContainerDeSugestoes}
        />
      </div>
    );
  }
);
export default ComponenteSearch;
