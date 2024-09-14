
export interface Cinema {
  id: number;
  cinema_name: string;
  phone: string;
  location_id: number;
  cinema_address: string;
  status: 'Show' | 'Hidden';
  created_at: string;
  updated_at: string;
}
