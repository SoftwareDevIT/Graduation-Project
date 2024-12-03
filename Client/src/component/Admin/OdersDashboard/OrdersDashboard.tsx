import React, { useEffect, useState } from "react";
import { Table, Button, Select, Input, DatePicker, Pagination, Card, Space, notification } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import instance from "../../../server";
import { Booking } from "../../../interface/Booking";
import { CheckCircleOutlined, ExclamationCircleOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import './OrdersDashboard.css'

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrdersDashboard: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const { Search } = Input;

  // Fetch bookings when filters change
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params: any = {
          page: currentPage,
          status: statusFilter,
          search: searchTerm,
        };
        if (dateRange) {
          params.start_date = dateRange[0];
          params.end_date = dateRange[1];
        }

        const response = await instance.get("/dashboard", { params });
        setBookings(response.data.data);
        setTotalPages(response.data.data.last_page);
      } catch (error) {
        notification.error({
          message: "Lỗi",
          description: "Không thể tải thông tin đơn hàng.",
        });
      }
    };

    fetchBookings();
  }, [currentPage, statusFilter, searchTerm, dateRange]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pain':
        return {
          className: 'status-pain',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      case 'Confirmed':
        return {
          className: 'status-confirmed',
          icon: <ExclamationCircleOutlined style={{ color: 'orange', marginRight: 8 }} />,
        };
      case 'Pending':
        return {
          className: 'status-pending',
          icon: <CheckCircleOutlined style={{ color: 'green', marginRight: 8 }} />,
        };
      default:
        return {
          className: 'status-default',
          icon: null,
        };
    }
  };

  const handlePrintInvoice = (booking: Booking) => {
    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      notification.error({
        message: "Lỗi",
        description: "Không thể mở cửa sổ in hóa đơn.",
      });
      return;
    }
    const invoiceContent = `
      <html>
      <head>
        <title>Hóa đơn</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
          th { background-color: #f4f4f4; }
        </style>
      </head>
      <body>
        <h1>Hóa đơn</h1>
        <p><strong>Mã Đơn Hàng:</strong> ${booking.id}</p>
        <p><strong>Người Dùng:</strong> ${booking.user?.user_name || "Không xác định"}</p>
        <p><strong>Email:</strong> ${booking.user?.email || "Không xác định"}</p>
        <p><strong>Suất Chiếu:</strong> ${booking.showtime?.showtime_date || "Không xác định"}</p>
        <p><strong>Phim:</strong> ${booking.showtime.movie.movie_name || "Không xác định"}</p>
        <p><strong>Tổng Tiền:</strong> ${booking.amount}</p>
        <hr />
        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
      </body>
      </html>
    `;
    invoiceWindow.document.write(invoiceContent);
    invoiceWindow.document.close();
    invoiceWindow.print();
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "booking_id",
      key: "booking_id",
      align: "center" as const,
    },
    {
      title: "Người Dùng",
      dataIndex: ["user_name"],
      key: "user_name",
      align: "center" as const,
      render: (text: string) => text || "Unknown User",
    },
    {
      title: "Suất Chiếu",
      dataIndex: ["showtime_date"],
      key: "showtime_date",
      align: "center" as const,
    },
    {
      title: "Phòng",
      dataIndex: ["room_name"],
      key: "room_name",
      align: "center" as const,
    },
    {
      title: "Phim",
      dataIndex: ["movie_name"],
      key: "movie_name",
      align: "center" as const,
    },
    {
      title: "Phương Thức Thanh Toán",
      dataIndex: ["payMethod"],
      key: "payMethod",
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
      render: (_: any, booking: any) => (
        <Space>
           <Link to={`/admin/ordersdetail/${booking.booking_id}`} className="btn btn-primary">
    Chi tiết
  </Link>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Doanh Thu" style={{ margin: "20px" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ display: "flex", justifyContent: "space-between" }}>
          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);  // Reset to the first page when filter changes
            }}
            style={{ width: 200 }}
            placeholder="Trạng thái"
          >
            <Option value="">Tất cả trạng thái</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Confirmed">Confirmed</Option>
            <Option value="Pain">Pain</Option>
          </Select>
          <RangePicker
            onChange={(dates) => {
              if (dates) {
                setDateRange([dayjs(dates[0]).format("YYYY-MM-DD"), dayjs(dates[1]).format("YYYY-MM-DD")]);
              } else {
                setDateRange(null);
              }
              setCurrentPage(1);  // Reset to the first page when filter changes
            }}
          />
          <Search
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);  // Reset to the first page when search term changes
            }}
            style={{ width: 300 }}
            allowClear
          />
        </Space>
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey={(record) => record.id}
          pagination={false}
          bordered
        />
        <div className="d-flex justify-content-center mt-4">
          <Pagination
            current={currentPage}
            total={totalPages * 10}
            onChange={(page) => setCurrentPage(page)}
            style={{ textAlign: "center" }}
          />
        </div>
      </Space>
    </Card>
  );
};

export default OrdersDashboard;
