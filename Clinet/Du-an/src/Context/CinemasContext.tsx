import React, { createContext, useReducer, useContext, useEffect } from 'react';
import { Cinema } from '../interface/Cinema';
import instance from '../server';

// Define action types
type Action =
  | { type: 'SET_CINEMAS'; payload: Cinema[] }
  | { type: 'ADD_CINEMA'; payload: Cinema }
  | { type: 'UPDATE_CINEMA'; payload: Cinema }
  | { type: 'DELETE_CINEMA'; payload: number };

// Define the initial state type
interface CinemaState {
  cinemas: Cinema[];
}

// Create context
const CinemaContext = createContext<{
  state: CinemaState;
  dispatch: React.Dispatch<Action>;
  addCinema: (cinema: Cinema) => Promise<void>;
  updateCinema: (id: number, cinema: Cinema) => Promise<void>;
  deleteCinema: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const cinemaReducer = (state: CinemaState, action: Action): CinemaState => {
  switch (action.type) {
    case 'SET_CINEMAS':
      return { ...state, cinemas: action.payload };
    case 'ADD_CINEMA':
      return { ...state, cinemas: [...state.cinemas, action.payload] };
    case 'UPDATE_CINEMA':
      return {
        ...state,
        cinemas: state.cinemas.map(cinema =>
          cinema.id === action.payload.id ? action.payload : cinema
        ),
      };
    case 'DELETE_CINEMA':
      return {
        ...state,
        cinemas: state.cinemas.filter(cinema => cinema.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create a provider component
export const CinemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cinemaReducer, { cinemas: [] });

  const fetchCinemas = async () => {
    try {
      const response = await instance.get('/cinema');
      dispatch({ type: 'SET_CINEMAS', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch cinemas:', error);
    }
  };

  useEffect(() => {
    fetchCinemas(); // Fetch cinemas when the provider mounts
  }, []);

  // Function to add a new cinema
  const addCinema = async (cinema: Cinema) => {
    try {
      const response = await instance.post('/cinema', cinema);
      dispatch({ type: 'ADD_CINEMA', payload: response.data }); // Dispatch add action
      fetchCinemas(); // Re-fetch cinemas after adding
    } catch (error) {
      console.error('Failed to add cinema:', error);
    }
  };

  // Function to update an existing cinema
  const updateCinema = async (id: number, cinema: Cinema) => {
    try {
      const response = await instance.patch(`/cinema/${id}`, cinema);
      dispatch({ type: 'UPDATE_CINEMA', payload: response.data }); // Dispatch update action
      fetchCinemas(); // Re-fetch cinemas after updating
    } catch (error) {
      console.error('Failed to update cinema:', error);
    }
  };

  // Function to delete a cinema
  const deleteCinema = async (id: number) => {
    try {
      await instance.delete(`/cinema/${id}`);
      dispatch({ type: 'DELETE_CINEMA', payload: id }); // Dispatch delete action
      fetchCinemas(); // Re-fetch cinemas after deleting
    } catch (error) {
      console.error('Failed to delete cinema:', error);
    }
  };

  return (
    <CinemaContext.Provider value={{ state, dispatch, addCinema, updateCinema, deleteCinema }}>
      {children}
    </CinemaContext.Provider>
  );
};

// Custom hook to use the CinemaContext
export const useCinemaContext = () => {
  const context = useContext(CinemaContext);
  if (!context) {
    throw new Error('useCinemaContext must be used within a CinemaProvider');
  }
  return context;
};
