import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import Headerticket from "../Headerticket/Headerticket";
import "./CinemaSeatSelection.css";
import instance from "../../server";
import { Room } from "../../interface/Room";


interface SeatRowProps {
  row: string | { row: string; seats: (string | null)[] };
  onSeatClick: (row: string, seatIndex: number) => void;
  selectedSeats: Map<string, number[]>;
  reservedSeats: Set<string>;
}

interface SeatProps {
  type: string | null;
  index: number;
  row: string;
  onSeatClick: (row: string, seatIndex: number) => void;
  isSelected: boolean;
  isReserved: boolean;
}

const CinemaSeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const { movieName, cinemaName, showtime, showtimeId, cinemaId, price, roomId } =
    location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomAndSeats = async () => {
      try {
        const roomResponse = await instance.get(`/room/${roomId}`);
        const roomData = roomResponse.data.data;
        if (roomData) {
          console.log("Room data:", roomData);
console.log("VIP Seats:", roomData.quantity_vip_seats);

          // Chắc chắn dữ liệu ghế VIP và ghế đôi được trả về chính xác
          const { quantity_double_seats, quantity_vip_seats, volume } = roomData;
          const normalSeats = volume - (quantity_double_seats + quantity_vip_seats);
  
          setRoomData({
            ...roomData,
            quantity_double_seats,
            quantity_vip_seats,
            normalSeats,
          });
        }
      } catch (error) {
        console.error("Error fetching room or seat data", error);
      }
    };
    fetchRoomAndSeats();
  }, [showtimeId]);
  
  
  if (error) {
    return <div>{error}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const totalSeats = roomData.volume;
  const seatsPerRow = 10;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  const rowLabels = Array.from({ length: totalRows }, (_, index) =>
    String.fromCharCode(65 + index)
  );
  const seatRows: Array<{ row: string; seats: (string | null)[] }> = rowLabels.map(
    (rowLabel, rowIndex) => {
      const isLastRow = rowIndex === rowLabels.length - 1; // Kiểm tra hàng cuối cùng
      const startSeatNumber = rowIndex * seatsPerRow;
      const endSeatNumber = Math.min(startSeatNumber + seatsPerRow, totalSeats);
      const seats: (string | null)[] = Array.from(
        { length: endSeatNumber - startSeatNumber },
        () => null // Tạo mảng ghế trống
      );
  
      if (isLastRow) {
        // Dòng cuối cùng: Chỉ chứa ghế đôi
        let coupleSeatsToAssign = Math.min(
          roomData.quantity_double_seats,
          seats.length
        );
        for (let i = 0; i < coupleSeatsToAssign; i++) {
          seats[i] = "COUPLE";
        }
  
        roomData.quantity_double_seats -= coupleSeatsToAssign;
      } else {
        // Các dòng khác: Gán ghế VIP và NORMAL
        let vipSeatsToAssign = Math.min(roomData.quantity_vip_seats, seats.length);
        for (let i = 0; i < vipSeatsToAssign; i++) {
          seats[i] = "VIP";
        }
  
        let normalSeatsToAssign = seats.length - vipSeatsToAssign;
        for (let i = vipSeatsToAssign; i < vipSeatsToAssign + normalSeatsToAssign; i++) {
          seats[i] = "NORMAL";
        }
  
        roomData.quantity_vip_seats -= vipSeatsToAssign;
      }
  
      return { row: rowLabel, seats };
    }
  );
  
  const handleSeatClick = (row: string, seatIndex: number) => {
    const seatId = `${row}${seatIndex + 1}`;
    if (reservedSeats.has(seatId)) return; // Không cho chọn ghế đã đặt trước
  
    setSelectedSeats((prev) => {
      const newSelection = new Map(prev);
      const selectedInRow = newSelection.get(row) || [];
  
      if (selectedInRow.includes(seatIndex)) {
        // Nếu đã chọn thì bỏ chọn
        newSelection.set(
          row,
          selectedInRow.filter((seat) => seat !== seatIndex)
        );
      } else {
        // Nếu chưa chọn thì thêm ghế
        newSelection.set(row, [...selectedInRow, seatIndex]);
      }
  
      return newSelection;
    });
  };
  
  

  const totalSelectedSeats = Array.from(selectedSeats.values()).reduce(
    (acc, selectedSeatsInRow) => acc + selectedSeatsInRow.length,
    0
  );

  const hours = showtime.split(":")[0];

  let price_ticket = 0;

  price_ticket = price;

  const totalPrice = totalSelectedSeats * price_ticket;

  // Hàm submit xử lý việc đẩy dữ liệu
  // Hàm submit xử lý việc đẩy dữ liệu
  const handleSubmit = async () => {
    const selectedSeatsArray = Array.from(selectedSeats.entries()).flatMap(
      ([row, indices]) =>
        indices.map((index) => ({
          seat_name: `${row}${index + 1}`,
          room_id: roomData?.id,
          showtime_id: showtimeId,
          seat_row: row.charCodeAt(0) - 65 + 1,
          seat_column: index + 1,
        }))
    );

    const payload = {
      cinemaId,
      showtimeId,
      seats: selectedSeatsArray,
    };

    try {
      const response = await instance.post("/selectSeats", payload);
      console.log(payload);
      if (response.status === 200) {
        // Navigate to 'orders' with all required data, including seats as an array
        navigate("/orders", {
          state: {
            movieName,
            cinemaName,
            showtime,
            showtimeId,
            cinemaId,
            roomId: roomData?.id,
            seats: selectedSeatsArray, // Pass selectedSeatsArray as seats
            totalPrice,
          },

        });
        console.log(selectedSeatsArray);

      } else {
        console.error("Error: API call successful but status is not 200");
      }
    } catch (error) {
      console.error("Error submitting movie and seats selection", error);
      setError("Có lỗi xảy ra khi gửi thông tin, vui lòng thử lại.");
    }
  };



  // Hiển thị thông báo lỗi nếu có lỗi trong việc chọn ghế hoặc submit API
  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
      <Header />
      <Headerticket />
      <div className="box-map">
        <div className="container container-map">
          <div className="seat-info-box">
            <div className="seat-map-box ">
              <div className="screen">MÀN HÌNH</div>
              <div className="seat-map">
                {seatRows.map((row, index) => (
                  <SeatRow
                    key={index}
                    row={row}
                    onSeatClick={handleSeatClick}
                    selectedSeats={selectedSeats}
                    reservedSeats={reservedSeats}

                  />
                ))}
              </div>
              <div className="legend">
                <div>
                  <span className="seat selected"></span> Ghế bạn chọn
                </div>
                <div>
                  <span className="seat couple-seat"></span> Ghế đôi
                </div>
                <div>
                  <span className="seat reserved"></span> Đã bán
                </div>
              </div>
            </div>
            <div className="thongtinphim">
              <div className="details-box1">
                <p className="title-phim">{movieName}</p>
                <p>
                  Rạp:<span> {cinemaName}</span>
                </p>
                <p>
                  Suất: <span> {showtime}</span>
                </p>
                <p>
                  Phòng chiếu: <span>{roomData.room_name || roomData.id}</span>
                </p>
                <p>
                  Ghế:{" "}
                  {Array.from(selectedSeats.entries())
                    .map(([row, indices]) =>
                      indices.map((index) => `${row}${index + 1}`).join(", ")
                    )
                    .join(", ")}
                </p>
              </div>
              <div className="price-box1">
                <div className="price">
                  Tổng đơn hàng
                  <br /> <span>{totalPrice.toLocaleString()} đ</span>
                </div>
              </div>
              <div className="actionst1">
                <button className="back-btn1" >←</button>
                <button className="continue-btn1" onClick={handleSubmit} disabled={totalSelectedSeats === 0}>
                  Tiếp Tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const SeatRow: React.FC<SeatRowProps> = ({
  row,
  onSeatClick,
  selectedSeats,
  reservedSeats,
}) => {
  const rowLabel = typeof row === "string" ? row : row.row;
  const seats = typeof row === "string" ? Array(12).fill(null) : row.seats;

  return (
    <div className="seat-row-container">
      <div className="seat-row-label">{rowLabel}</div>
      <div className="seat-row-seats">
        {seats.map((seat, index) => {
          const seatId = `${rowLabel}${index + 1}`;
          const isReserved = reservedSeats.has(seatId);
          const isSelected = selectedSeats.get(rowLabel)?.includes(index) ?? false;
          return (
            <Seat
              key={index}
              type={seat}
              index={index}
              row={rowLabel}
              onSeatClick={onSeatClick}
              isSelected={isSelected}
              isReserved={isReserved}

            />
          );
        })}
      </div>
    </div>
  );
};
const Seat: React.FC<SeatProps> = ({
  type,
  index,
  row,
  onSeatClick,
  isSelected,
  isReserved,
}) => {
  const handleClick = () => {
    if (!isReserved) {
      onSeatClick(row, index);
    }
  };

  // Xác định loại ghế dựa trên các điều kiện
  const seatClassName = isReserved
    ? "seat reserved"
    : isSelected
    ? "seat selected"
    : type === "VIP"
    ? "seat vip"
    : type === "COUPLE"
    ? "seat couple-seat"
    : "seat normal";

  return (
    <span className={seatClassName} onClick={handleClick}>
      <span className="seat-number1">{`${row}${index + 1}`}</span>
    </span>
  );
};





export default CinemaSeatSelection;