
import React, { useState } from 'react';

interface SignUpProps {
  onSignUp: (email: string) => void;
  onSwitchToLogin: () => void;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && password === confirmPassword) {
      // In a real app, you'd create the user here.
      // For this simulation, we'll just log them in.
      onSignUp(email);
    } else if (password !== confirmPassword) {
        alert("Passwords don't match!");
    }
  };

  return (
    <div className="fade-in">
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-signup" className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email-signup"
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
          <label htmlFor="password-signup" className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
            Password
          </label>
          <div className="mt-1">
            <input
              id="password-signup"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-left text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirm-password-signup"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white/50 dark:bg-gray-800/50"
            />
          </div>
        </div>


        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Sign up
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
          Sign in
        </button>
      </p>
    </div>
  );
};

export default SignUp;
