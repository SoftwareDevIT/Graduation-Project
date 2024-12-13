import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification, Table, Button, Input, Pagination, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const ShowtimesDashboard: React.FC = () => {
    const { state, dispatch } = useShowtimeContext();
    const { showtimes } = state; // Truyền lại showtimes từ context
    const [error, setError] = useState<string | null>(null);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { Search } = Input;
    // Fetch showtimes và movies từ API
    useEffect(() => {
        const fetchShowtimes = async () => {
            try {
                const response = await instance.get(`/showtimes?page=${currentPage}`);
                if (Array.isArray(response.data.data.data)) {
                    dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data.data });
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
    }, [dispatch, currentPage]);

    // Lọc showtimes theo tên phim
    const filteredShowtimes = showtimes.filter((showtime) =>
        showtime.movie && showtime.movie.movie_name && showtime.movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    

    // Xử lý xóa showtime
    const deleteShowtime = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa showtime này?')) {
            try {
                await instance.delete(`/showtimes/${id}`);
                dispatch({ type: 'DELETE_SHOWTIME', payload: id });

                // Thông báo thành công
                notification.success({
                    message: 'Xóa Thành Công',
                    description: 'Showtime đã được xóa thành công!',
                });
            } catch (err) {
                // Thông báo lỗi
                notification.error({
                    message: 'Lỗi Xóa Showtime',
                    description: 'Không thể xóa showtime. Vui lòng thử lại sau.',
                });
            }
        }
    };

    // Định dạng giá tiền
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    // Cột hiển thị của bảng Ant Design
    const columns = [
        {
            title: 'Phim',
            dataIndex: ['movie','movie_name'],
            key: 'movie_name',
        },
        {
            title: 'Phòng',
            dataIndex: ['room', 'room_name'],
            key: 'room_name',
        },
        {
            title: 'Ngày',
            dataIndex: 'showtime_date',
            key: 'showtime_date',
            render: (date: string) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Giờ bắt đầu',
            dataIndex: 'showtime_start',
            key: 'showtime_start',
        },
        {
            title: 'Giờ kết thúc',
            dataIndex: 'showtime_end',
            key: 'showtime_end',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => formatCurrency(price),
        },
        {
            title: 'Trạng Thái',
            key: 'actions',
            render: (movie: Movie) => (
                <div style={{ textAlign: 'left' }}>
                    <Switch 
                        checkedChildren="On" 
                        unCheckedChildren="Off" 
                    />
                </div>
            ),
            className: 'text-left',
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_ :any, record: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/showtimes/edit/${record.id}`}>
                        <Button icon={<EditOutlined />} type="primary" />
                    </Link>
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteShowtime(record.id)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/showtimes/add">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm Suất Chiếu
                    </Button>
                </Link>
                <Search
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
                pagination={false}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    onChange={(page) => setCurrentPage(page)}
                    total={50} // Điều chỉnh tổng số bản ghi phù hợp
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default ShowtimesDashboard;
