import React, { useState, useEffect } from 'react';
import './MoviesDashboard.css';
import { Movie } from '../../../interface/Movie';
import instance from '../../../server';
import ReactPaginate from 'react-paginate';

const MoviesDashboard: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const itemsPerPage = 5; // Số lượng phim trên mỗi trang
    const [currentPage, setCurrentPage] = useState(0);

    // Fetch movies from the API when the component mounts
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await instance.get('/movies');
                console.log('API Response:', response.data);

                if (Array.isArray(response.data.data)) {
                    setMovies(response.data.data);
                } else {
                    console.error('Unexpected response format', response.data);
                    setError('Failed to fetch movies: Unexpected response format');
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to fetch movies');
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const pageCount = Math.ceil(movies.length / itemsPerPage);
    const handlePageClick = (data: { selected: number }) => {
        setCurrentPage(data.selected);
    };

    const currentMovies = movies.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="movies-dashboard">
            <h2>Quản Lý Phim</h2>
            <div className="actions">
                <button className="add-movie-btn">Thêm Phim Mới</button>
            </div>
            <div className="table-container">
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>ID Phim</th>
                            <th>Tên Phim</th>
                            <th>Thể Loại</th>
                            <th>Thời Gian</th>
                            <th>Hành Động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(currentMovies) && currentMovies.length > 0 ? (
                            currentMovies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>{movie.movie_name}</td>
                                    <td>{movie.movie_category_id}</td> {/* Thay thế nếu cần */}
                                    <td>{movie.duraion}</td>
                                    <td className="action-buttons">
                                        <button className="view-btn">👁</button>
                                        <button className="edit-btn">✏️</button>
                                        <button className="delete-btn">🗑</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>Không có phim nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    );
};

export default MoviesDashboard;
