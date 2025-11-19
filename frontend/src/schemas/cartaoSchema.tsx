import { z } from "zod";

export const cartaoSchema = z.object({
  number: z
    .string()
    .min(13, "Número do cartão inválido")
    .max(19, "Número do cartão inválido"),
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .regex(/^[a-zA-Z\s]*$/, "Apenas letras e espaços são permitidos"),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Formato deve ser MM/YY")
    .refine((value) => {
      const [month, year] = value.split("/");
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;

      if (monthNum < 1 || monthNum > 12) return false;
      if (yearNum < currentYear) return false;
      if (yearNum === currentYear && monthNum < currentMonth) return false;

      return true;
    }, "Cartão expirado"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV deve ter 3 ou 4 dígitos"),
  identificationNumber: z.string().optional(),
  identificationType: z.enum(["CPF", "CNPJ"]).optional(),
});

export type CartaoFormData = z.infer<typeof cartaoSchema>;
