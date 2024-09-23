<<<<<<< HEAD
import { Cinema } from "./Cinema";

export interface Movie {
    rating: string;
    id: number;
    movie_category_id: number;
    actor_id: number;
    director_id: number;
    movie_name: string;
    poster: string | null;
    duraion: string | null;
    cinema: Cinema[];
    release_date: string | null;
    age_limit: number | null;
    description: string | null;
    trailer: string | null;
    status: 'Show' | 'Hidden';
  }
  
=======
import { Showtime } from "./Showtime";

 export interface Movie {
  id: number;
  movie_name: string;
  poster: string;
  duraion: string;
  release_date: string;
  age_limit: number;
  description: string;
  trailer: string;
  status: string;
  showtimes: Showtime[];
  actor_id: number; // Thêm actor_id vào Movie
}
>>>>>>> 63b968456eccbd2585ec462498fbed91e7df8f53
