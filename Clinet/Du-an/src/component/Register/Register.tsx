import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../server";

import "./Register.css";
import { RegisterFormData } from "../../interface/RegisterFormData";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerError("Mật khẩu không khớp");
      return;
    }
    if (!captchaValue) {
      setServerError("Vui lòng xác minh CAPTCHA");
      return;
    }

    try {
      const response = await instance.post("/register", {
        email: data.email,
        user_name: data.user_name,
        password: data.password,
        password_confirmation: data.confirmPassword,
        'g-recaptcha-response': captchaValue,
      });

      if (response.status === 200) {
        alert("Đăng ký tài khoản thành công!"); // Sử dụng alert để thông báo thành công
        setServerError(null);
        navigate("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data as {
          message?: string;
          errors?: Record<string, string[]>; 
        };

        if (err.response?.status === 422) {
          setServerError("Tài khoản đã tồn tại! Vui lòng nhập tài khoản khác");
        } else if (err.response?.status === 500) {
          setServerError("Có lỗi từ phía server. Xin thử lại sau.");
        } else {
          setServerError(errorResponse?.message || "Đã xảy ra lỗi");
        }
      } else {
        setServerError("Đã xảy ra lỗi không xác định");
      }
    }
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <div className="custom-register-container">
      <div className="custom-register-form">
        <h2>Đăng ký</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="custom-form-group">
            <div className="custom-form-field">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                {...register("email", { required: "Email là bắt buộc" })}
              />
              {errors.email && <p className="error-message">{errors.email.message}</p>}
            </div>
            <div className="custom-form-field">
              <label htmlFor="user_name">Tên đăng nhập:</label>
              <input
                type="text"
                id="user_name"
                {...register("user_name", { required: "Tên đăng nhập là bắt buộc" })}
              />
              {errors.user_name && <p className="error-message">{errors.user_name.message}</p>}
            </div>
          </div>
          <div className="custom-form-group">
            <div className="custom-form-field">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                {...register("password", { required: "Mật khẩu là bắt buộc" })}
              />
              {errors.password && <p className="error-message">{errors.password.message}</p>}
            </div>
            <div className="custom-form-field">
              <label htmlFor="confirmPassword">Xác minh mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", { required: "Xác minh mật khẩu là bắt buộc" })}
              />
              {errors.confirmPassword && <p className="error-message">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <div className="custom-form-group">
            <ReCAPTCHA
              sitekey="6LdahEAqAAAAAKeWH4oPIbVjTx0zFMO2_nb8B7MM" // Thay thế bằng site key của bạn
              onChange={onCaptchaChange}
            />
          </div>
          <button type="submit" className="custom-submit-btn">
            Tạo tài khoản
          </button>
        </form>
        <p className="custom-login-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập!</Link>
        </p>
      </div>
      <div className="custom-image-container">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png" alt="Mascot" />
      </div>
    </div>
  );
};

export default Register;
