import React, { useEffect, useState } from "react";
import axios from "axios";
import { Room } from "../../interface/Room";
import './SeatLayout.css'
type Seat = {
  id: number;
  seat_layout_id: number;
  row: string | undefined;
  column: number;
  type: "Regular" | "VIP" | "Couple";
  status?: "available" | "unavailable";
};

type Seats = {
  [row: string]: Seat[];
};

type SeatLayoutResponse = {
  id: number;
  movie_id: number;
  room_id: number;
  seats: Seats;
  showtime_date: string;
  showtime_start: string;
  showtime_end: string;
  room: Room;
};

const SeatLayout = () => {
  const [seatData, setSeatData] = useState<SeatLayoutResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSeatData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/showtimes/1");
        setSeatData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải dữ liệu sơ đồ ghế. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchSeatData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  if (!seatData?.seats) {
    return <div>Không có dữ liệu ghế.</div>;
  }

  const rows = Object.keys(seatData.seats);
  const columns = seatData.room.seat_layout.columns;

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {/* Cột tên hàng */}
      <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
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
              color:'#fff',
              border: "1px solid black", // Add border to row labels
              backgroundColor: "#727575", // Slight background color for clarity
        
            }}
          >
            {row}
          </div>
        ))}
      </div>

      {/* Cột ghế */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 30px)`,
          gridGap: "10px",
          alignItems: "center",
        }}
      >
        {rows.map((row) => {
          const rowSeats = seatData.seats[row];
          const rowArray = Array.from({ length: columns }, (_, i) => {
            return rowSeats.find(seat => seat.column === i + 1);
          });

          return rowArray.map((seat, index) => {
            const seatType = seat?.type || "Regular";
            const isSeatAvailable = seat?.status !== "unavailable";
            const seatLabel = seat?.row ? `${seat.row}${seat.column}` : "";

            return (
              <div
                key={`${row}-${index}`}
                style={{
                color: "#727575",
  fontFamily:"LaTo",
fontWeight:"600",
                  width: "30px",
                  height: "30px",
                  background:
                    seat
                      ? seatType === "Regular"
                        ? "lightgray"
                        : seatType === "VIP"
                        ? "gold"
                        : seatType === "Couple"
                        ? "linear-gradient(45deg, gray 50%, rgb(56, 53, 53) 50%)"
                        : "gray"
                      : "white",
                  display: isSeatAvailable ? "flex" : "none",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "10px",
                  borderRadius: "5px", // Add border radius to the seats
                 
                }}
              >
                {seatLabel}
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default SeatLayout;
