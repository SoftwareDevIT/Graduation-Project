import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Room } from '../../../interface/Room';
import { Cinema } from '../../../interface/Cinema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import instance from '../../../server';
import { notification } from 'antd';


// Zod schema validation
const roomSchema = z.object({
  room_name: z.string().min(1, 'Tên phòng không được bỏ trống'),
  cinema_id: z.number().min(1, 'Vui lòng chọn rạp'),
  seat_map_id: z.number().min(1, 'Vui lòng chọn kiểu bố trí ghế'),
});

const RoomsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Room>({
    resolver: zodResolver(roomSchema),
  });
  const nav = useNavigate();

  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [seatLayouts, setSeatLayouts] = useState<any[]>([]); // Dữ liệu seat_layouts

  useEffect(() => {
    const fetchCinemas = async () => {
      const response = await instance.get('/cinema');
      setCinemas(response.data.data);
    };

    const fetchSeatLayouts = async () => {
      // Giả sử có API cho seat layouts
      const response = await instance.get('/seat-maps');
      setSeatLayouts(response.data);
    };

    const fetchRoom = async () => {
      if (id) {
        const response = await instance.get(`/room/${id}`);
        const roomData = response.data.data;
        reset({
          room_name: roomData.room_name,
          cinema_id: roomData.cinema_id,
          seat_map_id: roomData.seat_map_id,
        });
      }
    };

    fetchCinemas();
    fetchSeatLayouts();
    fetchRoom();
  }, [id, reset]);

  const onSubmit: SubmitHandler<Room> = async (data) => {
    console.log('Submitted Data:', data);
    if (!data.room_name || !data.cinema_id || !data.seat_map_id) {
      notification.error({
        message: 'Thông báo',
        description: 'Vui lòng điền đầy đủ thông tin.',
      });
      return;
    }

    try {
      if (id) {
        await instance.put(`/room/${id}`, data);
        notification.success({
          message: 'Cập nhật Phòng',
          description: 'Cập nhật phòng thành công!',
        });
      } else {
        const mappedData = {
          ...data,
        };
        await instance.post('/room', mappedData);
        notification.success({
          message: 'Thêm Phòng',
          description: 'Thêm phòng thành công!',
        });
      }

      nav('/admin/rooms');
      reset();
    } catch (error) {
      notification.error({
        message: 'Lỗi',
        description: 'Đã xảy ra lỗi trong quá trình thêm hoặc cập nhật phòng.',
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{id ? "Cập nhật Phòng" : "Thêm Phòng"}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
        {/* Tên Phòng */}
        <div className="mb-3">
          <label className="form-label">Tên Phòng</label>
          <input
            type="text"
            {...register('room_name')}
            className={`form-control ${errors.room_name ? 'is-invalid' : ''}`}
          />
          {errors.room_name && <div className="invalid-feedback">{errors.room_name.message}</div>}
        </div>

        {/* Rạp */}
        <div className="mb-3">
          <label className="form-label">Rạp</label>
          <select
            {...register('cinema_id', { valueAsNumber: true })}
            className={`form-control ${errors.cinema_id ? 'is-invalid' : ''}`}
          >
            <option value="">Chọn Rạp</option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.cinema_name}
              </option>
            ))}
          </select>
          {errors.cinema_id && <div className="invalid-feedback">{errors.cinema_id.message}</div>}
        </div>

        {/* Kiểu Bố trí Ghế */}
        <div className="mb-3">
          <label className="form-label">Kiểu Bố trí Ghế</label>
          <select
            {...register('seat_map_id', { valueAsNumber: true })}
            className={`form-control ${errors.seat_map_id ? 'is-invalid' : ''}`}
          >
            <option value="">Chọn Kiểu Bố trí Ghế</option>
            {seatLayouts.map((layout) => (
              <option key={layout.id} value={layout.id}>
                {layout.name} {/* Giả sử mỗi layout có thuộc tính name */}
              </option>
            ))}
          </select>
          {errors.seat_map_id && <div className="invalid-feedback">{errors.seat_map_id.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? "Cập nhật Phòng" : "Thêm Phòng"}
        </button>
      </form>
    </div>
  );
};

export default RoomsForm;
