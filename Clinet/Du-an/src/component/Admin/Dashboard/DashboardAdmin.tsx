import React from "react";
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
  const doughnutData = {
    labels: ['Search Engines', 'Direct Click', 'Bookmarks Click'],
    datasets: [
      {
        data: [30, 30, 40],
        backgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384'],
        hoverBackgroundColor: ['#36a2eb', '#4bc0c0', '#ff6384'],
      },
    ],
  };
  
  const doughnutOptions = {
    maintainAspectRatio: false,
    cutout: '70%', // Tạo khoảng trống ở giữa
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
        },
      },
    },
  };

  const barData = {
    labels: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG"],
    datasets: [
      {
        label: 'CHN',
        data: [30, 25, 20, 25, 30, 35, 40, 35],
        backgroundColor: '#a27efc',
      },
      {
        label: 'USA',
        data: [20, 30, 25, 35, 25, 20, 30, 25],
        backgroundColor: '#ff7e7e',
      },
      {
        label: 'UK',
        data: [40, 35, 30, 40, 35, 30, 50, 45],
        backgroundColor: '#5ac7fd',
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
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Bảng điều khiển Admin</h2>
      <div className="dashboard-content">
      <div className="summary">
  {/* Box 1: Weekly Sales */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #ffafbd, #ffc3a0)' }}>
    <div className="summary-card-header">
      <i className="fas fa-chart-line summary-icon"></i>
      <h3>Tổng đơn hàng</h3>
    </div>
    <div className="summary-number">$ 15,0000</div>
    <div className="summary-footer">
      <span className="summary-change positive">
        <i className="fas fa-caret-up"></i> Increased by 60%
      </span>
    </div>
  </div>

  {/* Box 2: Weekly Orders */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #36d1dc, #5b86e5)' }}>
    <div className="summary-card-header">
      <i className="fas fa-bookmark summary-icon"></i>
      <h3>Phân tích</h3>
    </div>
    <div className="summary-number">45,6334</div>
    <div className="summary-footer">
      <span className="summary-change negative">
        <i className="fas fa-caret-down"></i> Decreased by 10%
      </span>
    </div>
  </div>

  {/* Box 3: Visitors Online */}
  <div className="summary-card" style={{ background: 'linear-gradient(to right, #96fbc4, #96fbc4)' }}>
    <div className="summary-card-header">
      <i className="fas fa-map-marker-alt summary-icon"></i>
      <h3>Tổng sản phẩm</h3>
    </div>
    <div className="summary-number">95,5741</div>
    <div className="summary-footer">
      <span className="summary-change positive">
        <i className="fas fa-caret-up"></i> Increased by 5%
      </span>
    </div>
  </div>
</div>
        <div className="charts-container">
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
        </div>

        {/* Thêm bảng vào dưới biểu đồ */}
        <div className="recent-orders">
          <h3>Đơn hàng gần đây</h3>
          <table>
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Ngày</th>
                <th>Sản phẩm</th>
                <th>Tên khách hàng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Loại thanh toán</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#RB5625</td>
                <td>29 Tháng 4, 2024</td>
                <td>Laptop</td>
                <td>Anna M. Hines</td>
                <td>anna.hines@mail.com</td>
                <td>(+1)-555-1564-261</td>
                <td>Burr Ridge/Illinois</td>
                <td>Thẻ tín dụng</td>
                <td>Hoàn tất</td>
              </tr>
              <tr>
                <td>#RB89652</td>
                <td>25 Tháng 4, 2024</td>
                <td>Máy ảnh</td>
                <td>Judith H. Fritsche</td>
                <td>judith.fritsche@mail.com</td>
                <td>(+57)-305-5579-759</td>
                <td>SULLIVAN/Kentucky</td>
                <td>Thẻ tín dụng</td>
                <td>Hoàn tất</td>
              </tr>
              <tr>
                <td>#RB5984</td>
                <td>25 Tháng 4, 2024</td>
                <td>Máy giặt</td>
                <td>Peter T. Smith</td>
                <td>peter.smith@mail.com</td>
                <td>(+33)-655-5187-93</td>
                <td>Yreka/California</td>
                <td>PayPal</td>
                <td>Hoàn tất</td>
              </tr>
              <tr>
                <td>#RB3625</td>
                <td>21 Tháng 4, 2024</td>
                <td>Điện thoại</td>
                <td>Emmanuel J. Delcid</td>
                <td>emmanuel.delcid@mail.com</td>
                <td>(+30)-693-5553-637</td>
                <td>Atlanta/Georgia</td>
                <td>PayPal</td>
                <td>Đang xử lý</td>
              </tr>
              <tr>
                <td>#RB88652</td>
                <td>18 Tháng 4, 2024</td>
                <td>Máy tính</td>
                <td>William J. Cook</td>
                <td>william.cook@mail.com</td>
                <td>(+91)-855-5446-150</td>
                <td>Rosenberg/Texas</td>
                <td>Thẻ tín dụng</td>
                <td>Đang xử lý</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
