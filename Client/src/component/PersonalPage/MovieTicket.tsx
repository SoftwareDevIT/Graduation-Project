import React from 'react';
import { Avatar } from 'antd';

import QRCode from 'react-qr-code';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import './MovieTicket.css';

const MovieTicket: React.FC = () => {
  const [avatar, setAvatar] = React.useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');

  const ticketData = {
    code: "2912",
    cinema: "GALAXY QUANG TRUNG",
    date: "Chủ nhật, 3/12/2017",
    time: "09:40",
    room: "RẠP 7",
    seat: "GHẾ F7",
    total: "45,000 VND"
  };

  return (
    <>
      <Header />
      <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="content-account">
        <div className="container boxcha">
          <div className="profile-fullscreen">
            <div className="account-settings-container">
              <div className="account-avatar">
                <div className="account-info">
                  <Avatar size={128} src={avatar} alt="avatar" className="avatar" />
                  <div className="account-details">
                    <h2 className="account-name">NPTG</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider"></div>

            <div className="ticket-container">
              <div className="ticket-header">
                <span className="ticket-format">2D</span>
                <span className="ticket-sub">SUB</span>
              </div>
              <p className="ticket-code">Mã đặt vé - {ticketData.code}</p>
              <h2 className="ticket-cinema">{ticketData.cinema}</h2>
              <p className="ticket-date">{ticketData.date}</p>
              <div className="ticket-info">
                <span className="ticket-time">{ticketData.time}</span>
                <span className="ticket-room">{ticketData.room}</span>
                <span className="ticket-seat">{ticketData.seat}</span>
              </div>
              <div className="ticket-details">
                <div className="ticket-item">
                  <span className="item-name">VÉ 2D THÀNH VIÊN</span>
                  <span className="item-quantity">1</span>
                  <span className="item-price">45,000 VND</span>
                </div>
                <div className="ticket-item total">
                  <span className="item-name">TỔNG</span>
                  <span className="item-price">{ticketData.total}</span>
                </div>
              </div>

              {/* QR Code */}
              <div className="ticket-qr">
                <QRCode value={JSON.stringify(ticketData)} size={128} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MovieTicket;
