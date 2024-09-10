import React, { useState } from "react";
import "./CinemaSeatSelection.css";
import { Link } from "react-router-dom";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import Headerticket from "../Headerticket/Headerticket";

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

  const seatRows: Array<string | { row: string; seats: (string | null)[] }> = [
    { row: "A", seats: Array(12).fill(null) },
    { row: "B", seats: Array(12).fill(null) },
    { row: "C", seats: Array(12).fill(null) },
    { row: "D", seats: [null, null, null, "reserved", "reserved", null, null, null, null, null, null, null] }, // D4, D5
    { row: "E", seats: [null, null, null, null, null, null, null, "reserved", "reserved", null, null, null] }, // E8, E9
    { row: "F", seats: Array(12).fill(null) },
    { row: "G", seats: Array(12).fill(null) },
    { row: "H", seats: [null, null, null, null, "reserved", "reserved", "reserved", "reserved", null, null, null, null] }, // H5, H6, H7, H8
    { row: "I", seats: Array(12).fill(null) },
    { row: "J", seats: Array(12).fill(null) },
    { row: "K", seats: Array(12).fill(null) },
    { row: "L", seats: ["couple", "couple", "couple", "couple", "couple", "couple"] },
  ];  

  const handleSeatClick = (row: string, seatIndex: number) => {
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
    <Header/>
    <Headerticket/>
    <div className="container container-map">
      <div className="seat-info-box"> {/* Combined seat-map and info-box */}
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
    <Footer/>
    </>
  );
};

const SeatRow: React.FC<SeatRowProps> = ({ row, onSeatClick, selectedSeats }) => {
  const rowLabel = typeof row === "string" ? row : row.row;
  const seats = typeof row === "string" ? Array(12).fill(null) : row.seats;

  return (
    <div className="seat-row">
      <div className="seat-label">{rowLabel}</div>
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
