
import { User } from '../types';

const USERS_KEY = 'app_users';
const CURRENT_USER_KEY = 'app_current_user';

export const StorageService = {
  getUsers: (): Record<string, User> => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveUsers: (users: Record<string, User>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser: (): User | null => {
    const username = localStorage.getItem(CURRENT_USER_KEY);
    if (!username) return null;
    const users = StorageService.getUsers();
    return users[username] || null;
  },

  setCurrentUser: (username: string | null) => {
    if (username) {
      localStorage.setItem(CURRENT_USER_KEY, username);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  register: (username: string, password: string): { success: boolean; message: string } => {
    const users = StorageService.getUsers();
    if (users[username]) {
      return { success: false, message: '用户名已存在' };
    }

    const newUser: User = {
      username,
      passwordHash: password,
      createdAt: new Date().toISOString(),
    };

    users[username] = newUser;
    StorageService.saveUsers(users);
    return { success: true, message: '注册成功，请登录' };
  },

  login: (username: string, password: string): { success: boolean; message: string } => {
    const users = StorageService.getUsers();
    const user = users[username];
    
    if (!user || user.passwordHash !== password) {
      return { success: false, message: '用户名或密码错误' };
    }

    StorageService.setCurrentUser(username);
    return { success: true, message: '登录成功' };
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
