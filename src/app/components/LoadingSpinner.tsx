import React from 'react';

interface LoadingSpinnerProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ text = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <img
            src="/imgs/Shopping cart.gif"
            alt="Loading"
            className={`${sizeClasses[size]} mx-auto mb-4`}
          />


          <h1 className="text-2xl font-bold text-gray-900 mb-4">{text}</h1>
        </div>
      </div>
    </div>
  );
}
