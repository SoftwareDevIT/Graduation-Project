import React, { createContext, useReducer, useContext, useEffect } from 'react';
import instance from '../server';
import { Location } from '../interface/Location';

type Action =
  | { type: 'SET_COUNTRIES'; payload: Location[] }
  | { type: 'ADD_COUNTRY'; payload: Location }
  | { type: 'UPDATE_COUNTRY'; payload: Location }
  | { type: 'DELETE_COUNTRY'; payload: number };

interface CountryState {
  countries: Location[];
}

const CountryContext = createContext<{
  state: CountryState;
  dispatch: React.Dispatch<Action>;
  addCountry: (country: Location) => Promise<void>;
  updateCountry: (id: number, country: Location) => Promise<void>;
  deleteCountry: (id: number) => Promise<void>;
  fetchCountries: () => Promise<void>; // Thêm function fetchCountries
} | undefined>(undefined);

const countryReducer = (state: CountryState, action: Action): CountryState => {
  switch (action.type) {
    case 'SET_COUNTRIES':
      return { ...state, countries: action.payload };
    case 'ADD_COUNTRY':
      return { ...state, countries: [...state.countries, action.payload] };      
    case 'UPDATE_COUNTRY':
      return {
        ...state,
        countries: state.countries.map(country =>
          country.id === action.payload.id ? action.payload : country
        ),
      };
    case 'DELETE_COUNTRY':
      return {
        ...state,
        countries: state.countries.filter(country => country.id !== action.payload),
      };
    default:
      return state;
  }
};

export const CountryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(countryReducer, { countries: [] });
  useEffect(() => {
    fetchCountries();
  }, []); // Empty dependency array ensures it runs only once when the component mounts

  const fetchCountries = async () => {
    try {
      const response = await instance.get('/location');
      dispatch({ type: 'SET_COUNTRIES', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const addCountry = async (country: Location) => {
    try {
      const response = await instance.post('/location', country);
      dispatch({ type: 'ADD_COUNTRY', payload: response.data });
      fetchCountries();
    } catch (error) {
      console.error('Failed to add country:', error);
    }
  };

  const updateCountry = async (id: number, country: Location) => {
    try {
      const response = await instance.put(`/location/${id}`, country);
      dispatch({ type: 'UPDATE_COUNTRY', payload: response.data });
    } catch (error) {
      console.error('Failed to update country:', error);
    }
  };

  const deleteCountry = async (id: number) => {
    try {
      await instance.delete(`/location/${id}`);
      dispatch({ type: 'DELETE_COUNTRY', payload: id });
    } catch (error) {
      console.error('Failed to delete country:', error);
    }
  };

  return (
    <CountryContext.Provider value={{
      state,
      dispatch,
      addCountry,
      updateCountry,
      deleteCountry,
      fetchCountries, // Đảm bảo `fetchCountries` có sẵn trong context
    }}>
      {children}
    </CountryContext.Provider>
  );
};

export const useCountryContext = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountryContext must be used within a CountryProvider');
  }
  return context;
};
