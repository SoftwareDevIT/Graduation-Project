import React, { useState } from 'react';
import './TicketCinema.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import { Avatar } from 'antd';
import avatar from 'antd/es/avatar';
import { Link } from 'react-router-dom';

const TicketCinema = () => {
    const [userProfile, setUserProfile] = useState<any>(null);
    const [avatar, setAvatar] = useState('https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png');
    return (
        <>
            <Header />
            <div className="banner">
        <img src="https://cdn.moveek.com/bundles/ornweb/img/tix-banner.png" alt="Banner" className="banner-img" />
      </div>
      <div className="container">
        <div className="content-acount1">
          <div className="container boxcha"></div>
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
                      <span className="account-nav-title">Tài khoản</span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">Tủ phim</span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title">Vé</span>
                    </div>
                    <div className="account-nav-item">
                      <span className="account-nav-title"><Link to={"/changepassword"}>Đổi mật khẩu</Link></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="divider"></div>
            <div className="ticket-container">
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">Vệ Binh Dải Ngân Hà 2</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">Vệ Binh Dải Ngân Hà 2</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">FlickHive</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">FlickHive</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">Vệ Binh Dải Ngân Hà 2</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            <div className="ticket">
                {/* Phần bên trái */}
                <div className="ticket-left">
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <h1 className="ticket-title">Vệ Binh Dải Ngân Hà 2</h1>
                    <div className="stars-container">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                    </div>
                    <div className="ticket-info">
                        <div className="infofl">
                            <div className="item-ve">
                                <p >
                                    <strong>Ngày :</strong> <span>12/12/2022</span>
                                </p>
                            </div>
                            <div className="item-ve">
                                <p className='timee'>
                                    <strong>Thời gian :</strong><span>9:00 PM</span>
                                </p></div>
                        </div>


                        <div className="infofl">
                        <div className="item-ve">
                        <p className='screenn'>
                                <strong >Phòng:</strong><span>2</span>
                            </p></div>
                           
                            <div className="item-ve">
                            <p className='seatt'>
                                <strong >Ghế:</strong><span> A1 , A2 , A3 , A4, </span>
                            </p></div>
                          
                        </div>
                    </div>
                </div>
                {/* Phần bên phải */}
                <div className="ticket-right">
                    <img
                        src="https://cdn.pixabay.com/photo/2013/07/12/14/45/qr-code-148732_640.png"
                        alt="QR Code"
                        className="qr-code"
                    />
                    <p className="admit-one">Checkin</p>
                </div>
            </div>
            
            </div>
            </div>
            </div>
          

            <Footer />
        </>
    );
};

export default TicketCinema;
