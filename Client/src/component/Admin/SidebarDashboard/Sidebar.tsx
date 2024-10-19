import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaFilm, FaTicketAlt, FaTag, FaNewspaper, FaList, FaGlobe, FaCogs, FaTheaterMasks, FaCalendarAlt, FaChartLine } from 'react-icons/fa'; // Importing Font Awesome icons

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="logo">
                <img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8ed3d547-94ff-48e1-9f20-8c14a7030a02_2000x2000.jpeg" alt="Admin Dashboard Logo" />
            </div>
            <ul>
                <li><Link to={'/admin'}><FaTachometerAlt /> Dashboard</Link></li>
                <li><Link to={'/admin/user'}><FaUser /> Users</Link></li>
                <li><Link to={'/admin/showtimes'}><FaCalendarAlt /> Quản lí xuất chiếu</Link></li>
                <li><Link to={'/admin/orders'}><FaTag /> Quản lí đơn hàng</Link></li>
                <li><Link to={'/admin/tickets'}><FaTicketAlt /> Quản lí vé</Link></li>
                <li><Link to={'/admin/posts'}><FaNewspaper /> Quản lí bài viết</Link></li>
                <li><Link to={'/admin/categories'}><FaList /> Quản lí thể loại</Link></li>
                <li><Link to={'/admin/countries'}><FaGlobe /> Quản lí quốc gia</Link></li>
                <li><Link to={'/admin/combo'}><FaCogs /> Quản lí combo nước</Link></li>
                <li><Link to={'/admin/cinemas'}><FaTheaterMasks /> Quản lí rạp chiếu phim</Link></li>
                <li><Link to={'/admin/movies'}><FaFilm /> Quản lí phim</Link></li>
                <li><Link to={'/admin/RevenueByCinema'}><FaChartLine /> Doanh thu theo rạp</Link></li>
                <li><Link to={'/admin/RevenueByMovie'}><FaChartLine /> Doanh thu theo phim</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
