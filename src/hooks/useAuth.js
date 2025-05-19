import { api } from '@/lib/api';
import axios from 'axios';
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,

 initializeAuth: () => {
  const token = localStorage.getItem('token');

  const getUser = async () => {
    try {
      const res = await api.get("/get_user");
      if (res.data.success) {
        const { user } = res.data;
        set({ token, user });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      // Optional: clear token on error if needed
      localStorage.removeItem('token');
      set({ token: null, user: null });
    }
  };

  if (token) {
    set({ token });
    getUser();
  }
},


  login: (token, user) => {
    localStorage.setItem('token', token);
    // localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },

  loginWithAPI: async (email, password) => {
    try {
      const res = await axios.post('/api/login', { email, password });
      //  console.log(res.status);
       
      if (res.status==200) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        set({ token, user });
        return { success: true };
      } else {
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login Error:', error);
      return { success: false, message: 'Login failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;
