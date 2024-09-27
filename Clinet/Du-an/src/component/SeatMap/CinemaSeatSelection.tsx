import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; // Nhập useLocation
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
}

interface SeatProps {
  type: string | null;
  index: number;
  row: string;
  onSeatClick: (row: string, seatIndex: number) => void;
  isSelected: boolean;
}

const CinemaSeatSelection: React.FC = () => {
  const location = useLocation(); // Khai báo useLocation
  const { movieName, cinemaName, showtime ,showtimeId, cinemaId} = location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomRoom = async () => {
      try {
        const response = await instance.get(`/room`);
        const data = response.data;

        if (data && Array.isArray(data.data) && data.data.length > 0) {
          // Chọn ngẫu nhiên một phòng từ danh sách phòng
          const randomRoom =
            data.data[Math.floor(Math.random() * data.data.length)];

          if (randomRoom && randomRoom.volume > 0) {
            setRoomData(randomRoom); // Lưu thông tin phòng đã chọn
          } else {
            setError("Room data is invalid");
          }
        } else {
          setError("No rooms available");
        }
      } catch (error) {
        setError("Error fetching room data");
        console.error(error);
      }
    };

    fetchRandomRoom();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const totalSeats = roomData.volume;
  const seatsPerRow = 10; // Số ghế trong một hàng
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
    setSelectedSeats((prev) => {
      const newSelection = new Map(prev);
      const selectedInRow = newSelection.get(row) || []; // Get the selected seats in the row or an empty array

      if (selectedInRow.includes(seatIndex)) {
        // Deselect the seat if it's already selected
        newSelection.set(
          row,
          selectedInRow.filter((seat) => seat !== seatIndex)
        );
      } else {
        // Add the new seat to the selection
        newSelection.set(row, [...selectedInRow, seatIndex]);
      }

      return newSelection;
    });
  };

  // Calculate the total price based on selected seats
  const totalSelectedSeats = Array.from(selectedSeats.values()).reduce(
    (acc, selectedSeatsInRow) => acc + selectedSeatsInRow.length,
    0
  );
  const totalPrice = totalSelectedSeats * 50000; // 50,000 VND per seat

  return (
    <>
      <Header />
      <Headerticket />
      <div className="container container-map">
        <div className="seat-info-box">
          <div className="seat-map-box">
            <div className="screen">MÀN HÌNH</div>
            <div className="seat-map">
              {seatRows.map((row, index) => (
                <SeatRow
                  key={index}
                  row={row}
                  onSeatClick={handleSeatClick}
                  selectedSeats={selectedSeats}
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
              <p className="title-phim">{movieName}</p>{" "}
              {/* Hiển thị tên phim */}
              <p>
                Rạp:<span> {cinemaName}</span>
              </p>{" "}
              {/* Hiển thị tên rạp */}
              <p>
                Suất: <span> {showtime}</span>
              </p>{" "}
              {/* Hiển thị thời gian chiếu */}
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
              <p>Showtime ID: <span>{showtimeId}</span></p> {/* Hiển thị showtimeId */}
    <p>Cinema ID: <span>{cinemaId}</span></p> {/* Hiển thị cinemaId */}
            </div>
            <div className="price-box">
              <div className="price">
                Tổng đơn hàng
                <br /> <span>{totalPrice.toLocaleString()} đ</span>
              </div>
            </div>
            <div className="actions">
              <button className="back-btn">←</button>
              <Link
  to="/orders"
  state={{
    movieName,
    cinemaName,
    showtime,
    showtimeId, // Truyền showtimeId
    cinemaId,   // Truyền cinemaId
    roomId: roomData?.id, // Truyền roomId từ roomData
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
}) => {
  const rowLabel = typeof row === "string" ? row : row.row;
  const seats = typeof row === "string" ? Array(12).fill(null) : row.seats;

  return (
    <div className="seat-row-container">
      <div className="seat-row-label">{rowLabel}</div>
      <div className="seat-row-seats">
        {seats.map((seat, index) => (
          <Seat
            key={index}
            type={seat}
            index={index}
            row={rowLabel}
            onSeatClick={onSeatClick}
            isSelected={selectedSeats.get(rowLabel)?.includes(index) || false}
          />
        ))}
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
}) => {
  const seatClass =
    type === "reserved"
      ? "seat reserved"
      : type === "couple"
      ? "seat couple-seat"
      : "seat";
  const handleClick = () => onSeatClick(row, index);

  return (
    <div
      className={`${seatClass} ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
      role="button"
      aria-label={`Ghế ${index + 1}`}
    >
      <span className="seat-number">
        {row}
        {index + 1}
      </span>
    </div>
  );
};

export default CinemaSeatSelection;
