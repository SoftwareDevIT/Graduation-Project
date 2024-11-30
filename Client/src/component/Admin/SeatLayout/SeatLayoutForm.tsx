import React, { useState } from 'react';
import { SeatLayout } from '../../../interface/SeatLayout';
import instance from '../../../server';
import './SeatLayout.css';

const SeatMatrixForm: React.FC = () => {
    const [formData, setFormData] = useState<SeatLayout>({
        id: 0,
        name: '',
        rows: 0,
        columns: 0,
        row_regular_seat: 0,
        row_vip_seat: 0,
        row_couple_seat: 0,
        status: 'Active',
        created_at: '',
        updated_at: ''
    });
    const [seatMatrix, setSeatMatrix] = useState<{ seatType: string; position: string; selected: boolean }[][]>([]);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name.includes('row') || name === 'rows' || name === 'columns' ? Number(value) : value,
        });
    };

    // Add matrix
    const handleAddMatrix = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { rows, columns, row_regular_seat, row_vip_seat, row_couple_seat } = formData;

            // Kiểm tra nếu tổng các loại ghế vượt quá tổng số hàng
            if (row_regular_seat + row_vip_seat + row_couple_seat > rows) {
                alert('Tổng số hàng ghế thường, VIP và cặp đôi vượt quá tổng số hàng!');
                return;
            }

            // Tạo ma trận ghế
            const newMatrix = Array.from({ length: rows }, (_, rowIndex) => {
                const rowLabel = String.fromCharCode(65 + rowIndex); // Chuyển số hàng thành ký tự A, B, C...
                let seatType: string;

                if (rowIndex < row_regular_seat) {
                    seatType = 'R'; // Regular Seat
                } else if (rowIndex < row_regular_seat + row_vip_seat) {
                    seatType = 'V'; // VIP Seat
                } else if (rowIndex < row_regular_seat + row_vip_seat + row_couple_seat) {
                    seatType = 'C'; // Couple Seat
                } else {
                    seatType = '+'; // Empty Seat
                }

                return Array.from({ length: columns }, (_, colIndex) => ({
                    seatType,
                    position: `${rowLabel}${colIndex + 1}`, // Tên ghế: A1, A2, B1...
                    selected: false // Trạng thái ghế ban đầu chưa được chọn
                }));
            });

            setSeatMatrix(newMatrix);

            // Gửi dữ liệu lên server
            const dataToSend = {
                ...formData,
                rows: formData.rows.toString(),
                columns: formData.columns.toString(),
                row_regular_seat: formData.row_regular_seat.toString(),
                row_vip_seat: formData.row_vip_seat.toString(),
                row_couple_seat: formData.row_couple_seat.toString(),
            };

            const response = await instance.post('/matrix', dataToSend);
            console.log('Matrix added successfully:', response.data);
        } catch (error) {
            console.error('Error adding matrix:', error);
        }
    };

    // Handle seat selection
    const handleSeatClick = (rowIndex: number, colIndex: number) => {
        const updatedMatrix = [...seatMatrix];
        const seat = updatedMatrix[rowIndex][colIndex];

        // Thay đổi trạng thái ghế khi nhấp vào
        seat.selected = !seat.selected;
        
        // Cập nhật ma trận ghế mới
        setSeatMatrix(updatedMatrix);
    };

    return (
        <div className="container seat-matrix-container">
            <h2>Quản lý ma trận ghế</h2>
            <form onSubmit={handleAddMatrix} className="seat-matrix-form">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Tên ma trận</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="rows" className="form-label">Số hàng</label>
                    <input
                        type="number"
                        className="form-control"
                        id="rows"
                        name="rows"
                        value={formData.rows}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="columns" className="form-label">Số cột</label>
                    <input
                        type="number"
                        className="form-control"
                        id="columns"
                        name="columns"
                        value={formData.columns}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="row_regular_seat" className="form-label">Số hàng ghế thường</label>
                    <input
                        type="number"
                        className="form-control"
                        id="row_regular_seat"
                        name="row_regular_seat"
                        value={formData.row_regular_seat}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="row_vip_seat" className="form-label">Số hàng ghế VIP</label>
                    <input
                        type="number"
                        className="form-control"
                        id="row_vip_seat"
                        name="row_vip_seat"
                        value={formData.row_vip_seat}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="row_couple_seat" className="form-label">Số hàng ghế cặp đôi</label>
                    <input
                        type="number"
                        className="form-control"
                        id="row_couple_seat"
                        name="row_couple_seat"
                        value={formData.row_couple_seat}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Thêm ma trận</button>
            </form>

            {/* Seat Matrix */}
            <h3 className="mt-5">Sơ đồ ghế</h3>
            {seatMatrix.length > 0 && (
                <div className="seat-matrix">
                    <table className="table table-bordered">
                        <tbody>
                            {seatMatrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((seat, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`text-center seat-${seat.seatType} ${seat.selected ? 'seat-selected' : ''}`}
                                            onClick={() => handleSeatClick(rowIndex, colIndex)}
                                        >
                                            {/* Hiển thị dấu cộng khi ghế chưa chọn, chữ ghế khi ghế đã chọn */}
                                            <div>{seat.selected ? seat.seatType : '+'}</div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SeatMatrixForm;
