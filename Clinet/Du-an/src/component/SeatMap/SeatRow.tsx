// import React from "react";

// interface SeatRowProps {
//   row: { row: string; seats: string[] };
//   onSeatClick: (row: string, seatIndex: number) => void;
//   selectedSeats: Map<string, number | null>;
// }

// const SeatRow: React.FC<SeatRowProps> = ({ row, onSeatClick, selectedSeats }) => {
//   const rowLabel = row.row;
//   const seats = row.seats;

//   return (
//     <div className="seat-row">
//       <div className="seat-label">{rowLabel}</div>
//       {seats.map((seat, index) => (
//         <div
//           key={index}
//           className={`seat ${selectedSeats.get(rowLabel) === index ? 'selected' : ''}`}
//           onClick={() => onSeatClick(rowLabel, index)}
//         >
//           {rowLabel}{index + 1}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SeatRow;
