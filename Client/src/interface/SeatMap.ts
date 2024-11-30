export interface SeatMap {
    id?: number;  // Make id optional
    seat_layout_id: number;
    row: string;
    column: number;
    type: string;
    created_at: string;
    updated_at: string;
}