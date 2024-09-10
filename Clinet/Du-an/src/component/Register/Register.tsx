import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../server";
import "./Register.css";
import { RegisterFormData } from "../../interface/RegisterFormData";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<boolean>(false);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    if (data.password !== data.confirmPassword) {
      setServerError("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await instance.post("/register", {
        email: data.email,
        user_name: data.user_name,
        password: data.password,
        password_confirmation: data.confirmPassword,
      });

      if (response.status === 200) {
        setSuccess(true);
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
          setServerError("Dữ liệu không hợp lệ, xin kiểm tra lại.");
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

  return (
    <div className="custom-register-container">
      <div className="custom-register-form">
        <h2>Đăng ký</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        {success && <p className="success-message">Đăng ký thành công! Bạn có thể <Link to="/login">đăng nhập</Link> ngay.</p>}
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
