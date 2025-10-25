
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';
import { LogoIcon } from './icons';

interface AuthPageProps {
  onLogin: (email: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-slate-900 dark:to-black animated-gradient"></div>

      <div className="w-full max-w-md mx-auto z-10">
        <div className="flex justify-center items-center gap-3 mb-6">
          <LogoIcon className="h-10 w-10 text-blue-500" />
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            AutoBI
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 fade-in">
          Welcome! Sign in or create an account to continue.
        </p>

        <div className="glassmorphism rounded-xl shadow-lg p-8 border border-white/10">
          {isLoginView ? (
            <Login onLogin={onLogin} onSwitchToSignUp={() => setIsLoginView(false)} />
          ) : (
            <SignUp onSignUp={onLogin} onSwitchToLogin={() => setIsLoginView(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
