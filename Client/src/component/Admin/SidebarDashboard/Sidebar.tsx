import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaFilm, FaTicketAlt, FaTag, FaNewspaper, FaList, FaGlobe, FaCogs, FaTheaterMasks, FaCalendarAlt, FaChartLine } from 'react-icons/fa'; // Importing Font Awesome icons

const Sidebar = () => {
    return (
        <div className="sidebar">
             <div className="header-logo col-lg-1 col-md-4 col-sm-4 col-4 ">
              <Link to={"/"}>
                {" "}
                <span className="logo-first-letter1">F</span>lickHive
              </Link>
            </div>
            <ul>
                <li><Link to={'/admin'}><FaTachometerAlt /> Dashboard</Link></li>
                <li><Link to={'/admin/user'}><FaUser /> Users</Link></li>
                <li><Link to={'/admin/showtimes'}><FaCalendarAlt /> Quản lí xuất chiếu</Link></li>
                <li><Link to={'/admin/orders'}><FaTag /> Quản lí đơn hàng</Link></li>
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
