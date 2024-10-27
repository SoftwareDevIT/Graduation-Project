import { Actor } from "./Actor";
import { Categories } from "./Categories";
import { Cinema } from "./Cinema";
import { Director } from "./Director";

export interface Movie {
    id: number;
    movie_name: string;
    poster: string | null;
    duration: string | null;
    release_date: string | null;
    age_limit: number | null;
    description: string | null;
    trailer: string | null;
    rating: string | null;
    status: number; // Số nguyên từ API trả về (1: Show, 0: Hidden)
    actor: Actor[];
    category: Categories[]; // Mảng các đối tượng danh mục phim chứa category_name
    director: Director[];
    movie_in_cinemas: Cinema[];
    [key: string]: any; // Có thể thêm các thuộc tính khác từ API nếu cần
}
