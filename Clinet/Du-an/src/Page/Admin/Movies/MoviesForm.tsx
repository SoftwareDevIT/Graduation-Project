import React from 'react';
import './MoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import AddMovie from '../../../component/Admin/MoviesDashboard/MovieAdd';



function MoviesAddManager() {
    return (
        <div className="moviesmanager">
            <Sidebar />
            <div className="moviesadmin">
                <Header />
            <AddMovie/>
            </div>
        </div>
    );
}

export default MoviesAddManager;
