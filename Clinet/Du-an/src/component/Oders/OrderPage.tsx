import React, { useState } from 'react';
import './OrderPage.css';
import { Link } from 'react-router-dom';
import Header from '../Header/Hearder';
import Headerticket from '../Headerticket/Headerticket';
import Footer from '../Footer/Footer';

const OrderPage = () => {
    // State để lưu số lượng các combo
    const [combos, setCombos] = useState([
        { name: 'Sweet Combo 69oz', description: 'TIẾT KIỆM 46K!!! Gồm: 1 Bắp (69oz) + 2 Nước có gaz (22oz)', price: 88000, quantity: 0 },
        { name: 'Beta Combo 69oz', description: 'TIẾT KIỆM 28K!!! Gồm: 1 Bắp (69oz) + 1 Nước có gaz (22oz)', price: 68000, quantity: 0 },
        { name: 'Family Combo 69oz', description: 'TIẾT KIỆM 95K!!! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2 Snack Oishi (80g)', price: 213000, quantity: 0 },
        { name: 'Family Combo 69oz', description: 'TIẾT KIỆM 95K!!! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2 Snack Oishi (80g)', price: 213000, quantity: 0 },
        { name: 'Family Combo 69oz', description: 'TIẾT KIỆM 95K!!! Gồm: 2 Bắp (69oz) + 4 Nước có gaz (22oz) + 2 Snack Oishi (80g)', price: 213000, quantity: 0 },
    ]);

    // Hàm để thay đổi số lượng
    const handleQuantityChange = (index: number, delta: number): void => {
        const newCombos = [...combos];
        newCombos[index].quantity += delta;
        if (newCombos[index].quantity < 0) newCombos[index].quantity = 0;
        setCombos(newCombos);
    };
    

    return (
        <>
        <Header/>
        <Headerticket/>
        <div className="combo-list">
          <div className="thongtincombo">
          <div className="combo-header">
                <div className='item'>COMBO</div>
                <div className='item'>GIÁ TIỀN</div>
                <div className='item fix-item'>SỐ LƯỢNG</div>
            </div>
            {combos.map((combo, index) => (
                <div key={index} className="combo-item">
                    <div className="combo-info">
                        <div className="combo-name">{combo.name}</div>
                        <div className="combo-description">{combo.description}</div>
                    </div>
                    <div className="combo-price">{combo.price.toLocaleString('vi-VN')} đ</div>
                    <div className="combo-quantity">
                        <button className='iconcong' onClick={() => handleQuantityChange(index, -1)}>-</button>
                        <span>{combo.quantity}</span>
                        <button className='iconcong' onClick={() => handleQuantityChange(index, 1)}>+</button>
                    </div>
                </div>
            ))}
          </div>
        <div className="thongtinphim box-thongtinphim">
  <div className="details-box">
    <p>Làm Giàu Với Ma</p>
    <p>Rạp:<span> Cinestar Quốc Thanh</span></p>
    <p>Suất: <span> 23:59 28/08/2024</span></p>
    <p>Phòng chiếu 01</p>
    <p>Ghế </p>
  </div>

  <div className="price-box">
    <div className="price">Tổng đơn hàng<br /> <span>0 đ</span></div>
  </div>

  <div className="actions">
    <button className="back-btn2">←</button>
    <Link to={'/pay'}><button className="continue-btn2" >Tiếp Tục</button></Link>
  </div>
</div>

            
        </div>
        <Footer/>
        </>
       
    );
};



export default OrderPage;
