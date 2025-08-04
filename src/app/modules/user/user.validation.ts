import z from "zod";

import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name too short, minimum 2 characters" })
    .max(50, { message: "Name too long, maximum 50 characters" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/, {
      message:
        "Password must be at least 8 characters and include 1 uppercase letter, 1 special character, and 1 number",
    }),

  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address too long, maximum 200 characters" })
    .optional(),
});
export const updateUserZodSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Name must be a string",
    })
    .min(2, { message: "Name too short, minimum 2 characters" })
    .max(50, { message: "Name too long, maximum 50 characters" })
    .optional(),


  phone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
      message: "Invalid Bangladeshi phone number",
    })
    .optional(),

  address: z
    .string()
    .max(200, { message: "Address too long, maximum 200 characters" })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isVerified: z.boolean({
    invalid_type_error: "isVerified must be true oor false",
  }).optional(),
  isDeleted: z.boolean({
    invalid_type_error: "isDeleted must be true oor false",
  }).optional(),
});
