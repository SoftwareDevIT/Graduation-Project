import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { CinemaRoom } from '../../../interface/Room';
import instance from '../../../server';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cinema } from '../../../interface/Cinema';


const RoomsForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { register, handleSubmit, reset } = useForm<CinemaRoom>();
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

    const onSubmit: SubmitHandler<CinemaRoom> = async (data) => {
        console.log('Submitted Data:', data); // Debug log
        if (!data.room_name || !data.volume || !data.cinema_id) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
    
        if (id) {
            await instance.put(`/room/${id}`, data);
        } else {
            const mappedData = {
                ...data,
                capacity: data.volume, // Map to the expected property name
            };
            await instance.post('/room', mappedData);
            
        }
    
        nav('/admin/rooms');
        reset();
    };
    

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">{id ? "Cập nhật Phòng" : "Thêm Phòng"}</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
                {/* Tên Phòng */}
                <div className="mb-3">
                    <label className="form-label">Tên Phòng</label>
                    <input type="text" {...register('room_name')} required className="form-control" />
                </div>

                {/* Sức Chứa */}
                <div className="mb-3">
                    <label className="form-label">Sức chứa</label>
                    <input
    type="number"
    {...register('volume')}
    required
    className="form-control"
/>

                </div>

                {/* Rạp */}
                <div className="mb-3">
                    <label className="form-label">Rạp</label>
                    <select {...register('cinema_id')} required className="form-control">
                        <option value="">Chọn Rạp</option>
                        {cinemas.map((cinema) => (
                            <option key={cinema.id} value={cinema.id}>
                                {cinema.cinema_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Số Ghế Đôi */}
                <div className="mb-3">
                    <label className="form-label">Số Ghế Đôi</label>
                    <input type="number" {...register('quantity_double_seats')} required className="form-control" />
                </div>

                {/* Số Ghế VIP */}
                <div className="mb-3">
                    <label className="form-label">Số Ghế VIP</label>
                    <input type="number" {...register('quantity_vip_seats')} required className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary">
                    {id ? "Cập nhật Phòng" : "Thêm Phòng"}
                </button>
            </form>
        </div>
    );
};

export default RoomsForm;
