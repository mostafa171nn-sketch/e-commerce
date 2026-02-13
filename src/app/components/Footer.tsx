import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-8">
          <h2
            className="text-4xl font-extrabold text-transparent bg-clip-text bg-cover bg-center mb-4"
            style={{
              backgroundImage: 'url(/banner-4.jpeg)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            Get the FreshCart app
          </h2>
          <p className="text-sm text-black/60">
            Enter your email and we'll send you a link to download the app on your phone.
          </p>
        </section>

        <section className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
          <input
            type="email"
            placeholder="Email…"
            className="flex-1 w-lg px-4 py-2 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder:text-black"
          />
          <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
            Share App Link
          </button>
        </section>

        <section className=" mb-8">
          <hr className="border-gray-300 my-4" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <h3 className="text-base sm:text-lg font-medium text-gray-600">Payment Partners</h3>
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png" alt="MasterCard" className="w-8 sm:w-12 h-4 sm:h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/200px-Amazon_logo.svg.png" alt="Amazon" className="w-8 sm:w-12 h-4 sm:h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/200px-PayPal.svg.png" alt="PayPal" className="w-8 sm:w-12 h-4 sm:h-6" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-base sm:text-lg font-medium text-gray-600">Get deliveries with FreshCart</span>
              <div className="flex gap-2">
                <button className="flex items-center">
                  <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg" alt="App Store" className="w-20 sm:w-24 h-10 sm:h-12" />
                </button>
                <button className="flex items-center">
                  <img src="/google-play-badge.png" alt="Google Play" className="w-22 sm:w-28 h-10 sm:h-12" />
                </button>
              </div>
            </div>
          </div>
          <hr className="border-gray-300 my-4" />
        </section>

      </div>
    </footer>
  );
};

export default Footer;
