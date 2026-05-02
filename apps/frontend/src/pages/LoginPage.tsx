import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      toast.success(`Welcome, ${data.user.name}!`);
      navigate('/billing');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-red rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">POS</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Restaurant POS</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lavishtown.com"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-2.5 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
