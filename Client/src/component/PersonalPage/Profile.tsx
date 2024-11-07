import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Upload,
  Avatar,
  notification,
} from "antd";

import "./Profile.css"; // Import file CSS
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import "./Profile.css";
import { Link } from "react-router-dom";
import instance from "../../server";

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("user_name", userProfile.user_name);
    formData.append("phone", userProfile.phone);
 
    
    // Kiểm tra xem avatarFile có tồn tại không trước khi thêm vào formData
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
  
    try {
      const response = await instance.post(`/user/${userProfile.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.status) {
        notification.success({ message: "Cập nhật thông tin thành công" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notification.error({ message: "Cập nhật thông tin thất bại" });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        setAvatar(event.target.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file); // Lưu file vào state để sử dụng khi cập nhật
    }
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
      <h3>{userProfile?.user_name || "No name"}</h3>
        
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

      </div>
      <div className="divider"></div> 
      <div className="profile-container">
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tên tài khoản</label>
                  <input
                    type="text"
                    id="username"
                    value={userProfile?.user_name || "giang1234"}
                    readOnly
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    id="email"
                    value={
                      userProfile?.email || ""
                    }
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    id="fullname"
                    value={userProfile?.fullname || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        fullname: e.target.value,
                      })
                    }
                  />
                </div>
                
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    id="phone"
                    value={userProfile?.phone || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
                
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Ảnh đại diện</label>
                  <input
                    type="file"
                    id="avatar"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>
              <button type="submit" className="update-btn">
                Cập nhật
              </button>
            </form>
          </div>
      </div>
      </div>

      <Footer />
    </>
  );
};  

export default Profile;