import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
  reservedSeats: Set<string>; // Thêm reservedSeats
}

interface SeatProps {
  type: string | null;
  index: number;
  row: string;
  onSeatClick: (row: string, seatIndex: number) => void;
  isSelected: boolean;
  isReserved: boolean; // Thêm isReserved
}

const CinemaSeatSelection: React.FC = () => {
  const location = useLocation();
  const { movieName, cinemaName, showtime, showtimeId, cinemaId } =
    location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set()); // Thêm reservedSeats
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomAndSeats = async () => {
      try {
        // Lấy dữ liệu phòng
        const roomResponse = await instance.get(`/room`);
        const roomData = roomResponse.data;
    
        if (roomData && Array.isArray(roomData.data) && roomData.data.length > 0) {
          const randomRoom = roomData.data[Math.floor(Math.random() * roomData.data.length)];
    
          if (randomRoom && randomRoom.volume > 0) {
            setRoomData(randomRoom);
          } else {
            setError("Room data is invalid");
            return; // Dừng lại nếu dữ liệu phòng không hợp lệ
          }
        } else {
          setError("No rooms available");
          return; // Dừng lại nếu không có phòng nào
        }
    
        // Nếu có phòng hợp lệ, tiếp tục lấy dữ liệu ghế đã đặt
        const seatResponse = await instance.get(`/seat/${showtimeId}`);
        const seatData = seatResponse.data;
    
        const reservedSeatSet = new Set<string>();
    
        // Kiểm tra và xử lý ghế nếu có dữ liệu ghế
        if (seatData && Array.isArray(seatData.data) && seatData.data.length > 0) {
          seatData.data.forEach((seat: { seat_name: string; status: string }) => {
            if (seat.status === "Reserved Until" || seat.status === "Booked") {
              reservedSeatSet.add(seat.seat_name);
            }
          });
          setReservedSeats(reservedSeatSet); // Cập nhật ghế đã đặt
        } else {
          // Nếu không có ghế nào đã đặt, vẫn hiển thị ghế trống
          setReservedSeats(new Set()); // Đặt Set trống nếu không có ghế nào được đặt
        }
    
      } catch (error) {
        // Không báo lỗi, chỉ hiển thị giao diện
        console.error("Error fetching room or seat data", error);
        setReservedSeats(new Set()); // Đặt Set trống để có thể hiển thị tất cả các ghế
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

  const seatRows: Array<string | { row: string; seats: (string | null)[] }> =
    rowLabels.map((rowLabel, rowIndex) => {
      const startSeatNumber = rowIndex * seatsPerRow;
      const endSeatNumber = Math.min(startSeatNumber + seatsPerRow, totalSeats);
      const seats = Array.from(
        { length: endSeatNumber - startSeatNumber },
        (_, index) => `${rowLabel}${startSeatNumber + index + 1}`
      );
      return { row: rowLabel, seats };
    });

    const handleSeatClick = (row: string, seatIndex: number) => {
      const seatId = `${row}${seatIndex + 1}`;
      if (reservedSeats.has(seatId)) return; // Ngăn chọn ghế đã đặt
    
      // Xử lý chọn/bỏ chọn ghế
      setSelectedSeats((prev) => {
        const newSelection = new Map(prev);
        const selectedInRow = newSelection.get(row) || [];
    
        if (selectedInRow.includes(seatIndex)) {
          newSelection.set(
            row,
            selectedInRow.filter((seat) => seat !== seatIndex)
          );
        } else {
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
  if (hours < 22) {
    price_ticket = 50000;
  } else {
    price_ticket = 45000;
  }
  const totalPrice = totalSelectedSeats * price_ticket;

  return (
    <>
      <Header />
      <Headerticket />
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
                  reservedSeats={reservedSeats} // Truyền reservedSeats vào
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
            <div className="details-box">
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
                Ghế{" "}
                {Array.from(selectedSeats.entries())
                  .map(([row, indices]) =>
                    indices.map((index) => `${row}${index + 1}`).join(", ")
                  )
                  .join(", ")}
              </p>
            </div>
            <div className="price-box">
              <div className="price">
                Tổng đơn hàng
                <br /> <span>{totalPrice.toLocaleString()} đ</span>
              </div>
            </div>
            <div className="actionst">
              <button className="back-btn">←</button>
              <Link
                to="/orders"
                state={{
                  movieName,
                  cinemaName,
                  showtime,
                  showtimeId,
                  cinemaId,
                  roomId: roomData?.id,
                  selectedSeats: Array.from(selectedSeats.entries())
                    .map(([row, indices]) =>
                      indices.map((index) => `${row}${index + 1}`).join(", ")
                    )
                    .join(", "),
                  totalPrice,
                }}
              >
                <button className="continue-btn">Tiếp Tục</button>
              </Link>
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
              isReserved={isReserved} // Truyền isReserved
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

  const seatClassName = isReserved
  ? "seat reserved"  // Nếu ghế đã đặt, gán class "reserved"
  : isSelected
  ? "seat selected"  // Nếu ghế được chọn, gán class "selected"
  : type === "couple"
  ? "seat couple-seat"  // Nếu là ghế đôi, gán class "couple-seat"
  : "seat";  // Ghế bình thường

  return <span className={seatClassName} onClick={handleClick}></span>;
};

export default CinemaSeatSelection;
