// MoviesDashboard.tsx
import React from 'react';
import './MoviesDashboard.css';

import { Link } from 'react-router-dom';

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


import './MoviesDashboard.css';
import { Movie } from '../../../interface/Movie';
import instance from '../../../server';


const MoviesDashboard: React.FC = () => {
  const { state, deleteMovie } = useMoviesContext();
  const { movies } = state;

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      await deleteMovie(id);
    }
  };

  return (
    <div className="movies-dashboard">
      <h2>Movie Management</h2>
      <div className="actions">
        <Link to="/admin/movies/add" className="add-movie-btn">Add New Movie</Link>
      </div>
      <div className="table-container">
        <table className="movie-table">
          <thead>
            <tr>
              <th>Movie ID</th>
              <th>Title</th>
              <th>Poster</th>
              <th>Category ID</th>
              <th>Actor ID</th>
              <th>Director ID</th>
              <th>Duration</th>
              <th>Release Date</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>{movie.movie_name}</td>
                  <td>
                    {movie.poster ? (
                      <img src={movie.poster} alt={movie.movie_name} className="movie-poster" />
                    ) : (
                      <span>No Poster Available</span>
                    )}
                  </td>
                  <td>{movie.movie_category_id}</td>
                  <td>{movie.actor_id}</td>
                  <td>{movie.director_id}</td>
                  <td>{movie.duraion}</td>
                  <td>{movie.release_date}</td>
                  <td>{movie.description}</td>
                  <td>
                    <Link to={`/admin/movies/edit/${movie.id}`} className="edit-btn">Edit</Link>
                    <button onClick={() => handleDelete(movie.id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>No movies found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );


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

                        {Array.isArray(movies) && movies.length > 0 ? (
                            movies.map((movie) => (
                                <tr key={movie.id}>
                                    <td>{movie.id}</td>
                                    <td>{movie.movie_name}</td> {/* Adjust to match your interface */}
                                    <td>{movie.movie_category_id}</td> {/* Replace with genre if needed */}

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

                                <td colSpan={5}>No movies available</td>

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
