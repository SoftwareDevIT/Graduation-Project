import React, { createContext, useReducer, useContext, ReactNode } from "react";
import instance from "../server"; // Adjust this path as needed
import { Movie } from "../interface/Movie"; // Adjust the path according to your project structure

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

const MovieContext = createContext<
  | {
      state: MovieState;
      dispatch: React.Dispatch<MovieAction>;
      addOrUpdateMovie: (data: any, id?: string) => Promise<void>; // New function signature
    }
  | undefined
>(undefined);

const movieReducer = (state: MovieState, action: MovieAction): MovieState => {
  switch (action.type) {
    case "SET_MOVIES":
      return { ...state, movies: action.payload };
    case "DELETE_MOVIE":
      return {
        ...state,
        movies: state.movies.filter((movie) => movie.id !== action.payload),
      };
    case "ADD_MOVIE":
      return { ...state, movies: [...state.movies, action.payload] }; // Add the new movie
    case "UPDATE_MOVIE":
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, ...action.payload }
            : movie
        ),
      }; // Update the existing movie
    default:
      return state;
  }
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  const addOrUpdateMovie = async (data: any, id?: string) => {
    const formData = new FormData();
    formData.append("movie_name", data.movie_name);
    
    // Specify the type of 'movie_category_id', assuming it's an array of numbers
    (data.movie_category_id as number[]).forEach((movie_category_id: number) => {
      formData.append("movie_category_id[]", movie_category_id.toString());
    });
    
    // Specify the type of 'actor_id', assuming it's an array of numbers
    (data.actor_id as number[]).forEach((actorId: number) => {
      formData.append("actor_id[]", actorId.toString());
    });
    
    // Specify the type of 'director_id', assuming it's an array of numbers
    (data.director_id as number[]).forEach((director_id: number) => {
      formData.append("director_id[]", director_id.toString());
    });
    
    formData.append("cinema_id", data.cinema_id);
    formData.append("release_date", data.release_date);
    formData.append("age_limit", data.age_limit);
    formData.append("description", data.description);
    formData.append("duration", data.duration);
  
    if (id) {
      formData.append("_method", "put");
    }
  
    if (data.posterFile) {
      formData.append("poster", data.posterFile);
    }
  
    try {
      const response = id
        ? await instance.post(`/movies/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await instance.post("/movies", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
  
      if (id) {
        dispatch({ type: "UPDATE_MOVIE", payload: response.data.data});
        console.log("Movie updated successfully");
      } else {
        dispatch({ type: "ADD_MOVIE", payload: response.data.data });
        console.log("Movie added successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
    throw new Error("useMovieContext must be used within a MovieProvider");
  }
  return context;
};
