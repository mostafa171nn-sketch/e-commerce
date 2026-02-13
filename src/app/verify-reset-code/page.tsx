'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyResetCode } from '../lib/auth';

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function VerifyResetCodeContent() {
  const [resetCode, setResetCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [initialData, setInitialData] = useState<any>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email')?.trim() || '';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com/init';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); 
        
        const res = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        clearTimeout(timeoutId);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setInitialData(data);
      } catch (err) {
        console.warn('Initial data fetch failed (non-critical):', err);
        setInitialData(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

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

    if (!email) {
      setError('Email is required. Please go back to the forgot password page.');
      setLoading(false);
      return;
    }

    try {
      const result = await verifyResetCode(email, trimmedCode);
      setMessage('Reset code verified successfully.');
      
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}&resetCode=${encodeURIComponent(trimmedCode)}`);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while verifying the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push('/forgot-password');
  };

  if (isLoadingData) {
    return <LoadingSpinner />;
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">Email is required. Please go back to the forgot password page.</p>
            <button
              onClick={handleGoBack}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Go to Forgot Password
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the reset code sent to your email.
          </p>
          {email && (
            <p className="mt-1 text-center text-xs text-gray-500">
              Code sent to: {email}
            </p>
          )}
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
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
                disabled={loading}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter the reset code"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleGoBack}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Forgot Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function VerifyResetCodePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <VerifyResetCodeContent />
    </Suspense>
  );
}
