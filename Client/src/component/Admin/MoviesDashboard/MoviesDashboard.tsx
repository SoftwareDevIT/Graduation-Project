import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <Link to={`/admin/movies/add`} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                <FontAwesomeIcon icon={faPlus} /> Thêm Phim Mới
                </Link>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 w-1/4"
                />
            </div>

            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-600">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-center">ID</th>
                            <th className="px-4 py-2 text-center">Tiêu Đề</th>
                            <th className="px-4 py-2 text-center">Ảnh</th>
                            <th className="px-4 py-2 text-center">Thể Loại</th>
                            <th className="px-4 py-2 text-center">Diễn Viên</th>
                            <th className="px-4 py-2 text-center">Đạo Diễn</th>
                            <th className="px-4 py-2 text-center">Thời Lượng</th>
                            <th className="px-4 py-2 text-center" style={{ display: showLikesViews ? 'table-cell' : 'none' }}>Lượt Thích</th>
                            <th className="px-4 py-2 text-center" style={{ display: showLikesViews ? 'table-cell' : 'none' }}>Lượt Xem</th>
                            <th className="px-4 py-2 text-center" style={{ display: showDescription ? 'table-cell' : 'none' }}>Mô Tả</th>
                            <th className="px-4 py-2 text-center">Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentMovies.length > 0 ? (
                            currentMovies.map((movie: Movie) => (
                                <tr key={movie.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-center">{movie.id}</td>
                                    <td className="px-4 py-3 text-center truncate-text" style={{ maxWidth: '150px' }}>{movie.movie_name}</td>
                                    <td className="px-4 py-3 text-center">
                                        <img 
                                            src={movie.poster ?? undefined} 
                                            style={{ width: "200px", height: "180px", objectFit: 'cover' }} 
                                            alt={`${movie.movie_name} poster`} 
                                            onClick={handleImageClick} 
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">{movie.movie_category.map(movie_category => movie_category.category_name).join(', ')}</td>
                                    <td className="px-4 py-3 text-center">{movie.actor.map(actor => actor.actor_name).join(', ')}</td>
                                    <td className="px-4 py-3 text-center">{movie.director.map(director => director.director_name).join(', ')}</td>
                                    <td className="px-4 py-3 text-center">{movie.duration} phút</td>
                                    <td className="px-4 py-3 text-center" style={{ display: showLikesViews ? 'table-cell' : 'none' }}>{movie.like}</td>
                                    <td className="px-4 py-3 text-center" style={{ display: showLikesViews ? 'table-cell' : 'none' }}>{movie.views}</td>
                                    <td className="px-4 py-3 text-center" style={{ display: showDescription ? 'table-cell' : 'none' }}>
                                        <ReactQuill 
                                            value={movie.description ?? ''} 
                                            readOnly={true} 
                                            theme="snow" 
                                            modules={{ toolbar: false }} 
                                            formats={['bold', 'underline', 'link']}
                                        />
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <Link
                                                to={`/admin/movies/edit/${movie.id}`}
                                                className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center hover:bg-yellow-200 transition"
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5 h-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.439 19.274a4.5 4.5 0 01-1.691 1.074l-3.003 1.001 1.001-3.003a4.5 4.5 0 011.074-1.691L16.862 3.487z"
                                                />
                                            </svg>
                                            </Link>
                                            <button
                                                onClick={() => deleteMovie(movie.id)}
                                                className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition"
                                            >
                                               <FontAwesomeIcon icon={faTrashAlt} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center py-4">Không có phim nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-6">
                <nav className="flex space-x-2">
                    <button
                        onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                        className="px-4 py-2 border rounded-md hover:bg-gray-200"
                    >
                        Previous
                    </button>
                    {[...Array(Math.ceil(filteredMovies.length / moviesPerPage))].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => paginate(index + 1)}
                            className={`px-4 py-2 border rounded-md ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => currentPage < Math.ceil(filteredMovies.length / moviesPerPage) && setCurrentPage(currentPage + 1)}
                        className="px-4 py-2 border rounded-md hover:bg-gray-200"
                    >
                        Next
                    </button>
                </nav>
            </div>
        </div>
    );
};

export default MoviesDashboard;
