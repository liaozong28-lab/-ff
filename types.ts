
export type ViewState = 'LOGIN' | 'REGISTER' | 'HOME';

export interface User {
  username: string;
  passwordHash: string; // 在实际应用中应加密
  createdAt: string;
}
