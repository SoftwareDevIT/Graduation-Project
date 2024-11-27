import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import Headerticket from "../Headerticket/Headerticket";
import "./CinemaSeatSelection.css";
import instance from "../../server";
import { Room } from "../../interface/Room";
import { message } from 'antd';
import { Modal } from 'antd';
import { SeatRowProps } from "../../interface/SeatRowProps";
import { SeatProps } from "../../interface/SeatProps";

const CinemaSeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const { movieName, cinemaName, showtime, showtimeId, cinemaId, price, roomId } =
    location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoomAndSeats = async () => {
      try {
        const roomResponse = await instance.get(`/room/${roomId}`);
        const roomData = roomResponse.data.data;
        if (roomData) {
          console.log("Room data:", roomData);
console.log("VIP Seats:", roomData.quantity_vip_seats);

          // Chắc chắn dữ liệu ghế VIP và ghế đôi được trả về chính xác
          const { quantity_double_seats, quantity_vip_seats, volume } = roomData;
          const normalSeats = volume - (quantity_double_seats + quantity_vip_seats);
  
          setRoomData({
            ...roomData,
            quantity_double_seats,
            quantity_vip_seats,
            normalSeats,
          });
        }
        const seatResponse = await instance.get(`/seat/${showtimeId}`);
      const seatData = seatResponse.data;

      const reservedSeatSet = new Set<string>();

      if (seatData && Array.isArray(seatData.data)) {
        seatData.data.forEach((seat: { seat_name: string; status: string }) => {
          // Nếu trạng thái là "Reserved Until" hoặc "Booked", đánh dấu ghế là đã đặt
          if (seat.status === "Reserved Until" || seat.status === "Booked") {
            reservedSeatSet.add(seat.seat_name);
          }
        });
      }
      setReservedSeats(reservedSeatSet); // Cập nhật ghế đã đặt
      } catch (error) {
        console.error("Error fetching room or seat data", error);
      }
    };
    fetchRoomAndSeats();
  }, [showtimeId]);
 
  
  if (error) {
    return <div>{error}</div>;
  }

  if (!roomData) {
    return <div>Loading...</div>;
  }

  const totalSeats = roomData.volume;
  const seatsPerRow = 10;
  const totalRows = Math.ceil(totalSeats / seatsPerRow);
  const rowLabels = Array.from({ length: totalRows }, (_, index) =>
    String.fromCharCode(65 + index)
  );
  let totalAssignedVipSeats = 0; // Tổng số ghế VIP đã phân bổ
