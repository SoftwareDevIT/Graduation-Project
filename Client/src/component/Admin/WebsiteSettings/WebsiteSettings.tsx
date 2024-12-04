import React, { useState, useEffect } from 'react';
import instance from '../../../server';

interface WebsiteSetting {
    id: number;
    site_name: string;
    tagline: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    working_hours: string | null;
    business_license: string | null;
    facebook_link: string;
    youtube_link: string | null;
    instagram_link: string | null;
    copyright: string | null;
    privacy_policy: string | null;
    logo: File | null;
    privacy_image: File | null;
    terms_image: File | null;
    about_image: File | null;
    created_at: string | null;
    updated_at: string | null;
    [key: string]: any;  // Thêm index signature
  }
  

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await instance.post('/website-settings');
        setSettings(response.data.data[0]); // Lấy cấu hình đầu tiên
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải cấu hình.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    try {
      setLoading(true);
      const formData = new FormData();
      
      // Append non-file fields to formData
      for (const key in settings) {
        if (settings[key] !== null && key !== 'logo' && key !== 'privacy_image' && key !== 'terms_image' && key !== 'about_image') {
          formData.append(key, settings[key] as string);
        }
      }
      
      // Append file fields to formData
      if (settings.logo) formData.append('logo', settings.logo);
      if (settings.privacy_image) formData.append('privacy_image', settings.privacy_image);
      if (settings.terms_image) formData.append('terms_image', settings.terms_image);
      if (settings.about_image) formData.append('about_image', settings.about_image);

      const response = await instance.post(`/website-settings/update/${settings.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert(response.data.message || 'Cập nhật thành công!');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    // Nếu là input type="file", sử dụng type assertion
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
  
      if (files) {
        setSettings((prev) => (prev ? { ...prev, [name]: files[0] } : null)); // Cập nhật file vào state
      }
    } else {
      setSettings((prev) => (prev ? { ...prev, [name]: value } : null)); // Cập nhật giá trị thông thường
    }
  };
  
  

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await instance.post('/website-settings/reset');
      alert(response.data.message || 'Đặt lại cấu hình thành công!');
      setSettings(response.data.data[0]); // Reset settings to default
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đặt lại cấu hình.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className="website-settings">
      <h1>Cấu Hình Website</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên trang web</label>
          <input
            type="text"
            name="site_name"
            value={settings?.site_name || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Khẩu hiệu</label>
          <input
            type="text"
            name="tagline"
            value={settings?.tagline || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={settings?.email || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={settings?.phone || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={settings?.address || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Giờ làm việc</label>
          <input
            type="text"
            name="working_hours"
            value={settings?.working_hours || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Logo</label>
          <input
            type="file"
            name="logo"
            onChange={handleChange}
            className="form-control"
            accept="image/jpeg, image/png, image/jpg, image/gif"
          />
        </div>
        <div className="form-group">
          <label>Ảnh quyền riêng tư</label>
          <input
            type="file"
            name="privacy_image"
            onChange={handleChange}
            className="form-control"
            accept="image/jpeg, image/png, image/jpg, image/gif"
          />
        </div>
        <div className="form-group">
          <label>Ảnh điều khoản</label>
          <input
            type="file"
            name="terms_image"
            onChange={handleChange}
            className="form-control"
            accept="image/jpeg, image/png, image/jpg, image/gif"
          />
        </div>
        <div className="form-group">
          <label>Ảnh về chúng tôi</label>
          <input
            type="file"
            name="about_image"
            onChange={handleChange}
            className="form-control"
            accept="image/jpeg, image/png, image/jpg, image/gif"
          />
        </div>
        <div className="form-group">
          <label>Facebook Link</label>
          <input
            type="text"
            name="facebook_link"
            value={settings?.facebook_link || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Youtube Link</label>
          <input
            type="text"
            name="youtube_link"
            value={settings?.youtube_link || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Instagram Link</label>
          <input
            type="text"
            name="instagram_link"
            value={settings?.instagram_link || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Copyright</label>
          <input
            type="text"
            name="copyright"
            value={settings?.copyright || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Chính sách quyền riêng tư</label>
          <input
            type="text"
            name="privacy_policy"
            value={settings?.privacy_policy || ''}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Lưu Cấu Hình
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          Đặt Lại
        </button>
      </form>
    </div>
  );
};

export default WebsiteSettings;
