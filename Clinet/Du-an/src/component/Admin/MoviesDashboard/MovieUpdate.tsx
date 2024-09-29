import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { useParams } from 'react-router-dom';
import { Actor } from '../../../interface/Actor';
import { Categories } from '../../../interface/Categories';
import { Cinema } from '../../../interface/Cinema';
import { Director } from '../../../interface/Director';
import instance from '../../../server';
import moment from 'moment'
const { Option } = Select;

const UpdateMovie: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
        try {
          const response = await instance.get(`/movies/${id}`); // Fetch the movie details
          console.log('Fetched movie details:', response.data); // Log the fetched data
          form.setFieldsValue({
            movie_name: response.data.movie_name,
            movie_category_id: response.data.movie_category_id,
            actor_id: response.data.actor_id,
            director_id: response.data.director_id,
            cinema_id: response.data.cinema_id,
            release_date: moment(response.data.release_date), // Convert to moment for DatePicker
            age_limit: response.data.age_limit,
            description: response.data.description,
          }); // Set the form fields with fetched data
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      };
      

    const fetchActors = async () => {
      const response = await instance.get('/actor');
      setActors(Array.isArray(response.data) ? response.data : []);
    };

    const fetchDirectors = async () => {
      const response = await instance.get('/director');
      setDirectors(Array.isArray(response.data) ? response.data : []);
    };

    const fetchCategories = async () => {
      const response = await instance.get('/movie-category');
      setCategories(Array.isArray(response.data) ? response.data : []);
    };

    const fetchCinemas = async () => {
      const response = await instance.get('/cinema');
      setCinemas(Array.isArray(response.data.data) ? response.data.data : []);
    };

    if (id) {
      fetchMovieDetails();
      fetchActors();
      fetchDirectors();
      fetchCategories();
      fetchCinemas();
    }
  }, [id]);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('movie_name', values.movie_name);
      formData.append('movie_category_id', values.movie_category_id);
      formData.append('actor_id', values.actor_id);
      formData.append('director_id', values.director_id);
      formData.append('cinema_id', values.cinema_id);
      formData.append('release_date', values.release_date.format('YYYY-MM-DD'));
      formData.append('age_limit', values.age_limit);
      formData.append('description', values.description);

      if (posterFile) {
        formData.append('poster', posterFile);
      }

      const response = await instance.put(`/movies/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Movie updated successfully:', response.data);
      form.resetFields(); // Reset form fields
      form.setFieldsValue(response.data); // Optionally reset to new data if necessary
    } catch (error) {
      console.error('Error updating movie:', error);
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
      >
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setPosterFile(e.target.files ? e.target.files[0] : null)}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Cập Nhật Phim
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateMovie;
