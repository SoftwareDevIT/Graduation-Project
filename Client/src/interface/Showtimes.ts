import { Movie } from "./Movie";
import { CinemaRoom } from "./Room";






export interface Showtime {
    movie_in_cinema_id: number;
    movie_in_cinema: {
        id: number;
        movie_id: number;
        cinema_id: number;
        created_at: string;
        updated_at: string;
        movie: Movie; // Thuộc tính `movie` chứa thông tin về phim
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
    room : CinemaRoom
   
    
    // Include the Movie interface
}