import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaFilm, FaTicketAlt, FaTag, FaNewspaper, FaList, FaGlobe, FaCogs, FaTheaterMasks, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="header-logo col-lg-1 col-md-4 col-sm-4 col-4">
                <NavLink to={"/"} className={({ isActive }) => (isActive ? 'active' : '')}>
                    <span className="logo-first-letter1">F</span>lickHive
                </NavLink>
            </div>
            <ul>
                
                <li><NavLink to={'/admin/dashboard'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTachometerAlt /> Dashboard</NavLink></li>
                <li><NavLink to={'/admin/user'} className={({ isActive }) => (isActive ? 'active' : '')}><FaUser /> Users</NavLink></li>
                <li><NavLink to={'/admin/showtimes'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCalendarAlt /> Quản lí xuất chiếu</NavLink></li>
                <li><NavLink to={'/admin/orders'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTag /> Quản lí đơn hàng</NavLink></li>
                <li><NavLink to={'/admin/posts'} className={({ isActive }) => (isActive ? 'active' : '')}><FaNewspaper /> Quản lí bài viết</NavLink></li>
                <li><NavLink to={'/admin/categories'} className={({ isActive }) => (isActive ? 'active' : '')}><FaList /> Quản lí thể loại</NavLink></li>
                <li><NavLink to={'/admin/countries'} className={({ isActive }) => (isActive ? 'active' : '')}><FaGlobe /> Quản lí quốc gia</NavLink></li>
                <li><NavLink to={'/admin/combo'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCogs /> Quản lí combo nước</NavLink></li>
                <li><NavLink to={'/admin/cinemas'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTheaterMasks /> Quản lí rạp chiếu phim</NavLink></li>
                <li><NavLink to={'/admin/movies'} className={({ isActive }) => (isActive ? 'active' : '')}><FaFilm /> Quản lí phim</NavLink></li>
                <li><NavLink to={'/admin/RevenueByCinema'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChartLine /> Doanh thu theo rạp</NavLink></li>
                <li><NavLink to={'/admin/RevenueByMovie'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChartLine /> Doanh thu theo phim</NavLink></li>
            </ul>
        </div>
    );
};

export default Sidebar;
