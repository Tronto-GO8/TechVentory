import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cartaoSchema, type CartaoFormData } from "@/schemas/cartaoSchema";

export type CardData = CartaoFormData;

interface CartaoFormProps {
  defaultValue?: CardData;
  onSubmit: (dados: CardData) => void;
  onBlurChange?: (dados: CardData) => void;
  className?: string;
}

export function CartaoForm({
  defaultValue,
  onSubmit,
  onBlurChange,
  className,
}: CartaoFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CardData>({
    resolver: zodResolver(cartaoSchema),
    mode: "onBlur",
    defaultValues: {
      number: defaultValue?.number || "",
      name: defaultValue?.name || "",
      expiry: defaultValue?.expiry || "",
      cvv: defaultValue?.cvv || "",
      identificationNumber: defaultValue?.identificationNumber || "",
      identificationType: defaultValue?.identificationType || "CPF",
    },
  });

  // limita os dígitos a 19 e formata com espaços a cada 4
  const formatCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (raw: string) => {
    const cleaned = raw.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setValue("number", formatted, { shouldValidate: false, shouldDirty: true });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setValue("expiry", formatted, { shouldValidate: false, shouldDirty: true });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setValue("cvv", digits, { shouldValidate: false, shouldDirty: true });
  };

  // chama onBlurChange apenas quando o usuário sai de um campo
  useEffect(() => {
    if (!onBlurChange) return;
    const subscription = watch((value, { type }) => {
      if (type === "blur") {
        onBlurChange(value as CardData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, onBlurChange]);

  const submit = (data: CardData) => {
    const cleaned: CardData = {
      ...data,
      number: (data.number || "").replace(/\s/g, ""),
      identificationNumber: data.identificationNumber?.replace(/\D/g, "") || "",
    };
    onSubmit(cleaned);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="number">Número do Cartão *</Label>
        <Input
          id="number"
          placeholder="1234 5678 9012 3456"
          {...register("number")}
          onChange={handleNumberChange}
          maxLength={23} // 19 dígitos + até 4 espaços
        />
        {errors.number && (
          <p className="text-sm text-red-500">{errors.number.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome no Cartão *</Label>
        <Input id="name" placeholder="NOME COMPLETO" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Validade (MM/YY) *</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            {...register("expiry")}
            onChange={handleExpiryChange}
            maxLength={5}
          />
          {errors.expiry && (
            <p className="text-sm text-red-500">{errors.expiry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV *</Label>
          <Input
            id="cvv"
            placeholder="123"
            {...register("cvv")}
            onChange={handleCvvChange}
            maxLength={4}
          />
          {errors.cvv && (
            <p className="text-sm text-red-500">{errors.cvv.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="identificationType">Tipo</Label>
          <Input
            id="identificationType"
            {...register("identificationType")}
            placeholder="CPF ou CNPJ"
          />
          {errors.identificationType && (
            <p className="text-sm text-red-500">
              {errors.identificationType.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="identificationNumber">Documento</Label>
          <Input
            id="identificationNumber"
            placeholder="Só números"
            {...register("identificationNumber")}
            onChange={(e) =>
              setValue(
                "identificationNumber",
                e.target.value.replace(/\D/g, "").slice(0, 14),
                { shouldValidate: false, shouldDirty: true }
              )
            }
            maxLength={14}
          />
          {errors.identificationNumber && (
            <p className="text-sm text-red-500">
              {errors.identificationNumber.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          Usar cartão
        </Button>
      </div>
    </form>
  );
}
