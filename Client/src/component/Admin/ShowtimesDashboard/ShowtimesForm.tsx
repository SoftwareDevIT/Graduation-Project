import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cinema } from '../../../interface/Cinema';
import { CinemaRoom } from '../../../interface/Room';

const ShowtimesForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<Showtime>();
    const { addOrUpdateShowtime } = useShowtimeContext();
    const nav = useNavigate();

    const [cinemasList, setCinemasList] = useState<Cinema[]>([]);
    const [movieInCinemas, setMovieInCinemas] = useState<any[]>([]);
    const [roomsList, setRoomsList] = useState<CinemaRoom[]>([]);
    const [cinemaId, setCinemaId] = useState<number | null>(null);
    const [showtimesList, setShowtimesList] = useState<Showtime[]>([]);

    useEffect(() => {
        const fetchCinemas = async () => {
            const response = await instance.get('/cinema');
            setCinemasList(response.data.data);
        };
    
        const fetchShowtime = async () => {
            if (id) {
                const response = await instance.get(`/showtimes/${id}`);
                const showtimeData = response.data.data;
                setCinemaId(showtimeData.movie_in_cinema.cinema_id); // Set cinema_id to fetch related movies and rooms
    
                // Fetch movies for the selected cinema
                await fetchMovieInCinema(showtimeData.movie_in_cinema.cinema_id);
                await fetchRoomsByCinema(showtimeData.movie_in_cinema.cinema_id);
    
                reset({
                    movie_in_cinema_id: showtimeData.movie_in_cinema_id,
                    cinema: showtimeData.movie_in_cinema.cinema_id,
                    showtime_date: showtimeData.showtime_date,
                    showtime_start: showtimeData.showtime_start,
                    showtime_end: showtimeData.showtime_end,
                    price: showtimeData.price,
                    room_id: showtimeData.room_id,
                });
            }
        };
    
        fetchCinemas();
        fetchShowtime();
    }, [id, reset]);
    
    const fetchMovieInCinema = async (cinemaId: number) => {
        const response = await instance.get(`/show-movie-in-cinema/${cinemaId}`);
        setMovieInCinemas(response.data.data);
    };
    
    const fetchRoomsByCinema = async (cinemaId: number) => {
        const response = await instance.get(`/cinema/${cinemaId}/room`);
        setRoomsList(response.data.data);
    };
    
    const handleCinemaChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCinemaId = Number(e.target.value);
        setCinemaId(selectedCinemaId);
        await fetchMovieInCinema(selectedCinemaId);
        await fetchRoomsByCinema(selectedCinemaId);
    };
    const onSubmit: SubmitHandler<Showtime> = async (data) => {
        const { showtime_start, showtime_end, room_id } = data;
    
        // Check that the end time is after the start time
        if (new Date(`1970-01-01T${showtime_end}:00`) <= new Date(`1970-01-01T${showtime_start}:00`)) {
            alert("Giờ kết thúc phải lớn hơn giờ bắt đầu.");
            return;
        }
    
        // Format the time fields to `H:i:s`
        const formattedData = {
            ...data,
            showtime_start: `${showtime_start}:00`, // Append seconds
            showtime_end: `${showtime_end}:00`,
        };
    
        if (!formattedData.movie_in_cinema_id || !formattedData.room_id) {
            alert("Vui lòng chọn phim và phòng trước khi gửi.");
            return;
        }
    
        // Fetch room details
        const roomResponse = await instance.get(`/room/${room_id}`);
        const roomDetails = roomResponse.data.data;
    
        // Add room details to the data
        const showtimeWithRoom = {
            ...formattedData,
            room_id: roomDetails.id,
        };
    
        if (!id) {
            setShowtimesList((prevList) => [...prevList, showtimeWithRoom]);
        } else {
            await addOrUpdateShowtime(showtimeWithRoom, id);
            nav('/admin/showtimes');
            return;
        }
    
        reset();
    };
    
    

    const handleSubmitAll = async () => {
        await addOrUpdateShowtime(showtimesList);
        alert("Gửi tất cả Showtime thành công!");
        nav('/admin/showtimes');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{id ? "Cập nhật Showtime" : "Thêm Showtime"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
                {/* Chọn Rạp */}
                <div className="mb-3">
                    <label className="form-label">Chọn Rạp</label>
                    <select 
                        onChange={handleCinemaChange} 
                        value={cinemaId || ''} // Make sure to set the selected value
                        required 
                        className="form-select"
                    >
                        <option value="">Chọn Rạp</option>
                        {cinemasList.map(cinema => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.cinema_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Chọn Phim */}
                <div className="mb-3">
    <label className="form-label">Chọn Phim</label>
    <select {...register('movie_in_cinema_id')} required className="form-select">
        <option value="">Chọn Phim</option>
        {movieInCinemas.map((movie: any) => (
            <option key={movie.id} value={movie.id}>
                {movie.movie.movie_name}
            </option>
        ))}
    </select>
</div>
                {/* Chọn Phòng */}
                <div className="mb-3">
    <label className="form-label">Chọn Phòng</label>
    <select {...register('room_id')} required className="form-select">
        <option value="">Chọn Phòng</option>
        {roomsList.map((room) => (
            <option key={room.id} value={room.id}>
                {room.room_name}
            </option>
        ))}
    </select>
</div>
                {/* Ngày chiếu */}
                <div className="mb-3">
                    <label className="form-label">Ngày chiếu</label>
                    <input type="date" {...register('showtime_date')} required className="form-control" />
                </div>

                {/* Giờ bắt đầu */}
                <div className="mb-3">
                    <label className="form-label">Giờ bắt đầu</label>
                    <input type="time" {...register('showtime_start')} required className="form-control" />
                </div>

                {/* Giờ kết thúc */}
                <div className="mb-3">
                    <label className="form-label">Giờ kết thúc</label>
                    <input type="time" {...register('showtime_end')} required className="form-control" />
                </div>

                {/* Giá */}
                <div className="mb-3">
                    <label className="form-label">Giá</label>
                    <input type="number" {...register('price')} required className="form-control" />
                </div>

                <div className="mb-3">
                    {id ? (
                        <button type="submit" className="btn btn-success">Cập nhật Showtime</button>
                    ) : (
                        <>
                            <button type="submit" className="btn btn-primary">Thêm Showtime</button>
                            <button type="button" onClick={handleSubmitAll} className="btn btn-secondary ms-2">Gửi tất cả Showtime</button>
                        </>
                    )}
                </div>
            </form>

            {/* Hiển thị danh sách showtimes */}
            <div className="mt-4">
                <h3 className="text-center">Danh sách Showtime</h3>
                {showtimesList.length > 0 ? (
                    <table className="table table-bordered mt-3">
                        <thead>
                            <tr>
                                <th>Phim</th>
                                <th>Ngày chiếu</th>
                                <th>Giờ bắt đầu</th>
                                <th>Giờ kết thúc</th>
                                <th>Giá</th>
                                <th>Phòng</th>
                            </tr>
                        </thead>
                        <tbody>
    {showtimesList.map((showtime, index) => (
        <tr key={index}>
            <td>{showtime.movie_in_cinema_id}</td>
            <td>{showtime.showtime_date}</td>
            <td>{showtime.showtime_start}</td>
            <td>{showtime.showtime_end}</td>
            <td>{showtime.price}</td>
            <td>{showtime.room_id}</td>
        </tr>
    ))}
</tbody>

                    </table>
                ) : (
                    <p className="text-center">Chưa có showtime nào được thêm.</p>
                )}
            </div>
        </div>
    );
};

export default ShowtimesForm;
