import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Avatar, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Profile.css'; // Import file CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './Profile.css'
import { Link } from 'react-router-dom';

const { Option } = Select;

const Profile: React.FC = () => {
    const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png'); // Khởi tạo giá trị avatar mặc định

  return (
    <>
      <Header/>
      <div className="banner">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
        </div>
      <div className="content-acount">
      <div className="container boxcha">
      <div className="profile-fullscreen">

       <div className="account-settings-container">
       <div className="account-settings-container">
  <div className="account-avatar">
    <div className="account-info">
      <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
      <div className="account-details">
        <h2 className="account-name">NPTG</h2>

      </div>
    </div>

    {/* Thêm menu điều hướng bên dưới avatar */}
    <div className="account-nav">
      <div className="account-nav-item">
        <span className="account-nav-title">Tài khoản</span>
        <ul className="account-submenu">
        <li className="account-submenu-item"><Link to={'/profile'}>Quản lí tài khoản</Link></li>
          <li className="account-submenu-item"><Link to={'/changepassword'}>Đổi mật khẩu</Link></li>
        </ul>
      </div>
      <div className="account-nav-item">
        <span className="account-nav-title">Tủ phim</span>
      </div>
      <div className="account-nav-item">
        <span className="account-nav-title">Vé</span>
      </div>
      <div className="account-nav-item">
        <span className="account-nav-title">Nạp tiền</span>
        <ul className="account-submenu">
        <li className="account-submenu-item"><Link to={'/credits'}> Nạp tiền</Link></li>
          <li className="account-submenu-item"><Link to={'/deponsit'}>Lịch sử nạp tiền</Link></li>
          <li className="account-submenu-item"><Link to={'/transaction'}>Lịch sử gia dịch</Link></li>
        </ul>
        
      </div>
    </div>
  </div>
</div>

</div>
<div className="divider"></div> 
      </div>
      </div>
      </div>

      <Footer />
    </>
  );
};  

export default Profile;