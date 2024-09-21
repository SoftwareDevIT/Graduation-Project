import React from 'react';
import './MoviesDashboard.css';

const MoviesDashboard = () => {
    const movies = [
        { id: 'MOV001', title: 'Inception', genre: 'Sci-Fi', duration: '148 min' },
        { id: 'MOV002', title: 'The Matrix', genre: 'Action', duration: '136 min' },
        { id: 'MOV003', title: 'Interstellar', genre: 'Sci-Fi', duration: '169 min' },
    ];


    return (
        <div className="movies-dashboard">
            <h2>Movie Management</h2>
            <div className="actions">
                <button className="add-movie-btn">Add New Movie</button>
            </div>
            <div className="table-container">
                <table className="movie-table">
                    <thead>
                        <tr>
                            <th>Movie ID</th>
                            <th>Title</th>
                            <th>Genre</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {movies.map((movie) => (
                            <tr key={movie.id}>
                                <td>{movie.id}</td>
                                <td>{movie.title}</td>
                                <td>{movie.genre}</td>
                                <td>{movie.duration}</td>
                                <td className="action-buttons">
                                    <button className="view-btn" >👁</button>
                                    <button className="edit-btn" >✏️</button>
                                    <button className="delete-btn" >🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MoviesDashboard;
