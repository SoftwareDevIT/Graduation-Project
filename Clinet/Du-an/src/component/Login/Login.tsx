import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";

import instance from "../../server";
import { loginSchema, LoginSchema } from "../../utils/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Login.css";
import { notification } from "antd";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const openNotificationWithIcon = (type: "success" | "error", message: string, description: string) => {
    notification[type]({
      message: message ?? "Thông báo",
      description,
    });
  };

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const response = await instance.post("/login", data);
      if (response.status === 200) {
        openNotificationWithIcon("success", "Đăng nhập thành công", "Bạn đã đăng nhập thành công.");
        navigate("/"); // Chuyển hướng sau khi đăng nhập thành công
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Mật khẩu không chính xác.");
        } else if (error.response.status === 403) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email.");
        } else if (error.response.status === 404) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Tài khoản không tồn tại.");
        } else {
          openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } else {
        openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  useEffect(() => {
    if (errors.email) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.email.message ?? "Có lỗi xảy ra.");
    }
    if (errors.password) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.password.message ?? "Có lỗi xảy ra.");
    }
  }, [errors]);

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email")} />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" {...register("password")} />
          </div>
          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        <div className="form-footer">
          <a href="/" className="forgot-password">
            Quên mật khẩu?
          </a>
          <p className="register-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
          </p>
        </div>
      </div>
      <div className="login-image">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png"
          alt="Mascot"
        />
      </div>
    </div>
  );
};

export default Login;
