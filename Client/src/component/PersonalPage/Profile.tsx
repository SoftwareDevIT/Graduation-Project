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
import { NavLink } from 'react-router-dom';
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
      const response = await instance.post(
        `/user/${userProfile.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      <Header />
      <div className="banner">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png"
          alt="Banner"
          className="banner-img"
        />
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

                {/* Menu điều hướng bên dưới avatar */}
              

                <div className="account-nav">
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tài khoản
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/movies" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tủ phim
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/movieticket" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Vé
      </NavLink>
    </span>
  </div>
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/changepassword" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Đổi mật khẩu
      </NavLink>
    </span>
  </div>
</div>

              </div>
            </div>
          </div>

          <div className="divider"></div>
          <div className="profile-container">
            <form className="profile-form" onSubmit={handleUpdateProfile}>
              <div className="row g-3">
                <div className="col">
                  <label className="label-form1">Tên tài khoản</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={userProfile?.user_name || "giang1234"}
                    readOnly
                    disabled
                  />
                </div>
                <div className="col">
                <label className="label-form1">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    value={userProfile?.email || ""}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="row g-3">
                <div className="col">
                <label className="label-form">Họ và tên</label>
                  <input
                    type="text"
                    className="form-control"
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
                <div className="col">
                <label className="label-form" >Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
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
              <label className="label-form">Ảnh đại diện</label>
             <div className="input-group mb-3">
          
  <input type="file" className="form-control" 
                    id="avatar"
                    onChange={handleAvatarChange}/>

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
