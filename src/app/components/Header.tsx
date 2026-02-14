'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faShoppingCart, faBars, faTimes, faUser, faSignOutAlt, faHome, faBox, faTags, faHeart, faSearch, faChevronDown } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../lib/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';


export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
    return undefined;
  }, [pathname]);

  const menuVariants = {
    open: {
      scaleY: 1,
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
    closed: {
      scaleY: 0,
      opacity: 0,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.1,
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
      },
    },
  };

  const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
  };

  const menuItems = [
    { href: '/', icon: faHome, text: 'Home' },
    { href: '/products', icon: faBox, text: 'Products' },
    { href: '/brands', icon: faTags, text: 'Brands' },
    { href: '/wishlist', icon: faHeart, text: 'Wishlist' },
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16 relative">

            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden absolute left-0 text-gray-700 hover:text-blue-600 transition-colors p-2 z-10"
              animate={isMenuOpen ? "open" : "closed"}
            >
              <motion.span variants={iconVariants}>
                <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
              </motion.span>
            </motion.button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden absolute right-0 text-gray-700 hover:text-blue-600 transition-colors p-2 z-10"
              aria-label="Search"
            >
              <FontAwesomeIcon icon={faSearch} size="lg" />
            </button>


            <div className="flex items-center space-x-8 w-full md:w-auto justify-center md:justify-start">

              <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-gray-900">

                <div className="bg-green-500 p-2 rounded-lg">
                  <FontAwesomeIcon icon={faShoppingCart} className="text-white text-xl" />
                </div>
                <span>Ecommerce</span>
              </Link>

              <nav className="hidden md:flex space-x-6">


                <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Products
                </Link>
                <Link href="/brands" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Brands
                </Link>
              <Link href="/wishlist" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Wishlist
                </Link>
              </nav>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="  hidden md:flex items-center gap-50 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors "
                aria-label="Search"
              >
                <span className="text-xs">Search...</span>
                <FontAwesomeIcon icon={faSearch} className="text-xs" />
              </button>





            </div>

            <div className="hidden md:flex items-center space-x-4 py-2">


              {isAuthenticated && user ? (
                <>
                  <span className="text-lg text-gray-700 font-bold">

                    Welcome <span className="font-bold  text-sm text-green-500">{user.name}</span>
                  </span>
                  
                  <div 
                    className="relative"
                    onMouseEnter={() => setIsProfileDropdownOpen(true)}
                    onMouseLeave={() => setIsProfileDropdownOpen(false)}
                  >
                    <button
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="text-sm" />
                      <FontAwesomeIcon 
                        icon={faChevronDown} 
                        className={`text-xs transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] z-50"
                        >
                          <div className="flex gap-2 px-2">
                            <Link
                              href="/profile"
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                            >
                              <FontAwesomeIcon icon={faUser} className="text-sm" />
                              Profile
                            </Link>
                            <button
                              onClick={logout}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                            >
                              <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
              <div className="flex space-x-2 ml-2">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </a>
                <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-500 transition-colors">
                  <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
                  <FontAwesomeIcon icon={faInstagram} size="lg" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700 transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} size="lg" />
                </a>
              </div>




            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden origin-top"
            >
              <nav className="px-4 py-4 space-y-2">
                {isAuthenticated && user && (
                  <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-3 p-3 text-gray-700 bg-green-50 rounded-md mb-2">
                      <FontAwesomeIcon icon={faUser} className="text-lg text-green-500" />
                      <span className="font-medium">Welcome <span className="text-green-500">{user.name}</span></span>
                    </div>
                  </motion.div>
                )}
                {menuItems.map((item) => (
                  <motion.div key={item.href} variants={itemVariants}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={item.icon} className="text-lg" />
                      <span className="font-medium">{item.text}</span>
                    </Link>
                  </motion.div>
                ))}

                {isAuthenticated && user && (
                  <>
                    <motion.div variants={itemVariants} className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex gap-2">
                        <Link
                          href="/profile"
                          className="flex-1 flex items-center justify-center gap-2 p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faUser} className="text-lg" />
                          <span className="font-medium">Profile</span>
                        </Link>

                        <motion.button
                          variants={itemVariants}
                          onClick={() => { logout(); setIsMenuOpen(false); }}
                          className="flex-1 flex items-center justify-center gap-2 p-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="text-lg" />
                          <span className="font-medium">Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  </>
                )}

                {!isAuthenticated && (
                  <>
                    <motion.div variants={itemVariants} className="border-t border-gray-200 pt-2 mt-2">
                      <Link
                        href="/login"
                        className="flex items-center gap-3 p-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                        <span className="font-medium">Login</span>
                      </Link>
                      <Link
                        href="/signup"
                        className="flex items-center gap-3 p-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-lg" />
                        <span className="font-medium">Sign Up</span>
                      </Link>
                    </motion.div>
                  </>
                )}
                
                <motion.div variants={itemVariants} className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center justify-center space-x-3 p-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
                      <FontAwesomeIcon icon={faFacebook} size="lg" />
                    </a>
                    <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-500 transition-colors">
                      <FontAwesomeIcon icon={faWhatsapp} size="lg" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-600 transition-colors">
                      <FontAwesomeIcon icon={faInstagram} size="lg" />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-700 transition-colors">
                      <FontAwesomeIcon icon={faLinkedin} size="lg" />
                    </a>
                  </div>
                </motion.div>




              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
