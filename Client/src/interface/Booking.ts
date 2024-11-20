import { User } from "./User";

import { PayMethod } from "./PayMethod";
import { Movie } from "./Movie";
import { Showtime } from "./Showtimes";

export interface Booking {
  id: string;
  user_id : number;
  showtime_id : number;
  pay_method_id : number;
  price_ticket: number;
  price_combo: number;
  amount:number;
  status: string;
  user: User;
  showtime: Showtime;
  pay_method : PayMethod;
  movie: Movie;
}
