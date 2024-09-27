import React from 'react';
import './MoviesManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import MoviesAdd from '../../../component/Admin/MoviesDashboard/MoviesForm';
import MoviesForm from '../../../component/Admin/MoviesDashboard/MoviesForm';



function MoviesFormManager() {
    return (
        <div className="moviesmanager">
            <Sidebar />
            <div className="moviesadmin">
                <Header />
                <MoviesForm/>
            </div>
        </div>
    );
}

export default MoviesFormManager;
