import React, { useEffect, useState } from 'react';
import { Avatar, notification } from 'antd';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './Profile.css';
import './ChangePassword.css';
import instance from '../../server';

const ChangePassword: React.FC = () => {
  const location = useLocation();
  const isAccountActive = location.pathname === '/profile' || location.pathname === '/changepassword';
  const isCreditsActive = location.pathname === '/credits' || location.pathname === '/deponsit' || location.pathname === '/transaction';

  const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [new_password_confirmation, setConfirmPassword] = useState('');
 
  const [userProfile, setUserProfile] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Thêm state để lưu file avatar

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      // Lấy thông tin người dùng theo ID
      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.status) {
            const userProfileData = response.data.data;
            setUserProfile(userProfileData);
            setAvatar(
              userProfileData.avatar ||
              "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
            );
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();

      // Lấy danh sách khu vực cho dropdown
      const fetchLocations = async () => {
        try {
          const response = await instance.get("/location");
          if (response.data.status) {
            setLocations(response.data.data);
          }
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };

      fetchLocations();
    }
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== new_password_confirmation) {
        notification.error({ message: 'Mật khẩu không khớp' });
        return;
    }

    const token = localStorage.getItem("token"); // Lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
    console.log(token);
    // Kiểm tra dữ liệu gửi lên
    console.log("Data sending to server:", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: new_password_confirmation,
    });

    try {
        const response = await instance.post('/resetPassword', {
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: new_password_confirmation,
        }, {
            headers: {
                Authorization: `Bearer k6V8jtEAWxqfU8egsj3altRAE5rlPo0NmbjRCOGTd13b572f`,
            },
            
            
        });
       

        if (response.data.status) {
            notification.success({ message: 'Đổi mật khẩu thành công!' });
        } else {
            notification.error({ message: response.data.message || 'Cập nhật mật khẩu thất bại' });
        }
    } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
        notification.error({ message: 'Cập nhật mật khẩu thất bại', description: error.response?.data?.message || '' });
    }
};



  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="content-acount">
        <div className="container boxcha">
          <div className="profile-fullscreen">
            <div className="account-settings-container">
              <div className="account-avatar">
              <div className="account-info">
                    <Avatar
                      size={128}
                      src={avatar}
                      alt="avatar"
                      className="avatar"
                    />
                    <div className="account-details">
                      <h2 className="account-name">
                        {userProfile?.user_name || "No name"}
                      </h2>
                    </div>
                  </div>


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

            <div className="divider"></div>
          </div>

          <div className="change-password-container">
            <form className="change-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Xác minh:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={new_password_confirmation}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="submit-button">
                Đổi mật khẩu
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ChangePassword;
