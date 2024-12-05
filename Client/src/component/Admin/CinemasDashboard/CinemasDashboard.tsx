import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Input, Space, notification, Pagination, Popconfirm } from 'antd';
import instance from '../../../server';
import { useCinemaContext } from '../../../Context/CinemasContext';
import { Movie } from '../../../interface/Movie';
import { MovieInCinema } from '../../../interface/MovieInCinema';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'; // Ant Design icons
const { Search } = Input;

const CinemasDashboard: React.FC = () => {
    const { state, dispatch } = useCinemaContext();
    const { cinemas } = state;

    const [currentPage, setCurrentPage] = useState(1);
    const [expandedCinemaId, setExpandedCinemaId] = useState<number | null>(null);
    const [selectedCinemaMovies, setSelectedCinemaMovies] = useState<MovieInCinema[]>([]);
    const [allMovies, setAllMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const cinemasPerPage = 5;

    useEffect(() => {
        const fetchAllMovies = async () => {
            try {
                const response = await instance.get('/movies');
                setAllMovies(response.data.data.original);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Lỗi khi lấy danh sách phim.',
                });
            }
        };

        fetchAllMovies();
    }, []);

    const filteredCinemas = cinemas.filter((cinema) =>
        cinema.cinema_name &&
        cinema.cinema_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const totalCinemas = filteredCinemas.length;

    const currentCinemas = filteredCinemas.slice(
        (currentPage - 1) * cinemasPerPage,
        currentPage * cinemasPerPage
    );

    const handleDeleteCinema = async (id: number) => {
        try {
            await instance.delete(`/cinema/${id}`);
            dispatch({ type: 'DELETE_CINEMA', payload: id });
            notification.success({
                message: 'Thành công',
                description: 'Xóa rạp thành công!',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Lỗi khi xóa rạp.',
            });
        }
    };

    const fetchMoviesForCinema = async (cinemaId: number) => {
        try {
            const response = await instance.get(`/show-movie-in-cinema/${cinemaId}`);
            const moviesInCinema = response.data.data.map((movie: MovieInCinema) => {
                const movieDetails = allMovies.find((m) => m.id === movie.movie_id);
                return {
                    ...movie,
                    movie_name: movieDetails ? movieDetails.movie_name : 'Phim không xác định',
                };
            });
            setSelectedCinemaMovies(moviesInCinema);
        } catch (error) {
            notification.error({message: 'Lỗi',
                description: 'Lỗi khi lấy phim của rạp.',
            });
        }
    };

    const handleCinemaClick = (cinemaId: number) => {
        if (expandedCinemaId === cinemaId) {
            setExpandedCinemaId(null);
            setSelectedCinemaMovies([]);
        } else {
            fetchMoviesForCinema(cinemaId);
            setExpandedCinemaId(cinemaId);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        setExpandedCinemaId(null);
        setSelectedCinemaMovies([]);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên Rạp',
            dataIndex: 'cinema_name',
            key: 'cinema_name',
            render: (text: string, record: any) => (
                <span
                    style={{ color: '#1890ff', cursor: 'pointer' }}
                    onClick={() => handleCinemaClick(record.id)}
                >
                    {text}
                </span>
            ),
        },
        {
            title: 'Điện Thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Vị Trí',
            dataIndex: ['location', 'location_name'],
            key: 'location_name',
        },
        {
            title: 'Địa Chỉ',
            dataIndex: 'cinema_address',
            key: 'cinema_address',
        },
        {
            title: 'Hành Động',
            key: 'actions',
            render: (_: any, record: any) => (
                <Space>
                    <Link to={`/admin/cinemas/edit/${record.id}`}>
                    <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa rạp này?"
                        onConfirm={() => handleDeleteCinema(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                         <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <Link to="/admin/cinemas/add">
                <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Rạp
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '300px' }}
                    allowClear
                />
            </div>
            <Table
                dataSource={currentCinemas} columns={columns}
                pagination={false}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) =>
                        expandedCinemaId === record.id && selectedCinemaMovies.length > 0 ? (
                            <div>
                                <h4>Phim trong rạp {record.cinema_name}</h4>
                                <ul>
                                    {selectedCinemaMovies.map((movie) => (
                                        <li key={movie.movie_id}>{movie.movie.movie_name}</li>
                                    ))}
                                </ul>
                            </div>
                        ) : null,
                    rowExpandable: () => true,
                }}
            />
            <div className="d-flex justify-content-center mt-4">
            <Pagination
                current={currentPage}
                total={totalCinemas}
                pageSize={cinemasPerPage}
                onChange={handlePageChange}
                className="mt-4 text-center"
            />
            </div>
        </div>
    );
};

export default CinemasDashboard;