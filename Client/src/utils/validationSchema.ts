// src/utils/validationSchema.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ").nonempty("Email là bắt buộc"),
  password: z.string().nonempty("Mật khẩu là bắt buộc").min(8,"Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().nonempty("Vui lòng nhập email.").email("Email không hợp lệ."),
  user_name: z.string().nonempty("Tên đăng nhập là bắt buộc."),
  password: z.string().nonempty("Mật khẩu là bắt buộc.").min(8, "Mật khẩu phải có ít nhất 8 ký tự."),
  confirmPassword: z.string(),

});
export type RegisterSchema = z.infer<typeof registerSchema>;