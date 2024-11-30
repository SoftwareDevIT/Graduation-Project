import React from "react";
import { SeatRowProps } from "../../interface/SeatRowProps";

import "./CinemaSeatSelection.css";
import Seat from "./Seat";

const SeatRow: React.FC<SeatRowProps> = ({
  row,
  onSeatClick,
  selectedSeats,
  reservedSeats,
}) => {
  const rowLabel = row.row;
  const seats = row.seats;

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

export default SeatRow;
