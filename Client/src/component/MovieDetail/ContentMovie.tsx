import React, { useEffect, useState } from 'react';
import './MovieDetail.css';
import './ContentMovie.css';
import MovieDetail from './MovieDetail';
import Footer from '../Footer/Footer';
import { useLocation } from 'react-router-dom';
import instance from '../../server'; // Ensure you import the API instance correctly
import { Movie } from '../../interface/Movie'; // Import Movie interface
import { Location } from '../../interface/Location'; // Import Location interface

interface Props {}

export const ContentMovie = (props: Props) => {
    const location = useLocation();
    const movieId = location.state?.movieId; // Get the movieId from the location state

    const [movie, setMovie] = useState<Movie | null>(null); // Initialize state for the movie
    const [locations, setLocations] = useState<Location[]>([]); // Initialize state for locations
    const [selectedLocation, setSelectedLocation] = useState<string>(''); // Initialize state for the selected location

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await instance.get(`/movies/${movieId}`); // Fetch movie details
                setMovie(response.data.data.original); // Store the movie data in state
            } catch (error) {
                console.error("Error fetching movie details:", error);
            }
        };

        if (movieId) {
            fetchMovieDetails();
        }
    }, [movieId]); // Fetch movie details when movieId changes

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await instance.get('/location'); // Fetch locations from the API
                setLocations(response.data?.data || []); // Store locations in state
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations(); // Fetch locations when the component mounts
    }, []);

    // Handle location change
    const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLocation(e.target.value); // Update selected location
    };

    if (!movie) {
        return <div>Đang tải thông tin phim...</div>; // Show loading message if movie data is not yet available
    }

    return (
        <div>
            <MovieDetail />
            <div className="content">
                <div className="container content-1">
                    <div className="video-section">
                        <iframe
                            width="735px"
                            height="400"
                            src={movie?.trailer || 'https://www.youtube.com/embed/defaultVideo'}
                            title={movie?.movie_name || "Movie Trailer"}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Select location and view schedule */}
                    <div className="schedule-section">
                        <h3>Lịch chiếu</h3>
                        <p>Chọn khu vực bạn muốn xem lịch chiếu cho phim <strong>{movie.movie_name}</strong>.</p>

                        <div className="schedule-actions">
                            <select
                                className="city-select"
                                value={selectedLocation}
                                onChange={handleLocationChange}
                            >
                                {locations.map((location) => (
                                    <option key={location.id} value={location.id.toString()}>
                                        {location.location_name}
                                    </option>
                                ))}
                            </select>
                            <button className="button xem-lich-chieu">Xem lịch chiếu</button>
                        </div>
                    </div>

                    {/* Related posts section */}
                    <div className="title-2">
                                <h3>Bài viết liên quan</h3>
                            </div>
                            <div className="related-posts">


                                <div className="newcontent">
                                    <div className="post">
                                        <img
                                            src="https://cdn-i.vtcnews.vn/resize/th/upload/2021/08/04/hinhanh0-07010768.jpg"
                                            alt="Transformers Review"
                                            className="post-image"
                                        />
                                        <div className="post-info">
                                            <a href="#" className="post-title">Review Transformers Một – Hoành tráng và bùng nổ hơn cả kỳ vọng</a>
                                            <p className="post-meta">Đánh giá phim • miduynph • 6 ngày trước</p>
                                            <p className="post-meta-2">Khác với trailer không mấy hấp dẫn thì bộ phim Transformers Một (Transformers One) lại mang đến điều ngược lại.</p>
                                        </div>
                                    </div>
                                    <div className="post">
                                        <img
                                            src="https://i.vietgiaitri.com/2019/5/10/vu-tru-dien-anh-marvel-da-ton-tai-mot-sieu-anh-hung-la-gay-nhung-103fd0.jpg"
                                            alt="8 Phim Hoạt Hình Đáng Mong Đợi"
                                            className="post-image"
                                        />
                                        <div className="post-info">
                                            <a href="#" className="post-title">8 Phim hoạt hình đáng mong đợi nhất nửa cuối năm 2024</a>
                                            <p className="post-meta">linhhuynh0257 • 2 tháng trước</p>
                                            <p className="post-meta-2">Hàng loạt những phim hoạt hình đáng chú ý sẽ ra mắt vào thời điểm nửa cuối năm 2024 này. Liệu có bộ phim nào có thể đạt được thành tích mà Inside Out 2 đã làm được hay không?</p>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="community-section">
                                <h3>Cộng đồng</h3>
                                <div className="comment">
                                    <p className="comment-user"><strong>VoDucTri744</strong> <span className="comment-rating">⭐ 8</span> • 4 ngày trước</p>
                                    <p className="comment-text">
                                        Lồng tiếng ok, hài hước còn lại nội dung nhưng do t chưa hiểu câu chuyện về TPM lắm nên chủ yếu lồng tiếng có ảnh KMT, QNT vs đặc biệt là CP nên sr sr.
                                    </p>
                                    <div className="comment-actions">
                                        <button className="like-btn">👍</button>
                                        <button className="dislike-btn">👎</button>
                                    </div>
                                </div>
                                <div className="comment">
                                    <p className="comment-user"><strong>VoDucTri744</strong> <span className="comment-rating">⭐ 8</span> • 4 ngày trước</p>
                                    <p className="comment-text">
                                        Lồng tiếng ok, hài hước còn lại nội dung nhưng do t chưa hiểu câu chuyện về TPM lắm nên chủ yếu lồng tiếng có ảnh KMT, QNT vs đặc biệt là CP nên sr sr.
                                    </p>
                                    <div className="comment-actions">
                                        <button className="like-btn">👍</button>
                                        <button className="dislike-btn">👎</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <Footer/>
            </div>
        )
    }