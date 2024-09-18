import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-left">
                <div className="company-info">
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/favicon-large.png" alt="Company Logo" className="company-logo" />
                    <p>CÔNG TY TNHH MONET</p>
                    <p>Số ĐKKD: 0315367026 · Nơi cấp: Sở kế hoạch và đầu tư Tp. Hồ Chí Minh</p>
                    <p>Đăng ký lần đầu ngày 01/11/2018</p>
                    <p>Địa chỉ: 33 Nguyễn Trung Trực, P.5, Q. Bình Thạnh, Tp. Hồ Chí Minh</p>
                    <div className="footer-links">
                        <a href="#">Về chúng tôi</a> · 
                        <a href="#">Chính sách bảo mật</a> · 
                        <a href="#">Hỗ trợ</a> · 
                        <a href="#">Liên hệ</a> · 
                        <span>v8.1</span>
                    </div>
                </div>
            </div>
            <div className="footer-right">
                <div className="partners">
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/beta-cineplex-v2.jpg" alt="Beta Cinemas" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/mega-gs-cinemas.png" alt="Mega GS" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/cinestar.png" alt="Cinestar" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/dcine.png" alt="DCINE" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/starlight.png" alt="Starlight" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/dong-da-cinemas.png" alt="DDC" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/touch-cinemas.png" alt="Touch Cinema" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/payoo.jpg" alt="Payoo" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/momo.png" alt="MoMo" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/shopeepay-icon.png" alt="Shopee" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/zalopay-icon.png" alt="ZaloPay" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/partners/fundiin-icon.png" alt="Fundin" />
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/20150827110756-dathongbao.png" alt="Bộ Công Thương" />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
