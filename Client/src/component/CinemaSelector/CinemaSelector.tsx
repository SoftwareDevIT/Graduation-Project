import React, { useState, useEffect } from "react";
import instance from "../../server";
import "./CinemaSelector.css";
import { Cinema } from "../../interface/Cinema";
import { Actor } from "../../interface/Actor";
import { Movie } from "../../interface/Movie";
import { Location } from "../../interface/Location";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { ClipLoader } from "react-spinners";

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

  // Lấy ngày hiện tại theo định dạng YYYY-MM-DD
  const getCurrentDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // Định dạng YYYY-MM-DD
  };

  // Tạo danh sách ngày cho 7 ngày tiếp theo
  const generateDateList = (): string[] => {
    return Array.from({ length: 7 }, (_, i) =>
      dayjs().add(i, "day").format("YYYY-MM-DD")
    );
  };

  // Lấy danh sách vị trí, rạp, diễn viên
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await instance.get("/location");
        setLocations(response.data.data || []);
      } catch (error) {
        console.error("không có dữ liệu:", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await instance.get("/cinema");
        setCinemas(response.data.data || []);
      } catch (error) {
        console.error("không có dữ liệu:", error);
      }
    };

    const fetchActors = async () => {
      try {
        const response = await instance.get("/actor");
        // console.log("Actors response:", response);
        setActors(response.data.data || []);
      } catch (error) {
        console.error("không có dữ liệu:", error);
        setActors([]);
      }
    };


    fetchActors();
    fetchLocations();
    fetchCinemas();


    setSelectedDate(getCurrentDate());
  }, []);

  // Mặc định chọn Hà Nội
  useEffect(() => {
    if (locations.length > 0) {
      const haNoi = locations.find(
        (location) => location.location_name === "Hà Nội"
      );
      if (haNoi) {
        setSelectedCity(haNoi.id); // Mặc định chọn Hà Nội
      }
    }
  }, [locations]);

  const sortedLocations = locations
    .map((location) => ({
      ...location,
      cinemaCount: cinemas.filter((cinema) => cinema.location_id === location.id)
        .length,
    }))

    .sort((a, b) => b.cinemaCount - a.cinemaCount); // Sắp xếp giảm dần

  // Mặc định chọn Hà Nội và rạp đầu tiên của Hà Nội
  const filteredLocations = sortedLocations.filter(location =>
    cinemas.some(cinema => cinema.location_id === location.id)
  );

  useEffect(() => {
    if (selectedCity && filteredCinemas.length > 0) {
      // Chọn rạp đầu tiên
      setSelectedCinema(filteredCinemas[0].id ?? null);

      // Chọn ngày đầu tiên là ngày hiện tại
      const today = getCurrentDate();
      setSelectedDate(today);
    }
  }, [selectedCity, filteredCinemas]);

  
  useEffect(() => {
    if (selectedCity && filteredCinemas.length > 0) {
      setSelectedCinema(filteredCinemas[0].id ?? null);
    }
  }, [selectedCity, filteredCinemas]);
  // Lọc rạp theo khu vực
  useEffect(() => {
    if (selectedCity) {
      const filtered = cinemas.filter(
        (cinema) => cinema.location_id === selectedCity
      );
      setFilteredCinemas(filtered);
    } else {
      setFilteredCinemas(cinemas);
    }
  }, [selectedCity, cinemas]);

  useEffect(() => {
    const fetchMoviesForSelectedCinemaAndDate = async () => {
      if (selectedCinema && selectedDate) {
        try {

          // Gọi API lọc phim theo rạp
          const cinemaResponse = await instance.get(`/filterByDate`, {
            params: {
              cinema_id: selectedCinema,
              showtime_date: selectedDate,
            },
          });

          const cinemaMovies = cinemaResponse.data?.data || [];

          // Nếu không có phim cho rạp này
          if (cinemaMovies.length === 0) {
            setMovies([]);
            return;
          }

          // Cập nhật danh sách phim
          setMovies(cinemaMovies);
        } catch (error) {
          // console.error("Lỗi khi lấy phim cho rạp và ngày:", error);
          setMovies([]); // Xóa danh sách phim khi gặp lỗi
        } finally {

        }
      }
    };

    fetchMoviesForSelectedCinemaAndDate();
  }, [selectedCinema, selectedDate]);

  const selectedCinemaDetails = cinemas.find(
    (cinema) => cinema.id === selectedCinema
  );

  return (
    <>

      <div className="div-content">
        <h2 className="titles">Mua vé theo rạp</h2>
        <div className="container">
          <div className="locations">
            <h3 className="khuvuc">Khu vực</h3>
            <ul className="list-tp">
              <div className="list">
                {filteredLocations.map((location) => {
                  return (
                    <li
                      key={location.id}
                      className={`city ${selectedCity === location.id ? "selected" : ""}`}
                      onClick={() => setSelectedCity(location.id)}
                    >
                      {location.location_name}
                      <span className="cinema-count">{location.cinemaCount}</span>
                    </li>
                  );
                })}
              </div>
              <select
                className="city-selects"
                value={selectedCity ?? ""}
                onChange={(e) => setSelectedCity(Number(e.target.value))}
              >
                <option className="city-selects-option" value="">Chọn khu vực</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.location_name}
                  </option>
                ))}
              </select>
            </ul>
          </div>

          <div className="cinemas">
            <h3 className="khuvuc">Rạp</h3>
            <ul className="list-tp">
              {filteredCinemas.map((cinema) => (
                <li
                  key={cinema.id}
                  className={`cinema ${selectedCinema === cinema.id ? "selected" : ""
                    }`}
                  onClick={() => {
                    setSelectedCinema(cinema.id ?? null);
                  }}
                >
                  {cinema.cinema_name}
                </li>
              ))}
            </ul>
          </div>

          <div className="showtimes">
            <div className="calendar-custom-1">
              {generateDateList().map((date) => (
                <div
                  key={date}
                  className={`date-custom-1 ${selectedDate === date ? "active" : ""}`}
                  onClick={() => {
                    setSelectedDate(date);
                    console.log("Ngày được chọn:", date);
                  }}
                >
                  <span>{dayjs(date).format("DD/MM")}</span>
                  <small>
                    {dayjs(date).day() === 0
                      ? "CN"
                      : `Thứ ${dayjs(date).day() + 1}`}
                  </small>
                </div>
              ))}
            </div>


            {/* Hiển thị danh sách phim */}
            {movies.length > 0 ? (
              <div className="movies">
                {movies.map((movieData) => {
                  const movie = movieData.movie;

                  let actor;
                  if (Array.isArray(actors)) {
                    actor = actors.find((a) => a.id === movie.id);
                  } else {
                    console.error("Actors is not an array:", actors);
                  }

                  // Sắp xếp showtimes theo giờ chiếu (theo showtime_start)
                  const sortedShowtimes = movieData.showtimes.sort((a: any, b: any) => {
                    const timeA = dayjs(`${selectedDate} ${a.showtime_start}`, "YYYY-MM-DD HH:mm");
                    const timeB = dayjs(`${selectedDate} ${b.showtime_start}`, "YYYY-MM-DD HH:mm");
                    return timeA.isBefore(timeB) ? -1 : 1;
                  });

                  return (
                    <div key={movie.id} className="movie">
                      <img src={movie.poster ?? undefined} alt={movie.movie_name} />
                      <div className="details">
                        <h4>{movie.movie_name}</h4>
                        <p>Đạo Diễn: {actor?.actor_name}</p>
                        <p>Thời gian: {movie.duration}</p>
                        <p>Giới hạn tuổi: {movie.age_limit}+</p>
                        <div className="showtimes-list">
                          {sortedShowtimes.length > 0 ? (
                            sortedShowtimes.map((showtime: any) => {
                              const showtimeDateTime = dayjs(`${selectedDate} ${showtime.showtime_start}`, "YYYY-MM-DD HH:mm");
                              const isPastShowtime = showtimeDateTime.isBefore(dayjs());

                              return (
                                <button
                                  key={showtime.id}
                                  disabled={isPastShowtime} // Vô hiệu hóa nút nếu suất chiếu đã qua
                                  onClick={() => {
                                    if (!isPastShowtime) {
                                      navigate("/seat", {
                                        state: {
                                          movieName: movie.movie_name,
                                          cinemaName: selectedCinemaDetails?.cinema_name,
                                          showtime: showtime.showtime_start,
                                          showtimeId: showtime.id,
                                          cinemaId: selectedCinemaDetails?.id,
                                          price: showtime.price,
                                          roomId: showtime.room_id
                                        },
                                      });
                                    }
                                  }}
                                  style={{
                                    cursor: isPastShowtime ? "not-allowed" : "pointer",
                                    color: isPastShowtime ? "gray" : "black"
                                  }}
                                >
                                  {showtime.showtime_start.slice(0, 5)}
                                  <p> {`${showtime.price / 1000}k`}</p>
                                </button>
                              );
                            })
                          ) : (
                            <p>Không có suất chiếu cho ngày này</p>
                          )}
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
      </div>


    </>
  );
};

export default CinemaSelector;
