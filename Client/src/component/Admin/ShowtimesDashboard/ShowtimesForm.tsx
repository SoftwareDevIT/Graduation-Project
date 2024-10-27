import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext'; // Import context
import instance from '../../../server';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cinema } from '../../../interface/Cinema';

const ShowtimesForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<Showtime>();
    const { addOrUpdateShowtime } = useShowtimeContext();
    const [movies, setMovies] = useState([]);
    const [cinemas, setCinemas] = useState<Cinema[]>([]);
    const nav = useNavigate();
    const [showtimesList, setShowtimesList] = useState<Showtime[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const movieResponse = await instance.get('/movies');
            setMovies(movieResponse.data.data);
        };

        const fetchCinemas = async () => {
            const cinemaResponse = await instance.get('/cinema');
            setCinemas(cinemaResponse.data.data);
        };

        const fetchShowtime = async () => {
            if (id) {
                const response = await instance.get(`/showtimes/${id}`);
                const showtimeData = response.data.data;
                reset({
                    movie_id: showtimeData.movie_id,
                    cinema_id: showtimeData.cinema_id,
                    showtime_date: showtimeData.showtime_date,
                    showtime_start: showtimeData.showtime_start,
                    showtime_end: showtimeData.showtime_end,
                });
            }
        };

        fetchMovies();
        fetchCinemas();
        fetchShowtime();
    }, [id, reset]);

   const onSubmit: SubmitHandler<Showtime> = async (data) => {
    if (!id) {
        setShowtimesList(prevList => [...prevList, data]); // Use functional state update
    } else {
        await addOrUpdateShowtime({...data}, id);
        nav('/admin/showtimes');
        return;
    }
    reset();
};


    const handleSubmitAll = async () => {
        await addOrUpdateShowtime(showtimesList);
        nav('/admin/showtimes');
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{id ? "Cập nhật Showtime" : "Thêm Showtime"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">Chọn Phim</label>
                    <select {...register('movie_id')} required className="form-select">
                        <option value="">Chọn Phim</option>
                        {movies.map((movie: any) => (
                            <option key={movie.id} value={movie.id}>
                                {movie.movie_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Chọn Rạp</label>
                    <select {...register('cinema_id')} required className="form-select">
                        <option value="">Chọn Rạp</option>
                        {cinemas.map((cinema: any) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.cinema_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Ngày chiếu</label>
                    <input type="date" {...register('showtime_date')} required className="form-control" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Giờ bắt đầu</label>
                    <input type="time" {...register('showtime_start')} required className="form-control" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Giờ kết thúc</label>
                    <input type="time" {...register('showtime_end')} required className="form-control" />
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

            {!id && (
    <>
        <h3 className="mt-4">Danh sách Showtime đã thêm:</h3>
        <div className="table-responsive">
            <table className="table table-striped">
                <thead className="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Phim</th>
                        <th scope="col">Rạp</th>
                        <th scope="col">Ngày</th>
                        <th scope="col">Giờ bắt đầu</th>
                        <th scope="col">Giờ kết thúc</th>
                    </tr>
                </thead>
                <tbody>
                    {showtimesList.length > 0 ? (
                        showtimesList.map((showtime, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{showtime.movie_id}</td>
                                <td>{showtime.cinema_id}</td>
                                <td>{showtime.showtime_date}</td>
                                <td>{showtime.showtime_start}</td>
                                <td>{showtime.showtime_end}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center">Chưa có showtime nào được thêm.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </>
)}

        </div>
    );
};

export default ShowtimesForm;
