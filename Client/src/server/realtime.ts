import Echo from "laravel-echo";
import axios from "axios";
import Pusher from "pusher-js";

// Hàm khởi tạo Echo với cấu hình từ API
async function initializeEcho() {
    try {
        // Gọi API lấy cấu hình từ backend
        const response = await axios.get("http://localhost:8000/api/env-config");
        const config = response.data;

        // Tạo kết nối với Laravel Echo
        const echo = new Echo({
            broadcaster: "pusher",
            key: config.PUSHER_APP_KEY,
            cluster: config.PUSHER_APP_CLUSTER,
            forceTLS: config.PUSHER_SCHEME === "https",  // Sử dụng TLS nếu backend sử dụng HTTPS
            wsPort: config.PUSHER_PORT || undefined,  // Cổng WebSocket
            wssPort: config.PUSHER_PORT || undefined,  // Cổng WebSocket bảo mật
            enabledTransports: ["ws", "wss"],  // Cung cấp các giao thức ws và wss
            authEndpoint: "http://localhost:8000/broadcasting/auth",  // Endpoint xác thực
            debug: true, 
        });

        return echo;
    } catch (error) {
        console.error("Error initializing Echo:", error);
        return null;
    }
}

export default initializeEcho;
