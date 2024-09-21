import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import instance from "../../server";
import { loginSchema, LoginSchema } from "../../utils/validationSchema";
import "./Login.css";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await instance.post("/login", data);
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 403 && error.response.data.userId) {
          setUserId(error.response.data.userId);
          setServerError(
            "Tài khoản chưa được xác thực. Vui lòng xác thực tài khoản."
          );
        } else if (error.response.status === 401) {
          setServerError("Thông tin đăng nhập không chính xác.");
        } else if (error.response.status === 404) {
          setServerError("Email chưa tồn tại.");
        } else {
          setServerError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } else {
        setServerError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
        {serverError && (
          <p className="error-message">
            {serverError}
            {userId && (
              <a href={`/verify-account/${userId}`} className="verify-link">
                Xác thực ngay
              </a>
            )}
          </p>
        )}

        <div className="form-footer">
          <a href="/" className="forgot-password">
            Quên mật khẩu?
          </a>
          <p className="register-link">
            Chưa có tài khoản? <a href="/register">Đăng ký ngay!</a>
          </p>
        </div>
      </div>
      <div className="login-image">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png"
          alt="Cartoon Monster"
        />
      </div>
    </div>
  );
};

export default Login;
