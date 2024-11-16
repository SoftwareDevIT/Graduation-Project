import React, { createContext, useReducer, useContext, ReactNode, useEffect, useCallback } from "react";
import instance from "../server"; // Đảm bảo đường dẫn đúng
import { Movie } from "../interface/Movie"; // Đảm bảo đường dẫn đúng

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
      addOrUpdateMovie: (data: any, id?: string) => Promise<void>;
      fetchMovies: () => Promise<void>; // Thêm function để fetch movies
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
      return { ...state, movies: [...state.movies, action.payload] };
    case "UPDATE_MOVIE":
      return {
        ...state,
        movies: state.movies.map((movie) =>
          movie.id === action.payload.id
            ? { ...movie, ...action.payload }
            : movie
        ),
      };
    default:
      return state;
  }
};

export const MovieProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(movieReducer, initialState);

  // Hàm gọi API để lấy danh sách phim
  const fetchMovies = useCallback(async () => {
    try {
      const response = await instance.get("/movies"); // API GET để lấy phim
      if (response.data && response.data.data) {
        dispatch({ type: "SET_MOVIES", payload: response.data.data.original }); // Lưu danh sách phim vào state
      } else {
        console.error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  }, []); // useCallback để đảm bảo hàm không bị tạo lại mỗi lần render

  // Hàm thêm hoặc cập nhật phim
  const addOrUpdateMovie = async (data: any, id?: string) => {
    const formData = new FormData();
    formData.append("movie_name", data.movie_name);

    // Thêm các thông tin khác vào formData
    (data.movie_category_id as number[]).forEach((movie_category_id: number) => {
      formData.append("movie_category_id[]", movie_category_id.toString());
    });

    (data.actor_id as number[]).forEach((actorId: number) => {
      formData.append("actor_id[]", actorId.toString());
    });

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
        dispatch({ type: "UPDATE_MOVIE", payload: response.data.data });
        console.log("Movie updated successfully");
      } else {
        dispatch({ type: "ADD_MOVIE", payload: response.data.data });
        console.log("Movie added successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    fetchMovies(); // Gọi fetchMovies khi MovieProvider được mount
  }, [fetchMovies]); // Thêm fetchMovies vào dependencies của useEffect để đảm bảo nó không bị gọi lại liên tục

  return (
    <MovieContext.Provider value={{ state, dispatch, addOrUpdateMovie, fetchMovies }}>
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
