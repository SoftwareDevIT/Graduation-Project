
  export interface Seat {
    row: string;
    type: string;
    label: string;
    column: number;
    status: number;
    linkedSeat?: string;
    isSelected?: boolean; 
  }