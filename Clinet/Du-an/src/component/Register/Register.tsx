import React, { useEffect, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { notification } from "antd";
import instance from "../../server";
import ReCAPTCHA from "react-google-recaptcha";
import "./Register.css";
import { RegisterFormData } from "../../interface/RegisterFormData";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const captchaRef = useRef<ReCAPTCHA | null>(null); // Dùng ref để giữ CAPTCHA
//  thư viên Ant Degsin
  const openNotificationWithIcon = (type: "success" | "error", message: string, description: string) => {
    notification[type]({
      message: message ?? "Thông báo", 
      description,
    });
  };

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      openNotificationWithIcon("error", "Lỗi xác thực", "Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    if (!captchaValue) {
      openNotificationWithIcon("error", "Lỗi xác thực", "Vui lòng xác minh CAPTCHA.");
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
        openNotificationWithIcon("success", "Đăng ký thành công", "Tài khoản của bạn đã được tạo thành công!");
        navigate("/login");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorResponse = err.response?.data as {
          message?: string;
          errors?: Record<string, string[]>;
        };

        if (err.response?.status === 422) {
          openNotificationWithIcon("error", "Đăng ký thất bại", "Tài khoản đã tồn tại! Vui lòng nhập tài khoản khác.");
        } else if (err.response?.status === 500) {
          openNotificationWithIcon("error", "Lỗi server", "Có lỗi xảy ra từ phía server. Xin thử lại sau.");
        } else if (errorResponse?.errors) {
          const errorMessages = Object.values(errorResponse.errors).flat().join(", ");
          openNotificationWithIcon("error", "Đăng ký thất bại", errorMessages);
        } else {
          const errorMessage = errorResponse?.message ?? "Đã xảy ra lỗi.";
          openNotificationWithIcon("error", "Đăng ký thất bại", errorMessage);
        }
      } else {
        openNotificationWithIcon("error", "Lỗi không xác định", "Đã xảy ra lỗi không xác định. Xin thử lại sau.");
      }
    }
  };

  const onCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  useEffect(() => {
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
  }, []);

  useEffect(() => {
    if (errors.password) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.password.message ?? "Có lỗi xảy ra.");
    }
    if (errors.confirmPassword) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.confirmPassword.message ?? "Có lỗi xảy ra.");
    }
    if (errors.email) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.email.message ?? "Có lỗi xảy ra.");
    }
    if (errors.user_name) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.user_name.message ?? "Có lỗi xảy ra.");
    }
  }, [errors]);

  return (
    <div className="custom-register-container">
      <div className="custom-register-form">
        <h2>Đăng ký</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="custom-form-group">
            <div className="custom-form-field">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                {...register("email", { 
                  required: "Email là bắt buộc", 
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email không đúng định dạng"
                  }
                })}
              />
            </div>
            <div className="custom-form-field">
              <label htmlFor="user_name">Tên đăng nhập:</label>
              <input
                type="text"
                id="user_name"
                {...register("user_name", { required: "Tên đăng nhập là bắt buộc" })}
              />
            </div>
          </div>
          <div className="custom-form-group">
            <div className="custom-form-field">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                {...register("password", { 
                  required: "Mật khẩu là bắt buộc", 
                  minLength: {
                    value: 8,
                    message: "Mật khẩu phải có ít nhất 8 ký tự"
                  }
                })}
              />
            </div>
            <div className="custom-form-field">
              <label htmlFor="confirmPassword">Xác minh mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword", { 
                  required: "Xác minh mật khẩu là bắt buộc" 
                })}
              />
            </div>
          </div>
          <div className="custom-form-group">
            <ReCAPTCHA
              sitekey="6LdahEAqAAAAAKeWH4oPIbVjTx0zFMO2_nb8B7MM" // Thay thế bằng site key của bạn
              onChange={onCaptchaChange}
              ref={captchaRef}
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
