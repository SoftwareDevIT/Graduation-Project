import React from "react";
import './Credits.css'; // Import file CSS
import Footer from "../Footer/Footer";
import Header from "../Header/Hearder";

interface Props { }

const Credits: React.FC<Props> = () => {
    return (
        <>
            <Header />
            <div className="moveek-credits-container">
                {/* Phần tiêu đề */}
                <div className="moveek-header">
                    <h3>Moveek Credits</h3>
                    <p> Mua vé nhanh chóng chỉ với 1 click </p><a href="#">tìm hiểu thêm</a>

                </div>

                {/* Phần hiển thị thông tin người dùng */}
                <div className="user-info">
                    <h4>Lựa chọn gói rạp</h4>
                    <p>
                        Xin chào <b>giang1234</b>. Số dư Moveek Credits: <b>0 đ</b>
                    </p>
                </div>

                {/* Phần lựa chọn gói nạp */}
                <div className="package-options">
                    {/* Gói 100.000 VND */}
                    <div className="package-card package-100k">
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/card-4.png" alt="Moveek Logo" />
                    <button>Nạp gói này</button>  
                    </div>
                    <div className="package-card package-200k">
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/card-1.png" alt="Moveek Logo" />
                    <button>Nạp gói này</button>  
                    </div>
                    <div className="package-card package-500k">
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/card-2.png" alt="Moveek Logo" />
                    <button>Nạp gói này</button>  
                    </div>
                    <div className="package-card package-1000k">
                    <img src="https://cdn.moveek.com/bundles/ornweb/img/card-3.png" alt="Moveek Logo" />
                    <button>Nạp gói này</button>  
                    </div>
    

                   
                 
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Credits;
