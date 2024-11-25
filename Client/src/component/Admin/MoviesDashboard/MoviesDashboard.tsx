import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';  // Import các style
import { notification } from 'antd';  // Import Ant Design notification

const MoviesDashboard: React.FC = () => {
    const { state, dispatch } = useMovieContext();
    const { movies } = state;

    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);
    const [showDescription, setShowDescription] = useState<boolean>(false);
    const [showLikesViews, setShowLikesViews] = useState<boolean>(false); // State to control likes and views columns visibility

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data.original });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu phim:', error);
                setError('Không thể tải phim');
            }
        };

        fetchMovies();
    }, [dispatch]);

    const deleteMovie = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
            try {
                await instance.delete(`/movies/${id}`);
                dispatch({ type: 'DELETE_MOVIE', payload: id });
                notification.success({
                    message: 'Xóa Phim',
                    description: 'Đã xóa phim thành công!',
                    placement: 'topRight',
                });
            } catch (error) {
                console.error('Lỗi khi xóa phim:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa phim.',
                    placement: 'topRight',
                });
            }
        }
    };

    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;

    const filteredMovies = Array.isArray(movies) 
        ? movies.filter(movie => 
            movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) 
        : [];

    const currentMovies = filteredMovies.slice(indexOfFirstMovie, indexOfLastMovie);

    if (error) {
        return <p>{error}</p>;
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Handle click on image to toggle visibility of description, likes, and views
    const handleImageClick = () => {
        setShowDescription(prevState => !prevState);
        setShowLikesViews(prevState => !prevState); // Toggle the likes/views columns
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={`/admin/movies/add`} className="btn btn-outline-primary"><FontAwesomeIcon icon={faPlus} /> Thêm Phim Mới</Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control w-25"
                />
            </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover shadow-sm">
                    <thead className="thead-light">
                        <tr>
                            <th>ID</th>
                            <th>Tiêu Đề</th>
                            <th>Ảnh</th>
                            <th>Thể Loại</th>
                            <th>Diễn Viên</th>
                            <th>Đạo Diễn</th>
                            <th>Thời Lượng</th>
                            <th style={{ display: showLikesViews ? 'table-cell' : 'none' }}>Lượt Thích</th> {/* Show Likes column */}
                            <th style={{ display: showLikesViews ? 'table-cell' : 'none' }}>Lượt Xem</th> {/* Show Views column */}
                            <th style={{ display: showDescription ? 'table-cell' : 'none' }}>Mô Tả</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMovies.length > 0 ? (
                            currentMovies.map((movie: Movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td className="truncate-text" style={{ maxWidth: '150px' }}>{movie.movie_name}</td>
                                    <td>
                                        <img 
                                            src={movie.poster ?? undefined} 
                                            style={{ width: "120px", height: "180px", objectFit: 'cover' }} 
                                            alt={`${movie.movie_name} poster`} 
                                            onClick={handleImageClick} 
                                        />
                                    </td>
                                    <td>{movie.movie_category.map(movie_category => movie_category.category_name).join(', ')}</td>
                                    <td>{movie.actor.map(actor => actor.actor_name).join(', ')}</td>
                                    <td>{movie.director.map(director => director.director_name).join(', ')}</td>
                                    <td>{movie.duration}</td>
                                    <td style={{ display: showLikesViews ? 'table-cell' : 'none' }}>{movie.like}</td> {/* Show Likes */}
                                    <td style={{ display: showLikesViews ? 'table-cell' : 'none' }}>{movie.views}</td> {/* Show Views */}
                                    <td style={{ display: showDescription ? 'table-cell' : 'none' }}>
                                        <ReactQuill 
                                            value={movie.description ?? ''} 
                                            readOnly={true} 
                                            theme="snow" 
                                            modules={{ toolbar: false }} 
                                            formats={['bold', 'underline', 'link']}
                                        />
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-around">
                                            <Link to={`/admin/movies/edit/${movie.id}`} className="btn btn-warning btn-sm mr-2">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Link>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => deleteMovie(movie.id)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9}>Không có phim nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <nav className="d-flex justify-content-center mt-4">
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                            Trước
                        </button>
                    </li>
                    {Array.from({ length: Math.ceil(filteredMovies.length / moviesPerPage) }, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => paginate(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${indexOfLastMovie >= filteredMovies.length ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                            Tiếp
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default MoviesDashboard;
