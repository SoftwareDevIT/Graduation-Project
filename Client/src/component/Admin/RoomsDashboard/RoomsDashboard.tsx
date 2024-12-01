import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { notification, Table, Pagination, Input, Button, Popconfirm } from 'antd';
import instance from '../../../server';
import { Room } from '../../../interface/Room';

const RoomDashboard: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const roomsPerPage = 7;
  const { Search } = Input;

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await instance.get('/room');
        setRooms(response.data.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.room_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRooms = filteredRooms.length;
  const currentRooms = filteredRooms.slice(
    (currentPage - 1) * roomsPerPage,
    currentPage * roomsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa phòng này?");
    if (confirmDelete) {
      try {
        await instance.delete(`/room/${id}`);
        setRooms(rooms.filter((room) => room.id !== id));
        notification.success({
          message: 'Xóa phòng thành công!',
          description: 'Phòng đã được xóa khỏi hệ thống.',
          placement: 'topRight',
        });
      } catch (error) {
        console.error('Error deleting room:', error);
        notification.error({
          message: 'Lỗi!',
          description: 'Không thể xóa phòng. Vui lòng thử lại sau.',
          placement: 'topRight',
        });
      }
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
      title: 'Tên Phòng',
      dataIndex: 'room_name',
      key: 'room_name',
      className: 'text-center',
    },
    {
      title: 'Tổng số ghế',
      dataIndex: 'volume',
      key: 'volume',
      className: 'text-center',
    },
    {
      title: 'Số Ghế Đôi',
      dataIndex: 'quantity_double_seats',
      key: 'quantity_double_seats',
      className: 'text-center',
    },
    {
      title: 'Số Ghế VIP',
      dataIndex: 'quantity_vip_seats',
      key: 'quantity_vip_seats',
      className: 'text-center',
    },
    {
      title: 'Hành Động',
      key: 'action',
      className: 'text-center',
      render: (text: any, room: Room) => (
        <div className="d-flex justify-content-around">
          <Link to={`/admin/rooms/edit/${room.id}`}>
            <Button type="primary" icon={<EditOutlined />} />
          </Link>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phòng này?"
            onConfirm={() => handleDelete(room.id)}
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
        <Link to={'/admin/rooms/add'}>
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Thêm Phòng
          </Button>
        </Link>
        <Search
          placeholder="Tìm kiếm theo tên phòng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={currentRooms}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: 'Không có phòng nào.',
        }}
      />
      <div className="d-flex justify-content-center mt-4">
        <Pagination
          current={currentPage}
          total={totalRooms}
          pageSize={roomsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total) => `Tổng số ${total} phòng`}
        />
      </div>
    </div>
  );
};

export default RoomDashboard;
