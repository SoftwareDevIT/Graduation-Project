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
import { Booking } from "../../../interface/Booking";
import instance from "../../../server";
import RevenueByCinema from "../RevenueByCinema/RevenueByCinema";



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
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await instance.get(`/order?page=${currentPage}`);
        console.log("API Response:", response.data);
        setBookings(response.data.data.data);
        setTotalPages(response.data.data.last_page);
                setNextPageUrl(response.data.data.next_page_url);
                setPrevPageUrl(response.data.data.prev_page_url);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin đặt vé:", error);
      }
    };
  
    fetchBookings();
  }, [currentPage]);
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
    }
};
  // const doughnutData = {
  //   labels: ['Search Engines', 'Direct Click', 'Bookmarks Click'],
  //   datasets: [
  //     {
  //       data: [30, 30, 40],
  //       backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384'],
  //       hoverBackgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384'],
  //     },
  //   ],
  // };
  
  // const doughnutOptions = {
  //   maintainAspectRatio: false,
  //   cutout: '70%', // Tạo khoảng trống ở giữa
  //   plugins: {
  //     legend: {
  //       position: 'right',
  //       labels: {
  //         boxWidth: 20,
  //       },
  //     },
  //   },
  // };

  // const barData = {
  //   labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
  //   datasets: [
  //     {
  //       label: 'CHN',
  //       data: [30, 25, 20, 25, 30, 35, 40, 35],
  //       backgroundColor: '#a27efc',
  //     },
  //     {
  //       label: 'USA',
  //       data: [20, 30, 25, 35, 25, 20, 30, 25],
  //       backgroundColor: '#ff7e7e',
  //     },
  //     {
  //       label: 'UK',
  //       data: [40, 35, 30, 40, 35, 30, 50, 45],
  //       backgroundColor: '#5ac7fd',
  //     },
  //   ],
  // };
  
  // const barOptions = {
  //   maintainAspectRatio: false,
  //   scales: {
  //     x: {
  //       beginAtZero: true,
  //     },
  //     y: {
  //       beginAtZero: true,
  //     },
  //   },
  // };

  return (
    <div className="dashboard">
      {/* <h2 className="dashboard-title">Bảng điều khiển Admin</h2> */}
      <div className="dashboard-content">
      <div className="summary">
        
  {/* Box 1: Weekly Sales */}
  {/* <div className="summary-card" style={{ background: 'linear-gradient(to right, #ffafbd, #ffc3a0)' }}>
    <div className="summary-card-header">
      <i className="fas fa-chart-line summary-icon"></i>
      <h3>Tổng đơn hàng</h3>
    </div>
    <div className="summary-number">$ 15,0000</div>
    <div className="summary-footer">
      <span className="summary-change positive">
        
      </span>
    </div>
  </div> */}

  {/* Box 2: Weekly Orders */}
  {/* <div className="summary-card" style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }}>
    <div className="summary-card-header">
      <i className="fas fa-bookmark summary-icon"></i>
      <h3>Phân tích</h3>
    </div>
    <div className="summary-number">45,6334</div>
    <div className="summary-footer">
      <span className="summary-change negative">
        
      </span>
    </div>
  </div> */}

  {/* Box 3: Visitors Online */}
  {/* <div className="summary-card" style={{ background: 'linear-gradient(to right, #96fbc4, #96fbc4)' }}>
    <div className="summary-card-header">
      <i className="fas fa-map-marker-alt summary-icon"></i>
      <h3>Tổng sản phẩm</h3>
    </div>
    <div className="summary-number">95,5741</div>
    <div className="summary-footer">
      <span className="summary-change positive">
      </span>
    </div>
  </div> */}
  <RevenueByCinema/>
  
</div>
        {/* <div className="charts-container">
          <div className="quarterly-revenue">
            <h3>Hiệu suất</h3>
            <div className="area-chart">
            <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="revenue-summary">
            <h3>Tổng doanh thu</h3>
            <div className="revenue-chart">
              <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
            </div>
            <p className="revenue-amount">$120,000</p>
          </div>
        </div> */}
        {/* Thêm bảng vào dưới biểu đồ */}
        <div className="recent-orders">
          <h3>Đơn hàng gần đây</h3>
          <table>
            <thead>
              <tr>
              <th>ID</th>
              <th>Người Dùng</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Suất Chiếu</th>
              <th>Phim</th>
              <th>Phương Thức Thanh Toán</th>
              {/* <th>Giá Vé</th>
              <th>Giá Combo</th> */}
              <th>Tổng Tiền</th>
              <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
  {bookings.length > 0 ? (
    bookings.map((booking: Booking) => (
      <tr key={booking.id}>
        <td>{booking.id}</td>
        <td>{booking.user?.user_name || "Unknown User"}</td>
        <td>{booking.user?.email || "Unknown User"}</td>
        <td>{booking.user?.phone || "Unknown User"}</td>
        <td>{booking.showtime?.showtime_date || "Unknown Showtime"}</td>
        <td>{booking.showtime?.movie_in_cinema.movie.movie_name|| "Unknown Movie"}</td>
        <td>{booking.pay_method?.pay_method_name || "Unknown Payment Method"}</td>
        {/* <td>${booking.price_ticket?.toFixed(2) || "0.00"}</td>
        <td>${booking.price_combo?.toFixed(2) || "0.00"}</td> */}
        <td>{booking.amount}</td>
        <td>{booking.status}</td>
        
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={10} className="text-center">
        Không có đơn hàng nào.
      </td>
    </tr>
  )}
</tbody>
          </table>
        </div>
        {/* <nav className="d-flex justify-content-center mt-4">
    <ul className="pagination">
        
        <li className={`page-item ${!prevPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => prevPageUrl && setCurrentPage(currentPage - 1)}
                disabled={!prevPageUrl}
            >
                Trước
            </button>
        </li>

        
        {totalPages > 5 && currentPage > 3 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(1)}>
                    1
                </button>
            </li>
        )}
        
        {totalPages > 5 && currentPage > 4 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {[...Array(5)].map((_, index) => {
            const pageNumber = currentPage - 2 + index;
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                return (
                    <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? 'active' : ''}`}
                    >
                        <button className="page-link" onClick={() => handlePageChange(pageNumber)}>
                            {pageNumber}
                        </button>
                    </li>
                );
            }
            return null;
        })}

        {totalPages > 5 && currentPage < totalPages - 3 && (
            <li className="page-item disabled">
                <span className="page-link">...</span>
            </li>
        )}

        {totalPages > 5 && currentPage < totalPages - 2 && (
            <li className="page-item">
                <button className="page-link" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                </button>
            </li>
        )}

       
        <li className={`page-item ${!nextPageUrl ? 'disabled' : ''}`}>
            <button
                className="page-link"
                onClick={() => nextPageUrl && setCurrentPage(currentPage + 1)}
                disabled={!nextPageUrl}
            >
                Tiếp
            </button>
        </li>
    </ul>
</nav> */}
      </div>
    </div>
  );
};

export default DashboardAdmin;
