import React from 'react';
import './MoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';

import UpdateMovie from '../../../component/Admin/MoviesDashboard/MovieUpdate';




function MoviesUpdateManager() {
    return (
        <div className="moviesmanager">
            <Sidebar />
            <div className="moviesadmin">
                <Header />
                <UpdateMovie/>
            </div>
        </div>
    );
}

export default MoviesUpdateManager;
