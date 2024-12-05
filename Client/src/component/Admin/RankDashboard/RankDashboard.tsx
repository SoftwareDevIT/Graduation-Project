import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notification, Table, Pagination, Input, Button, Popconfirm, Modal, Form, Input as AntdInput } from 'antd'; // Import Ant Design components
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'; // Ant Design icons
import { Rank } from '../../../interface/Rank';
import instance from '../../../server';

const RankDashboard = () => {
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [totalOrderFilter, setTotalOrderFilter] = useState<number | null>(null); // Trạng thái lọc theo tổng số đơn hàng
    const [discountFilter, setDiscountFilter] = useState<number | null>(null); // Trạng thái lọc theo phần trăm giảm giá

    const ranksPerPage = 7;
    const { Search } = Input;

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchRanks = async () => {
            setLoading(true);
            try {
                const response = await instance.get('/ranks');
                setRanks(response.data.data);
            } catch (error) {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải danh sách hạng.',
                    placement: 'topRight',
                });
            } finally {
                setLoading(false);
            }
        };
        fetchRanks();
    }, []);

    // Lọc và phân trang
    const filteredRanks = ranks.filter((rank) => {
        const matchesSearchTerm = rank.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTotalOrderFilter = totalOrderFilter ? rank.total_order_amount >= totalOrderFilter : true;
        const matchesDiscountFilter = discountFilter ? rank.percent_discount >= discountFilter : true;
        return matchesSearchTerm && matchesTotalOrderFilter && matchesDiscountFilter;
    });

    const totalRanks = filteredRanks.length;
    const currentRanks = filteredRanks.slice(
        (currentPage - 1) * ranksPerPage,
        currentPage * ranksPerPage
    );

    const handlePageChange = (page: number) => setCurrentPage(page);

    const handleDelete = async (id: number) => {
        setLoading(true);
        try {
            await instance.delete(`/ranks/${id}`);
            setRanks((prevRanks) => prevRanks.filter((rank) => rank.id !== id));
            notification.success({
                message: 'Thành công',
                description: 'Hạng đã được xóa thành công.',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể xóa hạng. Vui lòng thử lại sau.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddRank = async (values: any) => {
        setLoading(true);
        try {
            await instance.post('/ranks', values);
            setRanks((prevRanks) => [...prevRanks, values]);
            notification.success({
                message: 'Thành công',
                description: 'Hạng đã được thêm thành công.',
                placement: 'topRight',
            });
            setModalVisible(false); // Close modal after successful submission
            form.resetFields(); // Reset the form fields
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Không thể thêm hạng. Vui lòng thử lại sau.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    // Cấu hình cột bảng
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            className: 'text-center',
        },
        {
            title: 'Tên Hạng',
            dataIndex: 'name',
            key: 'name',
            className: 'text-center',
        },
        {
            title: 'Tổng Số Đơn Hàng',
            dataIndex: 'total_order_amount',
            key: 'total_order_amount',
            className: 'text-center',
        },
        {
            title: 'Phần Trăm Giảm Giá',
            dataIndex: 'percent_discount',
            key: 'percent_discount',
            className: 'text-center',
            render: (percent: number) => `${percent}%`,
        },
        {
            title: 'Hành Động',
            key: 'action',
            className: 'text-center',
            render: (text: any, rank: Rank) => (
                <div className="d-flex justify-content-around">
                    <Link to={`/admin/rank/edit/${rank.id}`}>
                        <Button type="primary" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa hạng này?"
                        onConfirm={() => handleDelete(rank.id)}
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
                    onClick={() => setModalVisible(true)} // Open modal when clicked
                >
                    Thêm Hạng
                </Button>
                <Search
                    placeholder="Tìm kiếm theo tên hạng"
                    onSearch={(value) => setSearchTerm(value)}
                    style={{ width: 300 }}
                    allowClear
                />
                {/* Bộ lọc theo Tổng Số Đơn Hàng và Phần Trăm Giảm Giá */}
                <div className="d-flex gap-3">
                    <AntdInput
                        type="number"
                        placeholder="Lọc theo tổng số đơn hàng"
                        onChange={(e) => setTotalOrderFilter(e.target.value ? Number(e.target.value) : null)}
                    />
                    <AntdInput
                        type="number"
                        placeholder="Lọc theo phần trăm giảm giá"
                        onChange={(e) => setDiscountFilter(e.target.value ? Number(e.target.value) : null)}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={currentRanks}
                rowKey="id"
                pagination={false} // Disable built-in pagination
                loading={loading}
                locale={{
                    emptyText: 'Không có hạng nào.',
                }}
            />
            <div className="d-flex justify-content-center mt-4">
                <Pagination
                    current={currentPage}
                    total={totalRanks}
                    pageSize={ranksPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    showQuickJumper
                    showTotal={(total) => `Tổng số ${total} hạng`}
                />
            </div>

            {/* Modal Thêm Hạng */}
            <Modal
                title="Thêm Hạng"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)} // Close modal when cancel
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    onFinish={handleAddRank} // Submit form when finished
                    layout="vertical"
                >
                    <Form.Item
                        label="Tên Hạng"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên hạng!' }]}
                    >
                        <AntdInput />
                    </Form.Item>
                    <Form.Item
                        label="Tổng Số Đơn Hàng"
                        name="total_order_amount"
                        rules={[{ required: true, message: 'Vui lòng nhập tổng số đơn hàng!' }]}
                    >
                        <AntdInput type="number" />
                    </Form.Item>
                    <Form.Item
                        label="Phần Trăm Giảm Giá"
                        name="percent_discount"
                        rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                    >
                        <AntdInput type="number" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Thêm Hạng
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default RankDashboard;
