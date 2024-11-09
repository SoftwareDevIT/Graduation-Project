import React, { useState } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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
                        {isProfileOpen && (
                            <div className="profile-dropdown">
                                <div className="profile-info">
                                    <img 
                                        src="https://via.placeholder.com/80" 
                                        alt="User Avatar" 
                                        className="profile-avatar"
                                    />
                                    <div className="profile-details">
                                        <p className="profile-name">Nguyễn Văn A</p>
                                        <p className="profile-email">nguyenvana@example.com</p>
                                    </div>
                                </div>
                                <button className="logout-button">Đăng xuất</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
