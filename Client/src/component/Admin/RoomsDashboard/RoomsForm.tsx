import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Room } from '../../../interface/Room';
import { Cinema } from '../../../interface/Cinema';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'; // For integrating Zod with React Hook Form
import instance from '../../../server';
import { notification } from 'antd'; // Import notification from Ant Design
import 'bootstrap/dist/css/bootstrap.min.css';

// Zod schema validation
const roomSchema = z.object({
  room_name: z.string().min(1, 'Tên phòng không được bỏ trống'),
  
  volume: z
    .number()
    .min(50, 'Sức chứa phải từ 50 đến 300')
    .max(300, 'Sức chứa phải từ 50 đến 300')
    .int('Sức chứa phải là số nguyên'),
  
  cinema_id: z.number().min(1, 'Vui lòng chọn rạp'),
  
  quantity_double_seats: z
    .number()
    .min(0, 'Số ghế đôi không thể nhỏ hơn 0')
    .max(10, 'Số ghế đôi không thể lớn hơn 10') // Không vượt quá 10 ghế đôi
    .int('Số ghế đôi phải là số nguyên')
    .refine((value) => value <= 10, {
      message: 'Số ghế đôi không thể lớn hơn 10',
    }),

  quantity_vip_seats: z
    .number()
    .min(0, 'Số ghế VIP không thể nhỏ hơn 0')
    .int('Số ghế VIP phải là số nguyên')
    .refine((value) => value <= 10, {
      message: 'Số ghế VIP không thể lớn hơn 10',
    }),

}).refine((data) => data.quantity_double_seats + data.quantity_vip_seats <= data.volume, {
  message: 'Tổng số ghế đôi và ghế VIP không thể lớn hơn sức chứa',
  path: ['quantity_double_seats'], // Đảm bảo lỗi này được hiển thị ở ghế đôi
});




const RoomsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Room>({
    resolver: zodResolver(roomSchema), // Use Zod resolver for validation
  });
  const nav = useNavigate();

  const [cinemas, setCinemas] = useState<Cinema[]>([]);

  useEffect(() => {
    // Fetch all cinemas
    const fetchCinemas = async () => {
      const response = await instance.get('/cinema');
      setCinemas(response.data.data);
    };

    // Fetch room details if editing
    const fetchRoom = async () => {
      if (id) {
        const response = await instance.get(`/room/${id}`);
        const roomData = response.data.data;
        reset({
          room_name: roomData.room_name,
          volume: roomData.volume || '',
          cinema_id: roomData.cinema_id,
          quantity_double_seats: roomData.quantity_double_seats,
          quantity_vip_seats: roomData.quantity_vip_seats,
        });
      }
    };

    fetchCinemas();
    fetchRoom();
  }, [id, reset]);

  const onSubmit: SubmitHandler<Room> = async (data) => {
    console.log('Submitted Data:', data); // Debug log
    if (!data.room_name || !data.volume || !data.cinema_id) {
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
          capacity: data.volume, // Map to the expected property name
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

        {/* Sức Chứa */}
        <div className="mb-3">
          <label className="form-label">Sức chứa</label>
          <input
            type="number"
            {...register('volume',{valueAsNumber: true})}
            className={`form-control ${errors.volume ? 'is-invalid' : ''}`}
          />
          {errors.volume && <div className="invalid-feedback">{errors.volume.message}</div>}
        </div>

        {/* Rạp */}
        <div className="mb-3">
          <label className="form-label">Rạp</label>
          <select
            {...register('cinema_id',{valueAsNumber: true})}
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

        {/* Số Ghế Đôi */}
        <div className="mb-3">
          <label className="form-label">Số Ghế Đôi</label>
          <input
            type="number"
            {...register('quantity_double_seats',{valueAsNumber: true})}
            className={`form-control ${errors.quantity_double_seats ? 'is-invalid' : ''}`}
          />
          {errors.quantity_double_seats && <div className="invalid-feedback">{errors.quantity_double_seats.message}</div>}
        </div>

        {/* Số Ghế VIP */}
        <div className="mb-3">
          <label className="form-label">Số Ghế VIP</label>
          <input
            type="number"
            {...register('quantity_vip_seats',{valueAsNumber: true})}
            className={`form-control ${errors.quantity_vip_seats ? 'is-invalid' : ''}`}
          />
          {errors.quantity_vip_seats && <div className="invalid-feedback">{errors.quantity_vip_seats.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? "Cập nhật Phòng" : "Thêm Phòng"}
        </button>
      </form>
    </div>
  );
};

export default RoomsForm;
