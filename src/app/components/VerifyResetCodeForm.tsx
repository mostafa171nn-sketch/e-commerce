 'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyResetCode } from '../lib/auth';

export default function VerifyResetCodeForm() {
  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email')?.trim() || '';

  if (!email) {
    return (
      <div className="text-center">
        <p className="text-red-600">Email is required. Please go back to the forgot password page.</p>
        <button
          onClick={() => router.push('/forgot-password')}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go to Forgot Password
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const trimmedCode = resetCode.trim();
    if (!trimmedCode) {
      setError('Please enter the reset code.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyResetCode(email, trimmedCode);
      setMessage('Reset code verified successfully.');
      // Redirect to reset password page with email and resetCode
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&resetCode=${encodeURIComponent(trimmedCode)}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      <div>
        <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700">
          Reset Code
        </label>
        <input
          id="resetCode"
          name="resetCode"
          type="text"
          required
          value={resetCode}
          onChange={(e) => setResetCode(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter the reset code"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Code'}
        </button>
      </div>
    </form>
  );
}
