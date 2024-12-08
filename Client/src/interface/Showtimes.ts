
import { Movie } from "./Movie";
import { Room } from "./Room";
import { Seat } from "./Seat";
export interface Showtime {
    movie: Movie; 
    id: number;
    movie_id: number;
    cinema_id: number;
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    date: string;
    opening_time: string;
    closing_time:string;
    duration: string;
    cinema:string;
    status: string;
    price: number;
    room_id:number;
    room : Room;

    showtime_id:string;
    
   
    
    // Include the Movie interface
}