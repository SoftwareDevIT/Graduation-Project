import React, { useState } from 'react';
import './CityForm.css';

interface CityFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ isVisible, onClose }) => {
  const [search, setSearch] = useState('');

  const cities = [
    { name: 'Tp. Hồ Chí Minh', theaters: 59 },
    { name: 'Hà Nội', theaters: 41 },
    { name: 'Đà Nẵng', theaters: 9 },
    { name: 'Đồng Nai', theaters: 8 },
    { name: 'Bình Dương', theaters: 8 },
    { name: 'Bà Rịa - Vũng Tàu', theaters: 8 },
    { name: 'Khánh Hòa', theaters: 6 },
    { name: 'Cần Thơ', theaters: 5 },
    { name: 'Thừa Thiên - Huế', theaters: 5 },
    { name: 'Lâm Đồng', theaters: 5 },
    { name: 'Quảng Ninh', theaters: 4 },
  ];

  // Lọc danh sách tỉnh/thành phố
  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Lớp phủ ngoài */}
      {isVisible && (
        <div
          className="city-form-overlay"
          onClick={onClose} // Gọi hàm onClose khi click vào overlay
        ></div>
      )}

      {/* Form chính */}
      {isVisible && (
        <div className="city-form-container">
          <div className="city-form">
            {/* Ô tìm kiếm */}
            <div className="search-box">
              <input
                type="text"
                placeholder="Tìm theo tỉnh, thành phố"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            {/* Danh sách các tỉnh/thành phố */}
            <ul className="city-list">
              {filteredCities.map((city, index) => (
                <li key={index} className="city-item">
                  <div className="city-name">{city.name}</div>
                  <div className="city-theaters">{city.theaters} rạp</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default CityForm;
