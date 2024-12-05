import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { notification, Table, Pagination, Input, Button, Popconfirm, Modal, Form } from 'antd';

import './CategoriesDashboard.css';
import { useCategoryContext } from '../../../Context/CategoriesContext';

const CategoriesDashboard = () => {
    const { state, deleteCategory, addCategory } = useCategoryContext();
    const { categories } = state;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const categoriesPerPage = 7;
    const { Search } = Input;

    const filteredCategories = categories.filter((category) =>
        category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCategories = filteredCategories.length;
    const currentCategories = filteredCategories.slice(
        (currentPage - 1) * categoriesPerPage,
        currentPage * categoriesPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = (id: number) => {
        deleteCategory(id);
        notification.success({
            message: 'Thành Công',
            description: 'Thể loại đã được xóa thành công!',
            placement: 'topRight',
        });
    };

    const handleAddCategory = async (values: any) => {
        try {
            await addCategory(values); // Giả định hàm addCategory đã có
            notification.success({
                message: 'Thành Công',
                description: 'Thêm thể loại thành công!',
            });
            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể thêm thể loại.',
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
            title: 'Tên Thể Loại',
            dataIndex: 'category_name',
            key: 'category_name',
            className: 'text-center',
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, category: any) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/categories/edit/${category.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa thể loại này?"
                        onConfirm={() => handleDelete(category.id)}
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
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalVisible(true)}
                >
                    Thêm Thể Loại Phim
                </Button>
                <Search
                    placeholder="Tìm kiếm theo tên thể loại"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={currentCategories}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: 'Không có thể loại nào.' }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalCategories}
                    pageSize={categoriesPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} thể loại`}
                />
            </div>

            {/* Modal Thêm Thể Loại */}
            <Modal
                title="Thêm Thể Loại Phim"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddCategory}>
                    <Form.Item
                        name="category_name"
                        label="Tên Thể Loại"
                        rules={[{ required: true, message: 'Vui lòng nhập tên thể loại!' }]}
                    >
                        <Input placeholder="Nhập tên thể loại" />
                    </Form.Item>
                    <div className="text-right">
                        <Button onClick={() => setIsModalVisible(false)} style={{ marginRight: '10px' }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Thêm
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default CategoriesDashboard;
