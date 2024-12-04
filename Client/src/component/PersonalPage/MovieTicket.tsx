import React, { useEffect, useState } from 'react';
import Header from '../Header/Hearder';
import { Avatar } from 'antd';
import instance from '../../server';
import Footer from '../Footer/Footer';
import './MovieTicket.css';
import Ticket from '../../interface/Ticket';
import { Link, NavLink } from 'react-router-dom';
import { AwesomeQR } from "awesome-qr"; // Import AwesomeQR

const MovieTicket = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]); 
  const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [qrCodes, setQrCodes] = useState<string[]>([]); // Store QR code as base64

  useEffect(() => {
    const profileData = localStorage.getItem('user_profile');
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.status) {
            setUserProfile(response.data.data);
            setAvatar(response.data.data.avatar || 'https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      };

      const fetchTickets = async () => {
        try {
          const response = await instance.post('/historyOrder'); 
          if (response.data.status) {
            const ticketData = response.data.data;
            setTickets(ticketData);
            console.log(ticketData); // Log ticket data for debugging
          }
        } catch (error) {
          console.error('Error fetching tickets:', error);
        }
      };

      fetchUserProfile();
      fetchTickets();
    }
  }, []);



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

          <div className="divider"></div>
         
        </div>
      </div>

    </>
  );
};
export default MovieTicket;