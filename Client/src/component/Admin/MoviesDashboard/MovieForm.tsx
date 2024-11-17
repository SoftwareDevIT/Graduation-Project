import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { Actor } from '../../../interface/Actor';
import { Director } from '../../../interface/Director';
import { useMovieContext } from '../../../Context/MoviesContext';
import instance from '../../../server';
import { MovieCategory } from '../../../interface/MovieCategory';

const MovieForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, control } = useForm();
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [categories, setCategories] = useState<MovieCategory[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const nav = useNavigate();
  const { addOrUpdateMovie } = useMovieContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actorResponse = await instance.get('/actor');
        const directorResponse = await instance.get('/director');
        const categoryResponse = await instance.get('/movie-category');
  
        setActors(Array.isArray(actorResponse.data.data) ? actorResponse.data.data : []);
        setDirectors(Array.isArray(directorResponse.data.data) ? directorResponse.data.data : []);
        setCategories(Array.isArray(categoryResponse.data.data) ? categoryResponse.data.data : []);
  
        if (id) {
          const movieResponse = await instance.get(`/movies/${id}`);
          const movieData = movieResponse.data.data.original;
          console.log(movieData);

          // Reset form after data is fetched and available
          reset({
            movie_name: movieData.movie_name || '',
            movie_category_id: movieData.movie_category.map((category: any) => category.id) || [],
            actor_id: movieData.actor.map((actor: any) => actor.id) || [],
            director_id: movieData.director.map((director: any) => director.id) || [],
            release_date: moment(movieData.release_date).format('YYYY-MM-DD'),
            age_limit: movieData.age_limit || '',
            description: movieData.description || '',
            duration: movieData.duration || '',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    console.log(data);
    const updatedData = {
      ...data,
      actor_id: data.actor_id || [],
      director_id: data.director_id || [],
      movie_category_id: data.movie_category_id || [],
      posterFile,
    };

    await addOrUpdateMovie(updatedData, id);
    nav('/admin/movies');
  };

  return (
    <Box
      sx={{
        maxWidth: '800px',
        margin: 'auto',
        padding: '40px',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        {id ? 'Chỉnh sửa phim' : 'Thêm phim'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('movie_name')}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Danh mục phim</InputLabel>
          <Controller
            name="movie_category_id"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                label="Danh mục phim"
                multiple
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Diễn viên</InputLabel>
          <Controller
            name="actor_id"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                label="Diễn viên"
                multiple
                required
              >
                {actors.map((actor) => (
                  <MenuItem key={actor.id} value={actor.id}>
                    {actor.actor_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Đạo diễn</InputLabel>
          <Controller
            name="director_id"
            control={control}
            defaultValue={[]}
            render={({ field }) => (
              <Select
                {...field}
                label="Đạo diễn"
                multiple
                required
              >
                {directors.map((director) => (
                  <MenuItem key={director.id} value={director.id}>
                    {director.director_name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <TextField
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('release_date')}
          required
        />

        <TextField
          type="number"
          variant="outlined"
          fullWidth
          label="Giới hạn độ tuổi"
          margin="normal"
          {...register('age_limit')}
          required
          
        />

        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('description')}
          required
          label="Mô tả"
        />

        <TextField
          type="text"
          variant="outlined"
          fullWidth
          label="Thời lượng"
          margin="normal"
          {...register('duration')}
          required
          
        />

        <Button
          variant="contained"
          component="label"
          sx={{ display: 'block', marginBottom: '20px' }}
        >
          Tải lên Poster
          <input
            type="file"
            hidden
            onChange={(e) => {
              if (e.target.files) {
                setPosterFile(e.target.files[0]);
              }
            }}
          />
        </Button>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          sx={{ padding: '15px', fontSize: '1rem' }}
        >
          {id ? 'Cập nhật phim' : 'Thêm phim'}
        </Button>
      </form>
    </Box>
  );
};

export default MovieForm;
