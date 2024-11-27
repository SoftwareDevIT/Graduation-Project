import React, { useState, useEffect } from "react";
import "./LichChieu.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useCountryContext } from "../../Context/CountriesContext";

import instance from "../../server"; // API instance
import { Cinema } from "../../interface/Cinema";

import { useMovieContext } from "../../Context/MoviesContext";
import { Showtime } from "../../interface/Showtimes";
import MovieDetail from "./MovieDetail";

const MuaVe: React.FC = () => {
  const { slug } = useParams();
  const { state: countryState, fetchCountries } = useCountryContext();
  const { state, fetchMovies } = useMovieContext(); // Lấy phim từ MovieContext
  const navigate = useNavigate();

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  ); // Ngày hiện tại
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lấy phim theo ID
  const movie = state.movies.find((movie) => movie.slug === slug);
  useEffect(() => {
    fetchMovies(); // Gọi lại fetchMovies khi slug thay đổi
  }, [slug]);

  useEffect(() => {
    fetchCountries(); // Lấy danh sách khu vực
  }, [fetchCountries]);

  useEffect(() => {
    if (countryState.countries.length > 0 && !selectedLocation) {
      setSelectedLocation(countryState.countries[0].id.toString()); // Mặc định chọn khu vực đầu tiên
    }
  }, [countryState, selectedLocation]);

  // Lấy danh sách rạp chiếu
  useEffect(() => {
    const fetchCinemasAndShowtimes = async () => {
      try {
        const response = await instance.get(`/filterByDateByMovie`, {
          params: {
            location_id: selectedLocation,
            showtime_date: selectedDate,
            movie_id: movie?.id,
          },
        });

        const cinemaData = response.data?.data || [];
        setCinemas(
          cinemaData.map((item: any) => ({
            ...item.cinema,
            showtimes: item.showtimes,
          }))
        );
      } catch (error) {
        console.error("Error fetching cinemas and showtimes:", error);
        setError("Không thể tải lịch chiếu cho phim này.");
      }
    };
    if (selectedLocation) fetchCinemasAndShowtimes();
  }, [selectedLocation, selectedDate, movie?.id]);

  const toggleCinemas = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Tạo danh sách ngày trong tuần
  const generateWeekDays = () => {
    const days = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + i);
      days.push({
        date: date.toISOString().split("T")[0],
        day: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        weekDay: date.toLocaleDateString("vi-VN", { weekday: "short" }),
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
                            {countryState.countries.map((location) => (
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
                    <span className="logo-first-letter-1">F</span>lickHive
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
                                                                                movieName: movie?.movie_name,
                                                                                cinemaName: cinema.cinema_name,
                                                                                showtime: showtime.showtime_start,
                                                                                showtimeId: showtime.id,
                                                                                cinemaId: cinema.id,
                                                                                roomId: showtime.room_id,
                                                                                price: showtime.price
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
