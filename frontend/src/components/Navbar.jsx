import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isBrowseActive = location.pathname === '/';
  const isDashboardActive = location.pathname === '/dashboard';
  const isMyRequestsActive = isDashboardActive && user?.role !== 'donor';
  const isManageRequestsActive = isDashboardActive && user?.role === 'donor';

  const navItemClass = (isActive) =>
    [
      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors md:text-base',
      isActive ? 'bg-[#e6f5ec] text-[#1b9d59]' : 'text-[#4b5563] hover:bg-[#f2f4f7]',
    ].join(' ');

  return (
    <nav className="sticky top-0 z-20 bg-white/95 border-b border-[#e3e7ec] backdrop-blur">
      <div className="max-w-[1180px] mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 text-[1.85rem] font-semibold text-[#111827] md:text-[2rem]">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#0ea55b] text-white">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.9">
              <path d="M12 3 4.5 7v10L12 21l7.5-4V7L12 3Z" />
              <path d="M12 3v8m0 0 7.5-4M12 11 4.5 7" />
            </svg>
          </span>
          SharePlate
        </Link>

        <div className="flex gap-2 items-center text-sm md:text-base">
          <Link
            to="/"
            className={navItemClass(isBrowseActive)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <rect x="3" y="3" width="14" height="14" rx="2.5" />
              <path d="M10 3v14M3 10h14" />
            </svg>
            Browse Donations
          </Link>

          <Link
            to="/dashboard"
            className={navItemClass(isMyRequestsActive)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M4.2 9.8 8 13.6l7.8-7.8" />
              <rect x="2.5" y="2.5" width="15" height="15" rx="2.5" />
            </svg>
            My Requests
          </Link>

          {user?.role === 'donor' && (
            <>
              <Link
                to="/dashboard"
                className={navItemClass(isManageRequestsActive)}
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <rect x="3" y="3" width="5" height="5" rx="1" />
                  <rect x="12" y="3" width="5" height="5" rx="1" />
                  <rect x="3" y="12" width="5" height="5" rx="1" />
                  <rect x="12" y="12" width="5" height="5" rx="1" />
                </svg>
                Manage Requests
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="ml-2 bg-[#111827] hover:bg-[#1f2937] transition px-4 py-2 rounded-xl text-sm font-semibold text-white"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-2 bg-[#111827] hover:bg-[#1f2937] transition px-4 py-2 rounded-xl text-sm font-semibold text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
