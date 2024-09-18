import React from 'react';
import './RevenueByMovies.css';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);
const RevenueByMovies = () => {
    // Sample data for bar chart
    const barData = {
        labels: ['Movie A', 'Movie B', 'Movie C', 'Movie D'],
        datasets: [
            {
                label: 'Revenue by Movie',
                data: [1200, 1500, 800, 1000],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    // Sample data for pie chart
    const pieData = {
        labels: ['Movie A', 'Movie B', 'Movie C', 'Movie D'],
        datasets: [
            {
                label: 'Revenue Distribution',
                data: [1200, 1500, 800, 1000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)'
                ],
                borderColor: 'rgba(0, 0, 0, 0.2)',
                borderWidth: 1
            }
        ]
    };
    return (
        <div className="revenue-by-movie">
           <h2>Movie Revenue Statistics</h2>
            <div className="chart-container">
                <div className="chart-section">
                    <h3>Revenue by Movie</h3>
                    <div className="chart-wrapper">
                        <Bar data={barData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return `Revenue: $${tooltipItem.raw}`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    beginAtZero: true
                                },
                                y: {
                                    beginAtZero: true
                                }
                            }
                        }} />
                    </div>
                </div>
                <div className="chart-section">
                    <h3>Revenue Distribution</h3>
                    <div className="chart-wrapper">
                        <Pie data={pieData} options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return `Revenue: $${tooltipItem.raw}`;
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
            <button className="export-btn">Export Data</button>
        </div>
    );
};

export default RevenueByMovies;
