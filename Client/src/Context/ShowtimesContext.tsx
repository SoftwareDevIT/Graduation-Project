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
    addOrUpdateShowtime: (data: Showtime | Showtime[], id?: string) => Promise<void>;
    deleteShowtime: (id: number) => Promise<void>;
    fetchShowtimes: () => Promise<void>;
} | undefined>(undefined);

const showtimeReducer = (state: ShowtimeState, action: ShowtimeAction): ShowtimeState => {
    switch (action.type) {
        case 'SET_SHOWTIMES':
            return { ...state, showtimes: action.payload };
        case 'DELETE_SHOWTIME':
            return { ...state, showtimes: state.showtimes.filter(showtime => showtime.id !== action.payload) };
        case 'ADD_SHOWTIME':
            return { ...state, showtimes: [...state.showtimes, action.payload] };
        case 'ADD_SHOWTIMES':
            return { ...state, showtimes: [...state.showtimes, ...action.payload] };
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

    const addOrUpdateShowtime = async (data: Showtime | Showtime[], id?: string) => {
        try {
            if (Array.isArray(data)) {
                const responses = await Promise.all(data.map(async (showtime) => {
                    const response = await instance.post('/showtimes', showtime);
                    return response.data.data;
                }));
                dispatch({ type: 'ADD_SHOWTIMES', payload: responses });
            } else {
                const response = id
                    ? await instance.put(`/showtimes/${id}`, data)
                    : await instance.post('/showtimes', data);

                if (id) {
                    dispatch({ type: 'UPDATE_SHOWTIME', payload: response.data });
                } else {
                    dispatch({ type: 'ADD_SHOWTIME', payload: response.data.data });
                }
            }
        } catch (error) {
            console.error('Error submitting showtime:', error);
        }
    };

    const deleteShowtime = async (id: number) => {
        try {
            await instance.delete(`/showtimes/${id}`);
            dispatch({ type: 'DELETE_SHOWTIME', payload: id });
        } catch (error) {
            console.error('Error deleting showtime:', error);
        }
    };

    const fetchShowtimes = async () => {
        try {
            const response = await instance.get<{ data: Showtime[] }>('/showtimes');
            dispatch({ type: 'SET_SHOWTIMES', payload: response.data.data });
        } catch (error) {
            console.error('Error fetching showtimes:', error);
        }
    };

    return (
        <ShowtimeContext.Provider value={{ state, dispatch, addOrUpdateShowtime, deleteShowtime, fetchShowtimes }}>
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
