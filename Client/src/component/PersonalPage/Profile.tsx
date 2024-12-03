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
import { UploadOutlined } from "@ant-design/icons";
import "./Profile.css"; // Import CSS
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";
import { Link, NavLink } from "react-router-dom";
import instance from "../../server";

const { Option } = Select;

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState<string>(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
  const [userProfile, setUserProfile] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Lưu file avatar

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

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

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("user_name", userProfile.user_name);
    formData.append("phone", userProfile.phone);

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

  const handleAvatarUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      setAvatar(event.target.result);
    };
    reader.readAsDataURL(file);
    setAvatarFile(file);
    return false; // Ngăn Ant Design tự tải lên
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
        to="/Personal" 
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
  <div className="account-nav-item">
    <span className="account-nav-title">
      <NavLink 
        to="/points" 
        className={({ isActive }) => isActive ? 'active-link' : ''}>
        Tích Điểm
      </NavLink>
    </span>
  </div>
</div>

              </div>
            </div>
          </div>

          <div className="divider"></div>
          <div className="profile-container">
            <Form
              layout="vertical"
              onFinish={handleUpdateProfile}
              className="profile-form"
            >
              <Form.Item label="Tên tài khoản">
                <Input
                  value={userProfile?.user_name || ""}
                  readOnly
                  disabled
                />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={userProfile?.email || ""} readOnly disabled />
              </Form.Item>
              <Form.Item label="Họ và tên">
                <Input
                  value={userProfile?.fullname || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      fullname: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input
                  value={userProfile?.phone || ""}
                  onChange={(e) =>
                    setUserProfile({
                      ...userProfile,
                      phone: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Ảnh đại diện">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={handleAvatarUpload}
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
               
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Profile;
