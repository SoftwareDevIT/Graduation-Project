import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Import Ant Design components
import instance from '../../../server';
import { SeatMap1 } from '../../../interface/SeatMap';


const SeatMap = () => {
    const [seatMaps, setSeatMaps] = useState<SeatMap1[]>([]); // Use SeatMap interface here
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const seatMapsPerPage = 7;
    const { Search } = Input;

    useEffect(() => {
        const fetchSeatMaps = async () => {
            try {
                const response = await instance.get('/seat-map'); // API call for seat maps
                setSeatMaps(response.data.data); // Assuming the structure is { data: [...] }
            } catch (error) {
                console.error('Error fetching seat maps:', error);
                notification.error({
                    message: 'Error',
                    description: 'Unable to load seat maps!',
                    placement: 'topRight',
                });
            }
        };
        fetchSeatMaps();
    }, []);

    const handleDelete = async (id: number) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa layout ghế này?');
        if (!isConfirmed) return;

        try {
            await instance.delete(`/seat-map/${id}`); // API call for deleting seat map
            setSeatMaps((prevMaps) => prevMaps.filter((map) => map.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Layout ghế đã được xóa!',
                placement: 'topRight',
            });
        } catch (error) {
            console.error('Error deleting seat map:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa layout ghế!',
                placement: 'topRight',
            });
        }
    };

    const filteredSeatMaps = seatMaps.filter(map =>
        map.row.toLowerCase().includes(searchTerm.toLowerCase()) // Assuming you want to search by row
    );

    const totalSeatMaps = filteredSeatMaps.length;
    const currentSeatMaps = filteredSeatMaps.slice(
        (currentPage - 1) * seatMapsPerPage,
        currentPage * seatMapsPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Layout ID',
            dataIndex: 'seat_layout_id',
            key: 'seat_layout_id',
            className: 'text-center',
        },
        {
            title: 'Lable',
            dataIndex: 'label',
            key: 'label',
            className: 'text-center',
        },
        {
            title: 'Hàng',
            dataIndex: 'row',
            key: 'row',
            className: 'text-center',
        },
        {
            title: 'Cột',
            dataIndex: 'column',
            key: 'column',
            className: 'text-center',
        },
        {
            title: 'Loại Ghế',
            dataIndex: 'type',
            key: 'type',
            className: 'text-center',
        },
        {
            title: 'Ghế Cặp',
            dataIndex: 'is_double',
            key: 'is_double',
            className: 'text-center',
            render: (isDouble: number) => (isDouble ? 'Có' : 'Không'),
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, seatMap: SeatMap1) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/seatmap/edit/${seatMap.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa layout ghế này?"
                        onConfirm={() => handleDelete(seatMap.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/seatmap/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Sơ Đồ Ghế
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo hàng"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentSeatMaps}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có layout ghế nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalSeatMaps}
                    pageSize={seatMapsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} layout ghế`}
                />
            </div>
        </div>
    );
};

export default SeatMap;
