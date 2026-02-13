'use client';

import VerifyResetCodeForm from '../components/VerifyResetCodeForm';

export default function VerifyResetCodePage() {
  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verify Reset Code
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the reset code sent to your email.
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <VerifyResetCodeForm />
        </div>
      </div>
    </div>
  );
}
