import React, { useEffect, useState } from 'react';
import './Personal.css'; // Import CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import instance from '../../server';
import { Movie } from '../../interface/Movie';


const Personal: React.FC = () => {
  const [avatar, setAvatar] = useState(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
  const [userProfile, setUserProfile] = useState<any>(null);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      // Lấy thông tin người dùng theo ID
      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          console.log(response.data); // In ra phản hồi từ API
          if (response.data.status) {
            const userProfileData = response.data.data;

            setUserProfile(userProfileData);
            setAvatar(
              userProfileData.avatar ||
              "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
            );
            setFavoriteMovies(userProfileData.favorite_movies || []);
            console.log(userProfileData.favorite_movies);
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };

      fetchUserProfile();
    } else {
      console.log("Không có dữ liệu trong localStorage cho 'user_profile'.");
    }
  }, []);

  return (
    <>
      <Header />
      <div className='main-content'>
        <div className="container">
          <div className="cardacounnt">
            <div className="cover">
              <img id="placeholder-cover" src="https://cdn.moveek.com/bundles/ornweb/img/no-cover.png" className="cover-img" alt="cover" />
            </div>
            <div className="acounntone">
              <div className='avatas'>
                <img src={avatar} alt="avatar" />
              </div>
              <div className='nameacount'>
                <h3>{userProfile?.user_name || "No name"}</h3>
              </div>
            </div>
          </div>

          <div className="moveslike">
            <h3>Phim tui thích</h3>
            <div className="phimyeuthich-container">
  <div className="phimyeuthich">
    {favoriteMovies.length > 0 ? (
      favoriteMovies.map((movie) => (
        <div className="item-phim" key={movie.id}>
          <div className="img">
            <img src={movie.poster || undefined} alt={movie.movie_name} />
          </div>
          <div className="movie-title">
            <h5>{movie.movie_name}</h5>
          </div>
        </div>
      ))
    ) : (
      <div className="col-12 text-center">Chưa có phim yêu thích nào.</div>
    )}
  </div>
</div>


          </div>

          <div className='activities'>
            <h4 className='text-center'>Hoạt động gần đây</h4>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-info">
                  <span className="activity-dot">•</span>
                  <span className="activity-text">
                    <strong>{userProfile?.user_name}</strong> đã thích <strong>Transformers Một</strong>
                  </span>
                </div>
                <span className="activity-time">42 phút trước</span>
              </div>
              <div className="activity-item">
                <div className="activity-info">
                  <span className="activity-dot">•</span>
                  <span className="activity-text">
                    <strong>{userProfile?.user_name}</strong> đã thích <strong>CẤM</strong>
                  </span>
                </div>
                <span className="activity-time">43 phút trước</span>
              </div>
              <div className="activity-item">
                <div className="activity-info">
                  <span className="activity-dot">•</span>
                  <span className="activity-text">
                    <strong>{userProfile?.user_name}</strong> đã thích <strong>Joker 2: Điên Có Đôi</strong>
                  </span>
                </div>
                <span className="activity-time">43 phút trước</span>
              </div>
              <div className="see-more">Xem thêm</div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Personal;
