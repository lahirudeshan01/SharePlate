import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DonationCard({ donation }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAvailable = donation?.status === 'available';

  const handleRequestClick = () => {
    if (!isAvailable) {
      alert('This donation is not available for new requests right now');
      return;
    }
    if (!user) {
      navigate(`/request/${donation._id}`);
      return;
    }
    if (user.role !== 'shelter') {
      alert('Only shelters can request donations');
      return;
    }
    navigate(`/request/${donation._id}`);
  };

  const expiryDate = donation?.expiryDate ? new Date(donation.expiryDate) : null;
  const isValidExpiry = expiryDate instanceof Date && !Number.isNaN(expiryDate?.getTime?.());
  const daysLeft = isValidExpiry
    ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpiring = typeof daysLeft === 'number' && daysLeft < 2;
  const donorName =
    donation?.donor?.organizationName ||
    donation?.donor?.name ||
    'Unknown donor';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{donation.foodName || 'Unnamed donation'}</h3>

        <p className="mb-3 text-sm">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 font-semibold ${
              isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {donation?.status || 'unknown'}
          </span>
        </p>

        <div className="space-y-2 mb-4 text-gray-600 text-sm">
          <p>
            <strong>Quantity:</strong> {donation?.quantity ?? 'N/A'} units
          </p>
          <p>
            <strong>Location:</strong> {donation.location?.address || 'N/A'}
          </p>
          <p>
            <strong>Organization:</strong> {donorName}
          </p>
          {typeof daysLeft === 'number' ? (
            <p
              className={`font-semibold ${
                isExpiring ? 'text-red-600' : 'text-green-600'
              }`}
            >
              <strong>Expires in:</strong> {daysLeft > 0 ? daysLeft : 'today'} days
            </p>
          ) : (
            <p className="font-semibold text-gray-500">
              <strong>Expires in:</strong> N/A
            </p>
          )}
        </div>

        <button
          onClick={handleRequestClick}
          disabled={!isAvailable}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isAvailable ? 'Request This Food' : 'Currently Unavailable'}
        </button>
      </div>
    </div>
  );
}
