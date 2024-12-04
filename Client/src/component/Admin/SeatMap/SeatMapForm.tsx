import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver


// Define Zod schema for validation
const seatMapSchema = z.object({
  seat_layout_id: z.number().min(1, "Bố cục ghế là bắt buộc"),
  label: z.string().min(1, "Nhãn là bắt buộc"),
  row: z.string().min(1, "Hàng là bắt buộc"),
  column: z
    .number()
    .min(1, "Cột là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số cột phải là một số hợp lệ"),
  type: z.string().min(1, "Loại ghế là bắt buộc"),
  is_double: z.number().min(0, "Trạng thái ghế phải hợp lệ").max(1, "Trạng thái ghế phải hợp lệ"),
});

type SeatMapFormData = z.infer<typeof seatMapSchema>;

const SeatMapForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  // Integrating Zod with react-hook-form using zodResolver
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<SeatMapFormData>({
    resolver: zodResolver(seatMapSchema), // Use zodResolver here
  });

  useEffect(() => {
    const fetchSeatMap = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/seat-map/${id}`);
          reset(data.data); // Reset form with fetched data
        } catch (error) {
          console.error("Error fetching seat map data:", error);
        }
      }
    };

    fetchSeatMap(); // Fetch data if ID exists
  }, [id, reset]);

  const handleFormSubmit = async (data: SeatMapFormData) => {
    try {
      // Submit the seat map data (Create or Update)
      if (id) {
        // Update seat map
        await instance.put(`/seat-map/${id}`, data);
        notification.success({
          message: "Cập nhật bố cục ghế thành công!",
        });
      } else {
        // Create new seat map
        await instance.post("/seat-map", data);
        notification.success({
          message: "Thêm bố cục ghế thành công!",
        });
      }
      nav("/admin/seat-map"); // Redirect to the seat map list page
    } catch (error) {
      console.error("Error submitting seat map data:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu bố cục ghế",
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
          {id ? "Cập nhật Bố cục ghế" : "Thêm Bố cục ghế"}
        </h1>

        {/* Seat Layout ID */}
        <div className="mb-3">
          <label htmlFor="seat_layout_id" className="form-label">
            Bố cục ghế
          </label>
          <input
            type="number"
            className={`form-control ${errors.seat_layout_id ? "is-invalid" : ""}`}
            {...register("seat_layout_id", { valueAsNumber: true })}
          />
          {errors.seat_layout_id && <div className="invalid-feedback">{errors.seat_layout_id.message}</div>}
        </div>

        {/* Label */}
        <div className="mb-3">
          <label htmlFor="label" className="form-label">
            Nhãn
          </label>
          <input
            type="text"
            className={`form-control ${errors.label ? "is-invalid" : ""}`}
            {...register("label")}
          />
          {errors.label && <div className="invalid-feedback">{errors.label.message}</div>}
        </div>

        {/* Row */}
        <div className="mb-3">
          <label htmlFor="row" className="form-label">
            Hàng
          </label>
          <input
            type="text"
            className={`form-control ${errors.row ? "is-invalid" : ""}`}
            {...register("row")}
          />
          {errors.row && <div className="invalid-feedback">{errors.row.message}</div>}
        </div>

        {/* Column */}
        <div className="mb-3">
          <label htmlFor="column" className="form-label">
            Cột
          </label>
          <input
            type="number"
            className={`form-control ${errors.column ? "is-invalid" : ""}`}
            {...register("column", { valueAsNumber: true })}
          />
          {errors.column && <div className="invalid-feedback">{errors.column.message}</div>}
        </div>

        {/* Type */}
        <div className="mb-3">
          <label htmlFor="type" className="form-label">
            Loại ghế
          </label>
          <input
            type="text"
            className={`form-control ${errors.type ? "is-invalid" : ""}`}
            {...register("type")}
          />
          {errors.type && <div className="invalid-feedback">{errors.type.message}</div>}
        </div>

        {/* Double Seat */}
        <div className="mb-3">
          <label htmlFor="is_double" className="form-label">
            Trạng thái ghế
          </label>
          <select
            className={`form-control ${errors.is_double ? "is-invalid" : ""}`}
            {...register("is_double",{ valueAsNumber: true })}
          >
            <option value={0}>Một ghế</option>
            <option value={1}>Ghế đôi</option>
          </select>
          {errors.is_double && <div className="invalid-feedback">{errors.is_double.message}</div>}
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {id ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav("/admin/seat-map")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeatMapForm;
