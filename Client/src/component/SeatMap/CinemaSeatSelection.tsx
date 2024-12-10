import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import Headerticket from "../Headerticket/Headerticket";
import "./CinemaSeatSelection.css";
import instance from "../../server";
import { Room } from "../../interface/Room";
import { message, Spin } from "antd";
import { Modal } from "antd";
import { Movie } from "../../interface/Movie";
import initializeEcho from "../../server/realtime";
import Echo from "laravel-echo";
import { Cinema } from "../../interface/Cinema";
import { SeatMap } from "../../interface/SeatMapp";

interface Showtime {
  id: number;
  movie_id: number;
  movie: Movie;
  room_id: number;
  room: {
    id: string;
    room_name: string;
    cinema: Cinema;
    seat_map: SeatMap;
  };
  showtime_date: string;
  showtime_start: string;
  showtime_end: string;
  price: number;
  status: number;
  created_at: string;
  updated_at: string;
}
const CinemaSeatSelection: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Khai báo useNavigate để điều hướng
  const { movieName, cinemaName, showtime, showtimeId, cinemaId, price } =
    location.state || {};

  const [selectedSeats, setSelectedSeats] = useState<Map<string, number[]>>(
    new Map()
  );
  const [loading, setLoading] = useState(true); // Add loading state
  const [reservedSeats, setReservedSeats] = useState<Set<string>>(new Set());
  const [showtimeData, setShowtimeData] = useState<Showtime>();
  const [seatData, setSeatData] = useState<SeatMap>({
    seat_structure: [],
    matrix_row: 0,
    matrix_column: 0,
  });

  const [error, setError] = useState("");

  const [echoInstance, setEchoInstance] = useState<Echo<"pusher"> | null>(null);

  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const fetchRoomAndSeats = async () => {
      try {
        // Fetching the showtime data
        const response = await instance.get(`/showtimes/${showtimeId}`);
        const seatLayoutData = response.data.data;
        // console.log('showtimedata3444',seatLayoutData)
        const seatStructure =
          response.data?.data?.room?.seat_map?.seat_structure;
        // console.log('showtimedata',seatStructure)
        setShowtimeData(seatLayoutData);

        // Setting seat data
        setSeatData({
          seat_structure: seatStructure,
          matrix_row: response.data?.data?.room.seat_map?.matrix_row || 0,
          matrix_column: response.data?.data?.room.seat_map?.matrix_column || 0,
        });
        // Fetching seat data
        try {
          const seatResponse = await instance.get(`/seat/${showtimeId}`);
          const seatDataseat = seatResponse.data;
          // console.log("Seat Data:", seatResponse.data); // Log dữ liệu ghế
          const reservedSeatSet: Set<string> = new Set();

          seatDataseat.data.forEach((seat: any) => {
            if (seat.seat_type === "Standard") {
              reservedSeatSet.add(seat.seat_name);
            }
          });

          // Cập nhật state
          setReservedSeats(reservedSeatSet);
          setLoading(false);
        } catch (seatError) {
          console.error("Error fetching seat data", seatError);

          setReservedSeats(new Set<string>());
          setLoading(false);
        }

        // Khởi tạo Echo và lắng nghe sự kiện realtime
        const setupRealtime = async () => {
          const echo = await initializeEcho();
          console.log("Connected to Pusher!", echo);
          if (echo) {
            setEchoInstance(echo);
            setStatus("Connected to Pusher!");
            const roomId = response.data.data.room.id;
            // Kết nối với channel tương ứng
            const channel = echo.private(`seats-${roomId}`);
            console.log("Connected to channel:", channel);
            // Lắng nghe sự kiện SeatSelected
            channel.listen("SeatSelected", (eventData: any) => {
              console.log("Received seats data:", eventData);

              if (eventData) {
                console.log("Received selected seats:", eventData.seats);

                // Cập nhật state với Map
                const newSelectedSeats = new Map(selectedSeats); // Sao chép bản đồ cũ
                newSelectedSeats.set(roomId, eventData.seats); // Thêm ghế mới vào Map theo roomId
                setSelectedSeats(newSelectedSeats); // Cập nhật lại state

                
                updateSeatsSelection(eventData.seats); // Cập nhật ghế trong lưới
              }
            });
          } else {
            setStatus("Failed to connect.");
          }
        };

        if (!echoInstance) {
          setupRealtime();
        }

        // Cleanup khi component bị unmount
        return () => {
          if (echoInstance) {
            echoInstance.disconnect();
          }
        };
      } catch (error) {
        console.error("Error fetching room data", error);
        setError("Không thể tải dữ liệu, vui lòng thử lại!");
        setLoading(false);
      }
    };

    fetchRoomAndSeats();
  }, [showtimeId, selectedSeats,echoInstance ]);

  const updateSeatsSelection = (selectedSeats: string[]) => {
    // Lặp qua từng ghế trong seat_structure
    const updatedSeats = seatData.seat_structure.map((seat) => {
      // Tạo khóa ghế từ row và column
      const seatKey = `${seat.row}-${seat.column}`;
      // Kiểm tra xem ghế có trong danh sách ghế đã chọn không
      seat.isSelected = selectedSeats.includes(seatKey);
      return seat;
    });

    // Cập nhật lại seat_structure trong state
    setSeatData((prev) => ({
      ...prev,
      seat_structure: updatedSeats,
    }));
  };

  const { seat_structure, matrix_row, matrix_column } = seatData;

  // Tạo mảng các hàng (A, B, C, ...) dựa trên số lượng hàng
  const rows = Array.from({ length: matrix_row }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  // Tạo mảng các cột
  const columns = Array.from({ length: matrix_column }, (_, i) => i + 1);

  const handleSeatClick = (row: string, col: number) => {
    const seat = seat_structure.find((s) => s.row === row && s.column === col);

    if (!seat) {
      console.error(`Seat not found for row ${row}, column ${col}`);
      return;
    }

    const seatLabel = seat.label;

    if (reservedSeats.has(seatLabel)) {
      message.warning("Ghế này đã được đặt.");
      return;
    }

    // Lấy ghế liên kết
    const linkedSeatLabel = seat.linkedSeat;
    const linkedSeat = seat_structure.find((s) => s.label === linkedSeatLabel);

    const newSelectedSeats = new Map(selectedSeats);

    // Xử lý chọn/bỏ chọn ghế và ghế liên kết
    const currentIndices = newSelectedSeats.get(row) || [];
    if (currentIndices.includes(col)) {
      // Bỏ chọn ghế
      newSelectedSeats.set(
        row,
        currentIndices.filter((index) => index !== col)
      );

      // Nếu ghế có liên kết, bỏ chọn ghế liên kết
      if (linkedSeat) {
        const linkedRow = linkedSeat.row;
        const linkedCol = linkedSeat.column;
        const linkedIndices = newSelectedSeats.get(linkedRow) || [];
        newSelectedSeats.set(
          linkedRow,
          linkedIndices.filter((index) => index !== linkedCol)
        );
      }
    } else {
      // Chọn ghế
      newSelectedSeats.set(row, [...currentIndices, col]);

      // Nếu ghế có liên kết, chọn cả ghế liên kết
      if (linkedSeat) {
        const linkedRow = linkedSeat.row;
        const linkedCol = linkedSeat.column;
        const linkedIndices = newSelectedSeats.get(linkedRow) || [];
        newSelectedSeats.set(linkedRow, [...linkedIndices, linkedCol]);
      }
    }

    setSelectedSeats(newSelectedSeats);

    // Chuyển dữ liệu ghế đã chọn thành dạng mảng ghế
    const updatedSelectedSeats = Array.from(newSelectedSeats.entries()).flatMap(
      ([row, indices]) => indices.map((colIndex) => `${row}-${colIndex}`) // Bỏ +1 nếu không cần thiết
    );
    // Gọi API để lưu ghế đã chọn
    instance
      .post(`/seat-selection/${showtimeData?.room.id}`, {
        seats: updatedSelectedSeats,
      })
      .then((response) => {
        console.log("API response:", response.data);
      })
      .catch((error) => {
        console.error("Error while saving seats:", error);
      });
  };

  const calculatePrice = () => {
    let totalPrice = 0;

    selectedSeats.forEach((indices, row) => {
      indices.forEach((col) => {
        // Tìm ghế trong seat_structure dựa trên hàng (row) và cột (col)
        const seat = seatData.seat_structure.find(
          (s) => s.row === row && s.column === col
        );

        if (!seat) return; // Nếu không tìm thấy ghế, bỏ qua

        // Tính giá vé dựa trên loại ghế
        if (seat.type === "VIP") {
          totalPrice += price * 1.3; // Giá vé cho ghế VIP
        } else if (seat.type === "Couple") {
          totalPrice += price * 1.3 * 2; // Giá vé cho ghế đôi (giá đôi)
        } else {
          totalPrice += price; // Giá vé cho ghế thường
        }
      });
    });

    return totalPrice;
  };

  const totalPrice = calculatePrice();

  const getTotalSeatsInRow = (row: string) => {
    return seat_structure.filter((seat) => seat.row === row).length;
  };
  const totalSeatsInRows: Record<string, number> = rows.reduce(
    (acc, row) => ({
      ...acc,
      [row]: getTotalSeatsInRow(row), // Tính tổng số ghế của từng hàng
    }),
    {}
  );

  // const rows = Object.keys(seatData.seats);
  // const columns = seatData.room.seat_layout.columns;
  const handleSubmit = async () => {
    const selectedSeatsArray = Array.from(selectedSeats.entries()).flatMap(
      ([row, indices]) =>
        indices.map((index) => {
          const seat = seat_structure.find(
            (s) => s.row === row && s.column === index
          );

          // Bao gồm cả linkedSeat
          return {
            seat_name: seat?.label || `${row}${index}`,
            room_id: showtimeData?.room.id,
            showtime_id: showtimeId,
            seat_row: row.charCodeAt(0) - 65 + 1,
            seat_column: index,
          };
        })
    );
    // console.log("du lieu seat:", selectedSeatsArray);
    const payload = {
      cinemaId,
      showtimeId,
      seats: selectedSeatsArray,
      totalSeatsInRows,
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
            roomId: showtimeData?.room.id,
            seats: selectedSeatsArray,
            totalPrice,
          },
        });
      } else if (response.data.message === "Some seats already exist.") {
        message.error(
          "Một số ghế đã được đặt trước. Chuyển về trang chủ sau 3 giây!",
          3
        );
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
          const backendMessage = error.response.data?.message;
          const missingSeat = error.response.data?.data?.missing_seats;

          if (
            backendMessage ===
              "Please select consecutive seats without gaps." ||
            "Please select consecutive seats up to the last seat of the row."
          ) {
            Modal.error({
              title: "Lỗi chọn ghế",
              content: `Vui lòng không để trống ghế ${
                missingSeat || "Không xác định"
              }`,
              icon: null,
              className: "custom-error-modal",
            });
          }
        } else if (error.response.status === 400) {
          Modal.error({
            title: "Ghế đã được đặt",
            content: "Ghế của bạn đã được chọn trước vui lòng chọn ghế khác ",
            icon: null,
            className: "custom-error-modal",
          });
        }
      } else {
        Modal.error({
          title: "Lỗi kết nối",
          content:
            "Không thể kết nối tới máy chủ, vui lòng kiểm tra lại kết nối.",
        });
      }
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Spin tip="Đang Tải Dữ Liệu Khu Vực..." size="large" />
      </div>
    );
  }
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
              <div
                className="mapseat"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginRight: "70px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  {/* Render cột tên hàng */}
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      right: "150px",
                    }}
                  >
                    {rows.map((row) => (
                      <div
                        key={row}
                        style={{
                          width: "50px",
                          height: "30px",
                          marginBottom: "10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontWeight: "bold",
                          color: "#fff",
                          border: "1px solid black",
                          backgroundColor: "#727575",
                        }}
                      >
                        {row}
                      </div>
                    ))}
                  </div>

                  {/* Render các ghế */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    {rows.map((row) => {
                      return (
                        <div
                          key={row}
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            marginBottom: "10px",
                          }}
                        >
                          {columns.map((col) => {
                            const seatLabel = `${row}${col}`;

                            const seat = seat_structure.find(
                              (s) => s.row === row && s.column === col
                            );
                            const isReserved = reservedSeats.has(seatLabel);
                            const isLinkedSelected =
                              seat?.linkedSeat &&
                              Array.from(selectedSeats.entries()).some(
                                ([selectedRow, selectedCols]) => {
                                  const linkedSeat = seat_structure.find(
                                    (s) => s.label === seat.linkedSeat
                                  );
                                  return (
                                    linkedSeat?.row === selectedRow && // Kiểm tra cùng dòng
                                    selectedCols.includes(linkedSeat?.column) // Kiểm tra cột của ghế liên kết
                                  );
                                }
                              );

                            const isSelected =
                              (selectedSeats.has(row) &&
                                selectedSeats.get(row)?.includes(col)) ||
                              isLinkedSelected;
                            const seatType = seat?.type || "Regular"; // Default to regular seat

                            const isSeatEmpty = !seat; // Check if seat data is missing

                            return (
                              <div
                                key={seatLabel}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  background: isSelected
                                    ? "#00bfff" // Màu xanh dương nếu ghế được chọn
                                    : isReserved
                                    ? "#999999" // Màu xanh dương nếu ghế được chọn
                                    : seatType === "VIP"
                                    ? "gold" // Màu vàng cho ghế VIP
                                    : seatType === "Couple"
                                    ? "linear-gradient(45deg, gray 50%, rgb(56, 53, 53) 50%)" // Màu gradient cho ghế đôi
                                    : isSeatEmpty
                                    ? "white" // Màu trắng nếu ghế không có dữ liệu
                                    : "lightgray", // Màu xám nhạt cho ghế thường
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  fontSize: "10px",
                                  borderRadius: "5px",
                                  color: isSeatEmpty
                                    ? "transparent"
                                    : "#727575", // Màu chữ hoặc trong suốt nếu ghế không có dữ liệu
                                  fontFamily: "LaTo",
                                  fontWeight: "600",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                  border: isSeatEmpty
                                    ? "none"
                                    : "1px solid #ddd", // Không có viền nếu ghế không có dữ liệu
                                  opacity: seat ? 1 : 0.5, // Làm mờ ghế không có dữ liệu
                                  pointerEvents: isSeatEmpty ? "none" : "auto", // Vô hiệu hóa tương tác nếu ghế không có dữ liệu
                                }}
                                onClick={() => handleSeatClick(row, col)}
                              >
                                {seat ? seat.label : ""}{" "}
                                {/* Hiển thị nhãn ghế hoặc để trống */}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
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
                <p className="title-phim">{showtimeData?.movie.movie_name}</p>
                <p>
                  Rạp:<span> {showtimeData?.room.cinema.cinema_name}</span>
                </p>
                <p>
                  Suất: <span> {showtime}</span>
                </p>
                <p>
                  Phòng chiếu: <span>{showtimeData?.room.room_name}</span>
                </p>
                <p>
                  Ghế:{" "}
                  {Array.from(selectedSeats.entries())
                    .flatMap(
                      ([row, cols]) =>
                        cols
                          .map((col) => {
                            const seat = seat_structure.find(
                              (s) => s.row === row && s.column === col
                            );
                            return seat ? seat.label : null; // Lấy label nếu ghế tồn tại
                          })
                          .filter(Boolean) // Loại bỏ giá trị null hoặc undefined
                    )
                    .join(", ")}
                </p>
              </div>
              <div className="price-box1">
                <div className="price">
                  Tổng đơn hàng
                  <br />{" "}
                  <span>
                    {totalPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 1,
                      maximumFractionDigits: 1,
                    })}{" "}
                    đ
                  </span>
                </div>
              </div>
              <div className="actionst1">
                <button className="back-btn1">←</button>
                <button
                  className="continue-btn1"
                  onClick={handleSubmit}
                  disabled={
                    Array.from(selectedSeats.values()).flat().length === 0
                  }
                >
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
