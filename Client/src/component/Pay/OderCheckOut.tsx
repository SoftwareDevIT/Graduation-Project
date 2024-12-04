import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../../server';
import { message } from 'antd'; // Import message from Ant Design
import Headerticket from '../Headerticket/Headerticket';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import './OderCheckOut.css';
import Header from '../Header/Hearder';
import { useUserContext } from '../../Context/UserContext';
export interface LocationState {
    movieName: string;
    cinemaName: string;
    showtime: string;
    seats: Array<{ seat_name: string; room_id: number; showtime_id: number; seat_row: number; seat_column: number; }>;
    totalPrice: number;
    showtimeId: number;
    roomId: number;
    cinemaId: number;
    selectedCombos :Array<{id:string,quantity:number}>
  }
const OrderCheckout = () => {
    
    const location = useLocation();
    const [voucherCode, setVoucherCode] = useState<string>(""); // Lưu mã voucher
    const [discount, setDiscount] = useState<number | null>(null); // Lưu giá trị giảm giá
    const [finalPrice, setFinalPrice] = useState<number | null>(null); // Lưu giá trị giá sau giảm giá
    const [voucherApplied, setVoucherApplied] = useState<boolean>(false); // Trạng thái kiểm tra voucher đã áp dụng hay chưa
    const [isVoucherVisible, setIsVoucherVisible] = useState<boolean>(false);
    const [isTableVisible, setIsTableVisible] = useState(false);
    const { userProfile, avatar, setUserProfile } = useUserContext(); // Use context to get user data
    const [pointHistories, setPointHistories] = useState<any[]>([]);
    const [pointsToUse, setPointsToUse] = useState(""); // Số điểm nhập
    // Hàm xử lý sự kiện click vào <h3> để thay đổi trạng thái hiển thị bảng
    const toggleTableVisibility = () => {
      setIsTableVisible(!isTableVisible);
    };

    useEffect(() => {
        if (userProfile) {
          setPointHistories(userProfile.point_histories);
        }
      }, [userProfile]);
    
    
    const navigate = useNavigate();
    const {
        movieName,
        cinemaName,
        showtime, // Ensure this matches the name from OrderPage
        seats,
        totalPrice,
        showtimeId,
        roomId,
        cinemaId,
        selectedCombos,
    } = (location.state as LocationState) || {};

    // Log selectedSeats to verify data
    console.log(seats);
    console.log(selectedCombos); // Check if combos are passed correctly
    const handleApplyVoucher = async () => {
        if (!voucherCode) {
            message.warning("Vui lòng nhập mã voucher.");
            return;
        }
    
        try {
            const response = await instance.post("/apply-promotion", {
                code: voucherCode,
                total_price: totalPrice,
            });
    
            if (response.data) {
                const { message: successMessage, discount, final_price } = response.data;
                message.success(successMessage);
                setDiscount(discount);
                setFinalPrice(final_price);
                setVoucherApplied(true); // Đánh dấu là voucher đã được áp dụng
            }
        } catch (error) {
            message.error("Không thể áp dụng mã khuyến mãi. Vui lòng kiểm tra lại.");
            console.error("Error applying voucher:", error);
        }
    };
    
    const handleUsePoints = async () => {
        // Chuyển đổi pointsToUse từ string sang number
        const points = Number(pointsToUse);
    
        // Kiểm tra nếu points không hợp lệ hoặc <= 0
        if (isNaN(points) || points <= 0) {
            message.warning("Vui lòng nhập số điểm hợp lệ.");
            return;
        }
    
        // Kiểm tra nếu số điểm nhập vào vượt quá tổng giá trị đơn hàng
        if (points > totalPrice) {
            message.warning("Số điểm không thể vượt quá tổng giá trị đơn hàng.");
            return;
        }
    const availablePoints=userProfile?.points ;
    const availablePointsNumber = availablePoints ? Number(availablePoints) : 0;
        // Kiểm tra nếu số điểm nhập vào lớn hơn số điểm hiện có
        if (points > availablePointsNumber) { // `availablePoints` là số điểm hiện có của người dùng
            message.warning("Bạn không có đủ điểm để sử dụng.");
            return;
        }
    
        try {
            const response = await instance.post("/use-points", {
                points_to_use: points, // Sử dụng giá trị đã chuyển đổi
                total_price: totalPrice, // Truyền tổng tiền hiện tại
            });
    
            if (response.status === 200 && response.data) {
                const { message: successMessage, discount, final_price } = response.data;
    
                // Hiển thị thông báo thành công
                message.success(successMessage);
    
                // Cập nhật tổng tiền và giảm giá
                setDiscount(discount); // Nếu API trả về số tiền quy đổi từ điểm
                setFinalPrice(final_price); // Cập nhật lại tổng tiền sau khi trừ điểm
            } else {
                message.error("Không thể sử dụng điểm. Vui lòng kiểm tra lại.");
            }
        } catch (error) {
            console.error("Lỗi khi sử dụng điểm:", error);
            message.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };
    
    
    const handleRemoveVoucher = () => {
        setVoucherCode(""); // Xóa mã voucher
        setDiscount(null); // Đặt lại giảm giá về null
        setFinalPrice(totalPrice); // Quay lại giá trị ban đầu
        setVoucherApplied(false); // Đánh dấu voucher chưa được áp dụng
    };
    // State for payment method
    const [pay_method_id, setPaymentMethod] = useState<number | null>(null); // Khởi tạo pay_method_id với null
    const [timeLeft, setTimeLeft] = useState(30000000);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    message.warning("Thời gian giữ ghế đã hết vui lòng đặt lại vé.");
                    setTimeout(() => {
                        navigate('/'); // Chuyển hướng về trang chủ
                    }, 2000); // Chờ 2 giây trước khi chuyển trang
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Dọn dẹp timer khi component unmount
    }, [navigate]);

    // Hàm chuyển đổi thời gian sang định dạng phút:giây
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleCheckout = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token) {
            message.warning("Vui lòng đăng nhập trước khi đặt vé.");
            return;
        }

        if (!cinemaId || !showtimeId || !userId) {
            message.warning("Thông tin không đầy đủ. Vui lòng kiểm tra lại.");
            return;
        }

        if (!Array.isArray(seats) || seats.length === 0) {
            message.warning("Vui lòng chọn ghế ngồi.");
            return;
        }

        if (pay_method_id === null) {
            message.warning("Vui lòng chọn phương thức thanh toán.");
            return;
        }

        const seatsData = seats.map((seat: any) => ({
            seat_name: seat.seat_name,
            room_id: roomId,
            showtime_id: showtimeId, // Ensure this matches the name from OrderPage
            seat_row: seat.seat_row,
            seat_column: seat.seat_column,
        }));

        console.log('Dữ liệu gửi lên serve',seatsData);

        const bookingData = {
            cinemaId,
            showtime_id: showtimeId, // Ensure this matches the name from OrderPage
            userId,
            seats: seatsData,
            amount: finalPrice || totalPrice,
            pay_method_id, // Gửi pay_method_id là số nguyên
            comboId: selectedCombos,
        };
        // console.log(bookingData);

        try {
            const response = await instance.post("/book-ticket", bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
             
            });

            if (response.data) {
                const redirectUrl = response.data.Url.original.url;
                message.success("Đặt vé thành công!");
                window.location.href = redirectUrl;
            } else {
                message.error("Có lỗi xảy ra khi đặt vé.");
            }
        } catch (error) {
            message.error("Có lỗi xảy ra khi đặt vé.");
            console.error("Error during booking:", error);
        }
        
    };

    return (
        <>
            <Header />
            <Headerticket />
            <div className="order-checkout-container">
                <div className="left-panel">
                    <div className="order-summary">
                        {/* Hiển thị tóm tắt đơn hàng */}
                       
                            <h3>Tóm tắt đơn hàng</h3>
                       
                        <div className="item-header">
                            <span>Mô Tả</span>
                            <span style={{marginLeft: "70px"}}>Số Lượng</span>
                            <span>Thành Tiền</span>
                        </div>
                        <div className="order-item">
                            <span className="item-title">Phim: {movieName}</span>
                            <span className="item-quantity">1</span>
                            <span className="item-price">{totalPrice?.toLocaleString('vi-VN')} đ</span>
                        </div>
                        <div className="order-item">
                            <span className="item-title">Rạp: {cinemaName}</span>
                        </div>
                        <div className="order-item">
                            <span className="item-title">Suất chiếu: {showtime}</span>
                        </div>
                        <div className="order-item">
                            <span className="item-title">Ghế đã chọn: {seats.map(seat => seat.seat_name).join(', ')}</span>
                        </div>
                        {/* Hiển thị combo nếu có */}
                        {selectedCombos && selectedCombos.length > 0 && (
                            <div className="combo-summary">
                                <h4>Combo đã chọn:</h4>
                                {selectedCombos.map((combo: any, index: number) => (
                                    <div key={index} className="order-item">
                                        <span className="item-title">Combo: {combo.combo_name}</span>
                                        <span className="item-quantity">Số lượng: {combo.quantity}</span>
                                    </div>
                                ))} 
                            </div>
                        )}
                <div className="voucher-section">
                        <h4 onClick={() => setIsVoucherVisible(!isVoucherVisible)}>
                            Nhập mã voucher
                        </h4>

                        {isVoucherVisible && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Nhập mã voucher"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value)}
                                    className="voucher-input"
                                />
                                <button className="apply-voucher-btn" onClick={handleApplyVoucher}>
                                    Áp dụng
                                </button>
                                {voucherApplied && (
                                    <button className="apply-voucher-btn-1" onClick={handleRemoveVoucher}>
                                        Xóa voucher
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                    <div>
      {/* Thêm sự kiện onClick vào <h3> */}
      <h4 onClick={toggleTableVisibility} className='diemgiamgia'>Điểm giảm giá FlickHive</h4>

      {/* Bảng khung-diem-poly chỉ hiển thị khi isTableVisible là true */}
      {isTableVisible && (
        <div className="khung-diem-poly">
          <table>
            <thead>
              <tr>
                <th>Điểm hiện có</th>
                <th>Nhập Điểm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td >{userProfile?.points || "0"}</td>
                <td><input
                    type="number"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(e.target.value)}
                    placeholder="Nhập số điểm"
                  /></td>
                <td><button onClick={handleUsePoints}>Áp dụng</button></td>
              </tr>
            
        
            </tbody>
          </table>
        </div>
      )}
    </div>




        <div className="order-total">
    <span className="total-title">Tổng </span>
    <span className="total-price">{totalPrice?.toLocaleString('vi-VN')} đ</span>
</div>
{discount && (
    <div className="order-discount">
        <span className="total-title">Giảm giá:</span>
        <span className="total-title"> -{discount.toLocaleString('vi-VN')} đ</span>
    </div>
)}
<div className="order-final">
    <span className="total-title2">Tổng sau giảm:</span>
    <span className="total-title3">
        {(finalPrice || totalPrice)?.toLocaleString('vi-VN')} đ
    </span>
</div>

                    </div>


                   {/* Phương thức thanh toán */}
                   <div className="payment-methods">
    <h3>Hình thức thanh toán</h3>
    <ul>
        <li onClick={() => setPaymentMethod(1)}>
            <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="VN Pay" className="payment-icon" />
            VN Pay {pay_method_id === 1 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(2)}>
            <img src="https://developers.momo.vn/v3/assets/images/primary-momo-ddd662b09e94d85fac69e24431f87365.png" alt="MoMo" className="payment-icon" />
            Ví MoMo {pay_method_id === 2 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(3)}>
            <img src="https://icons.iconarchive.com/icons/fa-team/fontawesome/512/FontAwesome-Qrcode-icon.png" alt="QR Code" className="payment-icon" />
            Quét mã QR {pay_method_id === 3 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(4)}>
            <img src="https://img.icons8.com/?size=100&id=rCkWdjSPe99o&format=png&color=000000" alt="Bank Transfer" className="payment-icon" />
            Chuyển khoản / Internet Banking {pay_method_id === 4 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(5)}>
            <img src="https://cdn.moveek.com/bundles/ornweb/img/shopeepay-icon.png" alt="ShopeePay" className="payment-icon" />
            Ví ShopeePay {pay_method_id === 5 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(6)}>
            <img src="https://cdn.moveek.com/bundles/ornweb/img/zalopay-domestic_card-icon.png" alt="ATM Card" className="payment-icon" />
            Thẻ ATM (Thẻ nội địa) {pay_method_id === 6 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
        <li onClick={() => setPaymentMethod(7)}>
            <img src="https://cdn.moveek.com/bundles/ornweb/img/fptpay-icon.png" alt="FPT Pay" className="payment-icon" />
            Ví FPT Pay {pay_method_id === 7 && <FontAwesomeIcon icon={faCheckCircle} className="check-icon" />}
        </li>
    </ul>
</div>


                    {/* Thông tin cá nhân */}
                    <div className="form-container">
                        <h3>Thông tin cá nhân</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="fullname">Họ và tên</label>
                                <input type="text" id="fullname" placeholder="Nhập họ và tên" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Nhập email" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input type="tel" id="phone" placeholder="Nhập số điện thoại" required />
                            </div>
                            <div className="nhom-form nhom-checkbox">
    <input type="checkbox" id="tao-tai-khoan" />
    <label htmlFor="tao-tai-khoan">Tạo tài khoản với email và số điện thoại này.</label>
</div>


                        </form>
                    </div>
                </div>

                {/* Thông tin thanh toán bên phải */}
                <div className="right-panel">
                    <div className="checkout-details">
                        <div className="order-info">
                            <span className="total-title">Tổng đơn hàng</span>
                            <h2 className="total-price"> {(finalPrice || totalPrice)?.toLocaleString('vi-VN')} đ</h2>
                        </div>
                        <div className="time-info">
                            <span className="time-title">Thời gian giữ ghế</span>
                            <h2 className="time-remaining">{formatTime(timeLeft)}</h2>
                        </div>
                    </div>
                    <div className="confirm-button">
                        <button onClick={handleCheckout}>Xác nhận thanh toán</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderCheckout;