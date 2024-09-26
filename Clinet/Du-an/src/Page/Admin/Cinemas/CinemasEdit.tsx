import React from 'react';
import './CinemasManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import CinemasUpdate from '../../../component/Admin/CinemasDashboard/CinemasEdit';


function CinemasEditManager() {
    return (
        <div className="cinemasmanager">
            <Sidebar />
            <div className="cinemasadmin">
                <Header />
                <CinemasUpdate/>
            </div>
        </div>
    );
}

export default CinemasEditManager;
