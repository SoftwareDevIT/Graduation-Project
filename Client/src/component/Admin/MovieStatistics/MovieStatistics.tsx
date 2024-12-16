import React from "react";
import { Bar } from "react-chartjs-2";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper } from "@mui/material";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import "./MovieStatistics.css"

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const MovieStatistics = () => {
  const optionsTickets = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" as const }, 
      title: { display: true, text: "Số vé bán ra theo phim" },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, minRotation: 0 }, // Nhãn ngang cho biểu đồ thứ nhất
        grid: { display: false },
      },
      y: { grid: { display: true } },
    },
  };

  const optionsRevenue = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: "top" as const },
      title: { display: true, text: "Doanh thu theo phim (VNĐ)" },
    },
    scales: {
      x: {
        ticks: { maxRotation: 0, minRotation: 0 }, // Nhãn ngang cho biểu đồ thứ hai
        grid: { display: false },
      },
      y: { grid: { display: true } },
    },
  };

  const dataTickets = {
    labels: ["SUGA | Agust D TOUR", "Kung Fu Panda 4", "Quỷ Cái", "Quất Mộ Trùng Ma", "Monkey Man Báo Thù"],
    datasets: [
      {
        label: "Số vé bán ra",
        data: [32, 11, 26, 8, 23],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const dataRevenue = {
    labels: ["SUGA | Agust D TOUR", "Kung Fu Panda 4", "Quỷ Cái", "Quất Mộ Trùng Ma", "Monkey Man Báo Thù"],
    datasets: [
      {
        label: "Doanh thu",
        data: [8677300, 4282000, 7791000, 2671000, 8118000],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const rows = [
    { name: "SUGA | Agust D TOUR", tickets: 32, revenue: "8,677,300" },
    { name: "Kung Fu Panda 4", tickets: 11, revenue: "4,282,000" },
    { name: "Quỷ Cái", tickets: 26, revenue: "7,791,000" },
    { name: "Quất Mộ Trùng Ma", tickets: 8, revenue: "2,671,000" },
    { name: "Monkey Man Báo Thù", tickets: 23, revenue: "8,118,000" },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      {/* Bộ lọc ngày và nút */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField type="date" variant="outlined" size="small" />
          <TextField type="date" variant="outlined" size="small" />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary">Load dữ liệu</Button>
          <Button variant="contained" color="success">Xuất báo cáo</Button>
        </Box>
      </Box>

      {/* Biểu đồ */}
      <Box sx={{ display: "flex", gap: 4, marginBottom: 4, height: 400 }}>
        <Box sx={{ flex: 1 }}>
          <Bar data={dataTickets} options={optionsTickets} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Bar data={dataRevenue} options={optionsRevenue} />
        </Box>
      </Box>

      {/* Bảng dữ liệu */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên phim</TableCell>
              <TableCell>Tổng vé bán ra</TableCell>
              <TableCell>Tổng doanh thu</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.tickets}</TableCell>
                <TableCell>{row.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MovieStatistics;
