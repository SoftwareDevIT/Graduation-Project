import React, { useState } from 'react';
import './Header1.css';
import { FaMoon, FaBell, FaCog, FaUserCircle } from 'react-icons/fa';

const Header = () => {
    // State để quản lý chế độ sáng/tối, mặc định là chế độ tối
    const [darkMode, setDarkMode] = useState(true);

    // Hàm để chuyển đổi giữa chế độ sáng và tối
    const toggleTheme = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`header1 ${darkMode ? '' : 'light-mode'}`}> {/* Chế độ sáng sẽ có thêm lớp 'light-mode' */}
            <h1>WELCOME!</h1>
            <div className="header-actions">
                <div className="icons-container">
                    <div className="icon" onClick={toggleTheme}>
                        <FaMoon />
                    </div>
                    <div className="icon">
                        <FaBell />
                        <span className="notification-badge">3</span>
                    </div>
                    <div className="icon">
                        <FaCog />
                    </div>
                    <div className="icon profile-pic">
                        <FaUserCircle />
                    </div>
                </div>
                <div className="search-container">
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
        </div>
    );
};

export default Header;
