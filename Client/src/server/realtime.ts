import Echo from 'laravel-echo';
import Pusher from 'pusher-js'; // Đảm bảo rằng Pusher được import
import instance from '.';
import { AxiosError } from 'axios';
async function initializeEcho() {
    try {
        // Gọi API lấy cấu hình từ backend
        const response = await instance.get("/env-config");
        const config = response.data;
        console.log("Cấu hình từ API:", config);

        // Kiểm tra các tham số cần thiết
        if (!config.PUSHER_APP_KEY || !config.PUSHER_APP_CLUSTER) {
            throw new Error("Thiếu PUSHER_APP_KEY hoặc PUSHER_APP_CLUSTER.");
        }

        // Tạo kết nối với Laravel Echo
        const echo = new Echo({
            broadcaster: Pusher,
            key: config.PUSHER_APP_KEY || "default_key",
            cluster: config.PUSHER_APP_CLUSTER || "mt1",
            forceTLS: config.PUSHER_SCHEME === "https",
            wsHost: config.PUSHER_HOST || "localhost",
            wsPort: config.PUSHER_PORT || 6001,
            wssPort: config.PUSHER_PORT || 6001,
            enabledTransports: ["ws", "wss"],
        });

        return echo;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Lỗi chi tiết:", error.message);
        }
    
        if ((error as AxiosError).response) {
            const axiosError = error as AxiosError;
            console.error("Chi tiết AxiosError:", {
                status: axiosError.response?.status,
                data: axiosError.response?.data,
                headers: axiosError.response?.headers,
            });
        } else {
            console.error("Lỗi không xác định:", error);
        }
    }
    
    
}

export default initializeEcho;
