
import { Movie } from "./Movie";
import { Room } from "./Room";
export interface Showtime {
    movie: Movie; 
    id: number;
    movie_id: number;
    cinema_id: number;
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    cinema:string;
    status: string;
    price: number;
    room_id:number;
    room : Room
    
    
   
    
    // Include the Movie interface
}