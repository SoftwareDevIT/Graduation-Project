import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification, Table, Button, Input, Space, Pagination } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state;
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [showtimesPerPage] = useState<number>(5);
    const [totalShowtimes, setTotalShowtimes] = useState<number>(0);  // Total showtimes to calculate total pages

    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get(`/showtimes?page=${currentPage}`);
                if (response.data.data.data && Array.isArray(response.data.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
                    setTotalShowtimes(response.data.data.total);  // Assuming the response contains the total count of showtimes
                } else {
                    setError('Không thể lấy showtime: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy showtime');
            }
        };

        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/movies');
                if (Array.isArray(movieResponse.data.data.original)) {
                    setMovies(movieResponse.data.data.original);
                } else {
                    setError('Không thể lấy danh sách phim: Định dạng phản hồi không mong đợi');
                }
            } catch (err) {
                setError('Không thể lấy danh sách phim');
            }
        };

        fetchShowtimes();
        fetchMovies();
    }, [dispatch, currentPage, showtimesPerPage]);

    const filteredShowtimes = showtimes.filter(showtime =>
        showtime.movie_in_cinema?.movie?.movie_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });
                notification.success({
                    message: 'Xóa Thành Công',
                    description: 'Showtime đã được xóa thành công!',
                });
            } catch (err) {
                notification.error({
                    message: 'Lỗi Xóa Showtime',
                    description: 'Không thể xóa showtime. Vui lòng thử lại sau.',
                });
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Pagination handler
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const columns = [
        {
            title: 'Phim',
            dataIndex: 'movieName',
            key: 'movieName',
            render: (text: string, record: any) => <span>{record.movie_in_cinema?.movie?.movie_name}</span>,
        },
        {
            title: 'Phòng',
            dataIndex: 'room',
            key: 'room',
            render: (text: string, record: any) => <span>{record.room?.room_name}</span>,
        },
        {
            title: 'Ngày',
            dataIndex: 'date',
            key: 'date',
            render: (text: string, record: any) => <span>{new Date(record.showtime_date).toLocaleDateString()}</span>,
        },
        {
            title: 'Giờ bắt đầu',
            dataIndex: 'start',
            key: 'start',
            render: (text: string, record: any) => <span>{record.showtime_start}</span>,
        },
        {
            title: 'Giờ kết thúc',
            dataIndex: 'end',
            key: 'end',
            render: (text: string, record: any) => <span>{record.showtime_end}</span>,
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => <span>{formatCurrency(text)}</span>,
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (text: string, record: any) => (
                <Space size="middle">
                    <Link to={`/admin/showtimes/edit/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Button
                     icon={<DeleteOutlined />}
        
                        danger
                        onClick={() => deleteShowtime(record.id)}
                    />
                </Space>
            ),
        },
    ];

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/showtimes/add">
                    <Button icon={<PlusOutlined />} type="primary" size="large">
                        Thêm Suất Chiếu
                    </Button>
                </Link>
                <Input
                    placeholder="Tìm kiếm theo tên phim"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredShowtimes}
                rowKey="id"
                pagination={false}  // Disable default pagination as we will use custom pagination
            />

<div className="d-flex justify-content-center mt-4"> 
                <Pagination
                    current={currentPage}
                    pageSize={showtimesPerPage}
                    total={totalShowtimes}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                />
            </div>
        </div>
    );
};

export default ShowtimesDashboard;
