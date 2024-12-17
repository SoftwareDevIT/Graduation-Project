import axios from 'axios'; // Import Axios
import React, { useState, useEffect, useRef } from 'react';
import './Header1.css';
import { FaBell, FaCog, FaUserCircle, FaCamera } from 'react-icons/fa';
import { Modal } from 'antd';
import { User } from '../../../interface/User';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';

const Header = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [barcodeData, setBarcodeData] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const barcodeReader = useRef(new BrowserMultiFormatReader());
    const navigate = useNavigate();
    const location = useLocation();

    // Hàm gọi API để check-in
    const checkInSeat = async (barcode: string) => {
        try {
            const response = await axios.post('/api/checkInSeat', { barcode });
            console.log("Check-in thành công:", response.data);

            // Hiển thị thông báo thành công
            alert(`Check-in thành công: ${response.data.message || 'OK'}`);
        } catch (error: any) {
            console.error("Lỗi khi check-in:", error);
            alert(`Lỗi khi check-in: ${error.response?.data?.message || 'Có lỗi xảy ra'}`);
        }
    };

    const handleBarcodeScan = (result: string) => {
        setBarcodeData(result); // Cập nhật dữ liệu quét được
        console.log("Barcode Data:", result); 

        // Gửi dãy số đến API để check-in
        checkInSeat(result);
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            if (videoStream) {
                videoStream.getTracks().forEach(track => track.stop());
                setVideoStream(null);
            }
            setIsCameraOn(false);
            setIsModalVisible(false);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                setVideoStream(stream);
                setIsCameraOn(true);
                setIsModalVisible(true);
            } catch (error) {
                console.error("Error accessing camera:", error);
            }
        }
    };

    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.srcObject = videoStream;
        }
    }, [videoStream]);

    useEffect(() => {
        if (isCameraOn && videoStream) {
            const videoElement = videoRef.current;
            if (videoElement) {
                barcodeReader.current.decodeFromVideoDevice('', videoElement, (result, error) => {
                    if (result) {
                        handleBarcodeScan(result.getText());
                    }
                    if (error) {
                        console.error(error);
                    }
                });
            }
        } else {
            barcodeReader.current.reset();
        }
    }, [isCameraOn, videoStream]);

    return (
        <div className="header1">
            <h1>Header</h1>
            <div className="header-actions">
                <div className="icons-container">
                    <div className="icon" onClick={toggleCamera}>
                        <FaCamera style={{ color: isCameraOn ? 'green' : '#004d40' }} />
                    </div>
                </div>
            </div>
            <Modal
                title="Camera"
                visible={isModalVisible}
                onCancel={() => toggleCamera()}
                footer={null}
                centered
                width="50%"
            >
                {isCameraOn && videoStream && (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: '10px',
                            objectFit: 'cover',
                        }}
                    />
                )}
                {barcodeData && (
                    <div className="barcode-result">
                        <p>Quét Mã Thành Công: {barcodeData}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Header;
