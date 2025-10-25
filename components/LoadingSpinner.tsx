
import React from 'react';

interface LoadingSpinnerProps {
    text: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 dark:from-gray-800 dark:via-slate-900 dark:to-black animated-gradient"></div>
      <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-6 text-lg text-gray-700 dark:text-gray-300 font-semibold">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
