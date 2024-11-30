export interface SeatLayout {
    id: number;
    name: string;
    rows: number;
    columns: number;
    row_regular_seat: number;
    row_vip_seat: number;
    row_couple_seat: number;
    status: string;
    created_at: string; // hoặc Date nếu bạn muốn làm việc với ngày giờ
    updated_at: string; // hoặc Date nếu bạn muốn làm việc với ngày giờ
}