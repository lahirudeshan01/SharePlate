import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [role, setRole] = useState('shelter');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async () => {
    const response = await authAPI.login(email, password);
    if (!response?.data?.success) {
      throw new Error('Login failed');
    }

    login(response.data.user, response.data.token);
    navigate('/dashboard');
  };

  const handleRegister = async () => {
    const response = await authAPI.signup({
      name,
      email,
      password,
      role,
      organizationName,
    });

    if (!response?.data?.success) {
      throw new Error('Registration failed');
    }

    login(response.data.user, response.data.token);
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      if (mode === 'login') {
        await handleLogin();
      } else {
        await handleRegister();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-4 py-10 md:px-6">
      <div className="max-w-[1180px] mx-auto">
        <div className="max-w-md mx-auto bg-white border border-[#d9dde3] rounded-2xl p-6 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
          <div className="mb-5 inline-flex rounded-xl bg-[#eef2f6] p-1 w-full">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-[#0f172a]' : 'text-[#475569]'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-[#0f172a]' : 'text-[#475569]'}`}
            >
              Register
            </button>
          </div>

          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h1>
          <p className="text-[#64748b] mb-6">
            {mode === 'login'
              ? 'Sign in to your account.'
              : 'Register as a donor or shelter to get started.'}
          </p>

          {error && (
            <div className="mb-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-[#b91c1c] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-[#d1d5db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cbd5e1]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1">Organization</label>
                  <input
                    type="text"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    className="w-full rounded-xl border border-[#d1d5db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cbd5e1]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#334155] mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-[#d1d5db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cbd5e1]"
                  >
                    <option value="shelter">Shelter</option>
                    <option value="donor">Donor (Restaurant)</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#d1d5db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cbd5e1]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#334155] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-[#d1d5db] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#cbd5e1]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#0f172a] text-white py-2.5 font-semibold hover:bg-[#1e293b] transition disabled:opacity-60"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register & Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
