import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd'; // Ant Design components
import instance from '../../../server';
import { User } from '../../../interface/User';

const UserDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const { Search } = Input;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await instance.get(`/all-user?page=${currentPage}`);
                setUsers(response.data.data);
                setTotalPages(response.data.last_page);
            } catch (err) {
                setError('Lỗi khi tải người dùng');
            }
        };

        fetchUsers();
    }, [currentPage]);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.user_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle pagination change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Handle delete action
    const handleDelete = (id: number) => {
        // Your delete logic here (API request, etc.)
        notification.success({
            message: 'Thành Công',
            description: 'Người dùng đã được xóa thành công!',
            placement: 'topRight',
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center' as const,  // Corrected here, use 'center' instead of string
        },
        {
            title: 'Tên Đăng Nhập',
            dataIndex: 'user_name',
            key: 'user_name',
            align: 'center' as const,  // Corrected here, use 'center' instead of string
        },
        {
            title: 'Tên Đầy Đủ',
            dataIndex: 'fullname',
            key: 'fullname',
            align: 'center' as const,  // Corrected here, use 'center' instead of string
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            align: 'center' as const,  // Corrected here, use 'center' instead of string
            render: (text: string) => text || 'Chưa có',
        },
        {
            title: 'Ngày Tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            align: 'center' as const,  // Corrected here, use 'center' instead of string
            render: (text: string) => new Date(text).toLocaleDateString(),
        },
        
    ];

    if (error) {
        return <p className="text-red-500 text-center mt-4">{error}</p>;
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/admin/user/roles">
                    <Button type="primary" size="large">
                        Quản lý vai trò
                    </Button>
                </Link>
                <Search
                    placeholder="Tìm kiếm theo tên"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredUsers}
                rowKey="id"
                pagination={false} // Disable default pagination
                locale={{
                    emptyText: 'Không có người dùng nào.',
                }}
            />

            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalPages * 10}
                    pageSize={7} // Number of users per page
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper
                   
                />
            </div>
        </div>
    );
};

export default UserDashboard;
