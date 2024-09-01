import React, { useState } from "react";
import "./CinemaSelector.css";

function CinemaSelector() {
  // Đặt mặc định selectedCity là "TP. Hồ Chí Minh"
  const [selectedCity, setSelectedCity] = useState<string>("TP. Hồ Chí Minh");
  const [selectedCinema, setSelectedCinema] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("30/8");

  // Đối tượng chứa thông tin các rạp theo thành phố
  const cinemasByCity: { [key: string]: string[] } = {
    "TP. Hồ Chí Minh": [
      "BHD Star Cineplex 3/2",
      "CGV Crescent Mall",
      "Galaxy Nguyễn Du",
      "Lotte Cinema Cộng Hòa",
      "Cinestar Quốc Thanh",
      "Mega GS Cao Thắng",
      "BHD Star Phạm Hùng",
      "Lotte Cinema Nam Sài Gòn",
      "CGV Pandora City",
      "Galaxy Kinh Dương Vương",
    ],
    "Hà Nội": [
      "BETA Thanh Xuân",
      "BETA Mỹ Đình",
      "CGV Tràng Tiền Plaza",
      "CGV Vincom Bà Triệu",
      "Lotte Cinema Hà Đông",
      "Galaxy Mipec Long Biên",
      "Lotte Cinema Keangnam",
      "Platinum Royal City",
      "Platinum Times City",
      "Lotte Cinema Long Biên",
    ],
    "Bình Dương": [
      "CGV Aeon Canary",
      "BHD Star Bình Dương",
      "Galaxy Bình Dương",
      "Cinestar Bình Dương",
      "Lotte Cinema Bình Dương",
      "Mega GS Bình Dương",
      "CGV Becamex Bình Dương",
      "Beta Bình Dương",
      "CGV Dĩ An",
      "Galaxy Bến Cát",
    ],
  };

  // Thông tin các phim và suất chiếu theo rạp và ngày
  const showtimesByCinemaAndDate: {
    [key: string]: {
      [key: string]: { movie: string; director: string; duration: string; genre: string; times: string[] }[];
    };
  } = {
    "BHD Star Cineplex 3/2": {
      "2/9": [
        {
          movie: "Ma Da",
          director: "Đinh Tuấn Vũ",
          duration: "120 phút",
          genre: "Kinh dị",
          times: ["12:45", "15:30", "18:45", "21:00"],
        },
        {
          movie: "Lật Mặt 6",
          director: "Lý Hải",
          duration: "130 phút",
          genre: "Hành động",
          times: ["11:00", "14:00", "17:00", "20:00"],
        },
        {
          movie: "Thiên Thần Hộ Mệnh",
          director: "Victor Vũ",
          duration: "115 phút",
          genre: "Tâm lý",
          times: ["10:30", "13:30", "16:30", "19:30"],
        },
      ],
      "3/9": [
        {
          movie: "Ma Da",
          director: "Đinh Tuấn Vũ",
          duration: "120 phút",
          genre: "Kinh dị",
          times: ["13:00", "16:00", "19:00", "22:00"],
        },
        {
          movie: "Lật Mặt 6",
          director: "Lý Hải",
          duration: "130 phút",
          genre: "Hành động",
          times: ["12:00", "15:00", "18:00", "21:00"],
        },
        {
          movie: "Thiên Thần Hộ Mệnh",
          director: "Victor Vũ",
          duration: "115 phút",
          genre: "Tâm lý",
          times: ["11:30", "14:30", "17:30", "20:30"],
        },
      ],
    },
    // Thêm thông tin cho các rạp khác và ngày khác tương tự
  };

  // Hàm để xử lý sự kiện khi bấm vào một thành phố
  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setSelectedCinema(null); // Reset rạp đã chọn khi thay đổi thành phố
  };

  // Hàm xử lý khi chọn rạp
  const handleCinemaClick = (cinema: string) => {
    setSelectedCinema(cinema);
  };

  // Hàm xử lý khi chọn ngày
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // Danh sách rạp hiện tại dựa trên thành phố được chọn
  const currentCinemas = selectedCity ? cinemasByCity[selectedCity] : [];

  // Danh sách suất chiếu hiện tại dựa trên rạp và ngày được chọn
  const currentShowtimes =
    selectedCinema && showtimesByCinemaAndDate[selectedCinema]
      ? showtimesByCinemaAndDate[selectedCinema][selectedDate] || []
      : [];

  return (
    <>
      <h2 className="title">Mua vé theo rạp</h2>
      <div className="container">
        <div className="locations">
          <h3 className="khuvuc">Khu vực</h3>
          <ul className="list-tp">
            {Object.keys(cinemasByCity).map((city) => (
              <li
                key={city}
                className={`city ${selectedCity === city ? "selected" : ""}`}
                onClick={() => handleCityClick(city)}
              >
                {city}
              </li>
            ))}
          </ul>
        </div>

        <div className="cinemas">
          <h3 className="khuvuc">Rạp</h3>
          <ul className="list-tp">
            {currentCinemas.map((cinema) => (
              <li
                key={cinema}
                className={`cinema ${selectedCinema === cinema ? "selected" : ""}`}
                onClick={() => handleCinemaClick(cinema)}
              >
                {cinema}
              </li>
            ))}
          </ul>
        </div>

        <div className="showtimes">
        <div className="date-selection">
  {[ "2/9","3/9","4/9","5/9","6/9","7/9","8/9"].map((date) => {
    const fullDate = new Date(`2024/${date.split("/")[1]}/${date.split("/")[0]}`);
    const dayOfWeek = fullDate.getDay(); // Lấy ngày trong tuần (0: Chủ Nhật, 1: Thứ Hai, ..., 6: Thứ Bảy)
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]; // Mảng các thứ trong tuần

    return (
      <span
        key={date}
        className={`date ${selectedDate === date ? "selected" : ""}`}
        onClick={() => handleDateClick(date)}
      >
        <p>{date}</p>
        <p>{days[dayOfWeek]}</p> {/* Hiển thị thứ */}
      </span>
    );
  })}
</div>
          {currentShowtimes.length > 0 ? (
            <div className="movies">
               <div className="no-showtimes">
              <p>Nhấn vào suất chiếu để tiến hành mua vé.</p>
            </div>
              {currentShowtimes.map((showtime, index) => (
                <div key={index} className="movie">
                  <img src="https://cdn.moveek.com/storage/media/cache/mini/6684d276139ad087720074.jpg" alt="Movie Poster" />
                  <div className="details">
                    <h4>{showtime.movie}</h4>
                    <p>Đạo diễn: {showtime.director}</p>
                    <p>Thời gian: {showtime.duration}</p>
                    <p>Thể loại: {showtime.genre}</p>
                    <div className="showtimes-list">
                      {showtime.times.map((time) => (
                        <button key={time}>{time}</button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
}

export default CinemaSelector;