let totalAssignedBasicSeats = 0; // Tổng số ghế BASIC đã phân bổ

  const seatRows: Array<{ row: string; seats: string[] }> = rowLabels.map((rowLabel, rowIndex) => {
    const startSeatNumber = rowIndex * seatsPerRow;
    const endSeatNumber = Math.min(startSeatNumber + seatsPerRow, totalSeats);
    
    // Khởi tạo tất cả ghế là "AVAILABLE"
    const seats: string[] = Array.from({ length: endSeatNumber - startSeatNumber }, () => "AVAILABLE");
    

    
    if (rowIndex === rowLabels.length - 1) {
      // Xử lý hàng ghế đôi (Couple Seats)
      const coupleSeats = roomData.quantity_double_seats;
      const coupleSeatsToAssign = Math.min(coupleSeats, seats.length);
      for (let i = 0; i < coupleSeatsToAssign; i++) {
        seats[i] = "COUPLE";
      }
      
    } else {
      // Điều chỉnh số ghế VIP và BASIC sao cho không vượt quá số ghế có sẵn
      const remainingVipSeats = Math.max(0, roomData.quantity_vip_seats - totalAssignedVipSeats);  // Số ghế VIP còn lại
      const vipSeats = Math.min(remainingVipSeats, seats.length);  // Phân bổ ghế VIP tối đa có sẵn
  
      const remainingBasicSeats = Math.max(0, roomData.quantity_basic_seats - totalAssignedBasicSeats);  // Số ghế BASIC còn lại
      const basicSeats = Math.min(remainingBasicSeats, seats.length);  // Phân bổ ghế BASIC tối đa có sẵn
  
      let assignedVipSeats = 0;
      let assignedBasicSeats = 0;
  
      // Bước 1: Phân bổ ghế VIP
      for (let i = 0; i < seats.length; i++) {
        if (seats[i] === "AVAILABLE" && assignedVipSeats < vipSeats) {
          seats[i] = "VIP";
          assignedVipSeats++;
        }
      }
      totalAssignedVipSeats += assignedVipSeats;
      console.log(`VIP Seats Assigned: ${assignedVipSeats}`);
  
      // Bước 2: Phân bổ ghế BASIC
      for (let i = 0; i < seats.length; i++) {
        if (seats[i] === "AVAILABLE" && assignedBasicSeats < basicSeats) {
          seats[i] = "BASIC";
          assignedBasicSeats++;
        }
      }
      totalAssignedBasicSeats += assignedBasicSeats;

  
      // Bước 3: Phân bổ ghế NORMAL
      for (let i = 0; i < seats.length; i++) {
        if (seats[i] === "AVAILABLE") {
          seats[i] = "NORMAL"; // Phân bổ ghế NORMAL cho những ghế còn lại
        }
      }

    }
    
    // In ra toàn bộ trạng thái ghế của hàng này

    
    return { row: rowLabel, seats };
  });
  
  
  const handleSeatClick = (row: string, seatIndex: number) => {
    const seatId = `${row}${seatIndex + 1}`;
    if (reservedSeats.has(seatId)) return; // Không cho chọn ghế đã đặt trước
  
    setSelectedSeats((prev) => {
      const newSelection = new Map(prev);
      const selectedInRow = newSelection.get(row) || [];
  
      if (selectedInRow.includes(seatIndex)) {
        // Nếu đã chọn thì bỏ chọn
        newSelection.set(
          row,
          selectedInRow.filter((seat) => seat !== seatIndex)
        );
      } else {
        // Nếu chưa chọn thì thêm ghế
        newSelection.set(row, [...selectedInRow, seatIndex]);
      }
  
      return newSelection;
    });
  };
  
  

  const totalSelectedSeats = Array.from(selectedSeats.values()).reduce(
    (acc, selectedSeatsInRow) => acc + selectedSeatsInRow.length,
    0
  );
const calculatePrice = () => {
  let totalPrice = 0;

  selectedSeats.forEach((indices, row) => {
    indices.forEach((index) => {
      const seatType = seatRows.find((r) => r.row === row)?.seats[index];
      if (seatType === "VIP") {
        totalPrice += price * 1.5; // Giá vé VIP
      } else if (seatType === "COUPLE") {
        totalPrice += price * 2; // Giá vé đôi
      } else {
        totalPrice += price; // Giá vé thường
      }
    });
  });

  return totalPrice;
};

