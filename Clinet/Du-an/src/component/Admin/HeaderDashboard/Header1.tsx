import React from 'react';
import './Header1.css';
import { FaBars, FaBell, FaEnvelope, FaUserCircle, FaPowerOff } from 'react-icons/fa';

const Header = () => {
    return (
        <div className="header1">
            <div className="left-section">
                <FaBars className="menu-icon" />
                <input type="text" placeholder="Search projects" className="search-input" />
            </div>
            <div className="right-section">
                <FaEnvelope className="icon" />
                <FaBell className="icon notification-icon">
                    <span className="notification-badge">1</span>
                </FaBell>
                <FaUserCircle className="icon profile-icon" />
                <FaPowerOff className="icon" />
            </div>
        </div>
    );
};

export default Header;
