import React from 'react';
import './RevenueByCinema.css';
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering necessary components for ChartJS
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, ArcElement);

const RevenueByCinema = () => {
    const revenueData = [
        { cinema: 'Cinema 1', revenue: 10000 },
        { cinema: 'Cinema 2', revenue: 15000 },
        { cinema: 'Cinema 3', revenue: 8000 },
    ];

    const totalRevenue = revenueData.reduce((acc, item) => acc + item.revenue, 0);

    const areaData = {
        labels: revenueData.map(item => item.cinema),
        datasets: [{
            label: 'Revenue',
            data: revenueData.map(item => item.revenue),
            backgroundColor: 'rgba(39, 174, 96, 0.4)', // Light green with opacity
            borderColor: '#27ae60', // Dark green
            borderWidth: 2,
            fill: true, // This makes it an area chart
        }],
    };

    const pieData = {
        labels: revenueData.map(item => item.cinema),
        datasets: [{
            label: 'Revenue Distribution',
            data: revenueData.map(item => item.revenue),
            backgroundColor: ['#27ae60', '#3498db', '#e74c3c'],
            borderColor: '#ffffff',
            borderWidth: 2,
        }],
    };

    return (
        <div className="revenue-display">
            <h2>Revenue Overview</h2>
            <div className="summary-card">
                <h3>Total Revenue</h3>
                <p className="total-revenue">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="chart-container">
                <div className="chart-section1">
                    <h3>Revenue by Cinema (Area Chart)</h3>
                    <Line data={areaData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `$${context.raw}`,
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Cinemas',
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Revenue',
                                },
                                ticks: {
                                    callback: (value) => `$${value}`,
                                },
                            },
                        },
                    }} />
                </div>
                <div className="chart-section2">
                    <h3>Revenue Distribution (Pie Chart)</h3>
                    <Pie data={pieData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => `${context.label}: $${context.raw}`,
                                },
                            },
                        },
                    }} />
                </div>
            </div>
            <button className="export-btn">Export Report</button>
        </div>
    );
};

export default RevenueByCinema;
