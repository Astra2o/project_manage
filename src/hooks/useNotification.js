import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notif) =>
    set((state) => {
      // Browser native notification
      if (Notification.permission === 'granted') {
        new Notification(notif.message, {
          body: notif.type,
          data: { link: notif.link },
        });
      }

      return {
        notifications: [...state.notifications, notif],
      };
    }),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));

export default useNotificationStore;
