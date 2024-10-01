// src/context/PostsContext.tsx
import React, { createContext, useReducer, useContext } from 'react';
import { NewsItem } from '../interface/NewsItem';


// Định nghĩa các hành động
type Action =
  | { type: 'SET_POSTS'; payload: NewsItem[] }
  | { type: 'ADD_POST'; payload: NewsItem }
  | { type: 'UPDATE_POST'; payload: NewsItem }
  | { type: 'DELETE_POST'; payload: number };

// Định nghĩa kiểu trạng thái
interface PostsState {
  posts: NewsItem[];
}

// Tạo context
const PostsContext = createContext<{ state: PostsState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Hàm giảm
const postsReducer = (state: PostsState, action: Action): PostsState => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [...state.posts, action.payload] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post => (post.id === action.payload.id ? action.payload : post)),
      };
    case 'DELETE_POST':
      return { ...state, posts: state.posts.filter(post => post.id !== action.payload) };
    default:
      return state;
  }
};

// Tạo provider
export const PostsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(postsReducer, { posts: [] });

  return (
    <PostsContext.Provider value={{ state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};

// Custom hook để sử dụng context
export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a PostsProvider');
  }
  return context;
};
