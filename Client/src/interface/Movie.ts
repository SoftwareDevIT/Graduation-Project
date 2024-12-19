import { Actor } from "./Actor";

import { Cinema } from "./Cinema";
import { Director } from "./Director";
import { MovieCategory } from "./MovieCategory";

export interface Movie {
    id: number;
    movie_name: string;
    poster: string | null;
    thumbnail: string | null;
    duration: string | null;
    release_date: string | null;
    age_limit: number | null;
    description: string | null;
    trailer: string | null;
    country: string ;
    rating: string | null;
    views: number | null;
    like: number | null;
    status: number;
    actor: Actor[];
    cinema:Cinema[];
    movie_category: MovieCategory[]; 
    director: Director[];
    movie_in_cinemas: Cinema[];
    [key: string]: any; 
   
}
