import React, { useEffect, useState } from 'react';
import { requestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRequestId, setEditingRequestId] = useState(null);
  const [editForm, setEditForm] = useState({
    requestedQuantity: '',
    message: '',
  });

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'shelter') {
        const res = await requestAPI.getMyRequests();
        setRequests(res.data.requests || []);
      } else if (user?.role === 'donor') {
        const res = await requestAPI.getDonorRequests();
        setRequests(res.data.requests || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await requestAPI.approveRequest(requestId);
      alert('Request approved successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await requestAPI.rejectRequest(requestId);
      alert('Request rejected!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestAPI.deleteRequest(requestId);
        alert('Request deleted!');
        fetchData();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  const startEditRequest = (req) => {
    const currentQty = req.requestedQuantity ?? req.quantityRequested ?? 1;
    setEditingRequestId(req._id);
    setEditForm({
      requestedQuantity: String(currentQty),
      message: req.message || '',
    });
  };

  const cancelEditRequest = () => {
    setEditingRequestId(null);
    setEditForm({ requestedQuantity: '', message: '' });
  };

  const handleUpdateRequest = async (requestId) => {
    const parsedQty = Number(editForm.requestedQuantity);
    if (!Number.isInteger(parsedQty) || parsedQty < 1) {
      alert('Quantity must be a positive number');
      return;
    }

    try {
      await requestAPI.updateRequest(requestId, {
        requestedQuantity: parsedQty,
        message: editForm.message,
      });
      alert('Request updated successfully!');
      cancelEditRequest();
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">
          {user?.role === 'shelter' ? 'My Food Requests' : 'Request Approvals'}
        </h1>
        <p className="text-gray-600 mb-8">
          {user?.role === 'shelter'
            ? 'Track your food donation requests'
            : 'Review and approve food requests'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              {user?.role === 'shelter'
                ? 'No requests yet. Browse available donations!'
                : 'No pending requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{req?.donation?.foodName || 'Donation'}</h3>
                <div className="space-y-1 text-sm text-gray-700 mb-4">
                  <p>
                    <strong>Requested Quantity:</strong> {req.requestedQuantity ?? req.quantityRequested ?? 'N/A'}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={`font-semibold ${
                        req.status === 'approved'
                          ? 'text-green-600'
                          : req.status === 'rejected'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {req.status}
                    </span>
                  </p>
                  {user?.role === 'donor' && req?.shelter?.organizationName && (
                    <p>
                      <strong>Shelter:</strong> {req.shelter.organizationName}
                    </p>
                  )}
                  {user?.role === 'shelter' && req?.donation?.donor?.organizationName && (
                    <p>
                      <strong>Donor:</strong> {req.donation.donor.organizationName}
                    </p>
                  )}
                </div>

                {user?.role === 'donor' && req.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {user?.role === 'shelter' && req.status === 'pending' && (
                  <div className="space-y-3">
                    {editingRequestId === req._id ? (
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Requested Quantity
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={editForm.requestedQuantity}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, requestedQuantity: e.target.value }))
                            }
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                          <textarea
                            value={editForm.message}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, message: e.target.value }))
                            }
                            rows="3"
                            className="w-full border rounded px-3 py-2"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateRequest(req._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Save Update
                          </button>
                          <button
                            onClick={cancelEditRequest}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditRequest(req)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          Update Request
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(req._id)}
                          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                        >
                          Delete Request
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 