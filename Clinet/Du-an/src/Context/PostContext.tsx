import React, { createContext, useReducer, useContext, useEffect } from 'react';
import instance from '../server';
import { NewsItem } from '../interface/NewsItem';

// Define action types
type Action =
  | { type: 'SET_POSTS'; payload: NewsItem[] }
  | { type: 'ADD_POST'; payload: NewsItem }
  | { type: 'UPDATE_POST'; payload: NewsItem }
  | { type: 'DELETE_POST'; payload: number };

// Define the initial state type
interface PostsState {
  posts: NewsItem[];
}

// Create context
const PostsContext = createContext<{
  state: PostsState;
  dispatch: React.Dispatch<Action>;
  addPost: (post: NewsItem) => Promise<void>;
  updatePost: (id: number, post: NewsItem) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
} | undefined>(undefined);

// Reducer function
const postsReducer = (state: PostsState, action: Action): PostsState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    case 'DELETE_POST':
      return {
        ...state,
        posts: state.posts.filter(post => post.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create a provider component
export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, { posts: [] });

  const fetchPosts = async () => {
    try {
      const response = await instance.get('/news');
      dispatch({ type: 'SET_POSTS', payload: response.data.data });
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts(); // Fetch posts when the provider mounts
  }, []);

  const addPost = async (post: NewsItem) => {
    try {
      const response = await instance.post('/news', post);
      dispatch({ type: 'ADD_POST', payload: response.data }); // Dispatch add action
    } catch (error) {
      console.error('Failed to add post:', error);
    }
  };

  const updatePost = async (id: number, post: NewsItem) => {
    try {
      const response = await instance.put(`/news/${id}`, post);
      dispatch({ type: 'UPDATE_POST', payload: response.data }); // Make sure response.data has the updated post
    } catch (error) {
      console.error('Failed to update post:', error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await instance.delete(`/news/${id}`);
      dispatch({ type: 'DELETE_POST', payload: id }); // Dispatch delete action
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <PostsContext.Provider value={{ state, dispatch, addPost, updatePost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook to use the PostsContext
export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};
