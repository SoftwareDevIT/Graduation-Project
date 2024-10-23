import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import instance from '../server';
import { Movie } from '../interface/Movie';

interface MovieState {
  movies: Movie[];
}

interface MovieAction {
  type: string;
  payload?: any;
}

const initialState: MovieState = {
  movies: [],
};

const MovieContext = createContext<{
  state: MovieState;
  dispatch: React.Dispatch<MovieAction>;
  addOrUpdateMovie: (data: any, id?: string) => Promise<void>;
} | undefined>(undefined);

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'DELETE_MOVIE':
      return { ...state, movies: state.movies.filter(movie => movie.id !== action.payload) };
    case 'ADD_MOVIE':
      return { ...state, movies: [...state.movies, action.payload] };
    case 'UPDATE_MOVIE':
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie.id === action.payload.id ? { ...movie, ...action.payload } : movie
        ),
      };
    default:
      return state;
  }
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  const addOrUpdateMovie = async (data: any, id?: string) => {
    const formData = new FormData();
    formData.append('movie_name', data.movie_name);
    formData.append('movie_category_id', data.movie_category_id);
    formData.append('actor_id', data.actor_id);
    formData.append('director_id', data.director_id);
    formData.append('release_date', data.release_date);
    formData.append('age_limit', data.age_limit);
    formData.append('description', data.description);
    formData.append('duration', data.duration);

    if (data.posterFile) {
      formData.append('poster', data.posterFile);
    }

    try {
      if (id) {
        // Update movie
        const response = await instance.put(`/movies/${id}`, formData);
        dispatch({ type: 'UPDATE_MOVIE', payload: response.data.data });
      } else {
        // Add movie
        const response = await instance.post('/movies', formData);
        dispatch({ type: 'ADD_MOVIE', payload: response.data.data });
      }
    } catch (error) {
      console.error('Error adding/updating movie:', error);
    }
  };

  return (
    <MovieContext.Provider value={{ state, dispatch, addOrUpdateMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
