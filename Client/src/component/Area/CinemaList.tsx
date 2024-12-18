import React from 'react';
import styles from './CinemaList.module.css';
import Header from '../Header/Hearder';
import Footer from '../Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Cinema {
  id: number;
  name: string;
  address: string;
  logo: string;
}

const cinemaData: Cinema[] = [
  {
    id: 1,
    name: 'Cinestar Quốc Thanh',
    address: '271 Nguyễn Trãi, P. Nguyễn Cư Trinh, Q.1, Tp. Hồ Chí Minh',
    logo: 'https://i.imgur.com/abc.png',
  },
  {
    id: 2,
    name: 'Cinestar Hai Bà Trưng',
    address: '135 Hai Bà Trưng, P. Bến Nghé, Q.1, Tp. Hồ Chí Minh',
    logo: 'https://i.imgur.com/abc.png',
  },
  {
    id: 3,
    name: 'Mega GS Cao Thắng',
    address: 'Lầu 6 – 7, 19 Cao Thắng, P.2, Q.3, Tp. Hồ Chí Minh',
    logo: 'https://i.imgur.com/mega.png',
  },
  {
    id: 4,
    name: 'Mega GS Lý Chính Thắng',
    address: '212 Lý Chính Thắng, phường 9, quận 3',
    logo: 'https://i.imgur.com/mega.png',
  },
  {
    id: 5,
    name: 'DCINE Bến Thành',
    address: 'Số 6, Mạc Đĩnh Chi, Q.1, Tp. Hồ Chí Minh',
    logo: 'https://i.imgur.com/dcine.png',
  },
  {
    id: 6,
    name: 'Beta Quang Trung',
    address: '645 Quang Trung, Phường 11, Quận Gò Vấp, Thành phố Hồ Chí Minh',
    logo: 'https://i.imgur.com/beta.png',
  },
  {
    id: 7,
    name: 'Beta Trần Quang Khải',
    address: 'Tầng 2 & 3, Tòa nhà IMC, 62 Đường Trần Quang Khải, Quận 1',
    logo: 'https://i.imgur.com/beta.png',
  },
];

const CinemaList: React.FC = () => {
  return (
    <>
    <Header/>
    <div className="banner-movies">
              <h2>Rạp phim khu vực Tp. Hồ Chí Minh</h2>
              <div className="text-white mt-0 description">
              Danh sách rạp chiếu phim tại khu vực Tp. Hồ Chí Minh
              </div>
            </div>
    <div className={styles.cinemaContainer}>
      <div className={styles.searchBox}>
      <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
        <input type="text" placeholder="Tìm rạp tại Tp. Hồ Chí Minh" />
      </div>
      <ul className={styles.cinemaList}>
        {cinemaData.map((cinema) => (
          <li key={cinema.id} className={styles.cinemaItem}>
            <img src={cinema.logo} alt={cinema.name} className={styles.cinemaLogo} />
            <div>
              <h3 className={styles.cinemaName}>
                {cinema.name} <span className={styles.ticketBadge}>bán vé</span>
              </h3>
              <p className={styles.cinemaAddress}>{cinema.address}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
    <Footer/>
    </>
  );
};

export default CinemaList;
