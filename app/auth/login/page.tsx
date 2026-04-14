'use client';

import { useState } from 'react';
import { useAuth } from '../context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold text-gray-900">
          MIFTAN Analytics
        </div>
        <div className="hidden md:flex items-center gap-4">
          <a className="text-gray-600 hover:text-blue-600 transition-colors" href="#">Help</a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in</h1>
            <p className="text-gray-600">Enter your account credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="name@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>

            <div className="text-center">
              <a href="/auth/register" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
                Don't have an account? Register
              </a>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500">
        © 2026 MIFTAN Systems. High-performance data analytics.
      </footer>
    </div>
  );
}