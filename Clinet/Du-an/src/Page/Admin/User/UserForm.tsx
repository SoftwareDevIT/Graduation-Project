import React from 'react';
import './UserManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import UserForm from '../../../component/Admin/UserDashboard/UserForm';



function UserForm1() {
    return (
        <div className="usermanager">
            <Sidebar />
            <div className="mainadmin">
                <Header />
                <UserForm/>
            </div>
        </div>
    );
}

export default UserForm1;
