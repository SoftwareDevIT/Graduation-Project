import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { Rank } from "../../../interface/Rank";


// Schema xác thực sử dụng Zod
const rankSchema = z.object({
  name: z.string().min(1, "Tên hạng là bắt buộc."),
  total_order_amount: z
    .number()
    .min(0, "Số lượng đơn hàng tối thiểu không được âm."),
  percent_discount: z
    .number()
    .min(0, "Phần trăm giảm giá không được âm.")
    .max(100, "Phần trăm giảm giá không được vượt quá 100."),
});

const RankForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Rank>({
    resolver: zodResolver(rankSchema),
  });

  useEffect(() => {
    const fetchRank = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/ranks/${id}`);
          reset(data.data); // Reset form với dữ liệu lấy được
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu hạng:", error);
          notification.error({
            message: "Lỗi khi tải dữ liệu",
            description: "Không thể lấy thông tin hạng từ server.",
          });
        }
      }
    };

    fetchRank();
  }, [id, reset]);

  const handleFormSubmit = async (data: Rank) => {
    try {
      if (id) {
        // Gọi API cập nhật hạng
        await instance.put(`/ranks/${id}`, data);
        notification.success({
          message: "Cập nhật hạng thành công!",
        });
      } else {
        // Gọi API thêm hạng mới
        await instance.post("/ranks", data);
        notification.success({
          message: "Thêm hạng thành công!",
        });
      }
      nav("/admin/rank"); // Chuyển hướng về trang danh sách hạng
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu hạng:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu hạng",
        description: "Không thể gửi dữ liệu đến server.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
      >
        <h1 className="text-center mb-4">
          {id ? "Cập nhật Hạng" : "Thêm Hạng"}
        </h1>

        {/* Tên hạng */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Tên Hạng
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-danger">{errors.name.message}</span>
          )}
        </div>

        {/* Tổng số lượng đơn hàng */}
        <div className="mb-3">
          <label htmlFor="total_order_amount" className="form-label">
            Tổng Số Lượng Đơn Hàng
          </label>
          <input
            type="number"
            className={`form-control ${
              errors.total_order_amount ? "is-invalid" : ""
            }`}
            {...register("total_order_amount", { valueAsNumber: true })}
          />
          {errors.total_order_amount && (
            <span className="text-danger">
              {errors.total_order_amount.message}
            </span>
          )}
        </div>

        {/* Phần trăm giảm giá */}
        <div className="mb-3">
          <label htmlFor="percent_discount" className="form-label">
            Phần Trăm Giảm Giá (%)
          </label>
          <input
            type="number"
            className={`form-control ${
              errors.percent_discount ? "is-invalid" : ""
            }`}
            {...register("percent_discount", { valueAsNumber: true })}
          />
          {errors.percent_discount && (
            <span className="text-danger">
              {errors.percent_discount.message}
            </span>
          )}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">
            {id ? "Cập nhật Hạng" : "Thêm Hạng"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RankForm;