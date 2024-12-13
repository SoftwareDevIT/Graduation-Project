import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm, Switch } from 'antd'; // Import Ant Design components
import { useComboContext } from '../../../Context/ComboContext';
import instance from '../../../server';
import { Movie } from '../../../interface/Movie';

const ComboDashboard: React.FC = () => {
    const { state, deleteCombo } = useComboContext();
    const { combos } = state;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const combosPerPage = 5;
    const { Search } = Input;

    useEffect(() => {
        const fetchCombos = async () => {
            try {
                await instance.get('/combo');
            } catch (err) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải các combo',
                });
            }
        };

        fetchCombos();
    }, []);

    const filteredCombos = combos.filter(combo =>
        combo.combo_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCombos = filteredCombos.length;
    const currentCombos = filteredCombos.slice(
        (currentPage - 1) * combosPerPage,
        currentPage * combosPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = async (id: number) => {
        try {
            await deleteCombo(id);
            notification.success({
                message: 'Thành Công',
                description: 'Combo đã được xóa thành công!',
                placement: 'topRight',
            });
        } catch (err) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa combo',
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
            title: 'Tên Combo',
            dataIndex: 'combo_name',
            key: 'combo_name',
            className: 'text-center',
        },
        {
            title: 'Mô Tả',
            dataIndex: 'descripton',
            key: 'descripton',
            className: 'text-center',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            className: 'text-center',
            render: (text: any) => formatPrice(text),
        },
        {
            title: 'Số Lượng',
            dataIndex: 'volume',
            key: 'volume',
            className: 'text-center',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            className: 'text-center',
            render: (text: any) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Trạng Thái ',
            key: 'action',
            className: 'text-center',
            render: (movie: Movie) => (
                <div style={{ textAlign: 'left' }}>
                    <Switch 
                        checkedChildren="On" 
                        unCheckedChildren="Off" 
                    />
                </div>
            ),
          
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, combo: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/combo/edit/${combo.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa combo này?"
                        onConfirm={() => handleDelete(combo.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to={'/admin/combo/add'}>
                    <Button type="primary" icon={<PlusOutlined />} size="large">
                        Thêm Combo
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên combo"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentCombos}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                locale={{
                    emptyText: 'Không có combo nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalCombos}
                    pageSize={combosPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} combo`}
                />
            </div>
        </div>
    );
};

export default ComboDashboard;
