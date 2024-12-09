import React, { useEffect, useState } from "react";
import "./DashboardAdmin.css";
import { Pie, Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome
import instance from "../../../server";
import { Button, DatePicker, Form, Pagination, Select, Space } from "antd";

import dayjs, { Dayjs } from "dayjs"; // Import dayjs for date handling
import { Cinema } from "../../../interface/Cinema";

import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { Link } from "react-router-dom";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);


const DashboardAdmin = () => {
  const [bookings, setBookings] = useState<any[]>([]); // Update this type to match your API response
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalBookings, setTotalBookings] = useState<number | null>(null);
  const [movieRevenue, setMovieRevenue] = useState<any[]>([]); // To store movie revenue details
  const [cinemas, setCinemas] = useState<Cinema[]>([]); // State for cinemas
  const [selectedCinema, setSelectedCinema] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null); 
  const [selectedDateRange, setSelectedDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Dayjs | null>(null); 
  const [selectedYear, setSelectedYear] = useState<Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { Option } = Select;
  const { RangePicker } = DatePicker;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [startDate, endDate] = selectedDateRange || [null, null];  // Ensure it's safe to destructure if null
        const formattedStartDate = startDate ? startDate.format("YYYY-MM-DD") : null;
        const formattedEndDate = endDate ? endDate.format("YYYY-MM-DD") : null;
        const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
        const formattedMonth = selectedMonth ? selectedMonth.format("YYYY-MM") : null;
        const formattedYear = selectedYear ? selectedYear.format("YYYY") : null;
        // Lấy danh sách các rạp
        const cinemasResponse = await instance.get("/cinema");
        setCinemas(cinemasResponse.data.data);  // Cập nhật danh sách rạp
  
        // Lấy dữ liệu bảng điều khiển với tham số chọn rạp (nếu có)
        const dashboardResponse = await instance.get("/dashboard", {
          params: { 
            cinema_id: selectedCinema ,
             status: selectedStatus,
             start_date: formattedStartDate,
             end_date: formattedEndDate,
             day: formattedDate,
             month: formattedMonth, 
             year: formattedYear
            }
        });
  
        console.log("Dashboard API Response:", dashboardResponse.data);
  
        setTotalRevenue(dashboardResponse.data.chart.total_amount);
        setTotalBookings(dashboardResponse.data.chart.booking_count);
        setBookings(dashboardResponse.data.data);
        setMovieRevenue(dashboardResponse.data.movie)
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };
  
    fetchDashboardData();
  }, [selectedCinema,selectedStatus,selectedDateRange,selectedDate,selectedMonth,selectedYear]);  // Thêm selectedCinema làm dependency
  const exportToExcel = () => {
    const formattedData = bookings.map((booking) => ({
      "Booking ID": booking.booking_id,
      "User Name": booking.user_name,
      "Payment Method": booking.payMethod,
      "Amount": booking.amount,
      "Status": booking.status,
      "Showtime Date": booking.showtime_date,
      "Room Name": booking.room_name,
      "Movie Name": booking.movie_name,
      "Created At": booking.created_at,
    }));

    const ws = XLSX.utils.json_to_sheet(formattedData); // Convert data to sheet
    const wb = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bookings"); // Append the sheet to the workbook

    // Export the Excel file
    XLSX.writeFile(wb, "Bookings_Report.xlsx");
  };
// Chỉnh sửa doughnutData để lấy dữ liệu từ movieRevenue
const doughnutData = {
  labels: movieRevenue.map((movie: any) => movie.movie_name), // Các tên phim làm nhãn
  datasets: [
    {
      data: movieRevenue.map((movie: any) => movie.total_amount), // Dữ liệu tổng doanh thu theo phim
      backgroundColor: ['#27ae60', '#3498db', '#e74c3c', '#f1c40f', '#9b59b6'],
    },
  ],
};

