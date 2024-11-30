
import { Movie } from "./Movie";

export interface Showtime {
    movie_in_cinema_id: number;
    movie_in_cinema: {
        id: number;
        movie_id: number;
        cinema_id: number;
        created_at: string;
        updated_at: string;
        movie: Movie; 
    }
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

    
    
   
    
    // Include the Movie interface
}