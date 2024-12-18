import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CityForm.css';

interface CityFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const CityForm: React.FC<CityFormProps> = ({ isVisible, onClose }) => {
  const [search, setSearch] = useState('');
  const [cities, setCities] = useState<{ name: string; theaters: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get('location');
        if (response.data.status && response.data.data) {
          const cityData = response.data.data.map((item: any) => ({
            name: item.location_name,
            theaters: item.cinema_count,
          }));
          setCities(cityData);
        } else {
          setError('Không có dữ liệu.');
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchCities();
    }
  }, [isVisible]);

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

            {/* Trạng thái tải dữ liệu */}
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="error-message">{error}</p>}

            {/* Danh sách các tỉnh/thành phố */}
            {!loading && !error && (
              <ul className="city-list">
                {filteredCities.map((city, index) => (
                  <li key={index} className="city-item">
                    <div className="city-name">{city.name}</div>
                    <div className="city-theaters">{city.theaters} rạp</div>
                  </li>
                ))}
                {filteredCities.length === 0 && <p>Không tìm thấy kết quả.</p>}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CityForm;
