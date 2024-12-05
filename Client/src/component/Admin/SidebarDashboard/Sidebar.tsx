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
            <li><NavLink to="/admin/cinema">Quản lý rạp</NavLink></li>
            <li><NavLink to="/admin/rooms">Quản lý phòng chiếu</NavLink></li>
            <li><NavLink to="/admin/seat-maps">Mẫu sơ đồ ghế</NavLink></li>
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
};

export default Sidebar;
