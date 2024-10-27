import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Avatar, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Profile.css'; // Import file CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './Profile.css'
import { Link, useLocation } from 'react-router-dom';

const { Option } = Select;

const Profile: React.FC = () => {
 
    const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png'); // Khởi tạo giá trị avatar mặc định

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const location = useLocation(); // Lấy vị trí hiện tại

    // Xác định URL hiện tại có thuộc nhóm "Tài khoản", "Nạp tiền", ...
    const isAccountActive = location.pathname === '/profile' || location.pathname === '/changepassword';
    const isCreditsActive = location.pathname === '/credits' || location.pathname === '/deponsit' || location.pathname === '/transaction';
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        notification.error({ message: 'Mật khẩu xác minh không trùng khớp!' });
        return;
      }
      // Xử lý logic đổi mật khẩu ở đây
      notification.success({ message: 'Đổi mật khẩu thành công!' });
      // Reset form sau khi đổi mật khẩu
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    };
  

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
            <div className={`account-nav-item ${isAccountActive ? 'active' : ''}`}>
                <span className="account-nav-title">Tài khoản</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/profile'}>Quản lí tài khoản</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/changepassword'}>Đổi mật khẩu</Link>
                    </li>
                </ul>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Tủ phim</span>
            </div>

            <div className="account-nav-item">
                <span className="account-nav-title">Vé</span>
            </div>

            <div className={`account-nav-item ${isCreditsActive ? 'active' : ''}`}>
                <span className="account-nav-title">Nạp tiền</span>
                <ul className="account-submenu">
                    <li className="account-submenu-item">
                        <Link to={'/credits'}>Nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/deponsit'}>Lịch sử nạp tiền</Link>
                    </li>
                    <li className="account-submenu-item">
                        <Link to={'/transaction'}>Lịch sử giao dịch</Link>
                    </li>
                </ul>
            </div>
        </div>
  </div>
</div>

</div>
<div className="divider"></div> 
      </div>
     
      <div className="profile-container">
  <form className="profile-form">
    <div className="form-row">
      <div className="form-group">
        <label >Tên tài khoản</label>
        <input type="text" id="username" value="giang1234" />
      </div>
      <div className="form-group">
        <label >Email</label>
        <input type="email" id="email" value="nguyenvanthien24032004@gmail.com"  />
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label >Họ và tên</label>
        <input type="text" id="fullname" value="" />
      </div>
      <div className="form-group">
        <label >Khu vực</label>
        <select id="region">
          <option value="hcm">Tp. Hồ Chí Minh</option>
          <option value="hcm">Hà Nội</option>
          <option value="hcm">Đà Nẵng</option>
        </select>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Số điện thoại</label>
        <input type="text" id="phone" placeholder="Số điện thoại" />
      </div>
      <div className="form-group">
        <button type="button" className="verify-phone">Xác thực số điện thoại</button>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label >Ảnh đại diện</label>
        <input type="file" id="avatar" />
      </div>
    </div>

    <button type="submit" className="update-btn">Cập nhật</button>
  </form>
</div>


      </div>
      </div>
      
      <Footer />
    </>
  );
};  

export default Profile;