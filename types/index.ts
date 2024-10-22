// @/types/index
import { z } from "zod";

export const SignUpSchema = z
  .object({
    username: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
    domainId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    status: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export const newPasswordSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    domain: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const SignInSchema = z.object({
  username: z.string().min(2).max(50),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  domain: z.string().min(1),
});

export const userSchemaAdditional = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  username: z.string(),
  phone: z.string(),
  role: z.string(),
  status: z.string(),
});
export type UserAdditionalSchema = z.infer<typeof userSchemaAdditional>;

export const userSchemaBase = z.object({
  id: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string(),
  username: z.string(),
  phone: z.string(),
  role: z.string(),
  status: z.string(),
});
export type UserBaseSchema = z.infer<typeof userSchemaBase>;

export const createUserSchema = z.object({
  username: z.string().min(2).max(50),
  domain: z.string().min(1),
});
