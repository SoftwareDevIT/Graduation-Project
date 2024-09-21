import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import Headerticket from "../Headerticket/Headerticket";
import "./CinemaSeatSelection.css";
import instance from "../../server";
import { Room } from "../../interface/Room";

interface SeatRowProps {
  row: string | { row: string; seats: (string | null)[] };
  onSeatClick: (row: string, seatIndex: number) => void;
  selectedSeats: Map<string, number | null>;
}

interface SeatProps {
  type: string | null;
  index: number;
  row: string;
  onSeatClick: (row: string, seatIndex: number) => void;
  isSelected: boolean;
}

const CinemaSeatSelection: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<Map<string, number | null>>(new Map());
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchRandomRoom = async () => {
      try {
        const response = await instance.get(`/room`);
        const data = response.data;
  
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          // Chọn ngẫu nhiên một phòng từ danh sách phòng
          const randomRoom = data.data[Math.floor(Math.random() * data.data.length)];
  
          // Kiểm tra dữ liệu phòng ngẫu nhiên
          console.log('Random room data:', randomRoom); // Kiểm tra dữ liệu
  
          // Nếu phòng có dữ liệu volume, bạn có thể xử lý tiếp
          if (randomRoom && randomRoom.volume > 0) {
            const totalSeats = randomRoom.volume;
            const randomSeatNumber = Math.floor(Math.random() * totalSeats) + 1; // Random từ 1 đến số ghế
            const seatRow = String.fromCharCode(65 + Math.floor((randomSeatNumber - 1) / 10)); // Tính row (A, B, C,...)
            const seatIndex = (randomSeatNumber - 1) % 10 + 1; // Tính vị trí ghế trong hàng
  
            // Kiểm tra và sử dụng thuộc tính đúng
            console.log(`Phòng ngẫu nhiên: ${randomRoom.name || randomRoom.room_name || randomRoom.id}, Ghế ngẫu nhiên: ${seatRow}${seatIndex}`);
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
  const seatsPerRow = 10; // Adjust based on actual layout
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  const rowLabels = Array.from({ length: totalRows }, (_, index) => String.fromCharCode(65 + index));

  const seatRows: Array<string | { row: string; seats: (string | null)[] }> = rowLabels.map((rowLabel, rowIndex) => {
    const startSeatNumber = rowIndex * seatsPerRow;
    const endSeatNumber = Math.min(startSeatNumber + seatsPerRow, totalSeats);
    const seats = Array.from({ length: endSeatNumber - startSeatNumber }, (_, index) => `${rowLabel}${startSeatNumber + index + 1}`);
    return { row: rowLabel, seats };
  });

  const handleSeatClick = (row: string, seatIndex: number) => {
    const seat = `${row}${seatIndex + 1}`;
    setSelectedSeats(prev => {
      const newSelection = new Map(prev);
      if (newSelection.get(row) === seatIndex) {
        newSelection.delete(row); // Deselect if already selected
      } else {
        newSelection.set(row, seatIndex); // Select the seat
      }
      return newSelection;
    });
  };

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
              <div><span className="seat selected"></span> Ghế bạn chọn</div>
              <div><span className="seat couple-seat"></span> Ghế đôi</div>
              <div><span className="seat reserved"></span> Đã bán</div>
            </div>
          </div>
          <div className="thongtinphim">
            <div className="details-box">
              <p>Làm Giàu Với Ma</p>
              <p>Rạp:<span> Cinestar Quốc Thanh</span></p>
              <p>Suất: <span> 23:59 28/08/2024</span></p>
              <p>Phòng chiếu 01</p>
              <p>Ghế {Array.from(selectedSeats.entries()).map(([row, index]) => `${row}${index !== null ? index + 1 : 'N/A'}`).join(', ')}</p>
            </div>
            <div className="price-box">
              <div className="price">Tổng đơn hàng<br /> <span>0 đ</span></div>
            </div>
            <div className="actions">
              <button className="back-btn">←</button>
              <Link to={'/orders'}><button className="continue-btn">Tiếp Tục</button></Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const SeatRow: React.FC<SeatRowProps> = ({ row, onSeatClick, selectedSeats }) => {
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
            isSelected={selectedSeats.get(rowLabel) === index}
          />
        ))}
      </div>
    </div>
  );
};

const Seat: React.FC<SeatProps> = ({ type, index, row, onSeatClick, isSelected }) => {
  const seatClass = type === "reserved" ? "seat reserved" : type === "couple" ? "seat couple-seat" : "seat";
  const handleClick = () => onSeatClick(row, index);

  return (
    <div
      className={`${seatClass} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      role="button"
      aria-label={`Seat ${index + 1}`}
    >
      <span className="seat-number">{row}{index + 1}</span>
    </div>
  );
};

export default CinemaSeatSelection;
