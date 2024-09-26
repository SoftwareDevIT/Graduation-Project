import React from 'react';
import './CinemasManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import CinemasAdd from '../../../component/Admin/CinemasDashboard/CinemasAdd';


function CinemasAddManager() {
    return (
        <div className="cinemasmanager">
            <Sidebar />
            <div className="cinemasadmin">
                <Header />
                <CinemasAdd/>
            </div>
        </div>
    );
}

export default CinemasAddManager;
