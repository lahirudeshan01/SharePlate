import React, { useEffect, useState } from 'react';
import { donationAPI } from '../services/api';
import DonationCard from '../components/DonationCard';

export default function BrowseDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDonations, setFilteredDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    const filtered = donations.filter(
      (donation) =>
        donation.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (donation.location?.address || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDonations(filtered);
  }, [searchTerm, donations]);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getAvailable();
      if (response.data.success) {
        setDonations(response.data.donations);
        setFilteredDonations(response.data.donations);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading donations...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Available Donations</h1>
        <p className="text-gray-600 mb-8">
          Browse and request food donations from generous donors
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by food name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
        </div>

        {filteredDonations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No donations match your search' : 'No donations available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation) => (
              <DonationCard key={donation._id} donation={donation} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
