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
  BarElement, // Add this line to register the BarElement
} from "chart.js";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import FontAwesome
import instance from "../../../server";
import { Button, DatePicker, Form, Pagination, Select, Space } from "antd";

import dayjs, { Dayjs } from "dayjs"; // Import dayjs for date handling
import { Cinema } from "../../../interface/Cinema";

import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { Link } from "react-router-dom";
import { Movie } from "../../../interface/Movie";
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement// Add this line to register the BarElement
);


const DashboardAdmin = () => {
  const [bookings, setBookings] = useState<any[]>([]); // Update this type to match your API response
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
  const [dayRevenue, setDayRevenue] = useState<any>(null);
const [monthRevenue, setMonthRevenue] = useState<any>(null);
const [yearRevenue, setYearRevenue] = useState<any>(null);
const [dailyData, setDailyData] = useState({});
const [monthlyData, setMonthlyData] = useState({});
const [movieRevenue, setMovieRevenue] = useState<Movie[]>([]);



useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [startDate, endDate] = selectedDateRange || [null, null];
      const formattedStartDate = startDate ? startDate.format("YYYY-MM-DD") : null;
      const formattedEndDate = endDate ? endDate.format("YYYY-MM-DD") : null;
      const formattedDate = selectedDate ? selectedDate.format("YYYY-MM-DD") : null;
      const formattedMonth = selectedMonth ? selectedMonth.format("YYYY-MM") : null;
      const formattedYear = selectedYear ? selectedYear.format("YYYY") : null;

      const cinemasResponse = await instance.get("/cinema");
      setCinemas(cinemasResponse.data.data);

      const dashboardResponse = await instance.get("/dashboard", {
        params: {
          cinema_id: selectedCinema,
          status: selectedStatus,
          start_date: formattedStartDate,
          end_date: formattedEndDate,
          day: formattedDate,
          month: formattedMonth,
          year: formattedYear
        }
      });

      console.log("API response:", dashboardResponse.data);


      // setTotalRevenue(dashboardResponse.data.chart.total_amount);
      setBookings(dashboardResponse.data.booking_revenue);
      setMovieRevenue(dashboardResponse.data.movie_revenue);
      // setBookings(dashboardResponse.data.data);
      // setMovieRevenue(dashboardResponse.data.movie);
      setDailyData(dashboardResponse.data.daily_revenue_chart);
        setMonthlyData(dashboardResponse.data.monthly_revenue_chart);
      
      // Set day, month, and year revenue data
      setDayRevenue(dashboardResponse.data.day_revenue);
      setMonthRevenue(dashboardResponse.data.month_revenue);
      setYearRevenue(dashboardResponse.data.year_revenue);
      

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  fetchDashboardData();
}, [selectedCinema, selectedStatus, selectedDateRange, selectedDate, selectedMonth, selectedYear]);
  // Thêm selectedCinema làm dependency
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
  const dailyLabels = Object.keys(dailyData);
  const dailyValues = Object.values(dailyData);

  const monthlyLabels = Object.keys(monthlyData).map((month) => `Tháng ${month}`);
  const monthlyValues = Object.values(monthlyData);
  
  const dailyChartData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Doanh thu theo ngày",
        data: dailyValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };
  const monthlyChartData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: monthlyValues,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };
  const selectedCinemaName = selectedCinema
  ? cinemas.find((cinema) => cinema.id === selectedCinema)?.cinema_name || "Rạp không xác định"
  : "Tất cả các rạp";

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
            <Form.Item label="">
      <Select
        placeholder="Chọn trạng thái"
        value={selectedStatus}
        onChange={(value) => setSelectedStatus(value)}
        allowClear
        style={{ width: 300 }}
      >
        <Option value="Thanh toán thành công">Thanh toán thành công</Option>
        <Option value="Đã in vé">Đã in vé</Option>
      </Select>
    </Form.Item>
    {/* <Form.Item label="">
              <RangePicker
                format="YYYY-MM-DD"
                value={selectedDateRange}
                onChange={(dates) => setSelectedDateRange(dates)}
                style={{ width: 240 }}
              />
            </Form.Item> */}
            <Form.Item label="">
      <Button type="primary" onClick={exportToExcel} block style={{ width: 300 }}>
        Export to Excel
      </Button>
    </Form.Item>
          </Space>
    </Form>
    <div className="summary">
  <div className="summary-card">
    <div className="summary-card-header">
      <h3>Doanh Thu</h3>
      <div className="summary-filter">
      <Form.Item label="">
              <DatePicker
                placeholder="Chọn ngày"
                format="YYYY-MM-DD"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                style={{ width: 160 }}
              />
            </Form.Item>
      </div>
    </div>
  <div className="summaryaccount">
  <div className="summary-number">
      {dayRevenue ? ` ${dayRevenue.current_revenue.toLocaleString()}₫` : ''}
    </div>
     <div className="previous_revenue"><p>{dayRevenue ? `${dayRevenue.previous_revenue.toLocaleString()}₫` : ''}</p></div>
    <div className="summary-change ${dayRevenue?.percentage_change > 0 ? 'increase' : 'decrease'}">
    {dayRevenue ? (
      <>
        {dayRevenue.percentage_change > 0 ? (
          <i className="fa fa-arrow-up" style={{ color: 'green' }}></i>
        ) : (
          <i className="fa fa-arrow-down" style={{ color: 'red' }}></i>
        )}
        {`${dayRevenue.percentage_change}%`}
      </>
    ) : '0%'}
        
    </div>
  </div>
  </div>

  <div className="summary-card">
    <div className="summary-card-header">
      <h3>Doanh Thu</h3>
      <div className="summary-filter">
      <Form.Item label="">
              <DatePicker
                picker="month"
                placeholder="Chọn tháng"
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                style={{ width: 160 }}
              />
            </Form.Item>
      </div>
    </div>
    <div className="summaryaccount">
    <div className="summary-number">
      {monthRevenue ? `${monthRevenue.current_revenue.toLocaleString()}₫ ` : ''}
    </div>
    <div className="previous_revenue">
    <p>{dayRevenue ? `${dayRevenue.previous_revenue.toLocaleString()}₫` : ''}</p>
    </div>
    <div className="summary-change ${monthRevenue?.percentage_change > 0 ? 'increase' : 'decrease'}">
    {dayRevenue ? (
      <>
        {dayRevenue.percentage_change > 0 ? (
          <i className="fa fa-arrow-up" style={{ color: 'green' }}></i>
        ) : (
          <i className="fa fa-arrow-down" style={{ color: 'red' }}></i>
        )}
        {`${dayRevenue.percentage_change}%`}
      </>
    ) : '0%'}
    </div>
    </div>
  </div>

  <div className="summary-card">
    <div className="summary-card-header">
      <h3>Doanh Thu</h3>
      <div className="summary-filter">
      <Form.Item label="">
              <DatePicker
                picker="year"
                placeholder="Chọn năm"
                value={selectedYear}
                onChange={(date) => setSelectedYear(date)}
                style={{ width: 160 }}
              />
            </Form.Item>
      </div>
    </div>
    <div className="summaryaccount">
    <div className="summary-number">
      {yearRevenue ? `${yearRevenue.current_revenue.toLocaleString()}₫ ` : ''}
    </div>
    <div className="previous_revenue"><p>{dayRevenue ? `${dayRevenue.previous_revenue.toLocaleString()}₫` : ''}</p></div>   
   
    <div className="summary-change ${yearRevenue?.percentage_change > 0 ? 'increase' : 'decrease'}">
    {dayRevenue ? (
      <>
        {dayRevenue.percentage_change > 0 ? (
          <i className="fa fa-arrow-up" style={{ color: 'green' }}></i>
        ) : (
          <i className="fa fa-arrow-down" style={{ color: 'red' }}></i>
        )}
        {`${dayRevenue.percentage_change}%`}
      </>
    ) : '0%'}
   
    </div>
  </div>
  </div>
