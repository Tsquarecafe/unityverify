import { z } from "zod";

export const paymentValidator = z.object({
  amount: z.number(),
  paymentMethod: z.enum(["CARD", "TRANSFER"]).default("TRANSFER"),
  status: z
    .enum(["INITIATED", "PAID", "CREDITED", "FAILED"])
    .default("INITIATED"),
});

export type PaymentType = z.infer<typeof paymentValidator>;
