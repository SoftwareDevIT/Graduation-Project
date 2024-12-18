import React, { useEffect, useState } from 'react';
import { useMovieContext } from '../../../Context/MoviesContext';
import { Link } from 'react-router-dom';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { Switch } from 'antd';

const MoviesDashboard: React.FC = () => {
    const { state, dispatch } = useMovieContext();
    const { movies } = state;
    const { Search } = Input;
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [moviesPerPage] = useState<number>(5);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const movieResponse = await instance.get('/manager/movies');
                dispatch({ type: 'SET_MOVIES', payload: movieResponse.data.data.original });
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu phim:', error);
                setError('Không thể tải phim');
            }
        };

        fetchMovies();
    }, [dispatch]);


    const deleteMovie = async (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phim này không?')) {
            try {
                await instance.delete(`/manager/movies/${id}`);
                dispatch({ type: 'DELETE_MOVIE', payload: id });
                notification.success({
                    message: 'Xóa Phim',
                    description: 'Đã xóa phim thành công!',
                    placement: 'topRight',
                });
            } catch (error) {
                console.error('Lỗi khi xóa phim:', error);
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể xóa phim.',
                    placement: 'topRight',
                });
            }
        }
    };

    const filteredMovies = Array.isArray(movies)
        ? movies.filter(movie =>
            movie.movie_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    const updateMovieStatus = async (id: number, currentStatus: boolean) => {
        try {
            const newStatus = !currentStatus; // Đảo trạng thái hiện tại
            await instance.post(`/manager/movieStatus/${id}`, { status: newStatus ? 1 : 0 });

            // Cập nhật trạng thái trên giao diện
            dispatch({
                type: 'UPDATE_MOVIE_STATUS',
                payload: { id, status: newStatus ? 1 : 0 },
            });

            notification.success({
                message: 'Cập Nhật Trạng Thái',
                description: `Phim đã được ${newStatus ? 'hiện' : 'ẩn'}.`,
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái phim:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể cập nhật trạng thái phim.',
                placement: 'topRight',
            });
        }
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Ảnh',
            dataIndex: 'poster',
            key: 'poster',
            render: (poster: string) => (
                <img src={poster} alt="Poster" style={{ width: '100px', height: '150px', objectFit: 'cover' }} />
            ),
            className: 'text-center',
        },
        {
            title: 'Thông Tin Phim',
            key: 'movie_info',
            render: (movie: Movie) => (
                <div>
                    <p><strong>Tên phim :</strong> {movie.movie_name}</p>
                    <p><strong>Thời Lượng:</strong> {movie.duration} phút</p>
                    <p><strong>Giới Hạn Tuổi:</strong> {movie.age_limit}+</p>
                    <p><strong>Quốc gia:</strong> {movie.country}</p>
                    <p><strong>Ngày Công Chiếu:</strong> {new Intl.DateTimeFormat('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    }).format(new Date(movie.release_date))}</p>
                    {/* <p><strong>Luợt xem :</strong> {movie.views}</p>
                <p><strong>Đánh giá :</strong> {movie.rating}</p> */}
                </div>
            ),
            className: 'text-left',
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (movie: Movie) => (
                <div style={{ textAlign: 'left' }}>
                    <Switch
                        checkedChildren="On"
                        unCheckedChildren="Off"
                        checked={movie.status === 1} // Kiểm tra trạng thái hiện tại
                        onChange={() => updateMovieStatus(movie.id, movie.status === 1)}
                    />
                </div>
            ),
            className: 'text-left',
        },

        {
            title: 'Hành Động',
            key: 'action',
            render: (text: any, movie: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/movies/edit/${movie.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa phim này?"
                        onConfirm={() => deleteMovie(movie.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
            className: 'text-center`',
        },
    ];



    const handlePageChange = (page: number) => setCurrentPage(page);

    const totalMovies = filteredMovies.length;
    const currentMovies = filteredMovies.slice(
        (currentPage - 1) * moviesPerPage,
        currentPage * moviesPerPage
    );

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/movies/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Phim Mới
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
                dataSource={currentMovies}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có phim nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalMovies}
                    pageSize={moviesPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} phim`}
                />
            </div>
        </div>
    );
};

export default MoviesDashboard;
