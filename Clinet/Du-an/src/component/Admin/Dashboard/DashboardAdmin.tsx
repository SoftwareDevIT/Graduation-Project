import React from "react";
import "./DashboardAdmin.css";
import { Pie, Line } from "react-chartjs-2";
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
  const pieData = {
    labels: ["Tổng doanh thu"],
    datasets: [
      {
        data: [120000],
        backgroundColor: ["#f56565"],
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  const areaData = {
    labels: [
      "Th1", "Th2", "Th3", "Th4", "Th5", "Th6", "Th7", "Th8", "Th9", "Th10", "Th11", "Th12",
    ],
    datasets: [
      {
        label: "Lượt xem trang",
        data: [20, 30, 50, 40, 60, 30, 40, 50, 70, 40, 60, 50],
        backgroundColor: "rgba(245, 101, 101, 0.2)",
        borderColor: "#f56565",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        fill: true,
      },
      {
        label: "Lượt nhấp chuột",
        data: [10, 20, 30, 25, 40, 35, 30, 20, 50, 35, 40, 45],
        backgroundColor: "rgba(56, 161, 105, 0.2)",
        borderColor: "#38a169",
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Bảng điều khiển Admin</h2>
      <div className="dashboard-content">
        <div className="summary">
          <div className="summary-card">
            <div className="summary-card-header">
              <i className="fas fa-shopping-basket summary-icon"></i>
              <h3>Tổng đơn hàng</h3>
            </div>
            <div className="summary-number">13,647</div>
            <div className="summary-footer">
              <span className="summary-change positive">
                <i className="fas fa-caret-up"></i> 2.3%
              </span>
              <span>Tuần trước</span>
              <a href="#" className="view-more">Xem thêm</a>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-card-header">
              <i className="fas fa-chart-line summary-icon"></i>
              <h3>Phân tích</h3>
            </div>
            <div className="summary-number">75</div>
            <div className="summary-footer">
              <span className="summary-change negative">
                <i className="fas fa-caret-down"></i> 1.2%
              </span>
              <span>Tuần trước</span>
              <a href="#" className="view-more">Xem thêm</a>
            </div>
          </div>

          {/* Ô summary mới: Total Products */}
          <div className="summary-card">
            <div className="summary-card-header">
              <i className="fas fa-box summary-icon"></i>
              <h3>Tổng sản phẩm</h3>
            </div>
            <div className="summary-number">1,248</div>
            <div className="summary-footer">
              <span className="summary-change positive">
                <i className="fas fa-caret-up"></i> 4.5%
              </span>
              <span>Tuần trước</span>
              <a href="#" className="view-more">Xem thêm</a>
            </div>
          </div>
        </div>

        <div className="charts-container">
          <div className="quarterly-revenue">
            <h3>Hiệu suất</h3>
            <div className="area-chart">
              <Line data={areaData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
          <div className="revenue-summary">
            <h3>Tổng doanh thu</h3>
            <div className="revenue-chart">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
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
