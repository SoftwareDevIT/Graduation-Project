// src/utils/validationSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").nonempty("Email là bắt buộc"),
  password: z.string().nonempty("Mật khẩu là bắt buộc").min(8,"Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;


export type RegisterSchema = z.infer<typeof registerSchema>;

export const resetPasswordSchema = z.object({
    password: z
        .string().nonempty('Mật khẩu không được để trống.').min(8, 'Mật khẩu phải có ít nhất 8 ký tự.'),
    passwordConfirmation: z
        .string()
        .nonempty('Xác nhận mật khẩu không được để trống.'),
}).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Mật khẩu và xác nhận mật khẩu không trùng khớp.',
    path: ['passwordConfirmation'], // Chỉ định lỗi xảy ra ở trường nào
});
export const registerSchema = z.object({
  email: z
    .string()
    .nonempty("Email là bắt buộc")
    .email("Email không đúng định dạng"),
  user_name: z.string().nonempty("Tên đăng nhập là bắt buộc"),
  password: z
    .string()
    .nonempty("Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().nonempty("Xác minh mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu và xác nhận mật khẩu không khớp",
  path: ["confirmPassword"], // Gắn lỗi vào trường confirmPassword
});