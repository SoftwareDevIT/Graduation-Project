import React, { useState } from 'react';

const UserForm = () => {

    return (
        <div className="form-container">
            <h2>Add New Product</h2>
            <form className="product-form">
                <div className="form-group">
                    <label>Product Name:</label>
                    <input
                        type="text"
                        placeholder="Enter product name"
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                      
                        placeholder="Enter product description"
                    />
                </div>

                <div className="form-group">
                    <label>Price:</label>
                    <input
                        type="number"
                       
                        placeholder="Enter product price"
                    />
                </div>

                <div className="form-group">
                    <label>Category:</label>
                    <input
                        type="text"
                        placeholder="Enter product category"
                    />
                </div>

                <button type="submit" className="submit-btn">Add Product</button>
            </form>
        </div>
    );
};

export default UserForm;
