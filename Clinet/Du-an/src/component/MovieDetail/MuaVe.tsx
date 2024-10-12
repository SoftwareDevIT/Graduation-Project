import React, { useState } from "react";
import "./MuaVe.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";

interface Cinema {
    name: string;
    branches: number;
    subCinemas?: string[]; // Danh sách các rạp con
}

const MuaVe: React.FC = () => {
    const cinemas: Cinema[] = [
        { name: "Beta Cinemas", branches: 2, subCinemas: ["Beta Quang Trung", "Beta Ung Văn Khiêm"] },
        { name: "Cinestar", branches: 2, subCinemas: ["Cinestar Hai Bà Trưng", "Cinestar Quốc Thanh"] },
        { name: "Dcine", branches: 1, subCinemas: ["Dcine Bến Thành"] },
        { name: "Mega GS Cinemas", branches: 2, subCinemas: ["Mega GS Cao Thắng", "Mega GS Cách Mạng Tháng Tám"] },
        { name: "BHD Star Cineplex", branches: 5, subCinemas: ["BHD Vincom 3/2", "BHD Vincom Quang Trung"] },
        { name: "CGV Cinemas", branches: 20, subCinemas: ["CGV Hùng Vương", "CGV Thủ Đức"] },
        { name: "Đống Đa Cinema", branches: 1 },
        { name: "Galaxy Cinema", branches: 10 },
        { name: "Lotte Cinema", branches: 9 }
    ];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(0); // Mặc định rạp đầu tiên được chọn

    const toggleSubCinemas = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        setSelectedIndex(index); // Cập nhật chỉ số của rạp đang được chọn
    };


    return (
        <>
            <MovieDetail />
            {/* Phần chọn lịch chiếu */}
            <div className="lich-chieu-container">
                <div className="calendar-container">
                    <div className="row-custom">
                        <select className="city-select-custom">
                            <option>Tp. Hồ Chí Minh</option>
                            <option>Hà Nội</option>
                            <option>Đà Nẵng</option>
                            {/* Thêm các tùy chọn thành phố khác tại đây */}
                        </select>
                    </div>
                    <div className="calendar-custom">
                        <div className="date-custom active">
                            <span>28/9</span>
                            <small>Th 7</small>
                        </div>
                        <div className="date-custom">
                            <span>29/9</span>
                            <small>CN</small>
                        </div>
                        <div className="date-custom">
                            <span>30/9</span>
                            <small>Th 2</small>
                        </div>
                        <div className="date-custom">
                            <span>1/10</span>
                            <small>Th 3</small>
                        </div>
                        <div className="date-custom">
                            <span>2/10</span>
                            <small>Th 4</small>
                        </div>
                        <div className="date-custom">
                            <span>3/10</span>
                            <small>Th 5</small>
                        </div>
                    </div>
                    {/* Danh sách rạp */}
                    <div className="cinema-list">
                        {cinemas.map((cinema, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`cinema-item ${expandedIndex === index ? "active" : ""} ${selectedIndex === index ? "selected" : ""}`}
                                    onClick={() => toggleSubCinemas(index)}
                                >

                                    <div className="cinema-logo">
                                        {/* Thêm hình ảnh logo nếu có */}
                                        <img src="https://cdn.moveek.com/storage/media/cache/square/5fffb2fcaf3c1018282624.png" alt={cinema.name} />
                                    </div>
                                    <div className="cinema-info">
                                        <p className="cinema-name">{cinema.name}</p>
                                        <p className="cinema-branches">{cinema.branches} rạp</p>
                                    </div>
                                    <div className="cinema-arrow">
                                        <span>&gt;</span> {/* Mũi tên sang phải */}
                                    </div>
                                </div>
                                {/* Danh sách rạp con, hiển thị nếu cinema có subCinemas */}
                                {expandedIndex === index && cinema.subCinemas && (
                                    <div className="sub-cinema-list">
                                        {cinema.subCinemas.map((subCinema, subIndex) => (
                                            <div className="sub-cinema-item" key={subIndex}>
                                                {subCinema}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default MuaVe;
