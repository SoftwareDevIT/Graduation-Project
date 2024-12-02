import React, { useState, useEffect } from "react";
import { Card, Row, Col, Input, Table, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import instance from "../../server";
import Header from "../Header/Hearder";
import { Avatar } from "antd";
import { NavLink } from "react-router-dom";
import './Pointaccumulation.css';

const Pointaccumulation: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pointHistories, setPointHistories] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [avatar, setAvatar] = useState<string>(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.success) {
            setUserProfile(response.data.user);
            setPointHistories(response.data.user.point_histories);
            setAvatar(
              response.data.user.avatar ||
                "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
            );
          }
        
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  const filteredTransactions = pointHistories.filter((transaction) =>
    transaction.created_at.includes(searchTerm)
  );



  return (
    <>
      <Header />
      
      {/* Banner Section */}
      <div className="banner">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png"
          alt="Banner"
          className="banner-img"
        />
      </div>

      {/* Profile and Account Info Section */}
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
                      {userProfile?.user_name || "Đang cập nhật thông tin"}
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
                </div>

              </div>
            </div>
          </div>

          <div className="divider"></div> {/* Thêm divider */}
        </div>
      </div>

      {/* Point Accumulation Stats and Transactions */}
      <div className="container">
        <Row gutter={[16, 16]} className="mt-5">
        <Col span={24} lg={6}>
    <Card className="stat-card" bordered={false}>
      <h4>Tổng chi tiêu</h4>
      <p>₫{userProfile?.total_amount || "0"}</p>
    </Card>
  </Col>

  <Col span={24} lg={6}>
    <Card className="stat-card" bordered={false}>
      <h4>Cấp Bậc</h4>
      <p>{userProfile?.rank_name || "Gold Member"}</p>
    </Card>
  </Col>

  <Col span={24} lg={6}>
    <Card className="stat-card" bordered={false}>
      <h4>Số Điểm Hiện Có</h4>
      <p>{userProfile?.points || "0"} Points</p>
    </Card>
  </Col>

  {/* New Card for Discount Percentage */}
  <Col span={24} lg={6}>
    <Card className="stat-card" bordered={false}>
      <h4>Giảm Giá</h4>
      <p>{userProfile?.discount_percentage ? `${userProfile.discount_percentage}%` : "0%"}</p>
    </Card>
  </Col>


          <Col span={24}>
            <Card className="table-card" bordered={false}>
              <Table
                dataSource={filteredTransactions}
                rowKey="id"
                columns={[
                  { title: "Số điểm tiêu", dataIndex: "points_used" },
                  { title: "Points Earned", dataIndex: "points_earned" },
                  { title: "Tổng đơn hàng", dataIndex: "order_amount" },
                  {
                    title: "Thời gian",
                    dataIndex: "created_at",
                    render: (text: string) => new Date(text).toLocaleString(),
                  },
                ]}
                bordered
                pagination={false}
                scroll={{ x: "max-content" }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Pointaccumulation;
