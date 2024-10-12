import React from 'react';
import './PostsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import PostsDashboard from '../../../component/Admin/PostsDasboard/PostsDashboard';



function PostsManager() {
    return (
        <div className="postsmanager">
            <Sidebar />
            <div className="postsadmin">
                <Header />
                <PostsDashboard/>
            </div>
        </div>
    );
}

export default PostsManager;
