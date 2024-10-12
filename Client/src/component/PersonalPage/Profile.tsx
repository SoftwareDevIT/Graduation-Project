import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './Profile.css'; // Import file CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';


const { Option } = Select;

const Profile: React.FC = () => {
  const [avatar, setAvatar] = useState('/path-to-avatar.png'); // Khởi tạo giá trị avatar mặc định

  const handleFinish = (values: any) => {
    console.log('Form Values:', values);
  };

  const handleUploadChange = (info: any) => {
    if (info.file.status === 'done') {
      // Cập nhật đường dẫn ảnh đại diện khi upload thành công
      setAvatar(info.file.response.url); // Giả sử server trả về đường dẫn ảnh
    }
  };

  return (
    <>
      <Header/>
      <div className="profile-fullscreen">
        <div className="banner">
          <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
        </div>
        <div className="account-settings-container">
          <div className="account-avatar">
            <Avatar size={128} src={avatar} alt="avatar" /> {/* Cập nhật src ở đây */}
            <h2>NPTG</h2>
            <span className="balance">0 đ</span>

            {/* Thêm menu điều hướng bên dưới avatar */}
            <div className="account-nav">
  <div className="account-nav-item">
    <span className="account-nav-title">Tài khoản</span>
    <ul className="account-submenu">
      <li className="account-submenu-item">Quản lí tài khoản</li>
      <li className="account-submenu-item">Đổi mật khẩu</li>
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
      <li className="account-submenu-item">Nạp tiền</li>
      <li className="account-submenu-item">Lịch sử nạp tiền</li>
      <li className="account-submenu-item">Lịch sử giao dịch</li>
    </ul>
  </div>
</div>

          </div>

          <Form
            layout="vertical"
            onFinish={handleFinish}
            initialValues={{
              username: 'giang1234',
              email: 'nguyenvanthien24032004@gmail.com',
              name: 'h5ejryk',
              region: 'Tp. Hồ Chí Minh',
            }}
            className="account-form"
          >
            <Form.Item label="Tên tài khoản" name="username">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Họ và tên" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Khu vực" name="region">
              <Select>
                <Option value="Tp. Hồ Chí Minh">Tp. Hồ Chí Minh</Option>
                <Option value="Hà Nội">Hà Nội</Option>
                <Option value="Đà Nẵng">Đà Nẵng</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary">Xác thực số điện thoại</Button>
            </Form.Item>

            <Form.Item label="Ảnh đại diện" name="avatar">
              <Upload
                name="avatar" // Đặt tên cho trường
                onChange={handleUploadChange} // Gọi hàm khi có sự thay đổi
                showUploadList={false} // Không hiển thị danh sách file đã upload
                action="/upload-avatar" // Đường dẫn server để upload ảnh
              >
                <Button icon={<UploadOutlined />}>Browse</Button>
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
      <Footer />
    </>
  );
};  

export default Profile;
