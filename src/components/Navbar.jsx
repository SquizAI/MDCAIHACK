import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import logo from '../assets/logo.svg';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check localStorage for user data
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="MDC Hackathon Logo" className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/schedule" className="text-gray-600 hover:text-blue-600 font-medium">
              Schedule
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                  Register Now
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {(user.role === 'participant' || user.role === 'both') && (
                  <Link to="/participant/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                    Participant Dashboard
                  </Link>
                )}
                {(user.role === 'volunteer' || user.role === 'both') && (
                  <Link to="/volunteer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                    Volunteer Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}