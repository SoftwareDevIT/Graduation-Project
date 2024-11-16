import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useComboContext } from "../../../Context/ComboContext"; // Import the Combo context
import { Combo } from "../../../interface/Combo";
import instance from "../../../server";

// Định nghĩa schema cho việc xác thực form sử dụng Zod
const comboSchema = z.object({
  combo_name: z.string().min(1, "Tên combo là bắt buộc."),
  description: z.string().min(1, "Mô tả là bắt buộc."), // sửa lỗi tên trường thành "description"
  price: z.number().min(1, "Giá phải là một số dương."),
  volume: z.number().min(1, "Số lượng phải là một số dương."),
});

const ComboForm = () => {
  const { addCombo, updateCombo } = useComboContext(); // Sử dụng Combo context
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Combo>({
    resolver: zodResolver(comboSchema),
  });

  useEffect(() => {
    const fetchCombo = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/combo/${id}`);
          reset(data.data); // Reset form với dữ liệu đã lấy
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu combo:", error);
        }
      }
    };

    fetchCombo(); // Lấy dữ liệu combo nếu có ID
  }, [id, reset]);

  const handleFormSubmit = async (data: Combo) => {
    try {
      if (id) {
        await updateCombo(Number(id), data); // Cập nhật combo với yêu cầu PUT
        alert("Cập nhật combo thành công!");
      } else {
        await addCombo(data); // Thêm combo với yêu cầu POST
        alert("Thêm combo thành công!");
      }
      nav('/admin/combo'); // Chuyển hướng tới trang danh sách combo hoặc trang cần thiết
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu combo:", error);
      alert("Lỗi khi gửi dữ liệu combo");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow p-4 rounded bg-light">
        <h1 className="text-center mb-4">{id ? "Cập nhật Combo" : "Thêm Combo"}</h1>

        {/* Tên Combo */}
        <div className="mb-3">
          <label htmlFor="combo_name" className="form-label">Tên Combo</label>
          <input
            type="text"
            className={`form-control ${errors.combo_name ? "is-invalid" : ""}`}
            {...register("combo_name")}
          />
          {errors.combo_name && <span className="text-danger">{errors.combo_name.message}</span>}
        </div>

        {/* Mô Tả */}
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Mô Tả</label>
          <input
            type="text"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            {...register("description")}
          />
          {errors.description && <span className="text-danger">{errors.description.message}</span>}
        </div>

        {/* Giá */}
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Giá</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            {...register("price", { valueAsNumber: true })}
          />
          {errors.price && <span className="text-danger">{errors.price.message}</span>}
        </div>

        {/* Số Lượng */}
        <div className="mb-3">
          <label htmlFor="volume" className="form-label">Số Lượng</label>
          <input
            type="number"
            className={`form-control ${errors.volume ? "is-invalid" : ""}`}
            {...register("volume", { valueAsNumber: true })}
          />
          {errors.volume && <span className="text-danger">{errors.volume.message}</span>}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-100">{id ? "Cập nhật Combo" : "Thêm Combo"}</button>
        </div>
      </form>
    </div>
  );
};

export default ComboForm;
