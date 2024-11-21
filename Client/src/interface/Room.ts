 export interface Room {
  id: number;
  room_name: string;
  volume: number;
  cinema_id: number;
  quantity_double_seats: number;
  quantity_vip_seats: number;
  created_at: string | null;
  updated_at: string | null;
}
