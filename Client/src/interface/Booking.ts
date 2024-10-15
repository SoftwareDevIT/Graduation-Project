import { User } from "./User";
import { Showtime } from "./Showtime";
import { PayMethod } from "./PayMethod";
import { Movie } from "./Movie";

export interface Booking {
  id: string;
  user_id : number;
  showtime_id : number;
  pay_method_id : number;
  price_ticket: number;
  price_combo: number;
  amount:number;
  seat_status: 'hold'|'no';
  user: User;
  showtime : Showtime;
  pay_method : PayMethod;
  movie: Movie;
}
