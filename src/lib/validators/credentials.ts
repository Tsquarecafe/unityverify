import { z } from "zod";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const credentialValidator = z.object({
  email: z.string().regex(emailRegex),
  password: z
    .string()
    .min(6, { message: "password must be longer than 6 characters" }),
});

export type credentialType = z.infer<typeof credentialValidator>;

export const registerCredentialValidator = z.object({
  email: z.string().regex(emailRegex),
  firstname: z.string().min(3, { message: "Please enter your first name" }),
  lastname: z.string().min(3, { message: "Please enter your last name" }),
  password: z
    .string()
    .min(6, { message: "password must be longer than 6 characters" }),
});

export type registerCredentialType = z.infer<
  typeof registerCredentialValidator
>;
