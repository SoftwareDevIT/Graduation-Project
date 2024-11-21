export interface Seat {
  type: "Normal" | "Couple" | "VIP";
    row: string;
    seat_name: string;
    seat_row: number;
    seat_column: number;
  }
  