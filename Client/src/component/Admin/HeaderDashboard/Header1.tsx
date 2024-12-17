import React, { useState, useEffect, useRef } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle, FaCamera } from 'react-icons/fa';
import { Modal } from 'antd';
import { User } from '../../../interface/User';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';  // Import thư viện quét mã vạch
import axios from 'axios';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState<string | null>(null);  // Lưu dữ liệu quét được
    const videoRef = useRef<HTMLVideoElement | null>(null);  // ref để điều khiển video
    const barcodeReader = useRef(new BrowserMultiFormatReader()); // Khởi tạo đối tượng quét mã vạch
    const navigate = useNavigate();
    const location = useLocation();
    const [checkInData, setCheckInData] = useState<any>(null);


    useEffect(() => {
        const storedUser = localStorage.getItem('user_profile');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const checkInSeat = async (barcode: string) => {
        try {
            const response = await axios.post('/api/manager/checkInSeat', { barcode });
            console.log("Check-in thành công:", response.data);

            setCheckInData(response.data.data); // Lưu dữ liệu vào state

            // Hiển thị thông báo thành công
            alert(response.data.message || 'Check-in thành công');
        } catch (error: any) {
            console.error("Lỗi khi check-in:", error);
            alert(`Lỗi khi check-in: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_profile");
        setIsLoggedIn(false);
        navigate('/');
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            // Tắt camera
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
            }
            setIsCameraOn(false);
            setIsModalVisible(false);
        } else {
            // Bật camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream);
                setIsCameraOn(true);
                setIsModalVisible(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        }
    };

    const handleBarcodeScan = (result: string) => {
        setBarcodeData(result);  // Cập nhật dữ liệu quét được
        console.log("Barcode Data:", result);  // In dữ liệu ra console
    };

    const getPageName = () => {
        const path = location.pathname;
        const pageName = path.split('/').pop();
        switch (pageName) {
            case 'dashboard': return 'Bảng Điều Khiển Admin';
            case 'user': return 'Quản Lí Người Dùng';
            // Các trường hợp khác...
            default: return 'Welcome';
        }
    };


    useEffect(() => {
        if (barcodeData) navigate(barcodeData.replace(/^http:\/\/localhost:5173/, ""));
    }, [barcodeData, navigate]);

    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    useEffect(() => {
        // Bắt đầu quét mã vạch khi camera bật
        if (isCameraOn && videoStream) {
            const videoElement = videoRef.current;
            if (videoElement) {
                barcodeReader.current.decodeFromVideoDevice('', videoElement, (result, error) => {
                    if (result) {
                        handleBarcodeScan(result.getText());  // Quét thành công
                    }
                    if (error) {
                        console.error(error);
                    }
                });
            }
        } else {
            barcodeReader.current.reset(); // Dừng quét khi camera tắt
        }
    }, [isCameraOn, videoStream]);

    return (
        <div className="header1">
            <h1>{getPageName()}</h1>
            <div className="header-actions">
                <div className="icons-container">
                    <div className="icon" onClick={toggleCamera}>
                        <FaCamera style={{ color: isCameraOn ? 'green' : '#004d40' }} />
                    </div>
                    <div className="icon">
                        <FaBell />
                        <span className="notification-badge">3</span>
                    </div>
                    <div className="icon">
                        <Link to={'/admin/website-settings'} style={{ color: "#004d40" }} >
                            <FaCog />
                        </Link>
                    </div>
                    <div className="icon profile-pic" onClick={toggleProfile}>
                        <FaUserCircle />
                        {isProfileOpen && user && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <img
                                        src={user.avatar || "https://via.placeholder.com/80"}
                                        alt="User Avatar"
                                        className="profile-avatar"
                                    />
                                    <div className="profile-details">
                                        <p className="profile-name">{user.fullname || user.user_name}</p>
                                        <p className="profile-email">{user.email}</p>
                                    </div>
                                </div>
                                <button className="logout-button" onClick={handleLogout}>Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal
                title="Camera"
                visible={isModalVisible}
                onCancel={() => {
                    toggleCamera();
                }}
                footer={null}
                centered
                width="30%"
              
                
            >
                {isCameraOn && videoStream && (
                    <video
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            objectFit: 'cover',
                        }}
                    />
                )}
                {barcodeData && (
                    <div className="barcode-result">
                        <p>Quét Mã Thành Công: <a href={barcodeData}>{barcodeData}</a></p>

                    </div>
                )}
                {checkInData && (
                    <div className="checkin-info" style={{ marginTop: '20px' }}>
                        <h3 style={{ color: '#004d40' }}>Thông Tin Check-in</h3>
                        <p><strong>Mã Check-in:</strong> {checkInData.code}</p>
                        <p><strong>Tên Ghế:</strong> {checkInData.seat_name}</p>
                        <p><strong>Loại Ghế:</strong> {checkInData.seat_type}</p>
                        <p><strong>Phòng Chiếu:</strong> {checkInData.room_id}</p>
                        <p><strong>Trạng Thái:</strong> {checkInData.status}</p>
                        <img
                            src={checkInData.barcode}
                            alt="Barcode"
                            style={{ marginTop: '10px', width: '150px', height: 'auto' }}
                        />
                    </div>
                )}
            </Modal>

        </div>
    );
};

export default Header;