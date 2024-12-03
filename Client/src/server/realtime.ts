import Echo from "laravel-echo";
import axios from "axios";
import Pusher from "pusher-js";

// Hàm khởi tạo Echo với cấu hình từ API
async function initializeEcho() {
    try {
        // Gọi API lấy cấu hình từ backend
        const response = await axios.get("http://localhost:8000/api/env-config");
        const config = response.data;

        const csrfMeta = document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        const csrfToken = csrfMeta ? csrfMeta.content : ''; // Empty string or a default value
        
        


        // Tạo kết nối với Laravel Echo
        const echo = new Echo({
            broadcaster: "pusher",
            key: config.PUSHER_APP_KEY,
            cluster: config.PUSHER_APP_CLUSTER,
            forceTLS: config.PUSHER_SCHEME === "https",  // Sử dụng TLS nếu backend sử dụng HTTPS
            wsHost: config.PUSHER_HOST || "localhost",  // Sử dụng localhost nếu không có host cấu hình
            wsPort: config.PUSHER_PORT || 6001,  // Cổng WebSocket nếu không có
            wssPort: config.PUSHER_PORT || 6001,  // Cổng WebSocket bảo mật nếu không có
            enabledTransports: ["ws", "wss"],  // Cung cấp các giao thức ws và wss
            authEndpoint: "http://localhost:8000/broadcasting/auth",  // Endpoint xác thực
            csrfToken: csrfToken, // Nếu cần CSRF token
            bearerToken: 'your-jwt-token-here', // Nếu cần token Bearer
            debug: true,
        });

        // Kiểm tra kết nối thành công
        echo.connector.pusher.connection.bind('connected', function() {
            console.log('Đã kết nối thành công với Pusher!');
        });

        echo.connector.pusher.connection.bind('disconnected', function() {
            console.log('Mất kết nối với Pusher!');
        });

        return echo;
    } catch (error) {
        console.error("Error initializing Echo:", error);
        return null;
    }
}

export default initializeEcho;
