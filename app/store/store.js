import { configureStore, combineReducers } from '@reduxjs/toolkit';
import sidebarReducer from './slices/sidebarSlice';
import authReducer from './slices/authSlice';

// Combine all reducers here
const rootReducer = combineReducers({
  auth: authReducer,
  sidebar: sidebarReducer,
});

// Configure the store with rootReducer
export const store = configureStore({
  reducer: rootReducer,
}); 