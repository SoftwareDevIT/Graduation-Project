import { Seat } from "./Seat";

export interface Room {
    id: number;
    room_name: string;
    volume: number;
    cinema_id: number;
    seat_map: Seat[]; 
    status: string;
  }
  