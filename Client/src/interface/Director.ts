export interface Director {
    id: number;  // Primary Key, kiểu bigint, UNSIGNED
    director_name: string;  // Tên đạo diễn, varchar(255)
    descripcion?: string | null;  // Mô tả, varchar(255), có thể null
    photo?: string | null;  // Ảnh, varchar(255), có thể null
    country?: string | null;  // Quốc gia, varchar(255), có thể null
    link_wiki?: string | null;  // Link Wikipedia, varchar(255), có thể null
  }
  