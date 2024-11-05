import React from 'react';
import './LoginAdmin.css'

const AdminLogin = () => {
    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Admin Login</h2>
                <form>
                    <div className="input-group">
                        <label>Username</label>
                        <input type="text" required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password" required />
                    </div>
                    <button type="submit" className="login-button">Log In</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
