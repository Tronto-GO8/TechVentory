import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  modalSeTornarVendedorForm,
  modalSeTornarVendedorSchema,
} from "@/schemas/modalSeTornarVendedorSchema";

interface ModalSeTornarVendedorProps {
  mostrarModalVendedor: boolean;
  fecharModal: () => void;
  confirmar: (dados: {
    nomeDaLoja: string;
    cnpj?: string;
    contaBancaria: string;
    cargo?: string;
  }) => void;
}

export default function ModalSeTornarVendedor({
  mostrarModalVendedor,
  fecharModal,
  confirmar,
}: ModalSeTornarVendedorProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<modalSeTornarVendedorForm>({
    resolver: zodResolver(modalSeTornarVendedorSchema),
    defaultValues: {
      nomeDaLoja: "",
      cnpj: "",
      contaBancaria: "",
    },
  });

  useEffect(() => {
    if (!mostrarModalVendedor) reset();
  }, [mostrarModalVendedor, reset]);

  const enviar = (data: modalSeTornarVendedorForm) => {
    confirmar({
      nomeDaLoja: data.nomeDaLoja.trim(),
      cnpj: data.cnpj || undefined,
      contaBancaria: data.contaBancaria.trim(),

    });

    reset();
  };

  return (
    <Dialog open={mostrarModalVendedor} onOpenChange={fecharModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Torne-se um Vendedor</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para transformar sua conta em uma loja
            ativa na plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(enviar)} className="space-y-4 py-4">

          {/* Nome da loja */}
          <div className="space-y-2">
            <Label htmlFor="nomeDaLoja">Nome da Loja *</Label>
            <Input
              id="nomeDaLoja"
              placeholder="Ex: Loja Tech do João"
              {...register("nomeDaLoja")}
            />
            {errors.nomeDaLoja && (
              <p className="text-sm text-red-500">{errors.nomeDaLoja.message}</p>
            )}
          </div>

          {/* CNPJ */}
          <div className="space-y-2">
            <Label htmlFor="cnpj">CNPJ (opcional)</Label>
            <Input
              id="cnpj"
              placeholder="00.000.000/0000-00"
              {...register("cnpj")}
            />
            {errors.cnpj && (
              <p className="text-sm text-red-500">{errors.cnpj.message}</p>
            )}
          </div>

          {/* Conta bancária */}
          <div className="space-y-2">
            <Label htmlFor="contaBancaria">Conta Bancária *</Label>
            <Input
              id="contaBancaria"
              placeholder="Agência e conta"
              {...register("contaBancaria")}
            />
            {errors.contaBancaria && (
              <p className="text-sm text-red-500">
                {errors.contaBancaria.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                fecharModal();
                reset();
              }}
            >
              Cancelar
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
