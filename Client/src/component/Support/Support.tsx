import React from 'react';
import './Support.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Hearder';

const SupportCenter: React.FC = () => {
  return (
    <>
      <Header />
      <div className="support-center">
        <header className='headersp'>
          <h1>Trung tâm hỗ trợ</h1>
          <div className='header-gt'>
            <p>
              Trung tâm hỗ trợ khách hàng của <strong>FlickHive</strong> sẽ hỗ trợ các vấn đề liên quan đến <strong>mua vé trực tuyến và thanh toán</strong> tại website FlickHive.com...<br />
              Các vấn đề khác chúng tôi sẽ không tiếp nhận, vui lòng xem thông tin trên website hoặc liên hệ trực tiếp với rạp để được giải quyết.
            </p>
          </div>
        </header>

        <section className="contact-info">
          <div className="contact-method">
            <h2>Zalo</h2>
            <a href="https://zalo.me/FlickHive" target="_blank" rel="noopener noreferrer">
              zalo.me/FlickHive
            </a>
            <p>09:00 – 23:00</p>
          </div>

          <div className="contact-method">
            <h2>Hotline</h2>
            <p><strong>024 7308 8890</strong></p>
            <p>09:00 – 23:00 - Tất cả các ngày</p>
          </div>

          <div className="contact-method">
            <h2>Email</h2>
            <a href="mailto:hotro@FlickHive.vn">hotro@FlickHive.vn</a>
            <p>Phản hồi nhanh nhất có thể</p>
          </div>

          <div className="contact-method">
            <h2>Hướng dẫn sử dụng</h2>
            <a href="https://kb.FlickHive.com" target="_blank" rel="noopener noreferrer">
              kb.FlickHive.com
            </a>
            <p>Cách mua vé, thanh toán...</p>
          </div>
        </section>

        <section className="faq-guides">
          <div className="faq">
            <h2>Câu hỏi thường gặp</h2>

            <div className="faq-item">
              <h3>Rạp FlickHive nằm ở đâu?</h3>
              <p>
                FlickHive không phải là rạp phim. FlickHive là website thông tin điện ảnh cung cấp các thông tin như: Lịch chiếu,
                Đặt vé phim, Tin tức điện ảnh, Review / Đánh giá phim, dữ liệu phim ảnh...
              </p>
              <p>
                Kể từ tháng 11/2018, FlickHive triển khai bán vé trực tuyến cho các cụm rạp trong cả nước.
              </p>
            </div>

            <div className="faq-item">
              <h3>Tôi có thể mua vé các cụm rạp nào tại FlickHive?</h3>
              <p>Hiện tại bạn đã có thể mua vé các hệ thống rạp:</p>
              <ul>
                <li><a href="#">Beta Cinemas</a></li>
                <li><a href="#">Mega GS Cinemas</a></li>
                <li><a href="#">CineStar</a></li>
                <li><a href="#">Dcine</a></li>
                <li><a href="#">Cinemax</a></li>
                <li><a href="#">Starlight</a></li>
                <li><a href="#">Rio Cinemas</a></li>
                <li><a href="#">Touch Cinema</a></li>
              </ul>
              <p>Các hệ thống khác, FlickHive sẽ kết nối trong thời gian sắp tới.</p>
            </div>

            {/* Thêm các phần hỏi đáp mới ở đây */}
            <div className="faq-item">
              <h3>Tôi đặt vé trước có được không?</h3>
              <p>
                FlickHive không hỗ trợ đặt vé, bạn cần thanh toán để nhận vé.
              </p>
            </div>

            <div className="faq-item">
              <h3>Thanh toán xong thì sao nữa?</h3>
              <p>
                Sau khi thanh toán thành công bạn sẽ nhận được mã vé qua email và tin nhắn đã chọn. Bạn mang mã vé đến quầy để đổi vé giấy. Nếu không nhận được email / tin nhắn, hãy liên hệ với FlickHive để được hỗ trợ ngay nhé.
              </p>
            </div>

            <div className="faq-item">
              <h3>Tôi mua nhầm vé, có đổi / trả được không?</h3>
              <p>
                Vé đã mua không thể đổi hoặc hoàn tiền.
              </p>
            </div>

            <div className="faq-item">
              <h3>Tôi đã bị trừ tiền nhưng không nhận được mã vé?</h3>
              <p>
                Nếu bạn mua vé ở các cụm rạp FlickHive hỗ trợ mua trực tuyến, hãy liên hệ ngay thông qua số hotline, chúng tôi sẽ xử lý trong tối đa 15 phút.<br />
                Đối với các cụm rạp khác, hãy sang website của rạp hoặc gọi số hotline của rạp để được hỗ trợ.
              </p>
            </div>
          </div>

          <div className="guides">
            <h2>Hướng dẫn</h2>
            <ul>
              <li><a href="#">Hướng dẫn các bước mua vé</a></li>
              <li><a href="#">Thanh toán bằng Thẻ / tài khoản ngân hàng nội địa</a></li>
              <li><a href="#">Thanh toán bằng Thẻ tín dụng / ghi nợ quốc tế</a></li>
              <li><a href="#">Thanh toán tại Cửa hàng gần nhà</a></li>
              <li><a href="#">Thanh toán bằng Ví điện tử MoMo</a></li>
              <li><a href="#">Thanh toán bằng Ví điện tử FPT Pay</a></li>
              <li><a href="#">Thanh toán bằng ví điện tử ShopeePay</a></li>
            </ul>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SupportCenter;
