import React, { useState, useEffect } from "react";
import instance from "../../server";
import "./CinemaSelector.css"; // Import the CSS file

interface Location {
  id: number;
  location_name: string;
}

interface Cinema {
  id: number;
  cinema_name: string;
  phone: string;
  location_id: number;
  cinema_address: string;
  status: string;
}

interface Movie {
  id: number;
  movie_name: string;
  poster: string;
  duration: string;
  release_date: string;
  age_limit: number;
  description: string;
  trailer: string;
  status: string;
}

interface Showtime {
  id: number;
  movie_id: number;
  room_id: number;
  showtime_date: string;
  showtime_start: string;
  showtime_end: string;
  status: string;
  cinema_id?: number;
}

interface Room {
  id: number;
  cinema_id: number;
}

const CinemaSelector: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [filteredCinemas, setFilteredCinemas] = useState<Cinema[]>([]);
  const [filteredShowtimes, setFilteredShowtimes] = useState<Showtime[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await instance.get("/location");
        setLocations(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    const fetchCinemas = async () => {
      try {
        const response = await instance.get("/cinema");
        setCinemas(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch cinemas:", error);
      }
    };

    const fetchMovies = async () => {
      try {
        const response = await instance.get("/movies");
        setMovies(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      }
    };

    const fetchShowtimes = async () => {
      try {
        const response = await instance.get("/showtimes");
        setShowtimes(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch showtimes:", error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await instance.get("/room");
        setRooms(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    fetchLocations();
    fetchCinemas();
    fetchMovies();
    fetchShowtimes();
    fetchRooms();
  }, []);

  useEffect(() => {
    if (selectedCity) {
      setFilteredCinemas(cinemas.filter((cinema) => cinema.location_id === selectedCity));
    } else {
      setFilteredCinemas(cinemas);
    }
  }, [selectedCity, cinemas]);

  useEffect(() => {
    console.log("Selected cinema:", selectedCinema);
    console.log("Selected date:", selectedDate);

    if (selectedCinema) {
      // Lọc showtimes theo rạp
      const filteredShowtimesByCinema = showtimes.filter(
        (showtime) =>
          showtime.cinema_id === selectedCinema && (selectedDate ? showtime.showtime_date === selectedDate : true)
      );

      setFilteredShowtimes(filteredShowtimesByCinema);
    } else {
      console.log("No cinema selected, clearing showtimes");
      setFilteredShowtimes([]);
    }
  }, [selectedCinema, selectedDate, showtimes]);

  const formatDate = (date: string) => {
    const [day, month] = date.split("/");
    const fullDate = new Date(`2024/${month}/${day}`);
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return `${day}/${month} ${days[fullDate.getDay()]}`;
  };

  return (
    <>
      <h2 className="title">Mua vé theo rạp</h2>
      <div className="container">
        <div className="locations">
          <h3 className="khuvuc">Khu vực</h3>
          <ul className="list-tp">
            {locations.map((location) => {
              const count = cinemas.filter((cinema) => cinema.location_id === location.id).length;
              return (
                <li
                  key={location.id}
                  className={`city ${selectedCity === location.id ? "selected" : ""}`}
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
                className={`cinema ${selectedCinema === cinema.id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedCinema(cinema.id);
                  setSelectedDate(""); // Clear date selection when changing cinema
                }}
              >
                {cinema.cinema_name}
              </li>
            ))}
          </ul>
        </div>

        <div className="showtimes">
          <div className="date-selection">
            {["2/9", "3/9", "4/9", "5/9", "6/9", "7/9", "8/9"].map((date) => (
              <span
                key={date}
                className={`date ${selectedDate === date ? "selected" : ""}`}
                onClick={() => {
                  setSelectedDate(date);
                  console.log("Date selected:", date); // Log selected date
                }}
              >
                <p>{formatDate(date)}</p>
              </span>
            ))}
          </div>
          {filteredShowtimes.length > 0 ? (
            <div className="movies">
              <div className="no-showtimes">
                <p>Nhấn vào suất chiếu để tiến hành mua vé.</p>
              </div>
              {filteredShowtimes.map((showtime) => {
                const movie = movies.find((m) => m.id === showtime.movie_id);
                return movie ? (
                  <div key={showtime.id} className="movie">
                    <img src={movie.poster} alt={movie.movie_name} />
                    <div className="details">
                      <h4>{movie.movie_name}</h4>
                      <p>Thời gian: {movie.duration}</p>
                      <p>Thể loại: {movie.age_limit}+</p>
                      <div className="showtimes-list">
                        <button>{showtime.showtime_start}</button>
                      </div>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div className="no-showtimes">
              <p>Không có suất chiếu cho ngày này.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CinemaSelector;
