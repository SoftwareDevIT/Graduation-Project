import React, { useState } from 'react';
import axios from 'axios';

const SeatMap: React.FC = () => {
  const [selectedSeats, setSelectedSeats] = useState<{ row: string; column: number }[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // Trạng thái đã gửi hay chưa
  const seatLayoutId = "2"; // Giá trị seat_layout_id có thể được lấy từ context hoặc props.

  // Hàm để gửi API
  const sendSeatData = async () => {
    if (selectedSeats.length > 0) {
      // Kiểm tra và đảm bảo dữ liệu không thiếu trường 'row' hoặc 'column'
      const seatData = selectedSeats.map(seat => {
        if (!seat.row || !seat.column) {
          console.error('Invalid seat data:', seat);
          return null; // Tránh gửi dữ liệu không hợp lệ
        }
        return {
          seat_layout_id: seatLayoutId,
          row: seat.row,
          column: seat.column,
          type: 1, // Giá trị type có thể thay đổi tùy theo yêu cầu
        };
      }).filter(seat => seat !== null); // Loại bỏ các ghế có dữ liệu không hợp lệ

      if (seatData.length === 0) {
        console.error('No valid seat data to send');
        return; // Không gửi nếu không có ghế hợp lệ
      }

      try {
        const response = await axios.post('http://localhost:8000/api/seat-map', seatData);
        console.log('Seat data sent:', response.data);
        setIsSubmitted(true); // Đánh dấu đã gửi thành công
      } catch (error) {
        console.error('Error sending seat data:', error);
      }
    } else {
      console.error('No seats selected');
    }
  };

  // Hàm để xử lý sự kiện chọn ghế (thêm hoặc xóa ghế khỏi danh sách đã chọn)
  const handleSeatClick = (row: string, column: number) => {
    const seatIndex = selectedSeats.findIndex(seat => seat.row === row && seat.column === column);

    if (seatIndex === -1) {
      // Nếu ghế chưa được chọn, thêm vào mảng
      setSelectedSeats([...selectedSeats, { row, column }]);
    } else {
      // Nếu ghế đã được chọn, xóa khỏi mảng
      const updatedSeats = selectedSeats.filter(seat => !(seat.row === row && seat.column === column));
      setSelectedSeats(updatedSeats);
    }
    setIsSubmitted(false); // Khi chọn ghế mới, reset trạng thái gửi
  };

  // Render ma trận ghế (ví dụ 5 hàng, 5 cột)
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const columns = [1, 2, 3, 4, 5];

  return (
    <div>
      <h2>Chọn ghế</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            {columns.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row}>
              <td>{row}</td>
              {columns.map((col) => (
                <td
                  key={col}
                  onClick={() => handleSeatClick(row, col)}
                  style={{
                    cursor: 'pointer',
                    padding: '10px',
                    border: '1px solid #ccc',
                    backgroundColor: selectedSeats.some(seat => seat.row === row && seat.column === col)
                      ? 'green'
                      : 'white',
                  }}
                >
                  {row}{col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Nút gửi ghế đã chọn */}
      {selectedSeats.length > 0 && !isSubmitted && (
        <button onClick={sendSeatData}>Gửi dữ liệu</button>
      )}

      {/* Thông báo đã gửi */}
      {isSubmitted && <p>Dữ liệu đã được gửi thành công!</p>}
    </div>
  );
};

export default SeatMap;
