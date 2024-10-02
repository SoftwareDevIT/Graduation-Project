
import React from 'react';
import { Link } from 'react-router-dom';
import './CinemasDashboard.css'

import instance from '../../../server'; // Ensure you have the correct path
import { useCinemaContext } from '../../../Context/CinemasContext';

const CinemasDashboard: React.FC = () => {
  const { state, dispatch } = useCinemaContext();
  const { cinemas } = state;

  const handleDeleteCinema = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this cinema?")) {
      try {
        await instance.delete(`/cinema/${id}`);
        dispatch({ type: 'DELETE_CINEMA', payload: id });
        alert("Cinema deleted successfully!");
      } catch (err) {
        console.error("Failed to delete cinema:", err);
        alert("Failed to delete cinema");
      }
    }
  };

  return (
    <div className="cinemas-dashboard">
      <h2>All Cinemas</h2>
      <div className="actions">
        <Link to={'/admin/cinemas/add'} className="add-cinema-btn">Add Cinema</Link>
      </div>
      <div className="table-container">
        <table className="cinema-table">
          <thead>
            <tr>
              <th>Cinema ID</th>
              <th>Cinema Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cinemas.map((cinema) => (
              <tr key={cinema.id}>
                <td>{cinema.id}</td>
                <td>{cinema.cinema_name}</td>
                <td>{cinema.phone}</td>
                <td>{cinema.cinema_address}</td>
                <td>{cinema.status}</td>
                <td>
                  <Link to={`/admin/cinemas/edit/${cinema.id}`} className="edit-btn">Edit</Link>
                  <button onClick={() => handleDeleteCinema(cinema.id!)} className="delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default CinemasDashboard;