const doughnutOptions = {
  maintainAspectRatio: false,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'top' as 'chartArea',
      labels: {
        boxWidth: 20,
      },
    },
  },
  responsive: true, 
};

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const barData = {
    labels: movieRevenue.map((movie: any) => movie.movie_name),
    datasets: [
      {
        label: 'Phim',
        data: movieRevenue.map((movie: any) => movie.total_amount),
        backgroundColor: movieRevenue.map(() => getRandomColor()),
      },
    ],
  };


  const barOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    responsive: true, 
  };
  const selectedCinemaName = selectedCinema
  ? cinemas.find((cinema) => cinema.id === selectedCinema)?.cinema_name || "Rạp không xác định"
  : "Tất cả các rạp";

  const paginatedBookings = bookings.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-subtitle">{selectedCinemaName}</h1>
      <div className="dashboard-content">
      <Form className="filter-form" layout="inline" style={{ marginBottom: '20px' }}>
          <Space direction="horizontal" size="middle" style={{ flexWrap: 'wrap' }}>
            {/* Lọc theo rạp */}
            <Form.Item label="Chọn Rạp">
              <Select
                placeholder="Chọn rạp"
                allowClear
                value={selectedCinema}
                onChange={(value) => setSelectedCinema(value)}
                style={{ width: 300 }}
              >
                <Option value="">Tất cả</Option>
                {cinemas.map((cinema) => (
                  <Option key={cinema.id} value={cinema.id}>
                    {cinema.cinema_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Lọc theo ngày */}
            <Form.Item label="Ngày">
              <DatePicker
                placeholder="Chọn ngày"
                format="YYYY-MM-DD"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                style={{ width: 160 }}
              />
            </Form.Item>

            {/* Lọc theo tháng */}
            <Form.Item label="Tháng">
              <DatePicker
                picker="month"
                placeholder="Chọn tháng"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                style={{ width: 160 }}
              />
            </Form.Item>

            {/* Lọc theo năm */}
            <Form.Item label="Năm">
              <DatePicker
                picker="year"
                placeholder="Chọn năm"
                value={selectedYear}
                onChange={(date) => setSelectedYear(date)}
                style={{ width: 160 }}
              />
            </Form.Item>
          </Space>
    </Form>
      <div className="summary">
          {/* Box 1: Weekly Sales */}
          <div className="summary-card" >
            <div className="summary-card-header">
            
              <h3>Doanh Thu</h3>
            </div>
            <div className="summary-number">{totalBookings !== null ? totalBookings : 'Loading...'}</div>
            
          </div>

          {/* Box 2: Total Revenue */}
          <div className="summary-card" >
            <div className="summary-card-header">
        
              <h3>Doanh Thu</h3>
            </div>
            <div className="summary-number">{totalRevenue !== null ? `$ ${totalRevenue.toLocaleString()}` : 'Loading...'}</div>
          </div>

          <div className="summary-card" >
            <div className="summary-card-header">
              
              <h3>Doanh Thu</h3>
            </div>
            <div className="summary-number">{totalRevenue !== null ? `$ ${totalRevenue.toLocaleString()}` : 'Loading...'}</div>
          </div>
        </div>
        <div className="charts-container">
          <div className="quarterly-revenue">
            <h3>Doanh Thu Phim Theo Rạp</h3>
            <div className="area-chart">
              <Bar data={barData} options={barOptions} />
              
            </div>
          </div>

          <div className="revenue-summary">
  <h3>Doanh Thu Phim Theo Rạp</h3>
  <div className="revenue-chart">
    <Doughnut
      data={doughnutData} options={doughnutOptions}  // Dữ liệu từ movieRevenue
    />
  </div>
  <p className="revenue-amount">{totalRevenue ? `${totalRevenue.toLocaleString()}VNĐ` : 'Loading...'}</p>
</div>

        </div>

        {/* Thêm bảng vào dưới biểu đồ */}
        <div className="recent-orders">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3>Đơn hàng gần đây</h3>
    <Form.Item label="">
              <RangePicker
                format="YYYY-MM-DD"
                value={selectedDateRange}
                onChange={(dates) => setSelectedDateRange(dates)}
                style={{ width: 240 }}
              />
            </Form.Item>
    <Form.Item label="">
              <Select
                placeholder="Chọn trạng thái"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value)}
                allowClear
                style={{ width: 160 }}
              >
                <Option value="Thanh toán thành công">Thanh toán thành công</Option>
                <Option value="Thanh toán thất bại">Thanh toán thất bại</Option>
                <Option value="Đã hủy">Đã hủy</Option>
                <Option value="Đang xử lý">Đang xử lý</Option>
                <Option value="Đã in vé">Đã in vé</Option>
              </Select>
            </Form.Item>
            <Form.Item label="">
            <Button type="primary" onClick={exportToExcel} block style={{ width: 180 }}>
      Export to Excel
    </Button>
            </Form.Item>
  </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Người Dùng</th>
                <th>Phương Thức Thanh Toán</th>
                <th>Suất Chiếu</th>
                <th>Phim</th>
                <th>Tổng Tiền</th>
                <th>Trạng Thái</th>
                <th>Ngày Đặt</th>
                <th>Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? (
                paginatedBookings.map((booking: any) => (
                  <tr key={booking.booking_id}>
                    <td>{booking.booking_id}</td>
                    <td>{booking.user_name}</td>
                    <td>{booking.payMethod}</td>
                    <td>{booking.showtime_date}</td>
                    <td>{booking.movie_name}</td>
                    <td>{booking.amount}</td>
                    <td>{booking.status}</td>
                    <td>{booking.created_at}</td>
                    <td>
                      <Link to={`/admin/ordersdetail/${booking.booking_id}`} className="btn btn-primary">
    Chi tiết
  </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', textAlign: 'right' }} className="d-flex justify-content-center mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={bookings.length}
          onChange={(page, size) => {
            setCurrentPage(page);
            setPageSize(size);
          }}
          showSizeChanger
        />
      </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
