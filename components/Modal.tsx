
import React from 'react';
import type { ModalProps } from '../types';

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 fade-in" 
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out scale-95 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center transition-colors"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
                <div className="flex items-center justify-end p-4 border-t border-gray-200 dark:border-gray-700 rounded-b">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
            {/* FIX: Removed the unsupported 'jsx' prop from the 'style' tag. This is a styled-jsx feature which is not configured in this project, causing a TypeScript error. */}
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;
