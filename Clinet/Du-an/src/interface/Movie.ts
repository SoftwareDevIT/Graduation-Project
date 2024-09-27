
import { Cinema } from "./Cinema";
import { Showtime } from "./Showtime";

export interface Movie {
    rating: string;
    id: number;
    movie_category_id: number;
    actor_id: number;
    director_id: number;
    movie_name: string;
    poster: string | null;
    duraion: string | null;
    cinema: Cinema;
    release_date: string | null;
    age_limit: number | null;
    description: string | null;
    trailer: string | null;
    status: 'Show' | 'Hidden';
    showtimes: Showtime[];
  }
  