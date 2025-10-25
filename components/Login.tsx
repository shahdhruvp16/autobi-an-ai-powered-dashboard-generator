
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
  onSwitchToSignUp: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      // In a real app, you'd validate credentials here.
      // For this simulation, we'll just log the user in.
      onLogin(email);
    }
  };

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password"  className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign in
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Not a member?{' '}
        <button onClick={onSwitchToSignUp} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign up
        </button>
      </p>
    </div>
  );
};

export default Login;
