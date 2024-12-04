import { Cinema } from "./Cinema";
import { SeatLayout } from "./SeatLayout";

export interface Room {
  id: number; 
  cinema:Cinema;
  cinema_id: number; 
  seat_layout: SeatLayout; 
  seat_layout_id: number;
  room_name: string; 
  status: boolean; 
  created_at: string | null; 
  updated_at: string | null;
}
