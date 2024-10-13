import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";

import Headerticket from "../Headerticket/Headerticket";
import Footer from "../Footer/Footer";
import instance from "../../server";
import "./OrderPage.css";
import { Combo } from "../../interface/Combo";
import Header from "../Header/Hearder";

export interface LocationState {
  movieName: string;
  cinemaName: string;
  showtime: string;
  selectedSeats: string;
  totalPrice: number;
  comboQuantities: number[];
  combos: Combo[];
  showtimeId: number; // Thêm showtimeId
  roomId: number; // Thêm roomId
  cinemaId: number; // Thêm cinemaId
}

const OrderPage: React.FC = () => {
  const location = useLocation();
  const {
    movieName,
    cinemaName,
    showtime,
    selectedSeats,
    totalPrice: initialTotalPrice,
    showtimeId, // Lấy từ location.state
    roomId, // Lấy từ location.state
    cinemaId, // Lấy từ location.state
  } = (location.state as LocationState) || {}; // Sử dụng as để ép kiểu

  // Log ra giá trị showtimeId, roomId và cinemaId để kiểm tra
  console.log("showtimeId:", showtimeId);
  console.log("roomId:", roomId);
  console.log("cinemaId:", cinemaId);

  const [combos, setCombos] = useState<Combo[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(initialTotalPrice || 0);
  const [comboQuantities, setComboQuantities] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    const selectedCombos = comboQuantities
      .map((quantity, index) => {
        if (quantity > 0) {
          return {
            id: combos[index].id,
            quantity: quantity,
          };
        }
        return null;
      })
      .filter((combo) => combo !== null);
  
    try {
      const response = await instance.post("/selectCombo", {
        comboId: selectedCombos, 
      });
  console.log(selectedCombos);
  
      console.log("API response:", response.data);
  
      if (response.data.status) {
        navigate("/pay", {
          state: {
            movieName,
            cinemaName,
            showtime,
            selectedSeats,
            totalPrice,
            showtimeId,
            roomId,
            cinemaId,
            selectedCombos, // Pass the selected combos to the next page
          },
        });
      } else {
        setErrorMessage(response.data.message || "Failed to select combos.");
      }
    } catch (error) {
      console.error("Error submitting combo selection:", error);
      setErrorMessage("Có lỗi xảy ra khi chọn combo.");
    }
  };
  

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await instance.get("/combo");
        setCombos(response.data.data);
        setComboQuantities(new Array(response.data.data.length).fill(0));
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };

    fetchCombos();
  }, []);

  const handleQuantityChange = (index: number, delta: number): void => {
    const newQuantities = [...comboQuantities];
    const newQuantity = newQuantities[index] + delta;

    // Kiểm tra nếu người dùng chọn số lượng vượt quá số lượng tối đa
    if (delta > 0 && newQuantity > combos[index].volume) {
      alert(`Sản phẩm ${combos[index].combo_name} hiện hết hàng`);
      return;
    }

    // Đảm bảo số lượng combo không âm
    if (newQuantity >= 0) {
      newQuantities[index] = newQuantity;
      setComboQuantities(newQuantities);

      // Cập nhật tổng tiền
      const priceDifference = delta * combos[index].price;
      setTotalPrice((prevTotal) => prevTotal + priceDifference);

      // Xóa thông báo lỗi nếu thay đổi số lượng hợp lệ
      setErrorMessage("");
    }
  };

  return (
    <>
      <Header />
      <Headerticket />
      <div className="combo-list">
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="thongtincombo">
          <div className="combo-header">
            <div className="item">COMBO</div>
            <div className="item">GIÁ TIỀN</div>
            <div className="item fix-item">SỐ LƯỢNG</div>
          </div>
          {Array.isArray(combos) &&
            combos.map((combo, index) => (
              <div key={combo.id} className="combo-item">
                <div className="combo-info">
                  <div className="combo-name">{combo.combo_name}</div>
                  <div className="descripton">{combo.descripton}</div>
                </div>
                <div className="combo-price">
                  {combo.price.toLocaleString("vi-VN")} đ
                </div>
                <div className="combo-quantity">
                  <button
                    className="iconcong"
                    onClick={() => handleQuantityChange(index, -1)}
                  >
                    -
                  </button>
                  <span>{comboQuantities[index]}</span>
                  <button
                    className="iconcong"
                    onClick={() => handleQuantityChange(index, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>

        <div className="thongtinphim box-thongtinphim">
          <div className="details-box">
            <p>{movieName}</p>
            <p>
              Rạp:<span> {cinemaName}</span>
            </p>
            <p>
              Suất: <span> {showtime}</span>
            </p>
            <p>
              Ghế: <span>{selectedSeats}</span>
            </p>
          </div>

          <div className="price-box">
            <div className="price">
              Tổng đơn hàng
              <br /> <span>{totalPrice.toLocaleString()} đ</span>
            </div>
          </div>

          <div className="actionsts">
            <Link to="/" className="back-btn2">
              <span>← </span>Quay lại
            </Link>
            <button className="continue-btn2" onClick={handleContinue}>
              Tiếp Tục
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
