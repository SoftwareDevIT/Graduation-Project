import React, { useState } from "react";
import "./LichChieu.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";

interface Cinema {
    name: string;
    branches: number;
    address: string; // Địa chỉ rạp
    showtimes: string[]; // Danh sách thời gian xuất chiếu
    subCinemas?: {
        name: string;
        address: string; // Địa chỉ của rạp con
        showtimes: string[]; // Danh sách thời gian xuất chiếu của rạp con
    }[]; // Danh sách các rạp con
}

const LichChieuUpdated: React.FC = () => {
    const cinemas: Cinema[] = [
        {
            name: "Beta Cinemas",
            branches: 2,
            address: "123 Đường ABC, Quận 1, Tp. Hồ Chí Minh",
            showtimes: ["18:00", "20:00"],
            subCinemas: [
                { name: "Beta Quang Trung", address: "123 Đường Quang Trung", showtimes: ["18:00", "19:00"] },
                { name: "Beta Ung Văn Khiêm", address: "456 Đường Văn Khiêm", showtimes: ["20:00", "21:00"] },
            ]
        },
        {
            name: "Cinestar",
            branches: 2,
            address: "456 Đường XYZ, Quận 2, Tp. Hồ Chí Minh",
            showtimes: ["17:00", "19:30"],
            subCinemas: [
                { name: "Cinestar Hai Bà Trưng", address: "789 Đường Hai Bà Trưng", showtimes: ["16:30", "18:30"] },
                { name: "Cinestar Quốc Thanh", address: "321 Đường Quốc Thanh", showtimes: ["19:00", "20:00"] },
            ]
        },
        // Các rạp khác...
    ];

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [subExpandedIndex, setSubExpandedIndex] = useState<number | null>(null); // Thêm state cho rạp con

    const toggleSubCinemas = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const toggleSubCinemaDetails = (index: number) => {
        setSubExpandedIndex(subExpandedIndex === index ? null : index);
    };

    return (
        <>
            <MovieDetail />
            <div className="lich-chieu-container">
                <div className="calendar-container">
                    <div className="row-custom">
                        <select className="city-select-custom">
                            <option>Tp. Hồ Chí Minh</option>
                            <option>Hà Nội</option>
                            <option>Đà Nẵng</option>
                        </select>
                        <select className="format-select-custom">
                            <option>Định dạng</option>
                            <option>2D</option>
                            <option>3D</option>
                            <option>IMAX</option>
                        </select>
                    </div>
                    <div className="calendar-custom">
                        <div className="date-custom active"><span>28/9</span><small>Th 7</small></div>
                        <div className="date-custom"><span>29/9</span><small>CN</small></div>
                        <div className="date-custom"><span>30/9</span><small>Th 2</small></div>
                        <div className="date-custom"><span>1/10</span><small>Th 3</small></div>
                        <div className="date-custom"><span>2/10</span><small>Th 4</small></div>
                        <div className="date-custom"><span>3/10</span><small>Th 5</small></div>
                    </div>
                    <div className="cinema-list">
                        {cinemas.map((cinema, index) => (
                            <React.Fragment key={index}>
                                <div
                                    className={`cinema-item ${expandedIndex === index ? "active" : ""}`}
                                    onClick={() => toggleSubCinemas(index)}
                                >
                                    <div className="cinema-logo">
                                        <img src="https://cdn.moveek.com/storage/media/cache/square/5fffb2fcaf3c1018282624.png" alt={cinema.name} />
                                    </div>
                                    <div className="cinema-info">
                                        <p className="cinema-name">{cinema.name}</p>
                                        <p className="cinema-branches">{cinema.branches} rạp</p>
                                    </div>
                                  
                                </div>
                                {expandedIndex === index && (
                                    <div className="sub-cinema-list">
                                        {cinema.subCinemas && cinema.subCinemas.map((subCinema, subIndex) => (
                                            <div key={subIndex}>
                                                <div className="sub-cinema-item" onClick={() => toggleSubCinemaDetails(subIndex)}>
                                                    {subCinema.name}
                                                </div>
                                                {subExpandedIndex === subIndex && (
                                                  <div className="sub-cinema-details">
                                               
                                                  <p className="cinema-address">645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh</p>
                                                  <div className="cinema-showtimes">
                                                      <span>08:20</span>
                                                      <span>10:40</span>
                                                      <span>11:00</span>
                                                      <span>13:00</span>
                                                      <span>15:20</span>
                                                      <span>18:20</span>
                                                      <span>19:00</span>
                                                      <span>20:10 </span>
                                                      <span>21:15 </span>
                                                     
                                                  </div>
                                              </div>
                                              
                                               
                                                )}
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

export default LichChieuUpdated;
