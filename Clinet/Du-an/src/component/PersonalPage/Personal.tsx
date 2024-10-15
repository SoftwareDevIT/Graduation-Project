import React from 'react';
import './Personal.css'; // Import CSS
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';

const Profile: React.FC = () => {
    return (
        <>
        <Header/>
    <div className='main-content'>
<div className="container">
    <div className="cardacounnt">
        <div className="cover">
        <img id="placeholder-cover" src="https://cdn.moveek.com/bundles/ornweb/img/no-cover.png" className="cover-img" alt="giang1234" />
        </div>
        <div className="acounntone">
            <div className='avatas'>
                <img src="https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png" alt="" />
            </div>
            <div className='nameacount'>
               <h3>nptg1311</h3>
            </div>
        </div>

    </div>
    <div className="moveslike">
        <h3>Phim tui thích</h3>
        <div className='phimyeuthich'>
           <div className="row">
           <div className="item-phim col-lg-4 ">
              <div className="img">  <img src="https://cdn.moveek.com/storage/media/cache/tall/663458008cfa2269960147.jpg" alt="" /></div>
               <div className="nutlike">
               <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00d97e"><path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z"/></svg>
               <span>100%</span>
               </div>
            </div>
            <div className="item-phim col-lg-4">
               <div className="img">
               <img src="https://cdn.moveek.com/storage/media/cache/tall/66e7ddfc73b0d564220537.jpg" alt="" />
               </div>
               <div className="nutlike"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#5f6368"><path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z"/></svg>
               <span className='nobackground'>100%</span> </div>
               
            </div>
            <div className="item-phim col-lg-4">
                <div className="img">  <img src="https://cdn.moveek.com/storage/media/cache/tall/66c421ae14a48844972400.jpg" alt="" /></div>
              
              <div className="nutlike">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#00d97e"><path d="M720-144H264v-480l288-288 32 22q17 12 26 30.5t5 38.5l-1 5-38 192h264q30 0 51 21t21 51v57q0 8-1.5 14.5T906-467L786.93-187.8Q778-168 760-156t-40 12Zm-384-72h384l120-279v-57H488l49-243-201 201v378Zm0-378v378-378Zm-72-30v72H120v336h144v72H48v-480h216Z"/></svg>
              <span>100%</span>
              </div>
            </div>
           </div>
        </div>
    </div>
    <div className='activities'>
   <h4 className='text-center'>Hoạt động gần đây</h4>
   <div className="activity-list">
      <div className="activity-item">
         <div className="activity-info">
            <span className="activity-dot">•</span>
            <span className="activity-text">
               <strong>giang1234</strong> đã thích <strong>Transformers Một</strong>
            </span>
         </div>
         <span className="activity-time">42 phút trước</span>
      </div>
      <div className="activity-item">
         <div className="activity-info">
            <span className="activity-dot">•</span>
            <span className="activity-text">
               <strong>giang1234</strong> đã thích <strong>CẤM</strong>
            </span>
         </div>
         <span className="activity-time">43 phút trước</span>
      </div>
      <div className="activity-item">
         <div className="activity-info">
            <span className="activity-dot">•</span>
            <span className="activity-text">
               <strong>giang1234</strong> đã thích <strong>Joker 2: Điên Có Đôi</strong>
            </span>
         </div>
         <span className="activity-time">43 phút trước</span>
      </div>
      <div className="see-more">Xem thêm</div>
   </div>
</div>

</div>
    </div>
        <Footer/>
        </>
    );
};

export default Profile;
