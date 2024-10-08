import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext'; // Import context
import instance from '../../../server';

const ShowtimesForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<Showtime>(); // Định nghĩa kiểu Showtime
    const { addOrUpdateShowtime } = useShowtimeContext(); // Lấy hàm add/update từ context
    const [movies, setMovies] = useState([]);
    const nav = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            const movieResponse = await instance.get('/movies');
            setMovies(movieResponse.data.data);
        };

        const fetchShowtime = async () => {
            if (id) {
                const response = await instance.get(`/showtimes/${id}`);
                const showtimeData = response.data.data;
                reset({
                    movie_id: showtimeData.movie_id,
                    showtime_date: showtimeData.showtime_date,
                    showtime_start: showtimeData.showtime_start,
                    showtime_end: showtimeData.showtime_end,
                    room_id: showtimeData.room_id,
                    status: showtimeData.status
                });
            }
        };

        fetchMovies();
        fetchShowtime();
    }, [id, reset]);

    // Hàm xử lý khi submit form
    const onSubmit: SubmitHandler<Showtime> = async (data) => {
        await addOrUpdateShowtime(data, id); // Gọi hàm thêm/cập nhật showtime
        nav('/admin/showtimes'); // Chuyển hướng sau khi submit
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>Chọn Phim</label>
                <select {...register('movie_id')} required>
                    <option value="">Chọn Phim</option>
                    {movies.map((movie: any) => (
                        <option key={movie.id} value={movie.id}>
                            {movie.movie_name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Ngày chiếu</label>
                <input type="date" {...register('showtime_date')} required />
            </div>

            <div>
                <label>Giờ bắt đầu</label>
                <input type="time" {...register('showtime_start')} required />
            </div>

            <div>
                <label>Giờ kết thúc</label>
                <input type="time" {...register('showtime_end')} required />
            </div>

            <div>
                <label>Phòng chiếu</label>
                <input type="number" {...register('room_id')} required />
            </div>

            <div>
                <label>Trạng thái</label>
                <select {...register('status')} required>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            <button type="submit">{id ? 'Cập nhật Showtime' : 'Thêm Showtime'}</button>
        </form>
    );
};

export default ShowtimesForm;
