import React, { useState } from "react";

import { Form, Input, Button, Row, Col, message } from "antd";
import axios from "axios";
import { WebsiteSettings } from "../../../interface/WebsiteSetting";

const WebsiteSettingsForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const initialSettings: WebsiteSettings = {
    id: 0,
    site_name: "",
    tagline: null,
    email: null,
    phone: null,
    address: null,
    working_hours: null,
    business_license: null,
    facebook_link: "",
    youtube_link: null,
    instagram_link: null,
    copyright: null,
    privacy_policy: null,
    logo: null,
    privacy_image: null,
    terms_image: null,
    about_image: null,
    created_at: null,
    updated_at: null,
  };

  const handleUpdate = async (values: WebsiteSettings) => {
    setLoading(true);
    try {
      await axios.post("/website-settings/update", values);
      message.success("Cập nhật thành công!");
    } catch (error) {
      console.error(error);
      message.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/website-settings/reset");
      form.setFieldsValue(data);
      message.success("Đặt lại thành công!");
    } catch (error) {
      console.error(error);
      message.error("Đặt lại thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Cấu hình Website</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={initialSettings}
        onFinish={handleUpdate}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên trang web"
              name="site_name"
              rules={[{ required: true, message: "Vui lòng nhập tên trang web!" }]}
            >
              <Input placeholder="Nhập tên trang web" />
            </Form.Item>
            <Form.Item label="Khẩu hiệu" name="tagline">
              <Input placeholder="Nhập khẩu hiệu" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" placeholder="Nhập email liên hệ" />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input.TextArea placeholder="Nhập địa chỉ" rows={3} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item label="Liên kết Facebook" name="facebook_link">
              <Input placeholder="Nhập liên kết Facebook" />
            </Form.Item>
            <Form.Item label="Liên kết YouTube" name="youtube_link">
              <Input placeholder="Nhập liên kết YouTube" />
            </Form.Item>
            <Form.Item label="Liên kết Instagram" name="instagram_link">
              <Input placeholder="Nhập liên kết Instagram" />
            </Form.Item>
            <Form.Item label="Bản quyền" name="copyright">
              <Input placeholder="Nhập thông tin bản quyền" />
            </Form.Item>
            <Form.Item label="Chính sách bảo mật" name="privacy_policy">
              <Input.TextArea placeholder="Nhập chính sách bảo mật" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <div className="d-flex justify-content-between">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="mr-3"
            >
              Cập nhật
            </Button>
            <Button type="default" onClick={handleReset} loading={loading}>
              Đặt lại
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default WebsiteSettingsForm;
