import { Cinema } from "./Cinema";
import { Movie } from "./Movie";
import { MovieInCinema } from "./MovieInCinema";



export interface Showtime {
    movie_in_cinema_id: number;
    id: number;
    movie_id: number;
    cinema_id: number;
    showtime_date: string;
    showtime_start: string;
    showtime_end: string;
    status: string;
    price: number;
    movie: Movie;  
    cinema:Cinema;
    
    // Include the Movie interface
}