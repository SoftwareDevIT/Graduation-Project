import React, { useState, useEffect } from "react";
import "./OrderPage.css";
import { Link } from "react-router-dom";
import Header from "../Header/Hearder";
import Headerticket from "../Headerticket/Headerticket";
import Footer from "../Footer/Footer";
import instance from "../../server";
import { Combo } from "../../interface/Combo";

const OrderPage = () => {

  const [combos, setCombos] = useState<Combo[]>([]);


  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await instance.get("/combo");
        console.log(response.data.data); // Log the response to verify its structure
        setCombos(response.data.data); // Ensure this is an array
      } catch (error) {
        console.error("Error fetching combos:", error);
      }
    };

    fetchCombos();
  }, []);

  // Function to update quantity
  const handleQuantityChange = (index: number, delta: number): void => {
    const newCombos = [...combos];
    newCombos[index].volume += delta;
    if (newCombos[index].volume < 0) newCombos[index].volume = 0;
    setCombos(newCombos);
  };

  return (
    <>
      <Header />
      <Headerticket />
      <div className="combo-list">
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
                  <div className="combo-description">{combo.descripton}</div>
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
                  <span>{combo.volume}</span>
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
            <p>Làm Giàu Với Ma</p>
            <p>
              Rạp:<span> Cinestar Quốc Thanh</span>
            </p>
            <p>
              Suất: <span> 23:59 28/08/2024</span>
            </p>
            <p>Phòng chiếu 01</p>
            <p>Ghế </p>
          </div>

          <div className="price-box">
            <div className="price">
              Tổng đơn hàng
              <br /> <span>0 đ</span>
            </div>
          </div>

          <div className="actions">
            <button className="back-btn2">←</button>
            <Link to={"/pay"}>
              <button className="continue-btn2">Tiếp Tục</button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderPage;
