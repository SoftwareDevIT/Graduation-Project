import React from "react";

interface Seat {
  id: string;
  row: number;
  col: number;
  isBooked: boolean;
}

interface SeatMapProps {
  rows: number;
  cols: number;
  bookedSeats: string[]; // Danh sách ghế đã đặt, ví dụ: ["A1", "B3"]
  onSeatClick?: (seatId: string) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ rows, cols, bookedSeats, onSeatClick }) => {
  const renderSeat = (row: number, col: number) => {
    const seatId = `${String.fromCharCode(65 + row)}${col + 1}`; // A1, B2, ...
    const isBooked = bookedSeats.includes(seatId);

    return (
      <td
        key={seatId}
        className={`seat ${isBooked ? "booked" : ""}`}
        onClick={() => !isBooked && onSeatClick?.(seatId)}
        style={{
          cursor: isBooked ? "not-allowed" : "pointer",
          backgroundColor: isBooked ? "#f44336" : "#4caf50",
          color: "white",
          padding: "10px",
          textAlign: "center",
        }}
      >
        {seatId}
      </td>
    );
  };

  return (
    <table style={{ borderCollapse: "collapse", margin: "auto" }}>
      <tbody>
        {Array.from({ length: rows }).map((_, row) => (
          <tr key={row}>
            {Array.from({ length: cols }).map((_, col) => renderSeat(row, col))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Sử dụng component
const CinemaSeats = () => {
  const handleSeatClick = (seatId: string) => {
    alert(`You clicked on seat ${seatId}`);
  };

  return (
    <div>
      <h1>Seat Map</h1>
      <SeatMap
        rows={5}
        cols={8}
        bookedSeats={["A1", "B3", "C5"]}
        onSeatClick={handleSeatClick}
      />
    </div>
  );
};

export default CinemaSeats;
