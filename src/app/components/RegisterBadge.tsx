'use client';

import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';

export default function RegisterBadge({ className }: { className?: string }) {
  const { user, logout, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center space-x-4 ${className || ''}`}>
        <button
          onClick={logout}
          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
        <Link
          href="/profile"
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Profile
        </Link>
        <span className="text-sm text-gray-700">
          Welcome: <span className="font-medium">{user.name}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className || ''}`}>
      <Link
        href="/login"
        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
      >
        Sign Up
      </Link>
    </div>
  );
}
