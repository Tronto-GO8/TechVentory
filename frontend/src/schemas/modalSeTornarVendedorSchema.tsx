import z from "zod";

export const modalSeTornarVendedorSchema = z.object({
  nomeDaLoja: z
    .string()
    .min(1, "Nome da loja é obrigatório")
    .max(100),

  contaBancaria: z
    .string()
    .min(1, "Conta bancária é obrigatória"),

  cnpj: z
  .union([
    z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
    z.literal("").transform(() => undefined), // campo vazio vira undefined
    z.undefined(),
  ])
  .transform((value) => {
    if (!value) return undefined;

    const digits = value.replace(/\D/g, "");
    return digits;
  })
  .optional(),
});

export type modalSeTornarVendedorForm = z.infer<
  typeof modalSeTornarVendedorSchema
>;
