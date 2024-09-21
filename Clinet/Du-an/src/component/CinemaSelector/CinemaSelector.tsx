import React, { useState, useEffect } from "react";
import instance from "../../server";
import "./CinemaSelector.css"; // Import file CSS
import { Cinema } from "../../interface/Cinema";
import { Actor } from "../../interface/Actor";
import { Movie } from "../../interface/Movie";
import { Location } from "../../interface/Location";
import { useNavigate } from "react-router-dom";


const CinemaSelector: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
  const navigate = useNavigate();
  // Lấy danh sách vị trí, rạp
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await instance.get("/location");
        setLocations(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách vị trí:", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await instance.get("/cinema");
        setCinemas(response.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách rạp:", error);
      }
    };
    // Lấy danh sách diễn viên

    const fetchActors = async () => {
      try {
        const response = await instance.get("/actor");
        setActors(response.data || []);
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách diễn viên:", error);
      }
    };

    fetchActors();

    fetchLocations();
    fetchCinemas();
  }, []);
  useEffect(() => {
    if (locations.length > 0) {
      const haNoi = locations.find(location => location.location_name === "Hà Nội");
      if (haNoi) {
        setSelectedCity(haNoi.id); // Mặc định chọn Hà Nội
      }
    }
  
    setSelectedDate("19/9"); // Chọn ngày đầu tiên
  }, [locations]); // Chạy khi danh sách locations thay đổi
  

  useEffect(() => {
    if (selectedCity) {
      const filtered = cinemas.filter(
        (cinema) => cinema.location_id === selectedCity
      );
      setFilteredCinemas(filtered);
      if (filtered.length === 0) {
        setMovies([]); // Xóa danh sách phim nếu không có rạp nào
      }
    } else {
      setFilteredCinemas(cinemas);
      setMovies([]); // Xóa danh sách phim khi không chọn khu vực
    }
  }, [selectedCity, cinemas]);

  // Lấy phim của rạp được chọn
  useEffect(() => {
    if (selectedCinema) {
      setMovies([]); // Xóa danh sách phim ngay lập tức khi rạp mới được chọn

      const fetchMoviesForCinema = async () => {
        try {
          const response = await instance.get(`/cenima/${selectedCinema}`); // Sửa URL cho đúng
          if (response.data && response.data.data) {
            setMovies(response.data.data); // Lưu danh sách phim và showtimes
          } else {
            console.log("Không có phim nào trong rạp này.");
            setMovies([]); // Xóa danh sách phim nếu không có phim
          }
        } catch (error) {
          console.error("Không thể lấy phim của rạp:", error);
          setMovies([]); // Xóa danh sách phim khi gặp lỗi
        }
      };

      fetchMoviesForCinema();
    } else {
      setMovies([]); // Xóa danh sách phim khi không chọn rạp
    }
  }, [selectedCinema]);

  // Định dạng ngày
  const formatDate = (date: string) => {
    const [day, month] = date.split("/");
    const fullDate = new Date(`2024/${month}/${day}`);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return `${day}/${month} ${days[fullDate.getDay()]}`;
  };
  const selectedCinemaDetails = cinemas.find(cinema => cinema.id === selectedCinema);

  return (
    <>
      <h2 className="title">Mua vé theo rạp</h2>
      <div className="container ">
        <div className="locations">
          <h3 className="khuvuc">Khu vực</h3>
          <ul className="list-tp">
            {locations.map((location) => {
              const count = cinemas.filter(
                (cinema) => cinema.location_id === location.id
              ).length;
              return (
                <li
                  key={location.id}
                  className={`city ${
                    selectedCity === location.id ? "selected" : ""
                  }`}
                  onClick={() => setSelectedCity(location.id)}
                >
                  {location.location_name}
                  <span className="cinema-count">{count}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="cinemas">
          <h3 className="khuvuc">Rạp</h3>
          <ul className="list-tp">
            {filteredCinemas.map((cinema) => (
              <li
                key={cinema.id}
                className={`cinema ${
                  selectedCinema === cinema.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedCinema(cinema.id);
                  setSelectedDate(""); // Xóa lựa chọn ngày khi thay đổi rạp
                }}
              >
                {cinema.cinema_name}
              </li>
            ))}
          </ul>
        </div>

        <div className="showtimes">
          <div className="date-selection">
            {["19/9", "20/9", "21/9", "22/9", "23/9", "24/9", "25/9"].map(
              (date) => (
                <span
                  key={date}
                  className={`date ${selectedDate === date ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedDate(date);
                    console.log("Ngày được chọn:", date);
                  }}
                >
                  <p>{formatDate(date)}</p>
                </span>
              )
            )}
          </div>

          {/* Hiển thị danh sách phim */}
          {movies.length > 0 ? (
            <div className="movies">
              {movies.map((movie) => {
                const actor = actors.find((a) => a.id === movie.actor_id);

                return (
                  <div key={movie.id} className="movie">
                    <img src={movie.poster} alt={movie.movie_name} />
                    <div className="details">
                      <h4>{movie.movie_name}</h4>
                      <p>
                        Đạo Diễn:{" "}
                        {actor ? actor.actor_name : "Không có thông tin"}
                      </p>{" "}
                      {/* Hiển thị tên diễn viên */}
                      <p>Thời gian: {movie.duraion}</p>
                      <p>Giới hạn tuổi: {movie.age_limit}+</p>
                      <div className="showtimes-list">
          {movie.showtimes.map((showtime) => (
            <button
              key={showtime.id}
              onClick={() => {
                // Chuyển hướng và truyền thông tin qua state
                navigate('/seat', {
                  state: {
                    movieName: movie.movie_name,
                    cinemaName: selectedCinemaDetails?.cinema_name, // Thay đổi ở đây
                    showtime: showtime.showtime_start,
                  },
                });
              }}
            >
              {showtime.showtime_start.slice(0, 5)}
            </button>
          ))}
        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-showtimes">
              <p>Không có phim cho rạp này.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CinemaSelector;
