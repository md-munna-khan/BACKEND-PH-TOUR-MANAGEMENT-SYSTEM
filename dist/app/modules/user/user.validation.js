"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.createUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("./user.interface");
exports.createUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be a string",
    })
        .min(2, { message: "Name too short, minimum 2 characters" })
        .max(50, { message: "Name too long, maximum 50 characters" }),
    email: zod_1.default.string().email({ message: "Invalid email address" }),
    password: zod_1.default
        .string({
        required_error: "Password is required",
    })
        .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/, {
        message: "Password must be at least 8 characters and include 1 uppercase letter, 1 special character, and 1 number",
    }),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address too long, maximum 200 characters" })
        .optional(),
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({
        invalid_type_error: "Name must be a string",
    })
        .min(2, { message: "Name too short, minimum 2 characters" })
        .max(50, { message: "Name too long, maximum 50 characters" })
        .optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, {
        message: "Invalid Bangladeshi phone number",
    })
        .optional(),
    address: zod_1.default
        .string()
        .max(200, { message: "Address too long, maximum 200 characters" })
        .optional(),
    role: zod_1.default.enum(Object.values(user_interface_1.Role)).optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isVerified: zod_1.default.boolean({
        invalid_type_error: "isVerified must be true oor false",
    }).optional(),
    isDeleted: zod_1.default.boolean({
        invalid_type_error: "isDeleted must be true oor false",
    }).optional(),
});
