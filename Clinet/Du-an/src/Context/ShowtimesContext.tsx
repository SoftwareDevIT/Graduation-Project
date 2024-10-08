import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import instance from '../server';
import { Showtime } from '../interface/Showtimes';

interface ShowtimeState {
    showtimes: Showtime[];
}

interface ShowtimeAction {
    type: string;
    payload?: any;
}

const initialState: ShowtimeState = {
    showtimes: [],
};

const ShowtimeContext = createContext<{
    state: ShowtimeState;
    dispatch: React.Dispatch<ShowtimeAction>;
    addOrUpdateShowtime: (data: Showtime, id?: string) => Promise<void>;
} | undefined>(undefined);

const showtimeReducer = (state: ShowtimeState, action: ShowtimeAction): ShowtimeState => {
    switch (action.type) {
        case 'SET_SHOWTIMES':
            return { ...state, showtimes: action.payload };
        case 'DELETE_SHOWTIME':
            return { ...state, showtimes: state.showtimes.filter(showtime => showtime.id !== action.payload) };
        case 'ADD_SHOWTIME':
            return { ...state, showtimes: [...state.showtimes, action.payload] };
        case 'UPDATE_SHOWTIME':
            return {
                ...state,
                showtimes: state.showtimes.map(showtime =>
                    showtime.id === action.payload.id ? { ...showtime, ...action.payload } : showtime
                ),
            };
        default:
            return state;
    }
};

export const ShowtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(showtimeReducer, initialState);

    const addOrUpdateShowtime = async (data: Showtime, id?: string) => {
        try {
            const response = id
                ? await instance.put(`/showtimes/${id}`, data)
                : await instance.post('/showtimes', data);

            if (id) {
                dispatch({ type: 'UPDATE_SHOWTIME', payload: response.data });
            } else {
                dispatch({ type: 'ADD_SHOWTIME', payload: response.data });
            }
        } catch (error) {
            console.error('Error submitting showtime:', error);
        }
    };

    return (
        <ShowtimeContext.Provider value={{ state, dispatch, addOrUpdateShowtime }}>
            {children}
        </ShowtimeContext.Provider>
    );
};

export const useShowtimeContext = () => {
    const context = useContext(ShowtimeContext);
    if (context === undefined) {
        throw new Error('useShowtimeContext must be used within a ShowtimeProvider');
    }
    return context;
};
