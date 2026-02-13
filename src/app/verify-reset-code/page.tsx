import VerifyResetCodeForm from '../components/VerifyResetCodeForm';

// App Router Server Component - fetches data on the server (replaces getServerSideProps)
export default async function VerifyResetCodePage() {
  // Fetch initial data on the server if needed
  let initialData = null;
  
  try {
    // Example: Fetch from a real API or remove if not needed
    const res = await fetch('https://api.example.com/init', {
      cache: 'no-store' // Dynamic data fetching on each request
    });
    initialData = await res.json();
  } catch (err) {
    console.error('Error fetching initial data:', err);
    initialData = null;
  }

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
          <VerifyResetCodeForm initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
