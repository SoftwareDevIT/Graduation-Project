import React, { useState, useEffect } from "react";
import { Card, Button, Typography, Image, Space, Row, Col, DatePicker } from "antd";
import { jsPDF } from "jspdf";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import instance from "../../server";
import moment from 'moment';
import Header from "../Header/Hearder";

const { Title, Text } = Typography;

interface Showtime {
  id: number;
  room: { room_name: string };
  movie: { movie_name: string; poster: string };
  showtime_date: string;
  showtime_start: string;
}

interface Seat {
  seat_name: string;
}

interface Order {
  id: number;
  booking_code: string;
  qrcode: string;
  showtime: Showtime;
  seats: Seat[];
  amount: number;
}

const OrderHistoryApp: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    instance
      .get("/order") // Endpoint API
      .then((response) => {
        const mappedOrders = response.data.data.map((order: any) => ({
          id: order.id,
          booking_code: order.booking_code,
          qrcode: order.qrcode,
          showtime: {
            ...order.showtime,
            movie: order.showtime.movie,
            room: order.showtime.room,
          },
          seats: order.seats,
          amount: order.amount,
        }));
        setOrders(mappedOrders);
        setFilteredOrders(mappedOrders); // Show all orders initially
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, []);

  const handleDateFilter = (date: moment.Moment | null, dateString: string | string[]) => {
    const filterDate = Array.isArray(dateString) ? dateString[0] : dateString;
  
    setSelectedDate(filterDate); // Gán giá trị vào state (selectedDate có kiểu string)
  
    if (filterDate) {
      const filtered = orders.filter(
        (order) => order.showtime.showtime_date === filterDate
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };

  // Hàm tải PDF
  const handleDownloadTicket = () => {
    if (!selectedOrder) return;

    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    // Header
    doc.setFontSize(20);
    doc.text("Vé Phim", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text(selectedOrder.showtime.movie.movie_name, 105, 30, { align: "center" });
    // QR Code
    doc.addImage(selectedOrder.qrcode, "JPEG", 80, 40, 50, 50);

    // Details
    doc.setFontSize(12);
    doc.text(`Mã: ${selectedOrder.qrcode}`, 20, 100);
    doc.text(`Phòng: ${selectedOrder.showtime.room.room_name}`, 20, 110);
    doc.text(`Thời gian: ${selectedOrder.showtime.showtime_date} ${selectedOrder.showtime.showtime_start}`, 20, 120);
    doc.text(`Ghế: ${selectedOrder.seats.map((s) => s.seat_name).join(", ")}`, 20, 130);
    doc.text(`Tổng: ${selectedOrder.amount} VND`, 20, 140);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for booking with us!", 105, 280, { align: "center" });

    // Download the PDF
    doc.save(`Ticket_${selectedOrder.booking_code}.pdf`);
  };

  // Hàm quay lại trang Order History
  const handleBackToOrders = () => {
    setSelectedOrder(null);
  };

  // Hàm phân trang, chỉ hiển thị 5 đơn hàng
  const ordersToDisplay = filteredOrders.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <>
      <Header />
      <div style={{ padding: "30px", maxWidth: "1200px", margin: "0 auto", background: "#f8f9fa", borderRadius: "10px" , marginTop:"20px" }}>
        {!selectedOrder ? (
          <div>
            <Title level={2} style={{ textAlign: "center", marginBottom: "20px", }}>
              Lịch Sử Mua Hàng
            </Title>
  
            {/* Lọc theo ngày */}
            <DatePicker
              style={{ marginBottom: "20px", width: "100%" }}
              onChange={handleDateFilter}
              value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
              format="YYYY-MM-DD"
            />
  
            {/* Nếu không có đơn hàng, hiển thị thông báo */}
            {filteredOrders.length === 0 ? (
              <div style={{ textAlign: "center", color: "#1890ff", fontSize: "18px", marginTop: "20px" }}>
                Bạn chưa có đơn hàng nào
              </div>
            ) : (
              ordersToDisplay.map((order) => (
                <Card
                  key={order.id}
                  hoverable
                  onClick={() => setSelectedOrder(order)}
                  style={{
                    marginBottom: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    padding: "15px",
                    backgroundColor: "#fff",
                  }}
                >
                  <Row gutter={16} align="middle" justify="space-between">
                    <Col xs={24} sm={6} style={{ textAlign: "center" }}>
                      <Image
                        src={order.showtime.movie.poster}
                        alt={order.showtime.movie.movie_name}
                        width={120}
                        style={{ borderRadius: "10px" }}
                      />
                    </Col>
                    <Col xs={24} sm={18} className="order-info">
                      <Space direction="vertical" style={{ width: "100%" }}>
                        <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                          {order.showtime.movie.movie_name}
                        </Title>
                        <Text>
                          <EnvironmentOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
                          <b>Phòng chiếu :</b> {order.showtime.room.room_name}
                        </Text>
                        <Text>
                          <CalendarOutlined style={{ marginRight: "8px", color: "#faad14" }} />
                          <b>Thời gian:</b> {order.showtime.showtime_date} {order.showtime.showtime_start}
                        </Text>
                        <Text>
                          <TeamOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
                          <b>Ghế:</b> {order.seats.map((s) => s.seat_name).join(", ")}
                        </Text>
                        <Text style={{ fontWeight: 600 }}>
                          <b>Tổng:</b> {order.amount} VND
                        </Text>
                      </Space>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
  
            {/* Phân trang */}
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Prev
              </Button>
              <span style={{ margin: "0 10px" }}>Page {currentPage}</span>
              <Button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage * 5 >= filteredOrders.length}
              >
                Next
              </Button>
            </div>
          </div>
        ) : (
          <div>
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={handleBackToOrders}
            style={{
              marginBottom: "20px",
              fontSize: "16px",
              borderRadius: "5px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            Back to Orders
          </Button>
          <Card
            style={{
              marginTop: "20px",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              background: "#ffffff",
            }}
          >
            <Row gutter={24}>
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Image
                  src={selectedOrder.showtime.movie.poster}
                  alt="Movie Poster"
                  width={180}
                  style={{
                    margin: "0 auto 20px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTicket}
                  style={{
                    marginTop: "10px",
                    padding: "8px 20px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Download Ticket
                </Button>
              </Col>
        
              <Col xs={24} sm={16}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={16}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                      <Text style={{ fontSize: "16px" }}>
                        <CalendarOutlined style={{ marginRight: "10px", color: "#faad14" }} />
                        <b>Thời gian:</b> {selectedOrder.showtime.showtime_date}{" "}
                        {selectedOrder.showtime.showtime_start}
                      </Text>
        
                      <Text style={{ fontSize: "16px" }}>
                        <TeamOutlined style={{ marginRight: "10px", color: "#52c41a" }} />
                        <b>Ghế:</b> {selectedOrder.seats.map((s) => s.seat_name).join(", ")}
                      </Text>
        
                      <Text style={{ fontSize: "16px" }}>
                        <EnvironmentOutlined style={{ marginRight: "10px", color: "#1890ff" }} />
                        <b>Phòng:</b> {selectedOrder.showtime.room.room_name}
                      </Text>
        
                      <Text style={{ fontSize: "16px" }}>
                        <b>Mã đặt vé:</b>
                        <Text code>{selectedOrder.booking_code}</Text>
                      </Text>
                    </Space>
                  </Col>
        
                  <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                    <Image
                      src={selectedOrder.qrcode}
                     
                      alt="QR Code"
                      width={120}
                      style={{
                        margin: "0 auto",
                        borderRadius: "10px",
                        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </div>
        
        )}
      </div>
    </>
  );
  
};

export default OrderHistoryApp;
