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
            <div className='phimyeuthich'>
              <div className="row ">
                {favoriteMovies.length > 0 ? (
  favoriteMovies.map((movie) => {
    // Kiểm tra nếu movie.rating là số, nếu không thì sử dụng giá trị mặc định
    const ratingNumber = typeof movie.rating === 'number' ? movie.rating : 0;
    return (
      <div className="item-phim col-lg-3" key={movie.id}>
        <div className="img">
          <img src={movie.poster || undefined} alt={movie.movie_name} />
        </div>
        {/* <div className="nutlike">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00d97e"><path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z"/></svg>
          <span className='nobackground'>
            {ratingNumber ? `${(ratingNumber * 10).toFixed(0)}%` : 'Chưa có đánh giá'}
          </span>
        </div> */}
      </div>
    );
  })
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
