import React, { useState, useEffect } from 'react';
import { User, Lock, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { ViewState } from './types';
import { StorageService } from './services/storageService';
import { Button, Input, Card } from './components/UIComponents';

export default function App() {
  const [view, setView] = useState<ViewState>('LOGIN');
  const [currentUser, setCurrentUser] = useState<import('./types').User | null>(null);
  
  // Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check login status on mount
  useEffect(() => {
    const user = StorageService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setView('HOME');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const res = StorageService.login(username, password);
    if (res.success) {
      setCurrentUser(StorageService.getCurrentUser());
      setView('HOME');
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 800));

    const res = StorageService.register(username, password);
    if (res.success) {
      alert('注册成功，请登录');
      setView('LOGIN');
      setPassword(''); // Clear password for safety
    } else {
      setError(res.message);
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    StorageService.logout();
    setCurrentUser(null);
    setView('LOGIN');
    setUsername('');
    setPassword('');
  };

  // --- Views ---

  if (view === 'HOME') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
            <LayoutDashboard />
            <span>MyApp</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-600">你好, <span className="font-bold text-slate-900">{currentUser?.username}</span></span>
            <Button variant="outline" onClick={handleLogout} className="w-auto px-4 py-1.5" icon={LogOut}>
              退出
            </Button>
          </div>
        </nav>
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-800">欢迎回来</h1>
            <p className="text-slate-500">这是您的个人中心主页。</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Branding */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {view === 'LOGIN' ? '欢迎登录' : '创建账号'}
          </h1>
          <p className="text-slate-500">
            {view === 'LOGIN' ? '请输入您的账号以继续' : '免费注册，开启您的旅程'}
          </p>
        </div>

        <Card>
          <form onSubmit={view === 'LOGIN' ? handleLogin : handleRegister} className="space-y-5">
            <Input 
              label="用户名" 
              icon={User}
              placeholder="请输入用户名" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            
            <Input 
              label="密码" 
              type="password"
              icon={Lock}
              placeholder="请输入密码" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              error={error}
            />

            <div className="pt-2">
              <Button type="submit" isLoading={isLoading} icon={view === 'LOGIN' ? LogIn : UserPlus}>
                {view === 'LOGIN' ? '立即登录' : '注册账号'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              {view === 'LOGIN' ? '还没有账号？' : '已有账号？'}
              <button 
                onClick={() => {
                  setView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN');
                  setError('');
                }}
                className="ml-1 text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all"
              >
                {view === 'LOGIN' ? '点击注册' : '直接登录'}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}