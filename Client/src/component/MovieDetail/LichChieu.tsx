import React, { useState, useEffect } from "react";
import "./LichChieu.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server"; // API instance
import { useNavigate, useParams } from "react-router-dom"; // Lấy ID phim từ URL
import { Location } from "../../interface/Location";
import { Cinema } from "../../interface/Cinema";
import { Showtime } from "../../interface/Showtime";

const LichChieuUpdated: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID phim từ URL
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Để mở rộng rạp chiếu
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Lấy ngày hôm nay
const navigate =useNavigate()
    // Fetch locations
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await instance.get("/location");
                setLocations(response.data?.data || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setError("Không thể tải danh sách khu vực.");
            }
        };
        fetchLocations();
    }, []);

    // Cập nhật selectedLocation khi có locations
    useEffect(() => {
        if (locations.length > 0 && !selectedLocation) {
            setSelectedLocation(locations[0].id.toString()); // Lấy ID khu vực đầu tiên
        }
    }, [locations, selectedLocation]);

    // Fetch cinemas and showtimes
    useEffect(() => {
        const fetchCinemasAndShowtimes = async () => {
            try {
                const response = await instance.get(`/filterByDateByMovie`, {
                    params: {
                        location_id: selectedLocation,
                        showtime_date: selectedDate, // Sử dụng ngày được chọn
                        movie_id: id, // Sử dụng ID phim từ URL
                    },
                });
                const cinemaData = response.data?.data || [];
                setCinemas(cinemaData.map((item: any) => ({
                    ...item.cinema,
                    showtimes: item.showtimes
                }))); // Kết hợp dữ liệu cinema và showtimes
            } catch (error) {
                console.error("Error fetching cinemas and showtimes:", error);
                setError("Không thể tải lịch chiếu cho phim này.");
            }
        };
        if (selectedLocation) {
            fetchCinemasAndShowtimes();
        }
    }, [selectedLocation, selectedDate, id]);

    const toggleCinemas = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Tạo danh sách ngày trong tuần (7 ngày từ ngày hiện tại)
    const generateWeekDays = () => {
        const days = [];
        const currentDate = new Date();
    
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);
            days.push({
                date: date.toISOString().split("T")[0], // YYYY-MM-DD format
                day: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }), // Định dạng dd/MM
                weekDay: date.toLocaleDateString('vi-VN', { weekday: 'short' }) // Thứ trong tuần
            });
        }
        return days;
    };

    return (
        <>
            <MovieDetail />
            <div className="lich-chieu-container">
                <div className="calendar-container">
                    <div className="row-custom">
                        <select
                            className="city-select-custom"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            {locations.map((location) => (
                                <option key={location.id} value={location.id.toString()}>
                                    {location.location_name}
                                </option>
                            ))}
                        </select>
                        <select className="format-select-custom">
                            <option>Định dạng</option>
                            <option>2D</option>
                            <option>3D</option>
                            <option>IMAX</option>
                        </select>
                    </div>
                    <div className="calendar-custom">
                        {generateWeekDays().map((day, index) => (
                            <div
                                key={index}
                                className={`date-custom ${selectedDate === day.date ? "active" : ""}`}
                                onClick={() => setSelectedDate(day.date)} // Cập nhật ngày khi chọn
                            >
                                <span>{day.day}</span>
                                <small>{day.weekDay}</small>
                            </div>
                        ))}
                    </div>
                    <div className="cinema-list">
                        {error ? (
                            <p>{error}</p>
                        ) : (
                            cinemas.map((cinema, index) => (
                                <React.Fragment key={index}>
                                    <div
                                        className={`cinema-item ${expandedIndex === index ? "active" : ""}`}
                                        onClick={() => toggleCinemas(index)}
                                    >
                                        <div className="cinema-logo">
                                            <img src="https://cdn.moveek.com/storage/media/cache/square/5fffb2fcaf3c1018282624.png" alt={cinema.cinema_name} />
                                        </div>
                                        <div className="cinema-info">
                                            <p className="cinema-name">{cinema.cinema_name}</p>
                                            <p className="cinema-branches">{cinema.showtimes.length} suất chiếu</p>
                                        </div>
                                    </div>
                                    {expandedIndex === index && (
                                        <div className="sub-cinema-list">
                                            <p>{cinema.cinema_address}</p>
                                            <div className="cinema-showtimes">
    {cinema.showtimes.length > 0 ? (
        cinema.showtimes.map((showtime: Showtime) => (
            <span
                key={showtime.id}
                onClick={() => {
                    navigate("/seat", {
                        state: {
                            movieName: "Tên Phim", // Thay thế bằng tên phim thực tế
                            cinemaName: cinema.cinema_name,
                            showtime: showtime.showtime_start,
                            showtimeId: showtime.id, // Truyền showtimeId
                            cinemaId: cinema.id, // Truyền cinemaId
                        },
                    });
                }}
                style={{ cursor: "pointer" }}
            >
                {showtime.showtime_start}
            </span>
        ))
    ) : (
        <p>Không có suất chiếu</p>
    )}
</div>

                                        </div>
                                    )}
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LichChieuUpdated;
