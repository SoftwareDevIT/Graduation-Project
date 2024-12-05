import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
  FaTachometerAlt,
  FaChartLine,
  FaChevronRight,
  FaChevronDown,
  FaCogs,
  FaFilm,
  FaMoneyCheckAlt,
  FaGift,
  FaTags,
  FaUserShield,
} from 'react-icons/fa';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<{ [key: string]: boolean }>({});

  const toggleMenu = (menuKey: string) => {
    setOpenMenu((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  return (
    <div className="container-wrapper">
    <div className="sidebar">
      <ul>
        <li>
          <NavLink to="/admin/dashboard">
            <FaTachometerAlt /> Bảng điều khiển
          </NavLink>
        </li>
        <li>
          <span onClick={() => toggleMenu('statistics')}>
            Thống kê {openMenu['statistics'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['statistics'] ? 'submenu open' : 'submenu'}>
            <li><NavLink to="/admin/revenue-stats"><FaChartLine /> Thống kê doanh thu</NavLink></li>
            <li><NavLink to="/admin/cinema-stats">Thống kê rạp</NavLink></li>
            <li><NavLink to="/admin/movie-stats">Thống kê phim</NavLink></li>
            <li><NavLink to="/admin/invoice-stats">Thống kê hóa đơn</NavLink></li>
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('cinema')}>
            Hệ thống rạp {openMenu['cinema'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['cinema'] ? 'submenu open' : 'submenu'}>
            {/* <li><NavLink to="/admin/branch-management">Quản lý chi nhánh</NavLink></li> */}
            <li><NavLink to="/admin/cinemas">Quản lý rạp</NavLink></li>
            <li><NavLink to="/admin/rooms">Quản lý phòng chiếu</NavLink></li>
            <li><NavLink to="/admin/seatmap">Mẫu sơ đồ ghế</NavLink></li>
            <li><NavLink to="/admin/rank">Cấp thành viên</NavLink></li>
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('movies')}>
            Phim và suất chiếu {openMenu['movies'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['movies'] ? 'submenu open' : 'submenu'}>
            <li><NavLink to="/admin/movies"><FaFilm /> Quản lý phim</NavLink></li>
            <li><NavLink to="/admin/showtimes">Quản lý suất chiếu</NavLink></li>
            <li><NavLink to="/admin/orders">Quản lý hóa đơn</NavLink></li>
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('services')}>
            Dịch vụ và ưu đãi {openMenu['services'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['services'] ? 'submenu open' : 'submenu'}>
            <li><NavLink to="/admin/combo"><FaGift /> Quản lý combo</NavLink></li>
            <li><NavLink to="/admin/discount-management"><FaTags /> Quản lý mã giảm giá</NavLink></li>
            <li><NavLink to="/admin/ticket-prices"><FaMoneyCheckAlt /> Quản lý giá vé</NavLink></li>
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('content')}>
            Nội dung và Marketing {openMenu['content'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['content'] ? 'submenu open' : 'submenu'}>
            <li><NavLink to="/admin/posts">Quản lý bài viết</NavLink></li>
            <li><NavLink to="/admin/slideshow-management">Quản lý slideshow</NavLink></li>
          </ul>
        </li>

        <li>
          <NavLink to="/admin/user">
            <FaUserShield /> Phân quyền
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/config">
            <FaCogs /> Cấu hình website
          </NavLink>
        </li>
      </ul>
    </div>
    </div>
  );

import { FaTachometerAlt, FaUser, FaFilm, FaTicketAlt, FaTag, FaNewspaper, FaList, FaGlobe, FaCogs, FaTheaterMasks, FaCalendarAlt, FaChartLine, FaChevronRight, FaChevronLeft, FaIndustry, FaUserTie, FaVideo, FaCreditCard, FaTh, FaChair, FaMedal } from 'react-icons/fa'; // Đã thay FaUser thành FaUserTie cho diễn viên

const Sidebar = () => {
    const [isActive, setIsActive] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Hàm toggle để mở/đóng sidebar
    const toggleSidebar = () => {
        setIsActive(!isActive);
    };
    

    return (
        <>
            {/* Nút mũi tên để mở/đóng sidebar */}
            <div className="sidebar-toggle" onClick={toggleSidebar}>
                {isActive ? <FaChevronLeft /> : <FaChevronRight />}
            </div>

            {/* Sidebar ẩn/hiện dựa vào trạng thái isActive */}
            <div className={`sidebar ${isActive ? 'active' : ''}`}>
                <div className="header-logo col-lg-1 col-md-4 col-sm-4 col-4">
                    <NavLink to={"/"} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <span className="logo-first-letter1">F</span>lickHive
                    </NavLink>
                </div>
                <ul>
                    <li><NavLink to={'/admin/dashboard'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTachometerAlt />Bảng điều khiển</NavLink></li>
                    <li><NavLink to={'/admin/user'} className={({ isActive }) => (isActive ? 'active' : '')}><FaUser />Quản lí người dùng</NavLink></li>
                    <li><NavLink to={'/admin/rank'} className={({ isActive }) => (isActive ? 'active' : '')}><FaMedal />Quản Lí Hạng</NavLink></li> {/* FaMedal biểu thị huy chương, phù hợp với quản lý hạng */}
                    <li><NavLink to={'/admin/movies'} className={({ isActive }) => (isActive ? 'active' : '')}><FaFilm /> Quản lí phim</NavLink></li>
                    <li><NavLink to={'/admin/actor'} className={({ isActive }) => (isActive ? 'active' : '')}><FaUserTie /> Quản lí diễn viên</NavLink></li> {/* Sử dụng FaUserTie cho diễn viên */}
                    <li><NavLink to={'/admin/director'} className={({ isActive }) => (isActive ? 'active' : '')}><FaVideo /> Quản lí đạo diễn</NavLink></li> {/* Sử dụng FaVideo cho đạo diễn */}
                    <li><NavLink to={'/admin/categories'} className={({ isActive }) => (isActive ? 'active' : '')}><FaList /> Quản lí thể loại</NavLink></li>
                    <li><NavLink to={'/admin/showtimes'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCalendarAlt /> Quản lí xuất chiếu</NavLink></li>
                    <li><NavLink to={'/admin/cinemas'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTheaterMasks /> Quản lí rạp chiếu phim</NavLink></li>
                    <li><NavLink to={'/admin/rooms'} className={({ isActive }) => (isActive ? 'active' : '')}><FaIndustry /> Quản lí phòng rạp</NavLink></li>
                    {/* <li><NavLink to={'/admin/matrix'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTh />Mẫu Sơ Đồ Ghế</NavLink></li> FaTh đại diện cho lưới (grid), phù hợp với sơ đồ mẫu */}
                    <li><NavLink to={'/admin/seat-maps'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChair />Sơ Đồ Ghế</NavLink></li> {/* FaChair biểu thị ghế, phù hợp với sơ đồ ghế */}
                    <li><NavLink to={'/admin/orders'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTag /> Quản lí đơn hàng</NavLink></li>
                    <li><NavLink to={'/admin/posts'} className={({ isActive }) => (isActive ? 'active' : '')}><FaNewspaper /> Quản lí bài viết</NavLink></li>
                    <li><NavLink to={'/admin/combo'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCogs /> Quản lí combo nước</NavLink></li>
                    {/* <li><NavLink to={'/admin/countries'} className={({ isActive }) => (isActive ? 'active' : '')}><FaGlobe /> Quản lí khu vực</NavLink></li> */}
                    <li><NavLink to={'/admin/promotions'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTicketAlt /> Mã giảm giá</NavLink></li>
                    <li><NavLink to={'/admin/method'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCreditCard /> Phương thức thanh toán</NavLink></li>
                    {/* <li><NavLink to={'/admin/RevenueByCinema'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChartLine /> Doanh thu theo rạp</NavLink></li>
                    <li><NavLink to={'/admin/RevenueByMovie'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChartLine /> Doanh thu theo phim</NavLink></li> */}
                    

                </ul>
            </div>
        </>
    );

};

export default Sidebar;