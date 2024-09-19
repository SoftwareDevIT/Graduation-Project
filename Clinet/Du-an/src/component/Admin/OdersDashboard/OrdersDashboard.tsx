import React from 'react';
import './OrdersDashboard.css';

const OrdersDashboard = () => {
    const orders = [
        { id: 'ORD001', customer: 'John Doe', product: 'Laptop', quantity: 1, total: 1500, status: 'Pending' },
        { id: 'ORD002', customer: 'Jane Smith', product: 'Smartphone', quantity: 2, total: 800, status: 'Completed' },
        { id: 'ORD003', customer: 'Alice Brown', product: 'Headphones', quantity: 3, total: 300, status: 'Shipped' },
    ];

    return (
        <div className="orders-management">
            <h2>Order Management</h2>
            <div className="actions">
                <button className="add-order-btn">Add Order</button>
            </div>
            <div className="table-container">
                <table className="order-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer}</td>
                                <td>{order.product}</td>
                                <td>{order.quantity}</td>
                                <td>${order.total}</td>
                                <td>{order.status}</td>
                                <td className="action-buttons">
                                    <button className="view-btn">👁</button>
                                    <button className="edit-btn">✏️</button>
                                    <button className="delete-btn">🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersDashboard;
