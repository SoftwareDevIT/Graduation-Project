import React, { useState, useEffect } from 'react';
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
import { Categories } from '../../../interface/Categories';
import { Cinema } from '../../../interface/Cinema';

import { useMovieContext } from '../../../Context/MoviesContext';
import instance from '../../../server';

const MovieForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset } = useForm();
  const [actors, setActors] = useState<Actor[]>([]);
  const [directors, setDirectors] = useState<Director[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const nav = useNavigate();
  const { addOrUpdateMovie } = useMovieContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const actorResponse = await instance.get('/actor');
        const directorResponse = await instance.get('/director');
        const categoryResponse = await instance.get('/movie-category');
        const cinemaResponse = await instance.get('/cinema');

        setActors(Array.isArray(actorResponse.data) ? actorResponse.data : []);
        setDirectors(Array.isArray(directorResponse.data) ? directorResponse.data : []);
        setCategories(Array.isArray(categoryResponse.data) ? categoryResponse.data : []);
        setCinemas(Array.isArray(cinemaResponse.data.data) ? cinemaResponse.data.data : []);

        if (id) {
          const movieResponse = await instance.get(`/movies/${id}`);
          const movieData = movieResponse.data.data;

          reset({
            movie_name: movieData.movie_name,
            movie_category_id: movieData.movie_category_id,
            actor_id: movieData.actor_id,
            director_id: movieData.director_id,
            cinema_id: movieData.cinema_id,
            release_date: moment(movieData.release_date).format('YYYY-MM-DD'),
            age_limit: movieData.age_limit,
            description: movieData.description,
            duration: movieData.duration,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: any) => {
    await addOrUpdateMovie({ ...data, posterFile }, id);
    nav('/admin/movies'); // Redirect after submission
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
        {id ? 'Edit Movie' : 'Add Movie'}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('movie_name')}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Movie Category</InputLabel>
          <Select
            label="Movie Category"
            {...register('movie_category_id')}
            required
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Actor</InputLabel>
          <Select label="Actor" {...register('actor_id')} required>
            <MenuItem value="">
              <em>Select Actor</em>
            </MenuItem>
            {actors.map((actor) => (
              <MenuItem key={actor.id} value={actor.id}>
                {actor.actor_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Director</InputLabel>
          <Select label="Director" {...register('director_id')} required>
            <MenuItem value="">
              <em>Select Director</em>
            </MenuItem>
            {directors.map((director) => (
              <MenuItem key={director.id} value={director.id}>
                {director.director_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Cinema</InputLabel>
          <Select label="Cinema" {...register('cinema_id')} required>
            <MenuItem value="">
              <em>Select Cinema</em>
            </MenuItem>
            {cinemas.map((cinema) => (
              <MenuItem key={cinema.id} value={cinema.id}>
                {cinema.cinema_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Release Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('release_date')}
          required
        />

        <TextField
          label="Age Limit"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('age_limit')}
          required
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('description')}
          required
        />

        <TextField
          label="Duration (minutes)"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          {...register('duration')}
          required
        />

        <Button
          variant="contained"
          component="label"
          sx={{ display: 'block', marginBottom: '20px' }}
        >
          Upload Poster
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
          {id ? 'Update Movie' : 'Add Movie'}
        </Button>
      </form>
    </Box>
  );
};

export default MovieForm;