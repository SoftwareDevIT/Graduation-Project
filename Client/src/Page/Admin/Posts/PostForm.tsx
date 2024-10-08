import React from 'react';
import './PostsManager.css'
import Sidebar from '../../../component/Admin/SidebarDashboard/Sidebar';
import Header from '../../../component/Admin/HeaderDashboard/Header1';
import PostsAdd from '../../../component/Admin/PostsDasboard/PostsAdd';





function PostsFormManager() {
    return (
        <div className="postsmanager">
            <Sidebar />
            <div className="postsadmin">
                <Header />
                <PostsAdd/>
            </div>
        </div>
    );
}

export default PostsFormManager;
