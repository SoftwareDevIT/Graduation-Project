import React, { useEffect, useState } from 'react';
import Header from '../Header/Hearder';
import { Avatar } from 'antd';
import instance from '../../server';
import Footer from '../Footer/Footer';
import './MovieTicket.css';
import Ticket from '../../interface/Ticket';
import { Link } from 'react-router-dom';
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
          const response = await instance.post(`/historyOrder`);
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

  useEffect(() => {
    // Generate QR codes when tickets are fetched
    const generateQRCodes = async () => {
      const qrCodesTemp = await Promise.all(
        tickets.map(async (ticket) => {
          // Create a more compact version of the ticket data
          const qrData = {
            id: ticket.id,
            showtime: ticket.showtime?.showtime_date + ' ' + ticket.showtime?.showtime_start,
            seats: ticket.seats?.map(seat => seat.seat_name).join(', '),
            amount: ticket.amount,
          };

          const qrCode = await new AwesomeQR({
            text: JSON.stringify(qrData),  // Only use essential data for QR code
            size: 300,
            margin: 10,
            logoScale: 0.2,
          }).draw();

          return qrCode; // Base64 encoded image
        })
      );
      console.log(qrCodesTemp); // Log the QR codes for debugging
      setQrCodes(qrCodesTemp);
    };
  
    if (tickets.length > 0) {
      generateQRCodes(); // Only generate QR codes when tickets are present
    }
  }, [tickets]);  // Runs when tickets are updated

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="container">
        <div className="content-acount1">
          <div className="container boxcha">
            <div className="profile-fullscreen">
              <div className="account-settings-container">
                <div className="account-avatar">
                  <div className="account-info fix-acount">
                    <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
                    <div className="account-details">
                      <h2 className="account-name">{userProfile?.user_name || 'No name'}</h2>
                    </div>
                  </div>
                  <div className="account-nav">
                    <div className="account-nav-item">
                    <span className="account-nav-title"><Link to={"/profile"}>Quản lí tài khoản</Link></span>
                    </div>
                    <div className="account-nav-item">
                    <span className="account-nav-title"><Link to={"/changepassword"}>Đổi mật khẩu</Link></span>
                    </div>
                    <div className="account-nav-item">
                    <span className="account-nav-title"><Link to={"/moviticket"}>Vé</Link></span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title"><Link to={"/desponsit"}>Nạp Tiền</Link></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="ticket-tong">
              {tickets.length === 0 ? (
                <p className="no-tickets-message">Bạn chưa có vé nào được đặt.</p>
              ) : (
                tickets.map((ticket, index) => (
                  <div className="ticket-container" key={index}>
                    <p className="ticket-code">Mã đặt vé - {ticket.id}</p>
                    <p className="ticket-date">{ticket.showtime?.showtime_date}</p>
                    <div className="ticket-info">
                      <span className="ticket-time">{ticket.showtime?.showtime_start}</span>
                      <span className="ticket-room">{ticket.showtime?.room?.room_name}</span>
                      <span className="ticket-seat">
                        {ticket.seats?.map((seat) => (
                          <span key={seat.seat_name}>{seat.seat_name}</span>
                        ))}
                      </span>
                    </div>
                    <div className="ticket-details">
                      <div className="ticket-item">
                        <span className="item-name">Số lượng</span>
                        <span className="item-quantity">{ticket.seats?.length || 0}</span>
                        <span className="item-price">{ticket.amount?.toLocaleString()} VND</span>
                      </div>
                      <div className="ticket-item">
                        <span className="item-name">Combo:</span>
                        <span className="item-quantity"> 
                          {ticket.combos?.map((combo, index) => (
                            <span key={index}>{combo.combo_name}</span>
                          ))}
                        </span>
                      </div>
                      <div className="ticket-item total">
                        <span className="item-name">TỔNG</span>
                        <span className="item-price">{ticket.amount?.toLocaleString()} VND</span>
                      </div>
                    </div>
                    <div className="ticket-qr">
                      {qrCodes[index] && <img src={qrCodes[index]} alt={`QR Code ${index}`} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieTicket;
