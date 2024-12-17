import React, { useState, useEffect } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle, FaCamera } from 'react-icons/fa';
import { Modal } from 'antd';
import { User } from '../../../interface/User';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user_profile');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

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
            // Turn off the camera
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
            }
            setIsCameraOn(false);
            setIsModalVisible(false);
        } else {
            // Turn on the camera
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

    const getPageName = () => {
        const path = location.pathname;
        const pageName = path.split('/').pop();
        switch(pageName) {
            case 'dashboard':
                return 'Bảng Điều Khiển Admin';
            case 'user':
                return 'Quản Lí Người Dùng';
            case 'showtimes':
                return 'Quản Lí Suất Chiếu';
            case 'orders':
                return 'Quản Lí Đơn Hàng';
            case 'posts':
                return 'Quản Lí Bài Viết';
            case 'categories':
                return 'Quản Lí Thể Loại';
            case 'countries':
                return 'Quản Lí Khu Vực';
            case 'combo':
                return 'Quản Lí Combo Nước';
            case 'cinemas':
                return 'Quản Lí Rạp Chiếu Phim';
            case 'movies':
                return 'Quản Lí Phim';
            case 'rooms':
                return 'Quản Lí Phòng Rạp';
            case 'RevenueByCinema':
                return 'Doanh Thu Theo Rạp';
            case 'RevenueByMovie':
                return 'Doanh Thu Theo Phim';
            case 'actor':
                return 'Quản Lí Diễn Viên'
            case 'director':
                return 'Quản Lí Đạo Diễn'
            case 'method':
                return 'Phương Thức Thanh Toán'
            case 'promotions':
                return 'Mã Giảm Giá'
            default:
                return 'Welcome';
        }
    };

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
                        <Link to={'/admin/website-settings'} style={{color: "#004d40"}} >
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
                        ref={video => {
                            if (video && !video.srcObject) {
                                video.srcObject = videoStream;
                            }
                        }}
                        style={{ width: '100%', height: 'auto', borderRadius: '10px' }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Header;
