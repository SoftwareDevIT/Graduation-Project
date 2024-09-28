import React from 'react';
import './Showtimes.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';



function ShowtimesFormManager() {
    return (
        <div className="showtimesmanager">
            <Sidebar />
            <div className="showtimesadmin">
                <Header />
               
            </div>
        </div>
    );  
}

export default ShowtimesFormManager;
