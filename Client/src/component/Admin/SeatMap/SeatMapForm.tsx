import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver

// Define Zod schema
const seatMapSchema = z.object({
  seat_layout_id: z
    .number()
    .min(1, "Bố cục ghế là bắt buộc"),
  row: z.string().min(1, "Số hàng là bắt buộc"),
  column: z
    .number()
    .min(1, "Số cột là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số cột phải là một số hợp lệ"),
  type: z.string().min(1, "Loại ghế là bắt buộc"),
  is_double: z
    .number()
    .min(0, "Trạng thái ghế phải là một số hợp lệ")
    .max(1, "Trạng thái ghế phải là 0 hoặc 1"),
});

type SeatMapFormData = z.infer<typeof seatMapSchema>;

const SeatMapForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  
  // State to store seat layout options
  const [seatLayouts, setSeatLayouts] = useState<{ id: number, name: string }[]>([]);

  // Integrating Zod with react-hook-form using zodResolver
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SeatMapFormData>({
    resolver: zodResolver(seatMapSchema), // Use zodResolver here
  });

  // Fetch seat layouts from API
  useEffect(() => {
    const fetchSeatLayouts = async () => {
      try {
        const { data } = await instance.get('/matrix');  // Call to /matrix API
        setSeatLayouts(data.data);  // Assuming response data contains array of seat layouts
      } catch (error) {
        console.error("Error fetching seat layouts:", error);
      }
    };

    fetchSeatLayouts(); // Fetch data when the component mounts
  }, []);

  useEffect(() => {
    const fetchSeatMap = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/seatmap/${id}`);

          // Reset form with fetched data
          reset(data.data);
        } catch (error) {
          console.error("Error fetching seat map data:", error);
        }
      }
    };

    fetchSeatMap(); // Fetch data if ID exists
  }, [id, reset]);

  const handleFormSubmit = async (data: SeatMapFormData) => {
    try {
      // Convert all numeric fields to strings before submitting
      const requestData = {
        ...data,
        column: String(data.column),
        is_double: String(data.is_double),
      };

      if (id) {
        // Update seat map
        await instance.put(`/seatmap/${id}`, requestData);
        notification.success({
          message: "Cập nhật bản đồ ghế thành công!",
        });
      } else {
        // Create new seat map
        await instance.post("/seatmap", requestData);
        notification.success({
          message: "Thêm bản đồ ghế thành công!",
        });
      }
      nav("/admin/seatmap"); // Redirect to the seat map list page
    } catch (error) {
      console.error("Error submitting seat map data:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu bản đồ ghế",
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
          {id ? "Cập nhật Bản đồ ghế" : "Thêm Bản đồ ghế"}
        </h1>

        {/* Seat Layout ID */}
        <div className="mb-3">
          <label htmlFor="seat_layout_id" className="form-label">
            Bố cục ghế
          </label>
          <select
            className={`form-control ${errors.seat_layout_id ? "is-invalid" : ""}`}
            {...register("seat_layout_id",{valueAsNumber: true})}
          >
            <option value="">Chọn bố cục ghế</option>
            {seatLayouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
          {errors.seat_layout_id && <div className="invalid-feedback">{errors.seat_layout_id.message}</div>}
        </div>.
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {id ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav("/admin/seatmaps")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeatMapForm;
