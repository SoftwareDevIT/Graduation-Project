import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Room } from '../../../interface/Room';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, notification } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

// Schema validation
const showtimeSchema = z.object({
  movie_id: z.number().min(1, 'Vui lòng chọn phim'),
  room_id: z.number().min(1, 'Vui lòng chọn phòng'),
  showtime_date: z
    .string()
    .min(1, 'Vui lòng chọn ngày chiếu')
    .refine((value) => {
      const today = new Date();
      const selectedDate = new Date(value);
      today.setHours(0, 0, 0, 0); // Reset giờ phút giây để chỉ so sánh ngày
      return selectedDate >= today;
    }, 'Ngày chiếu không được nhỏ hơn ngày hiện tại'),
    showtime_start: z
    .string()
    .min(1, 'Vui lòng chọn giờ bắt đầu')
    .regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu phải có định dạng HH:mm'),
  price: z
    .number()
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
    .max(500000, 'Giá không được vượt quá 500,000 VNĐ')
    .optional(),
});

const ShowtimesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Showtime>({
    resolver: zodResolver(showtimeSchema),
  });
  const { addOrUpdateShowtime } = useShowtimeContext();
  const navigate = useNavigate();

  // State variables
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [showtimesList, setShowtimesList] = useState<Showtime[]>(() => {
    const savedShowtimes = localStorage.getItem('showtimesList');
    return savedShowtimes ? JSON.parse(savedShowtimes) : [];
  });

  // Fetch initial data
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await instance.get('/manager/movies');
      setMoviesList(response.data.data.original);
    };

    const fetchShowtime = async () => {
      if (id) {
        const response = await instance.get(`/manager/showtimes/${id}`);
        const showtimeData = response.data.data;

        // Populate form fields for edit mode
        reset({
          movie_id: showtimeData.movie_id,
          showtime_date: showtimeData.showtime_date,
          showtime_start: showtimeData.showtime_start,
          price: showtimeData.price,
          room_id: showtimeData.room_id,
        });
      }
    };
    fetchRooms(); // Lấy danh sách phòng
    fetchMovies();
    fetchShowtime();
  }, [id, reset]);

  useEffect(() => {
    localStorage.setItem('showtimesList', JSON.stringify(showtimesList));
  }, [showtimesList]);

  // Fetch rooms by movie
  const fetchRooms = async () => {
    const response = await instance.get('/manager/room'); // Lấy danh sách phòng từ API
    setRoomsList(response.data.data);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<Showtime> = async (data) => {
    const formattedData = {
      ...data,
      showtime_start: `${data.showtime_start}:00`, // Add ':00' to make it HH:mm:ss
    };
  
    if (!id) {
      setShowtimesList((prevList) => [...prevList, formattedData]);
    } else {
      await addOrUpdateShowtime(formattedData, id);
      notification.success({
        message: 'Cập nhật Suất Chiếu Thành Công!',
        description: 'Suất chiếu đã được cập nhật vào danh sách.',
      });
      navigate('/admin/showtimes');
    }
  
    reset();
  };
  

  // Delete a showtime
  const handleDelete = (index: number) => {
    const newShowtimesList = [...showtimesList];
    newShowtimesList.splice(index, 1);
    setShowtimesList(newShowtimesList);
    notification.success({
      message: 'Xóa Suất Chiếu Thành Công!',
      description: 'Suất chiếu đã được xóa khỏi danh sách.',
    });
  };

  // Submit all showtimes in bulk
  const handleSubmitAll = async () => {
    if (
      showtimesList.length === 0 ||
      showtimesList.some(
        (item) =>
          !item.movie_id || !item.room_id || !item.showtime_date || !item.showtime_start
      )
    ) {
      notification.error({
        message: 'Lỗi khi gửi tất cả Showtime',
        description: 'Vui lòng điền đầy đủ thông tin cho tất cả các suất chiếu.',
      });
      return;
    }
    localStorage.setItem('showtimesList', JSON.stringify([]));
    await addOrUpdateShowtime(showtimesList);
    notification.success({
      message: 'Gửi Tất Cả Suất Chiếu Thành Công!',
      description: 'Suất chiếu mới đã được thêm vào danh sách.',
    });

    navigate('/admin/showtimes');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{id ? 'Cập nhật Suất Chiếu' : 'Thêm Suất Chiếu'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light" >
        <div className="mb-3">
          <Link to="/admin/showtimesauto/add">
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Thêm Suất Chiếu Tự Động
            </Button>
          </Link>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Chọn Phim</label>
            <select {...register('movie_id', { valueAsNumber: true })} className="form-select">
              <option value="">Chọn Phim</option>
              {moviesList.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.movie_name}
                </option>
              ))}
            </select>
            {errors.movie_id && <div className="text-danger">{errors.movie_id.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Chọn Phòng</label>
            <select {...register('room_id', { valueAsNumber: true })} className="form-select">
              <option value="">Chọn Phòng</option>
              {roomsList.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_name}
                </option>
              ))}
            </select>
            {errors.room_id && <div className="text-danger">{errors.room_id.message}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Ngày chiếu</label>
            <input type="date" {...register('showtime_date')} className="form-control" />
            {errors.showtime_date && <div className="text-danger">{errors.showtime_date.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Giờ bắt đầu</label>
            <input type="time" {...register('showtime_start')} className="form-control" />
            {errors.showtime_start && <div className="text-danger">{errors.showtime_start.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input type="number" {...register('price', { valueAsNumber: true })} className="form-control" style={{width:"25%"}} />
          {errors.price && <div className="text-danger">{errors.price.message}</div>}
        </div>

        <div className="mb-3">
          {id ? (
            <button type="submit" className="btn btn-success w-100">
              Cập nhật Showtime
            </button>
          ) : (
            <>
              <button type="submit" className="btn btn-primary w-30">
                Thêm Showtime
              </button>
      <button
  type="button"
  onClick={handleSubmitAll}
  className="btn btn-secondary w-30 mt-2"
  style={{marginLeft: "800px"}}
>
  Gửi tất cả Suất Chiếu
</button>

            </>
          )}
        </div>
      </form>

      <div className="showtimes-list mt-5">
        <h3>Danh Sách Suất Chiếu</h3>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Phim</th>
              <th>Phòng</th>
              <th>Ngày Chiếu</th>
              <th>Giờ Bắt Đầu</th>
              <th>Giá</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {showtimesList.map((showtime, index) => (
              <tr key={index}>
                <td>{showtime.movie_id}</td>
                <td>{showtime.room_id}</td>
                <td>{showtime.showtime_date}</td>
                <td>{showtime.showtime_start}</td>
                <td>{showtime.price}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(index)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowtimesForm;
