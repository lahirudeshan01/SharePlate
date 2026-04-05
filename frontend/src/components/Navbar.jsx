import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold hover:text-blue-200 transition">
          🍽️ SharePlate
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/" className="hover:text-blue-200 transition font-semibold">
            Browse
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-blue-200 transition font-semibold">
              {user.role === 'shelter' ? 'My Requests' : 'Approvals'}
            </Link>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-2">
                <div className="bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs text-blue-200">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 transition px-4 py-2 rounded-lg font-semibold"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
