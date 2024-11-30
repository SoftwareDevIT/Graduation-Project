
import { Movie } from "./Movie";
import { Room } from "./Room";
export interface Showtime {
    movie_in_cinema_id: number;
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