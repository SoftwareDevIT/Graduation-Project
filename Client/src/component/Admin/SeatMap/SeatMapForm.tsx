import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./SeatMap.css";

// Define Zod schema
const seatMapSchema = z.object({
  seat_layout_id: z
    .number()
    .min(1, "Bố cục ghế là bắt buộc"),
  row: z.string().min(1, "Số hàng là bắt buộc"),
  column: z
    .number()
    .min(1, "Số cột là bắt buộc"),
  type: z.string().min(1, "Loại ghế là bắt buộc"),
  is_double: z
    .number()
    .min(0, "Trạng thái ghế phải là 0 hoặc 1")
    .max(1, "Trạng thái ghế phải là 0 hoặc 1"),
});

type SeatMapFormData = z.infer<typeof seatMapSchema>;

const SeatMapForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [seatLayouts, setSeatLayouts] = useState<{ id: number; name: string }[]>([]);
  const [seatMap, setSeatMap] = useState<any[][]>([]);
  

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<SeatMapFormData>({
    resolver: zodResolver(seatMapSchema),
  });

  // Fetch seat layouts
  useEffect(() => {
    const fetchSeatLayouts = async () => {
      try {
        const { data } = await instance.get("/matrix");
        setSeatLayouts(data.data);
      } catch (error) {
        notification.error({
          message: "Lỗi khi tải bố cục ghế",
        });
      }
    };

    fetchSeatLayouts();
  }, []);

  useEffect(() => {
    const fetchSeatMap = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/seat-map/${id}`);
          reset(data.data);
        } catch (error) {
          notification.error({
            message: "Lỗi khi tải dữ liệu bản đồ ghế",
          });
        }
      }
    };

    fetchSeatMap();
  }, [id, reset]);

  const handleSeatLayoutChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    if (!selectedId) {
      setSeatMap([]);
      return;
    }

    try {
      const { data } = await instance.get(`/matrix/${selectedId}`);
      const { rows, columns, row_regular_seat, row_vip_seat, row_couple_seat } = data.data;

      const seatLayout = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        let seatType = "Regular";

        if (i < row_regular_seat) {
          seatType = "Regular";
        } else if (i >= row_regular_seat && i < row_regular_seat + row_vip_seat) {
          seatType = "VIP";
        } else if (i >= row_regular_seat + row_vip_seat) {
          seatType = "Couple";
        }

        for (let j = 0; j < columns; j++) {
          row.push({
            name: `${String.fromCharCode(65 + i)}${j + 1}`,
            type: seatType,
            is_double: seatType === "Couple" ? 1 : 0,
          });
        }
        seatLayout.push(row);
      }
      setSeatMap(seatLayout);
    } catch (error) {
      notification.error({
        message: "Lỗi khi lấy dữ liệu ghế",
      });
    }
  };

  const handleFormSubmit = async (data: SeatMapFormData) => {
    try {
      const requestData = {
        ...data,
        column: Number(data.column),
        is_double: Number(data.is_double),
      };

      await instance.put(`/seat-map/${id}`, requestData);
      notification.success({
        message: "Cập nhật bản đồ ghế thành công!",
      });
      nav("/admin/seatmap");
    } catch (error) {
      notification.error({
        message: "Lỗi khi gửi dữ liệu bản đồ ghế",
      });
    }
  };
  const handleSeatClick = (seat: any) => {
    console.log("Thông tin ghế:", seat);
    notification.info({
      message: "Thông tin ghế",
      description: `Tên ghế: ${seat.name}, Loại: ${seat.type}, Ghế đôi: ${seat.is_double ? "Có" : "Không"}`,
    });
  };
  

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
      >
        <h1 className="text-center mb-4">Cập nhật Bản đồ ghế</h1>

        <div className="mb-3">
          <label htmlFor="seat_layout_id" className="form-label">
            Bố cục ghế
          </label>
          <select
            className={`form-control ${errors.seat_layout_id ? "is-invalid" : ""}`}
            {...register("seat_layout_id", { valueAsNumber: true })}
            onChange={handleSeatLayoutChange}
          >
            <option value="">Chọn bố cục ghế</option>
            {seatLayouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name}
              </option>
            ))}
          </select>
          {errors.seat_layout_id && (
            <div className="invalid-feedback">{errors.seat_layout_id.message}</div>
          )}
        </div>

        <div className="seat-map">
          {seatMap.length > 0 ? (
            <div className="seat-rows">
              {seatMap.map((row, rowIndex) => (
                <div key={rowIndex} className="seat-row">
                  <div className="seat-row-label">{String.fromCharCode(65 + rowIndex)}</div>
                  <div className="seats">
                    {row.map((seat, colIndex) => (
                      <div
                        key={colIndex}
                        className={`seat ${
                          seat.type === "VIP"
                            ? "seat-vip"
                            : seat.type === "Couple"
                            ? "seat-couple"
                            : "seat-regular"
                        }`}
                        onClick={() => handleSeatClick(seat)} 
                      >
                        {seat.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Chọn bố cục ghế để hiển thị</p>
          )}
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            Cập nhật
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav("/admin/seatmap")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeatMapForm;

