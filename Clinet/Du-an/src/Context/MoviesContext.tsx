import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Movie } from '../interface/Movie';
import instance from '../server';

// Define action types
type Action =
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: Movie }
  | { type: 'DELETE_MOVIE'; payload: number };

// Define the initial state type
interface MovieState {
  movies: Movie[];
}

// Create context
const MovieContext = createContext<{
  state: MovieState;
  dispatch: React.Dispatch<Action>;
  addMovie: (movie: Movie) => Promise<void>;
  updateMovie: (id: number, movie: Movie) => Promise<void>;
  deleteMovie: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const movieReducer = (state: MovieState, action: Action): MovieState => {
  switch (action.type) {
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'ADD_MOVIE':
      return { ...state, movies: [...state.movies, action.payload] };
    case 'UPDATE_MOVIE':
      return {
        ...state,
        movies: state.movies.map(movie =>
          movie.id === action.payload.id ? action.payload : movie
        ),
      };
    case 'DELETE_MOVIE':
      return {
        ...state,
        movies: state.movies.filter(movie => movie.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create a provider component
export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, { movies: [] });

  const fetchMovies = async () => {
    try {
      const response = await instance.get('/movies');
      dispatch({ type: 'SET_MOVIES', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(); // Fetch movies when the provider mounts
  }, []);

  // Function to add a new movie
  const addMovie = async (movie: Movie) => {
    try {
      const response = await instance.post('/movies', movie);
      dispatch({ type: 'ADD_MOVIE', payload: response.data }); // Use response.data if it matches your Movie structure
    } catch (error) {
      console.error('Failed to add movie:', error);
      // Handle errors appropriately
    }
  };
  

  // Function to update an existing movie
  const updateMovie = async (id: number, movie: Movie) => {
    try {
      const response = await instance.patch(`/movies/${id}`, movie);
      dispatch({ type: 'UPDATE_MOVIE', payload: response.data }); // Dispatch update action
      fetchMovies(); // Re-fetch movies after updating
    } catch (error) {
      console.error('Failed to update movie:', error);
    }
  };

  // Function to delete a movie
  const deleteMovie = async (id: number) => {
    try {
      await instance.delete(`/movies/${id}`);
      dispatch({ type: 'DELETE_MOVIE', payload: id }); // Dispatch delete action
      fetchMovies(); // Re-fetch movies after deleting
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };

  return (
    <MovieContext.Provider value={{ state, dispatch, addMovie, updateMovie, deleteMovie }}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook to use the MovieContext
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};
