import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import feather from 'feather-icons';
import './Headerticket.css';

const Headerticket = () => {
    const location = useLocation();

    useEffect(() => {
        feather.replace();

        // Thay đổi màu của các icon bằng cách đặt thuộc tính 'stroke'
        document.querySelectorAll('.buoc.active i svg').forEach((icon) => {
            (icon as SVGElement).style.stroke = '#FF5252'; // Màu đỏ cho icon hoạt động
        });
    }, [location]); // Chạy lại khi URL thay đổi

    const getActiveClass = (path: string): string => {
        return location.pathname.includes(path) ? 'active' : '';
    };

    return (
        <div className="thanh-tien-trinh">
            <div className={`buoc ${getActiveClass('/seat')}`}>
                <i data-feather="grid"></i>
                <span className="label">Chọn ghế</span>
            </div>

            <span className="separator"> &gt; </span>

            <div className={`buoc ${getActiveClass('/orders')}`}>
                <i data-feather="shopping-bag"></i>
                <span className="label">Bắp nước</span>
            </div>

            <span className="separator"> &gt; </span>

            <div className={`buoc ${getActiveClass('/pay')}`}>
                <i data-feather="credit-card"></i>
                <span className="label">Thanh toán</span>
            </div>

            <span className="separator"> &gt; </span>

            <div className="buoc">
                <i data-feather="inbox"></i>
                <span className="label">Thông tin vé</span>
            </div>
        </div>
    );
};

export default Headerticket;
