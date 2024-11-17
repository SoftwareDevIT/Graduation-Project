import React, { useEffect, useState } from "react";
import "./Hearder.css";
import { Link, useNavigate } from "react-router-dom";
import { Cinema } from "../../interface/Cinema";
import { Location } from "../../interface/Location";
import instance from "../../server";


const Header = () => {
  const [isHeaderLeftVisible, setHeaderLeftVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isProfileMenuVisible, setProfileMenuVisibles] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const navigate = useNavigate();




  useEffect(() => {
    // Kiểm tra nếu có userId trong localStorage
    const token = localStorage.getItem("token");
    const user_id = localStorage.getItem("user_id");
    if (user_id && token) {
      setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
    }
    const fetchLocations = async () => {
      try {
        const response = await instance.get("/location");
        // console.log(response.data); // Kiểm tra dữ liệu nhận về từ API
        setLocations(response.data.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);
  useEffect(() => {
    if (selectedLocation !== null) {
      instance.get(`/cinema-by-location/${selectedLocation}`).then((response) => {
        setCinemas(response.data.data);
        // console.log(setCinemas);

      });
    }
  }, [selectedLocation]);
  const toggleHeaderLeft = () => {
    setHeaderLeftVisible((prev) => !prev);
  };
  const toggleProfileMenu = () => {
    setProfileMenuVisibles((prev) => !prev); // Toggle the profile menu visibility
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); // Xóa userId khỏi localStorage
    localStorage.removeItem("user_profile"); // Xóa userId khỏi localStorage
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    navigate('/')
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); // Cập nhật giá trị tìm kiếm vào state
  };


  // Hàm khi nhấn nút tìm kiếm
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Chuyển sang trang kết quả tìm kiếm, truyền từ khóa qua URL
      navigate(`/movie/search/${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(Number(e.target.value));
  };


  return (
    <header className="header">
      <div className="container">
        <div className="row menu ">
          <div className="col-lg-6 col-md-4 col-sm-4 col-4 menu-2">
            <button
              className="navbar-toggler navbar-dark thanhmenu"
              type="button"
              onClick={toggleHeaderLeft} // Gọi hàm toggle khi bấm nút
              aria-controls="navbarToggleExternalContent"
              aria-expanded={isHeaderLeftVisible}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`header-left ${isHeaderLeftVisible ? "visible" : "hidden"
                }`}
              id="menukkk"
            >
       
                <form onSubmit={handleSearchSubmit}>
                  <input id="search-mobile"
                    type="text"
                    placeholder="Từ khóa tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </form>
              

              <Link
                to={"/buy-ticket"}
                style={{ color: "red", fontWeight: "bold" }}
              >
                Đặt vé phim chiếu rạp
              </Link>
<Link to={'/buy-ticket'}>Lịch chiếu</Link>
          
              <div className="dropdown">
                <a href="#" className="dropbtn1" >
                  Rạp{" "}
                  <span className="arrow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"

                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#555"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <div className="dropdown-content">
                  <div className="timkiemrap">
                    <input
                      type="text"
                      placeholder="Tìm rạp tại"
                      style={{
                        width: "120px",
                        padding: "4px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                        marginRight: "5px",
                      }}
                    />
                    <select
                      name="location"
                      id="location-select"
                      onChange={handleLocationChange}
                      style={{
                        width: "100px",
                        padding: "4px",
                        marginBottom: "12px",
                        boxSizing: "border-box",
                      }}
                    >
                      <option value="">Chọn khu vực</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.location_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {cinemas.map((cinema) => (
                    <a key={cinema.id} href="#">
                      {cinema.cinema_name}
                    </a>
                  ))}
                </div>

              </div>
              <div className="dropdown">
                <a href="#" className="dropbtn">
                  Phim{" "}
                  <span className="arrow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#555"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <div className="dropdown-content">
                  <Link to={"/movieshowing"}>Đang chiếu</Link>
                  <a href="#">Sắp chiếu</a>
                  <a href="#">Chiếu sớm</a>
                  <a href="#">Phim Việt Nam</a>
                </div>
              </div>
              <div className="dropdown">
                <a href="#" className="dropbtn">
                  Tin Tức{" "}
                  <span className="arrow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#555"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                </a>
                <div className="dropdown-content">
                  <Link to={'/FilmNews'}>Tin điện ảnh</Link>
                  <a href="#">Đánh giá phim</a>
                  <a href="#">Video</a>
                  <a href="#">TV Series</a>
                </div>
              </div>
              <Link to={'/sp'}>Cộng đồng</Link>
                         </div>
          </div>

          <div className="header-logo col-lg-1 col-md-4 col-sm-4 col-4 ">
            <Link to={"/"}>
              {" "}
              <span className="logo-first-letter">F</span>lickHive
            </Link>
          </div>
          <div className="header-right col-lg-5 col-md-4 col-sm-4 col-4 ">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </form>
            <Link to="/map" className="icon-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-geo-alt"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10" />
                <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
            </Link>
            <Link to="/sp" className="icon-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                fill="currentColor"
                className="bi bi-question-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
              </svg>
            </Link>
            {isLoggedIn ? (
              <div className="icon-link" onClick={toggleProfileMenu}>
                <img className="avtat-img" src="	https://cdn.moveek.com/bundles/ornweb/img/no-avatar.png" alt="" />
                <i className="fas fa-check checkmark"></i>
                {isProfileMenuVisible && (
                  <div className="profile-dropdown">
                    <Link to="/Personal">Trang cá nhân</Link>
                    <Link to="/profile">Quản lý tài khoản</Link>
                    <Link to="/movies">Vé phim</Link>
                    <Link to="/credits">Moveek Credits</Link>
                    <Link to="/login" onClick={handleLogout}>Đăng xuất</Link>
                  
                  </div>
                )}
              </div>

            ) : (
              <>
                <Link to="/login" className="icon-link">
                  {/* Biểu tượng đăng nhập */}
                </Link>
                <Link to="/login" className="icon-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-person-circle"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                    <path
                      fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                    />
                  </svg>
                </Link>
              </>
            )}

            <span className="thongbao">&#128276;</span>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