</div>


        <div className="charts-container">
          <div className="quarterly-revenue">
            <h3>Doanh Thu Theo Ngày</h3>
            <div className="area-chart">
            <Line data={dailyChartData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const value = Number(context.raw); // Ép kiểu thành số
                                    return value ? `${value.toLocaleString()}₫` : ''; // Hiển thị VNĐ
                                  },
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: '',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: '',
                                },
                                ticks: {
                                  callback: (value) => `${value.toLocaleString()}₫`, // Hiển thị VNĐ
                                },
                            },
                        },
                    }} />   
            </div>
          </div>

          <div className="quarterly-revenue">
  <h3>Doanh Thu Theo Tháng</h3>
  <div className="bar-chart">
  <Bar data={monthlyChartData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                      label: (context) => {
                                        const value = Number(context.raw); // Ép kiểu thành số
                                        return value ? `${value.toLocaleString()}₫` : ''; // Hiển thị VNĐ
                                      },
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                      callback: (value) => `${value.toLocaleString()}₫`, // Hiển thị VNĐ
                                    },
                                }
                            }
                        }} />
  </div>
</div>
        </div>
        {/* Thêm bảng vào dưới biểu đồ */}
        <div className="recent-container">
  <div className="recent-orders">
    <h3>Đơn hàng gần đây</h3>
    <div style={{ overflowX: 'auto' }}>
      <table>
        <thead>
          <tr>
            <th>Mã Đơn Hàng</th>
            <th>Phim</th>
            <th>Tổng Tiền</th>
            <th>Trạng Thái</th>
            <th>Ngày Đặt</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking: any) => (
              <tr key={booking.booking_id}>
                <td>{booking.booking_code}</td>
                <td>{booking.showtime.movie.movie_name}</td>
                <td>{booking.amount}</td>
                <td>{booking.status}</td>
                <td>{booking.created_at}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Không có đơn hàng nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Phân trang */}
    <div style={{ marginTop: '20px', textAlign: 'center' }}>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={bookings.length}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
      />
    </div>
  </div>

  {/* Biểu đồ tròn nằm bên phải bảng */}
  <div className="chart-container1">
    <h3>Tỷ lệ chọn ghế</h3>
    <Doughnut
      data={{
        labels: ['Thanh toán thành công', 'Đã in vé'],
        datasets: [
          {
            label: 'Doanh Thu',
            data: [12000, 8000],
            backgroundColor: ['#4caf50', '#ff9800'],
            borderColor: ['#4caf50', '#ff9800'],
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}₫`,
            },
          },
        },
      }}
    />
  </div>
</div>
<div className="recent-orders">
          <h3>Doanh thu theo phim</h3>
          <table>
            <thead>
              <tr>
              <th>Ảnh Phim</th>
            <th>Tên Phim</th>
            <th>Doanh Thu Của Phim</th>
            <th>Tổng Suất Chiếu</th>
              </tr>
            </thead>
            <tbody>
            {movieRevenue.map((movie) => (
            <tr key={movie.movie_id}>
              <td>
                <img
                  src={movie.movie_image}
                  alt={movie.movie_name}
                  width="100"
                />
              </td>
              <td>{movie.movie_name}</td>
              <td>{movie.total_revenue.toLocaleString()}₫</td>
              <td>{movie.showtime_count}</td>
            </tr>
          ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
