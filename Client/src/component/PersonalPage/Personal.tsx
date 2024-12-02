import React, { useEffect, useState } from 'react';
import './Personal.css'; // Import CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';
import instance from '../../server';
import { Movie } from '../../interface/Movie';
import { formatDistanceToNow } from 'date-fns'; // Thêm thư viện date-fns

const Personal: React.FC = () => {
  const [avatar, setAvatar] = useState(
    "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
  );
  const [userProfile, setUserProfile] = useState<any>(null);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [activities, setActivities] = useState<string[]>([]); // Lưu trữ hoạt động gần đây
  const [visibleActivities, setVisibleActivities] = useState<string[]>([]); // Hoạt động hiển thị
  const [showAllActivities, setShowAllActivities] = useState(false); // Trạng thái xem tất cả hoạt động

  useEffect(() => {
    const profileData = localStorage.getItem("user_profile");
    if (profileData) {
      const profile = JSON.parse(profileData);
      const userId = profile.id;

      // Lấy thông tin người dùng theo ID
      const fetchUserProfile = async () => {
        try {
          const response = await instance.get(`/user/${userId}`);
          if (response.data.success) {
            const userProfileData = response.data.user;
            setUserProfile(userProfileData);
            setAvatar(
              userProfileData.avatar ||
              "https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png"
            );
            const movies = userProfileData.favorite_movies || [];
            setFavoriteMovies(movies);

            // Thêm hoạt động yêu thích phim vào danh sách hoạt động
            const newActivities = movies.map((movie: Movie) => {
              const timeAgo = formatDistanceToNow(new Date(movie.created_at), { addSuffix: true });
              return `${userProfileData.user_name} đã yêu thích phim: ${movie.movie_name} - ${timeAgo}`;
            });
            setActivities(newActivities);
            setVisibleActivities(newActivities.slice(0, 3)); // Hiển thị 3 hoạt động đầu tiên
          }
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      };

      fetchUserProfile();
    }
  }, []);

  const handleSeeMore = () => {
    setShowAllActivities(true);
    setVisibleActivities(activities); // Hiển thị tất cả hoạt động
  };

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

          {/* <div className="moveslike">
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
</div> */}


          </div>
          <div className="moveslike">
            <h3>Phim tui thích</h3>
            <div className='phimyeuthich-container'>
              <div className="phimyeuthich ">
                {favoriteMovies.length > 0 ? (
                  favoriteMovies.map((movie) => {
                    return (
                      <div className="item-phim " key={movie.id}>
                       <div className="img">
            <img src={movie.poster || undefined} alt={movie.movie_name} />
          </div>
                        <div className="movie-title">
            <h5>{movie.movie_name}</h5>
          </div>
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
              {visibleActivities.length > 0 ? (
                visibleActivities.map((activity, index) => (
                  <div className="activity-item" key={index}>
                    <div className="activity-info">
                      <span className="activity-dot">•</span>
                      <span className="activity-text">
                        {activity}
                      </span>
                    </div>
                    {/* <span className="activity-time">{activity}</span> */}
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">Chưa có hoạt động nào.</div>
              )}
              {!showAllActivities && activities.length > 3 && (
                <div className="see-more" onClick={handleSeeMore}>
                  Xem thêm
                </div>
              )}
            </div>
          </div>
        </div>
      
      <Footer />
    </>
  );
};

export default Personal;
