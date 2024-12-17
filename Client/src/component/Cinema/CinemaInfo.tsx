import React, { useState } from 'react';
import './CinemaInfo.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';

const ThongTinRap = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0]
      ); // Default: Current Date

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
      <Header />
      <div className="rap-container">
        <div className="rap-header">
          <img
            src="https://via.placeholder.com/60"
            alt="Logo Đống Đa"
            className="rap-logo"
          />
          <div className="rap-chi-tiet">
            <h1 className="rap-ten">Đống Đa</h1>
            <p className="rap-dia-chi">890 Trần Hưng Đạo, Quận 5, Tp. Hồ Chí Minh</p>
            <div className="rap-hanh-dong">
              <span className="hanh-dong-item">📍 Bản đồ</span>
              <span className="hanh-dong-item">📍 Tp. Hồ Chí Minh</span>
              <span className="hanh-dong-item">☰ Đống Đa Cinema</span>
            </div>
          </div>
        </div>
        <div className="rap-mo-ta">
          <p>
            Lịch chiếu phim Đống Đa - Lịch chiếu rạp toàn quốc đầy đủ & tiện lợi nhất tại Moveek.
            Rạp Đống Đa là 1 trong những cụm rạp lâu đời nhất của Sài Gòn. Hiện Đống Đa đã được
            nâng cấp với tên gọi mới <b>DDcinema</b> mang đến trải nghiệm điện ảnh tốt hơn với giá vé rất cạnh tranh.
          </p>
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
          <div className="thong-baooo">
  <span>ℹ️ Nhấn vào suất chiếu để tiến hành mua vé</span>
</div>


        <div className="lich-phim">
          <div className="phim-item">
            <img
              className="phim-anh"
              src="https://cdn.moveek.com/storage/media/cache/mini/66bc894c557c5445753964.jpg"
              alt="Kraven"
            />
            <div className="phim-chi-tiet">
              <h3>TKraven Thợ Săn Thủ Lĩnh</h3>
              <p className="phim-phu">Kraven the Hunter · T18 ·| Trailer</p>
              <div className="phim-ngon-ngu">Phụ đề tiếng Việt</div>
              <div className="phim-thoi-gian">
                {["13:05", "14:10", "15:10", "17:15", "19:20", "21:25"].map((gio, i) => (
                  <div key={i} className="thoi-gian-item">
                    <span className="gio">{gio}</span>
                    <span className="gia">45K</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ThongTinRap;
