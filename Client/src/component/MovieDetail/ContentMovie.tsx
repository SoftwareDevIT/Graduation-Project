import React, { useEffect, useState } from 'react';
import './MovieDetail.css';
import './ContentMovie.css';
import MovieDetail from './MovieDetail';
import Footer from '../Footer/Footer';
import { useParams } from 'react-router-dom';  // Import useParams
import instance from '../../server'; // Ensure you import the API instance correctly
import { Movie } from '../../interface/Movie'; // Import Movie interface
import { Location } from '../../interface/Location'; // Import Location interface

interface Props {}

export const ContentMovie = (props: Props) => {
    const { id } = useParams(); // Get the movieId from the route parameter
    const movieId = id ? parseInt(id) : null; // Parse the id to an integer
    const [ratings, setRatings] = useState<any[]>([]);  // State để lưu danh sách đánh giá
    const [movie, setMovie] = useState<Movie | null>(null); // Initialize state for the movie
    const [locations, setLocations] = useState<Location[]>([]); // Initialize state for locations
    const [selectedLocation, setSelectedLocation] = useState<string>(''); // Initialize state for the selected location
    const [relatedPosts, setRelatedPosts] = useState<any[]>([]); // Initialize state for related posts
    const [loading, setLoading] = useState<boolean>(true);  // Trạng thái tải
    const [error, setError] = useState<string | null>(null);  // Trạng thái lỗi
    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (movieId) {
                try {
                    const response = await instance.get(`/movies/${movieId}`); // Fetch movie details
                    setMovie(response.data.data.original); // Store the movie data in state
                } catch (error) {
                    console.error("Error fetching movie details:", error);
                }
            }
        };

        fetchMovieDetails(); // Fetch movie details when movieId changes
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
    useEffect(() => {
        if (id) {
            setLoading(true);
            instance
                .get(`/ratings/${id}`)  // Thay đổi từ fetch thành instance.get
                .then((response) => {
                    if (response.data.status) {
                        setRatings(response.data.data);  // Lưu đánh giá vào state
                    } else {
                        setError("Không có đánh giá cho phim này.");
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        } else {
            setError("ID phim không tồn tại.");
            setLoading(false);
        }
    }, [id]);
    useEffect(() => {
        const fetchRelatedPosts = async () => {
            if (movieId) {
                try {
                    const response = await instance.get(`/filterNewByMovie/${movieId}`); // Fetch related posts by movieId
                    if (response.data?.status) {
                        setRelatedPosts(response.data.data); // Store related posts in state
                    }
                } catch (error) {
                    console.error("Error fetching related posts:", error);
                }
            }
        };

        fetchRelatedPosts(); // Fetch related posts when movieId is available
    }, [movieId]);

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
                            {relatedPosts.map((post) => (
                                <div className="post" key={post.id}>
                                    <img
                                        src={post.thumnail}
                                        alt={post.title}
                                        className="post-image"
                                    />
                                    <div className="post-info">
                                        <a href="#" className="post-title">{post.title}</a>
                                        <p className="post-meta">Đánh giá phim • miduynph • 6 ngày trước</p>
                                        <p className="post-meta-2">{post.content.slice(0, 150)}...</p> {/* Display a truncated version of the content */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="community-section">
                            <h3>Cộng đồng</h3>

                            {/* Lặp qua danh sách đánh giá và hiển thị */}
                            {ratings.length > 0 ? (
                                ratings.map((rating) => (
                                    <div className="comment" key={rating.id}>
                                        <p className="comment-user">
                                            <i className="fas fa-user-circle avatar-icon"></i>
                                            <strong>{rating.user_name}</strong>
                                            <span className="comment-rating">⭐ {rating.rating}</span> • {new Date(rating.created_at).toLocaleDateString()}
                                        </p>
                                        <p className="comment-text">
                                            {rating.review || "Không có nội dung đánh giá."}
                                        </p>
                                        <div className="comment-actions">
                                            <button className="like-btn">👍</button>
                                            <button className="dislike-btn">👎</button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có đánh giá nào cho phim này.</p>
                            )}
                        </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
