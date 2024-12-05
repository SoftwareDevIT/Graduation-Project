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
  FaTheaterMasks,
  FaIndustry,
  FaChair,
  FaMedal,
  FaCalendarAlt,
  FaTag,
  FaTicketAlt,
  FaCreditCard,
  FaNewspaper,
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
    <div className="header-logo col-lg-1 col-md-4 col-sm-4 col-4">
                    <NavLink to={"/"} className={({ isActive }) => (isActive ? 'active' : '')}>
                        <span className="logo-first-letter1">F</span>lickHive
                    </NavLink>
                </div>
      <ul>
      <li><NavLink to={'/admin/dashboard'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTachometerAlt />Bảng điều khiển</NavLink></li>
        {/* <li>
          <span onClick={() => toggleMenu('statistics')}>
            Thống kê {openMenu['statistics'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['statistics'] ? 'submenu open' : 'submenu'}>
            <li><NavLink to="/admin/revenue-stats"><FaChartLine /> Thống kê doanh thu</NavLink></li>
            <li><NavLink to="/admin/cinema-stats">Thống kê rạp</NavLink></li>
            <li><NavLink to="/admin/movie-stats">Thống kê phim</NavLink></li>
            <li><NavLink to="/admin/invoice-stats">Thống kê hóa đơn</NavLink></li>
          </ul>
        </li> */}

        <li>
          <span onClick={() => toggleMenu('cinema')}>
            Hệ thống rạp {openMenu['cinema'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['cinema'] ? 'submenu open' : 'submenu'}>
            {/* <li><NavLink to="/admin/branch-management">Quản lý chi nhánh</NavLink></li> */}
            <li><NavLink to={'/admin/cinemas'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTheaterMasks /> Quản lí rạp chiếu phim</NavLink></li>
            <li><NavLink to={'/admin/rooms'} className={({ isActive }) => (isActive ? 'active' : '')}><FaIndustry /> Quản lí phòng rạp</NavLink></li>
            <li><NavLink to={'/admin/seat-maps'} className={({ isActive }) => (isActive ? 'active' : '')}><FaChair />Sơ Đồ Ghế</NavLink></li> {/* FaChair biểu thị ghế, phù hợp với sơ đồ ghế */}
            <li><NavLink to={'/admin/rank'} className={({ isActive }) => (isActive ? 'active' : '')}><FaMedal />Quản Lí Hạng</NavLink></li> {/* FaMedal biểu thị huy chương, phù hợp với quản lý hạng */}
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('movies')}>
            Phim và suất chiếu {openMenu['movies'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['movies'] ? 'submenu open' : 'submenu'}>
          <li><NavLink to={'/admin/movies'} className={({ isActive }) => (isActive ? 'active' : '')}><FaFilm /> Quản lí phim</NavLink></li>
          <li><NavLink to={'/admin/showtimes'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCalendarAlt /> Quản lí xuất chiếu</NavLink></li>
         
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('services')}>
            Dịch vụ và ưu đãi {openMenu['services'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['services'] ? 'submenu open' : 'submenu'}>
          <li><NavLink to={'/admin/combo'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCogs /> Quản lí combo nước</NavLink></li>
          <li><NavLink to={'/admin/promotions'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTicketAlt /> Mã giảm giá</NavLink></li>
          <li><NavLink to={'/admin/method'} className={({ isActive }) => (isActive ? 'active' : '')}><FaCreditCard /> Phương thức thanh toán</NavLink></li>
          <li><NavLink to={'/admin/orders'} className={({ isActive }) => (isActive ? 'active' : '')}><FaTag /> Quản lí đơn hàng</NavLink></li>
          </ul>
        </li>

        <li>
          <span onClick={() => toggleMenu('content')}>
            Nội dung và Marketing {openMenu['content'] ? <FaChevronDown /> : <FaChevronRight />}
          </span>
          <ul className={openMenu['content'] ? 'submenu open' : 'submenu'}>
          <li><NavLink to={'/admin/posts'} className={({ isActive }) => (isActive ? 'active' : '')}><FaNewspaper /> Quản lí bài viết</NavLink></li>
            <li><NavLink to="/admin/slideshow-management">Quản lý slideshow</NavLink></li>
          </ul>
        </li>

        <li>
          <NavLink to="/admin/user">
            <FaUserShield /> Quản Lý Người Dùng
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/website-settings">
            <FaCogs /> Cấu hình website
          </NavLink>
        </li>
      </ul>
    </div>
    </div>
  );
};

export default Sidebar;
