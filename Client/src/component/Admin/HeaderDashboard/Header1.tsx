import React, { useState, useEffect } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle } from 'react-icons/fa';
import { User } from '../../../interface/User';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // Fetch user data from localStorage when the component mounts
    useEffect(() => {
        const storedUser = localStorage.getItem('user_profile');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id"); // Xóa userId khỏi localStorage
        localStorage.removeItem("user_profile"); // Xóa userId khỏi localStorage
        setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
        navigate('/')
      };
    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <div className="header1">
            <h1>WELCOME!</h1>
            <div className="header-actions">
                <div className="icons-container">
                    <div className="icon">
                        <FaBell />
                        <span className="notification-badge">3</span>
                    </div>
                    <div className="icon">
                        <FaCog />
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
        </div>
    );
};

export default Header;
