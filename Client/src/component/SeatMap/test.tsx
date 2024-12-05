import { useEffect, useState } from "react";
import axios from "axios";

interface Seat {
  row: string;
  type: string;
  label: string;
  column: number;
  status: number;
}

interface SeatMap {
  seat_structure: Seat[];
  matrix_row: number;
  matrix_column: number;
}

const YourComponent = () => {
  const [seatData, setSeatData] = useState<SeatMap>({
    seat_structure: [],
    matrix_row: 0,
    matrix_column: 0,
  });

  const [showtimeData, setShowtimeData] = useState<any>(null); // State để lưu dữ liệu API gốc
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/showtimes/1"
        );
        console.log("Dữ liệu nhận được:", response.data.data);

        // Lưu toàn bộ dữ liệu API vào state showtimeData
        setShowtimeData(response.data.data);

        const seatStructure =
          response.data?.data?.room?.seat_map?.seat_structure;
        console.log("seat_structure:", seatStructure);

        if (seatStructure && seatStructure.length > 0) {
          setSeatData({
            seat_structure: seatStructure,
            matrix_row: response.data?.data?.room.seat_map?.matrix_row || 0,
            matrix_column: response.data?.data?.room.seat_map?.matrix_column || 0,
          });
        } else {
          setError("Không có dữ liệu ghế.");
        }
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        setError("Không thể tải dữ liệu sơ đồ ghế. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchSeatData();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  const { seat_structure, matrix_row, matrix_column } = seatData;

  // Tạo mảng các hàng (A, B, C, ...) dựa trên số lượng hàng
  const rows = Array.from({ length: matrix_row }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Tạo mảng các cột
  const columns = Array.from({ length: matrix_column }, (_, i) => i + 1);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {/* Render cột tên hàng */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginRight: "10px",
          }}
        >
          {rows.map((row) => (
            <div
              key={row}
              style={{
                width: "50px",
                height: "30px",
                marginBottom: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                color: "#fff",
                border: "1px solid black",
                backgroundColor: "#727575",
              }}
            >
              {row}
            </div>
          ))}
        </div>

        {/* Render các ghế */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {rows.map((row) => {
            return (
              <div
                key={row}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: "10px",
                }}
              >
                {columns.map((col) => {
                  const seatLabel = `${row}${col}`;
                  const seat = seat_structure.find(
                    (s) => s.row === row && s.column === col
                  );

                  const seatType = seat?.type || "Regular"; // Default to regular seat
                  const isSeatAvailable = seat?.status === 1; // Seat availability
                  const isSeatEmpty = !seat; // Check if seat data is missing

                  return (
                    <div
                      key={seatLabel}
                      style={{
                        width: "30px",
                        height: "30px",
                        background:
                          seatType === "VIP"
                            ? "gold"
                            : seatType === "Couple"
                            ? "linear-gradient(45deg, gray 50%, rgb(56, 53, 53) 50%)"
                            : isSeatEmpty
                            ? "white" // Màu trắng cho ghế không có dữ liệu
                            : "lightgray",
                        display: "flex", // Always show the seat, even if no data available
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "10px",
                        borderRadius: "5px",
                        color: isSeatEmpty ? "transparent" : "#727575", // Màu chữ trong ghế trống
                        fontFamily: "LaTo",
                        fontWeight: "600",
                        marginRight: "5px",
                        border: isSeatEmpty ? "none" : "1px solid #ddd", // Không có border cho ghế trống
                        opacity: seat ? 1 : 0.5, // Make missing seats slightly transparent
                        pointerEvents: isSeatEmpty ? "none" : "auto", // Vô hiệu hóa tương tác với ghế trống
                      }}
                    >
                      {seat ? seat.label : ""} {/* Hiển thị ghế hoặc không gì */}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Hiển thị dữ liệu gốc từ API */}
      <div style={{ marginTop: "20px" }}>
        <h3>Dữ liệu API gốc:</h3>
        <pre style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>
          {JSON.stringify(showtimeData.movie.movie_name, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default YourComponent;
