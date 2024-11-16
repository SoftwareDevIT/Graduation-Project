import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import instance from '../../../server';
import { CinemaRoom } from '../../../interface/Room';

const RoomDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<CinemaRoom[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<CinemaRoom[]>([]);
  const roomsPerPage = 11; // Number of rooms per page

  useEffect(() => {
    // Fetch rooms from the API
    const fetchRooms = async () => {
      try {
        const response = await instance.get('/room');
        setRooms(response.data.data);
        setFilteredRooms(response.data.data); // Initialize filtered rooms with all rooms
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  useEffect(() => {
    // Filter rooms based on the search term
    const filtered = rooms.filter((room) =>
      room.room_name.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
    setFilteredRooms(filtered);
    setCurrentPage(1); // Reset to first page when search term changes
  }, [searchTerm, rooms]);

  const totalRooms = filteredRooms.length;
  const totalPages = Math.ceil(totalRooms / roomsPerPage);

  // Get rooms for the current page
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage
  );

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (confirmDelete) {
      try {
        await instance.delete(`/room/${id}`);
        setRooms(rooms.filter(room => room.id !== id)); // Update the state after deletion
        setFilteredRooms(filteredRooms.filter(room => room.id !== id)); // Update the filtered list
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Generate pagination range (up to 5 pages)
  const paginationRange = () => {
    const range = [];
    const maxPagesToShow = 5;
    const halfMax = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - halfMax);
      const end = Math.min(totalPages, currentPage + halfMax);

      if (start > 1) range.push(1);
      if (start > 2) range.push('...');

      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      if (end < totalPages - 1) range.push('...');
      if (end < totalPages) range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center text-primary mb-4">All Rooms</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to={'/admin/rooms/add'} className="btn btn-outline-primary">
          Add Room
        </Link>
        <input
          type="text"
          placeholder="Search by room name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-25"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="thead-light">
            <tr>
              <th>Room ID</th>
              <th>Room Name</th>
              <th>Volume</th>
              <th>Double Seats</th>
              <th>VIP Seats</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <tr key={room.id}>
                  <td>{room.id}</td>
                  <td>{room.room_name}</td>
                  <td>{room.volume}</td>
                  <td>{room.quantity_double_seats}</td>
                  <td>{room.quantity_vip_seats}</td>
                  <td>
                  <Link to={`/admin/rooms/edit/${room.id}`} className="btn btn-warning btn-sm mx-1">
        <FontAwesomeIcon icon={faEdit} />
    </Link>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="btn btn-danger btn-sm"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>
              Prev
            </button>
          </li>
          {paginationRange().map((page, index) => (
            <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              {page === '...' ? (
                <span className="page-link">...</span>
              ) : (
                <button className="page-link" onClick={() => handlePageChange(page as number)}>
                  {page}
                </button>
              )}
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default RoomDashboard;
