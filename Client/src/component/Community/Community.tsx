import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import styles from "./Community.module.css";
import Header from "../Header/Hearder";
import Footer from "../Footer/Footer";

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
}

const Community: React.FC = () => {
  const movies: Movie[] = [
    { id: 1, title: "Ngày Xưa Có Chuyện Tình", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 2, title: "Sắc Màu Của Cảm Xúc", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a00a280dc938409480.jpg" },
    { id: 3, title: "Học Viện Anh Hùng", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 4, title: "Venom: Kẻo Cuối", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 5, title: "Phim Điện Ảnh Conan", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 6, title: "Wicked", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 7, title: "Robot Hoang Dã", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
    { id: 8, title: "Red One: Mặt Nạ", imageUrl: "https://cdn.moveek.com/storage/media/cache/short/6728a8914c92e872274843.jpg" },
  ];

  return (
    <>
      <Header />
      <div className={styles.communityContainer}>
        <h2 className={styles.heading}>Thịnh hành</h2>
        <p className={styles.subheading}>Các phim được yêu thích trong tuần</p>
        <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} >
              <img src={movie.imageUrl} alt={movie.title} className={styles.movieImage} />
              <div className={styles.overlay}>
                <i className={`${styles.heartIcon} fas fa-heart`}></i>
              </div>
              <p>{movie.title}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </>
  );
};

export default Community;