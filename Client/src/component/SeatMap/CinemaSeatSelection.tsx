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
import { Movie } from "../../interface/Movie";

type Seat = {
  id: number;
  seat_layout_id: number;
  row: string | undefined; 
  column: number;
  type: "Regular" | "VIP" | "Couple";
  status?: "available" | "unavailable";
};

type Seats = {
  [row: string]: Seat[]; 
};

type SeatLayoutResponse = {
  id: number;
  movie_id: number;
  room_id: number;
  seats: Seats;
  showtime_date: string;
  showtime_start: string;
  showtime_end: string;
  room: Room;
  movie:Movie;
};


const CinemaSeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const { movieName, cinemaName, showtime, showtimeId, cinemaId, price } =
    location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
  const [roomData, setRoomData] = useState<Room | null>(null);
  const [seatData, setSeatData] = useState<SeatLayoutResponse | null>(null);

  const [error, setError] = useState("");
  useEffect(() => {
    const fetchRoomAndSeats = async () => {
      try {
        // Fetching the showtime data
        const response = await instance.get(`/showtimes/${showtimeId}`);
        const seatLayoutData = response.data.data;
  
        // Setting seat data
        setSeatData(seatLayoutData);
  
        // Fetching seat data
        try {
          const seatResponse = await instance.get(`/seat/${showtimeId}`);
          const seatDataseat = seatResponse.data;
  
          const reservedSeatSet = new Set<string>();
          seatDataseat.data.forEach((seat: { seat_name: string; status: string }) => {
            if (seat.status === "Reserved Until" || seat.status === "Booked") {
              reservedSeatSet.add(seat.seat_name);
            }
          });
  
          // Set reserved seats data
          setReservedSeats(reservedSeatSet);
        } catch (seatError) {
          // If fetching seat data fails, just log it, but don't stop the execution
          console.error("Error fetching seat data", seatError);
          // Optionally set a fallback state for seat data
          setReservedSeats(new Set<string>());
        }
  
      } catch (error) {
        // Handle errors with fetching showtime data
        console.error("Error fetching room data", error);
        setError("Không thể tải dữ liệu, vui lòng thử lại!");
      }
    };
  
    fetchRoomAndSeats();
  }, [showtimeId]);
  
  const handleSeatClick = (row: string, index: number) => {
    const seatLabel = `${row}${index + 1}`;
    if (reservedSeats.has(seatLabel)) return; // Không xử lý nếu ghế đã được đặt
  
    const currentSeats = new Map(selectedSeats);
    if (currentSeats.has(row)) {
      const indices = currentSeats.get(row) || [];
      if (indices.includes(index)) {
        currentSeats.set(row, indices.filter((i) => i !== index));
      } else {
        currentSeats.set(row, [...indices, index]);
      }
    } else {
      currentSeats.set(row, [index]);
    }
    setSelectedSeats(currentSeats);
  };
  
  
 
  if (!seatData?.seats) {
    return <div>Không có dữ liệu ghế.</div>;
  }
  const calculatePrice = () => {
    let totalPrice = 0;
  
    selectedSeats.forEach((indices, row) => {
      indices.forEach((index) => {
        // Lấy thông tin ghế dựa trên hàng và cột
        const seat = seatData.seats[row]?.find((s) => s.column === index + 1);
        if (!seat) return; // Nếu ghế không tồn tại, bỏ qua
  
        // Tính giá vé dựa trên loại ghế
        if (seat.type === "VIP") {
          totalPrice += price * 1.3; // Giá vé VIP
        } else if (seat.type === "Couple") {
          totalPrice += price * 1.3  * 2; // Giá vé đôi
        } else {
          totalPrice += price; // Giá vé thường
        }
      });
    });
  
    return totalPrice;
  };
  const totalPrice = calculatePrice();
  

  const rows = Object.keys(seatData.seats);
  const columns = seatData.room.seat_layout.columns;
  const handleSubmit = async () => {
    const selectedSeatsArray = Array.from(selectedSeats.entries()).flatMap(
      ([row, indices]) =>
        indices.map((index) => ({
          seat_name: `${row}${index + 1}`,
          room_id:  seatData.room.id,
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
  console.log("du lieu ghe:",selectedSeatsArray);
  
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
            // totalPrice,
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
            content: "Vui lòng không để trống ghế ở giữa!",
            icon: null,
            className: "custom-error-modal",
          });
        } if(error.response.status === 400){
          Modal.error({
            title: "Ghế đã được đặt",
            content: "Ghế của bạn đã được đặt vui lòng đặt lại ghế khác",
            icon: null,
            className: "custom-error-modal",
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
              <div className="mapseat" style={{ display: "flex", alignItems: "flex-start",marginRight:"70px" }}>
      {/* Cột tên hàng */}
      <div style={{ display: "flex", flexDirection: "column", marginRight: "10px" }}>
        {rows.map((row) => (
          <div
            key={row}
            style={{
              width: "30px",
              height: "30px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              color:'#fff',
              border: "1px solid black", // Add border to row labels
              backgroundColor: "#727575", // Slight background color for clarity
             position:"relative",
             right:"50px"
        
            }}
          >
            {row}
          </div>
        ))}
      </div>

      {/* Cột ghế */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 30px)`,
          gridGap: "10px",
          alignItems: "center", // Đảm bảo các ghế được căn thẳng hàng
        }}
      >
       {rows.map((row) => {
  const rowSeats = seatData.seats[row];
  const rowArray = Array.from({ length: columns }, (_, i) => {
    return rowSeats.find(seat => seat.column === i + 1); // Tìm ghế theo cột
  });

  return rowArray.map((seat, index) => {
    const seatType = seat?.type || "Regular";
    const isSeatAvailable = seat?.status !== "unavailable";
    const seatLabel = seat?.row ? `${seat.row}${seat.column}` : ""; // Đảm bảo không truy cập row nếu undefined
    const isSelected = selectedSeats.get(row)?.includes(index);
    const isReserved = reservedSeats.has(seatLabel);

    // CSS chung cho các ghế (khi ghế không có giá trị, không thể chọn)
    const baseStyle = {
      color: "#727575",
      fontFamily: "LaTo",
      fontWeight: "600",
      width: "30px",
      height: "30px",
      display: isSeatAvailable ? "flex" : "none",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "10px",
      borderRadius: "5px", // Border radius chung cho tất cả ghế
   
    };

    // Màu nền khi ghế có giá trị
    const seatBackground = isReserved
    ? "darkgray" // Màu cho ghế đã đặt
    : seat
    ? isSelected
        ? "green" // Màu sắc khi chọn ghế
        : seatType === "VIP"
        ? "gold" // Ghế VIP
        : seatType === "Couple"
        ? "linear-gradient(45deg, gray 50%, rgb(56, 53, 53) 50%)" // Ghế Couple
        : "lightgray" // Ghế Regular
      : "white"; // Màu nền khi ghế không có giá trị (không thể chọn)

    return (
      <div
      className="seat_row"
        key={`${row}-${index}`}
        onClick={() => !isReserved && handleSeatClick(row, index)} 

        style={{
          ...baseStyle, // Áp dụng các style chung
          background: seatBackground, // Áp dụng màu nền cho ghế dựa trên loại và trạng thái
          cursor: isSeatAvailable ? "pointer" : "not-allowed", // Khi ghế không có sẵn, không thể chọn
        }}
      >
        {seatLabel}
      </div>
    );
  });
})}

      </div>
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
                <p className="title-phim">{seatData.movie.movie_name}</p>
                <p>
                  Rạp:<span> {seatData.room.cinema.cinema_name}</span>
                </p>
                <p>
                  Suất: <span> {showtime}</span>
                </p>
                <p>
                  Phòng chiếu: <span>{seatData.room.room_name || seatData.room.id}</span>
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
                <button className="continue-btn1" onClick={handleSubmit} >
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



export default CinemaSeatSelection;