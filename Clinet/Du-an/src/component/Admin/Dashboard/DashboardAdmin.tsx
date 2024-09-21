import React from "react";
import "./DashboardAdmin.css";
import { Pie, Line } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";


ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, CategoryScale, LinearScale, PointElement);

const DashboardAdmin = () => {
  const pieData = {
    labels: ["Total Revenue"],
    datasets: [
      {
        data: [120000],
        backgroundColor: ["#f56565"], // Orange color
        borderColor: ["#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  // Area chart data for performance
  const areaData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Page Views",
        data: [20, 30, 50, 40, 60, 30, 40, 50, 70, 40, 60, 50],
        backgroundColor: "rgba(245, 101, 101, 0.2)", // Light orange fill
        borderColor: "#f56565", // Orange color for line
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        fill: true,
      },
      {
        label: "Clicks",
        data: [10, 20, 30, 25, 40, 35, 30, 20, 50, 35, 40, 45],
        backgroundColor: "rgba(56, 161, 105, 0.2)", // Light green fill
        borderColor: "#38a169", // Green color for line
        borderWidth: 2,
        pointBackgroundColor: "#ffffff",
        fill: true,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Admin Dashboard</h2>
      <div className="dashboard-content">
        <div className="summary">
          <div className="summary-card">
            <h3>Users</h3>
            <p className="summary-number">150</p>
          </div>
          <div className="summary-card">
            <h3>Analytics</h3>
            <p className="summary-number">75</p>
          </div>
          <div className="summary-card">
            <h3>Sales</h3>
            <p className="summary-number">$10,000</p>
          </div>
          <div className="summary-card">
            <h3>Comments</h3>
            <p className="summary-number">1,200</p>
          </div>
        </div>
        <div className="charts-container">
          <div className="revenue-summary">
            <h3>Total Revenue</h3>
            <div className="revenue-chart">
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            </div>
            <p className="revenue-amount">$120,000</p>
          </div>
          <div className="quarterly-revenue">
            <h3>Performance</h3>
            <div className="area-chart">
              <Line data={areaData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