const totalPrice = calculatePrice();

 

  // Hàm submit xử lý việc đẩy dữ liệu
  // Hàm submit xử lý việc đẩy dữ liệu
  const handleSubmit = async () => {
    const selectedSeatsArray = Array.from(selectedSeats.entries()).flatMap(
      ([row, indices]) =>
        indices.map((index) => ({
          seat_name: `${row}${index + 1}`,
          room_id: roomData?.id,
          showtime_id: showtimeId,
          seat_row: row.charCodeAt(0) - 65 + 1,
          seat_column: index + 1,
        }))
    );
  
    const payload = {
      cinemaId,
      showtimeId,
      seats: selectedSeatsArray,
    };
  
    try {
      const response = await instance.post("/selectSeats", payload);
  
      if (response.status === 200) {
        navigate("/orders", {
          state: {
            movieName,
            cinemaName,
            showtime,
            showtimeId,
            cinemaId,
            roomId: roomData?.id,
            seats: selectedSeatsArray,
            totalPrice,
          },
        });
      } else if (response.data.message === "Some seats already exist.") {
        message.error("Một số ghế đã được đặt trước. Chuyển về trang chủ sau 3 giây!", 3);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        console.error("Error: API call successful but status is not 200");
      }
    } catch (error: any) {
      if (error.response) {
        // Kiểm tra mã lỗi
        if (error.response.status === 401) {
          message.warning("Vui lòng đăng nhập để tiếp tục.");
          navigate("/login"); // Chuyển đến trang đăng nhập
        } else if (error.response.status === 402) {
          Modal.error({
            title: "Lỗi ghế trống",
            content: "Vui lòng không để trống ghế ở giữa!",
          });
        } else {
          Modal.error({
            title: "Lỗi không xác định",
            content: "Đã xảy ra lỗi, vui lòng thử lại.",
          });
        }
      } else {
        Modal.error({
          title: "Lỗi kết nối",
          content: "Không thể kết nối tới máy chủ, vui lòng kiểm tra lại kết nối.",
        });
      }
    }
  };
  


  // Hiển thị thông báo lỗi nếu có lỗi trong việc chọn ghế hoặc submit API
  if (error) {
    return <div>{error}</div>;
  }


  return (
    <>
      <Header />
      <Headerticket />
      
      <div className="box-map">
        <div className="container container-map">
          <div className="seat-info-box">
            <div className="seat-map-box ">
              <div className="screen">MÀN HÌNH</div>
              <div className="seat-map">
                {seatRows.map((row, index) => (
                  <SeatRow
                    key={index}
                    row={row}
                    onSeatClick={handleSeatClick}
                    selectedSeats={selectedSeats}
                    reservedSeats={reservedSeats}

                  />
                ))}
              </div>
              <div className="legend">
                <div>
                  <span className="seat selected"></span> Ghế bạn chọn
                </div>
                <div>
                  <span className="seat vip"></span> Ghế vip
                </div>
                <div>
                  <span className="seat couple-seat"></span> Ghế đôi
                </div>
                <div>
                  <span className="seat reserved"></span> Đã bán
                </div>
              </div>
            </div>
            <div className="thongtinphim">
              <div className="details-box1">
                <p className="title-phim">{movieName}</p>
                <p>
                  Rạp:<span> {cinemaName}</span>
                </p>
                <p>
                  Suất: <span> {showtime}</span>
                </p>
                <p>
                  Phòng chiếu: <span>{roomData.room_name || roomData.id}</span>
                </p>
                <p>
                  Ghế:{" "}
                  {Array.from(selectedSeats.entries())
                    .map(([row, indices]) =>
                      indices.map((index) => `${row}${index + 1}`).join(", ")
                    )
                    .join(", ")}
                </p>
              </div>
              <div className="price-box1">
                <div className="price">
                  Tổng đơn hàng
                  <br /> <span>{totalPrice.toLocaleString()} đ</span>
                </div>
              </div>
              <div className="actionst1">
                <button className="back-btn1" >←</button>
                <button className="continue-btn1" onClick={handleSubmit} disabled={totalSelectedSeats === 0}>
                  Tiếp Tục
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const SeatRow: React.FC<SeatRowProps> = ({
  row,
  onSeatClick,
  selectedSeats,
  reservedSeats,
}) => {
  const rowLabel = typeof row === "string" ? row : row.row;
  const seats = typeof row === "string" ? Array(12).fill(null) : row.seats;

  return (
    <div className="seat-row-container">
      <div className="seat-row-label">{rowLabel}</div>
      <div className="seat-row-seats">
        {seats.map((seat, index) => {
          const seatId = `${rowLabel}${index + 1}`;
          const isReserved = reservedSeats.has(seatId);
          const isSelected = selectedSeats.get(rowLabel)?.includes(index) ?? false;
          return (
            <Seat
              key={index}
              type={seat}
              index={index}
              row={rowLabel}
              onSeatClick={onSeatClick}
              isSelected={isSelected}
              isReserved={isReserved}

            />
          );
        })}
      </div>
    </div>
  );
};


const Seat: React.FC<SeatProps> = ({
  type,
  index,
  row,
  onSeatClick,
  isSelected,
  isReserved,
}) => {
  const handleClick = () => {
    if (!isReserved) {
      onSeatClick(row, index);
    }
  };

  // Xác định loại ghế và lớp CSS dựa trên các điều kiện
  const seatClassName = `seat ${isReserved ? "reserved" : ""} ${
    isSelected ? "selected" : ""
  } ${type === "VIP" ? "vip" : type === "COUPLE" ? "couple-seat" : "normal"}`;

  return (
    <span className={seatClassName} onClick={handleClick}>
      <span className="seat-number1">{`${row}${index + 1}`}</span>
    </span>
  );
};

export default CinemaSeatSelection;