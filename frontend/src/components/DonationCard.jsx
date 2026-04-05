import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DonationCard({ donation }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleRequestClick = () => {
    if (!user) {
      alert('Please sign in first');
      return;
    }
    if (user.role !== 'shelter') {
      alert('Only shelters can request donations');
      return;
    }
    navigate(`/request/${donation._id}`);
  };

  const expiryDate = new Date(donation.expiryDate);
  const daysLeft = Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
  const isExpiring = daysLeft < 2;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105">
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-gray-900">{donation.foodName}</h3>

        <div className="space-y-2 mb-4 text-gray-600 text-sm">
          <p>
            <strong>Quantity:</strong> {donation.quantity} units
          </p>
          <p>
            <strong>Location:</strong> {donation.location?.address || 'N/A'}
          </p>
          <p>
            <strong>Organization:</strong> {donation.donor.organizationName}
          </p>
          <p
            className={`font-semibold ${
              isExpiring ? 'text-red-600' : 'text-green-600'
            }`}
          >
            <strong>Expires in:</strong> {daysLeft > 0 ? daysLeft : 'today'} days
          </p>
        </div>

        <button
          onClick={handleRequestClick}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Request This Food
        </button>
      </div>
    </div>
  );
}
