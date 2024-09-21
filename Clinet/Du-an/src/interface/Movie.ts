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