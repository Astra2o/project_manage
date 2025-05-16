// features/sidebar/sidebarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, SidebarItem, SidebarState } from '@/types/sidebar';

const initialState: SidebarState = {
  items: {
    admin: [
      { label: 'Dashboard', path: '/dashboard/admin' },
      { label: 'Users', path: '/dashboard/admin/users' },
    ],
    manager: [
      { label: 'Dashboard', path: '/dashboard/manager' },
      { label: 'Reports', path: '/dashboard/manager/reports' },
    ],
    employee: [
      { label: 'Dashboard', path: '/dashboard/employee' },
      { label: 'Tasks', path: '/dashboard/employee/tasks' },
    ],
  },
  isOpen: true,
  isMobileOpen: false,
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    setSidebarItems: (state, action: PayloadAction<Record<Role, SidebarItem[]>>) => {
      state.items = action.payload;
    },
  },
});

export const { toggleSidebar, toggleMobileSidebar, setSidebarItems } = sidebarSlice.actions;
export default sidebarSlice.reducer;
