import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { Actor } from '../../../interface/Actor';
import { Categories } from '../../../interface/Categories';
import { Cinema } from '../../../interface/Cinema';
import { Director } from '../../../interface/Director';
import instance from '../../../server';

const { Option } = Select;

const AddMovie: React.FC = () => {
  const [form] = Form.useForm();
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null); // Thay đổi kiểu dữ liệu

  useEffect(() => {
    const fetchActors = async () => {
      const response = await instance.get('/actor');
      console.log('Actors API response:', response.data);
      setActors(Array.isArray(response.data) ? response.data : []);
    };

    const fetchDirectors = async () => {
      const response = await instance.get('/director');
      console.log('Directors API response:', response.data);
      setDirectors(Array.isArray(response.data) ? response.data : []);
    };

    const fetchCategories = async () => {
      const response = await instance.get('/movie-category');
      console.log('Categories API response:', response.data);
      setCategories(Array.isArray(response.data) ? response.data : []);
    };

    const fetchCinemas = async () => {
      const response = await instance.get('/cinema');
      console.log('Cinemas API response:', response.data.data);
      setCinemas(Array.isArray(response.data.data) ? response.data.data : []);
    };

    fetchActors();
    fetchDirectors();
    fetchCategories();
    fetchCinemas();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('movie_name', values.movie_name);
      formData.append('movie_category_id', values.movie_category_id);
      formData.append('actor_id', values.actor_id);
      formData.append('director_id', values.director_id);
      formData.append('cinema_id', values.cinema_id);
      formData.append('release_date', values.release_date.format('YYYY-MM-DD')); // Định dạng ngày
      formData.append('age_limit', values.age_limit);
      formData.append('description', values.description);
      
      // Kiểm tra và thêm poster vào FormData
      if (posterFile) {
        formData.append('poster', posterFile);
      }

      const response = await instance.post('/movies', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Movie added successfully:', response.data);
      form.resetFields(); // Reset form sau khi thêm phim thành công
    } catch (error) {
      console.error('Error adding movie:', error);
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        label="Tên phim"
        name="movie_name"
        rules={[{ required: true, message: 'Vui lòng nhập tên phim' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Thể loại"
        name="movie_category_id"
        rules={[{ required: true, message: 'Vui lòng chọn thể loại' }]}
      >
        <Select placeholder="Chọn thể loại">
          {categories.map(category => (
            <Option key={category.id} value={category.id}>
              {category.category_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Diễn viên"
        name="actor_id"
        rules={[{ required: true, message: 'Vui lòng chọn diễn viên' }]}
      >
        <Select placeholder="Chọn diễn viên">
          {actors.map(actor => (
            <Option key={actor.id} value={actor.id}>
              {actor.actor_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Đạo diễn"
        name="director_id"
        rules={[{ required: true, message: 'Vui lòng chọn đạo diễn' }]}
      >
        <Select placeholder="Chọn đạo diễn">
          {directors.map(director => (
            <Option key={director.id} value={director.id}>
              {director.director_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Rạp"
        name="cinema_id"
        rules={[{ required: true, message: 'Vui lòng chọn rạp' }]}
      >
        <Select placeholder="Chọn rạp">
          {cinemas.map(cinema => (
            <Option key={cinema.id} value={cinema.id}>
              {cinema.cinema_name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Ngày phát hành"
        name="release_date"
        rules={[{ required: true, message: 'Vui lòng chọn ngày phát hành' }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label="Giới hạn tuổi"
        name="age_limit"
        rules={[{ required: true, message: 'Vui lòng nhập giới hạn tuổi' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Mô tả"
        name="description"
      >
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item
        label="Ảnh poster"
        name="poster"
        rules={[{ required: true, message: 'Vui lòng nhập tệp ảnh poster' }]}
      >
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPosterFile(e.target.files ? e.target.files[0] : null)} // Lưu tệp ảnh vào state
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Thêm Phim
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddMovie;
