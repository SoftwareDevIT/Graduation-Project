import React from 'react';
import './TicketsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import TicketsDashboard from '../../../component/Admin/TicketsDashboard/TicketsDashboard';



function TicketsManager() {
    return (
        <div className="ticketsmanager">
            <Sidebar />
            <div className="ticketsadmin">
                <Header />
                <TicketsDashboard/>
            </div>
        </div>
    );
}

export default TicketsManager;
