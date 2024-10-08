// MoviesContext.tsx
import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Movie } from '../interface/Movie';
import instance from '../server';


// Define the shape of the context state
interface MoviesState {
  movies: Movie[];
}

// Define action types
type Action =
  | { type: 'SET_MOVIES'; payload: Movie[] }
  | { type: 'ADD_MOVIE'; payload: Movie }
  | { type: 'UPDATE_MOVIE'; payload: Movie }
  | { type: 'DELETE_MOVIE'; payload: number };

// Create a context
const MoviesContext = createContext<{
  state: MoviesState;
  fetchMovies: () => Promise<void>;
  addMovie: (movie: Movie) => Promise<void>;
  updateMovie: (id: number, movie: Movie) => Promise<void>;
  deleteMovie: (id: number) => Promise<void>;
} | undefined>(undefined);

// Define a reducer to manage state
const moviesReducer = (state: MoviesState, action: Action): MoviesState => {
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
export const MoviesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(moviesReducer, { movies: [] });

  // Fetch movies from the API
  const fetchMovies = async () => {
    try {
      const response = await instance.get('/movies');
      dispatch({ type: 'SET_MOVIES', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    }
  };

  // Add a new movie
  const addMovie = async (movie: Movie) => {
    try {
      const response = await instance.post('/movies', movie);
      dispatch({ type: 'ADD_MOVIE', payload: response.data });
    } catch (error) {
      console.error('Failed to add movie:', error);
    }
  };

  // Update an existing movie
  const updateMovie = async (id: number, movie: Movie) => {
    try {
      const response = await instance.patch(`/movies/${id}`, movie);
      dispatch({ type: 'UPDATE_MOVIE', payload: response.data.data });
    } catch (error) {
      console.error('Failed to update movie:', error);
    }
  };

  const deleteMovie = async (id: number) => {
    try {
      // Check for related showtimes first
      const showtimesResponse = await instance.get(`/showtimes?movie_id=${id}`);
      if (showtimesResponse.data.length > 0) {
        console.error('Cannot delete movie; related showtimes exist.');
        return; // or handle the error gracefully
      }
  
      // Proceed to delete the movie
      await instance.delete(`/movies/${id}`);
      dispatch({ type: 'DELETE_MOVIE', payload: id });
    } catch (error) {
      console.error('Failed to delete movie:', error);
    }
  };
  

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <MoviesContext.Provider value={{ state, fetchMovies, addMovie, updateMovie, deleteMovie }}>
      {children}
    </MoviesContext.Provider>
  );
};

// Custom hook for using the MoviesContext
export const useMoviesContext = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMoviesContext must be used within a MoviesProvider');
  }
  return context;
};
