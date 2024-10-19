import { Showtime } from "./Showtime";

export interface Cinema {
  id?: number;
  cinema_name: string ;
  phone: string;
  location_id: number;
  cinema_address: string;
  status: string;
  showtimes:Showtime[]
}
