import React, { useEffect, useState } from "react";
import { Table, Card, Space, notification } from "antd";
import { Link } from "react-router-dom";

import instance from "../../../server";
import { Booking } from "../../../interface/Booking";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, PrinterOutlined } from '@ant-design/icons';
import './OrdersDashboard.css'

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get(`/manager/order`, {
          params: {
            page: pagination.current,
            pageSize: pagination.pageSize,
          },
        });
        setBookings(response.data.data);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total, // Giả sử API trả về tổng số lượng booking
        }));
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin đơn hàng.",
        });
      }
    };

    fetchBookings();
  }, [pagination.current, pagination.pageSize]);

  const getStatusStyle = (status: any) => {
    switch (status) {
      case 'Thanh toán thành công': // Successful payment
        return {
          className: 'status-Thanh toán thành công',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      case 'Đang xử lý': // Processing
        return {
          className: 'status-Đang xử lý',
          icon: <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />,
        };
      case 'Thanh toán thất bại': // Failed payment
        return {
          className: 'status-Thanh toán thất bại',
          icon: <CloseCircleOutlined style={{ color: 'red', marginRight: 8 }} />,
        };
      case 'Đã hủy': // Canceled
        return {
          className: 'status-Đã hủy',
          icon: <CloseCircleOutlined style={{ color: 'gray', marginRight: 8 }} />,
        };
      case 'Đã in vé': // Ticket printed
        return {
          className: 'status-Đã in vé',
          icon: <PrinterOutlined style={{ color: 'blue', marginRight: 8 }} />,
        };
      default:
        return {
          className: 'status-default',
          icon: null,
        };
    }
  };

  const columns = [
    {
      title: "Mã Đơn Hàng",
      dataIndex: "booking_code",
      key: "id",
      align: "center" as const,
    },
    {
      title: "Người Dùng",
      dataIndex: ["user", "user_name"],
      key: "user_name",
      align: "center" as const,
      render: (text: string) => text || "Unknown User",
    },
    {
      title: "Suất Chiếu",
      dataIndex: ["showtime", "showtime_date"],
      key: "showtime_date",
      align: "center" as const,
    },
    {
      title: "Phim",
      dataIndex: ["showtime","movie", "movie_name"],
      key: "movie_name",
      align: "center" as const,
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: ["pay_method", "pay_method_name"],
      key: "pay_method_name",
      align: "center" as const,
    },
    {
      title: "Tổng Tiền",
      dataIndex: "amount",
      key: "amount",
      align: "center" as const,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        const { className, icon } = getStatusStyle(text);
        return (
          <span className={className}>
            {icon}
            {text}
          </span>
        );
      },
    },
    {
      title: "Hành Động",
      key: "actions",
      align: "center" as const,
      render: (_: any, record: Booking) => (
        <Space>
          <Link to={`/admin/ordersdetail/${record.id}`} className="btn btn-primary">
            Chi tiết
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Đơn Hàng Gần Đây" style={{ margin: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey={(record) => record.id}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination({
                current: page,
                pageSize: pageSize || pagination.pageSize,
                total: pagination.total,
              });
            },
            style: { display: "flex", justifyContent: "center" },
          }}
          bordered
        />
      </Space>
    </Card>
  );
};

export default OrdersDashboard;
