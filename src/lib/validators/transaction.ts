import { z } from "zod";

export const transactionValidator = z.object({
  type: z.string(),
  slipType: z.string(),
  status: z.enum(["PENDING", "SUCCESS", "FAILED"]).default("PENDING"),
});

export type TransactionType = z.infer<typeof transactionValidator>;
