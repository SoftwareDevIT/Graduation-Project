import React, { useState, useEffect } from "react";
import "./MuaVe.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import MovieDetail from "./MovieDetail";
import instance from "../../server"; // API instance
import { useNavigate, useParams } from "react-router-dom"; // Navigation hook
import { Location } from "../../interface/Location";
import { Cinema } from "../../interface/Cinema";
import { Showtime } from "../../interface/Showtime";

const MuaVe: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Lấy ID phim từ URL
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string>(""); // Selected location ID
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]); // Today's date by default
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // For toggling cinema details
    const [error, setError] = useState<string | null>(null); // To store error message
    const navigate = useNavigate();

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

    // Update selectedLocation when locations are fetched
    useEffect(() => {
        if (locations.length > 0 && !selectedLocation) {
            setSelectedLocation(locations[0].id.toString()); // Default to the first location
        }
    }, [locations, selectedLocation]);

    // Fetch cinemas and showtimes based on selected location and date
    useEffect(() => {
        const fetchCinemasAndShowtimes = async () => {
            try {
                const response = await instance.get("/filterByDateByMovie", {
                    params: {
                        location_id: selectedLocation,
                        showtime_date: selectedDate, // Sử dụng ngày được chọn
                        movie_id: id, // Sử dụng ID phim từ URL
                    },
                });
                const cinemaData = response.data?.data || [];
                setCinemas(cinemaData.map((item: any) => ({
                    ...item.cinema,
                    showtimes: item.showtimes,
                })));
            } catch (error) {
                console.error("Error fetching cinemas and showtimes:", error);
                setError("Không thể tải lịch chiếu.");
            }
        };
        if (selectedLocation) {
            fetchCinemasAndShowtimes();
        }
    }, [selectedLocation, selectedDate]);

    const toggleCinemas = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Generate a list of days (7 days from today)
    const generateWeekDays = () => {
        const days = [];
        const currentDate = new Date();

        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(currentDate.getDate() + i);

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            days.push({
                date: `${year}-${month}-${day}`,
                day: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
                weekDay: date.toLocaleDateString('vi-VN', { weekday: 'short' }),
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
                    </div>
                    <div className="calendar-custom">
                        {generateWeekDays().map((day, index) => (
                            <div
                                key={index}
                                className={`date-custom ${selectedDate === day.date ? "active" : ""}`}
                                onClick={() => setSelectedDate(day.date)}
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
                                                    cinema.showtimes.map((showtime: Showtime) => {
                                                        const showtimeDateTime = new Date(`${selectedDate}T${showtime.showtime_start}`);
                                                        const isPastShowtime = showtimeDateTime < new Date();

                                                        return (
                                                            <span
                                                                key={showtime.id}
                                                                onClick={() => {
                                                                    if (!isPastShowtime) {
                                                                        navigate("/seat", {
                                                                            state: {
                                                                                cinemaName: cinema.cinema_name,
                                                                                showtime: showtime.showtime_start,
                                                                                showtimeId: showtime.id,
                                                                                cinemaId: cinema.id,
                                                                            },
                                                                        });
                                                                    }
                                                                }}
                                                                style={{
                                                                    cursor: isPastShowtime ? "not-allowed" : "pointer",
                                                                    color: isPastShowtime ? "gray" : "black",
                                                                }}
                                                            >
                                                                {showtime.showtime_start}
                                                            </span>
                                                        );
                                                    })
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

export default MuaVe;
