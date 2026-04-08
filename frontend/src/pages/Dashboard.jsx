import React, { useEffect, useState } from 'react';
import { requestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
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

  const formatDateTime = (value) => {
    if (!value) {
      return 'N/A';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatDate = (value) => {
    if (!value) {
      return 'N/A';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'N/A';
    }

    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
    });
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

  const pendingRequests = requests.filter((req) => req.status === 'pending');
  const approvedRequests = requests.filter((req) => req.status === 'approved');
  const rejectedRequests = requests.filter((req) => req.status === 'rejected');

  const groupedRequests = {
    pending: pendingRequests,
    approved: approvedRequests,
    rejected: rejectedRequests,
  };

  const tabRequests = groupedRequests[activeTab] || [];

  const statusBadgeClasses = {
    pending: 'bg-[#fff2c9] text-[#b7791f] border border-[#f4df93]',
    approved: 'bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]',
    rejected: 'bg-[#fee2e2] text-[#b91c1c] border border-[#fecaca]',
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] px-4 py-6 md:px-6">
      <div className="max-w-[1180px] mx-auto">
        <h1 className="text-[2.4rem] font-bold text-[#0f172a] mb-1">
          {user?.role === 'shelter' ? 'My Requests' : 'Manage Requests'}
        </h1>
        <p className="text-lg text-[#64748b] mb-8">
          {user?.role === 'shelter'
            ? 'Track your food donation requests'
            : 'Review and approve food requests'}
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#e5e7eb]">
            <p className="text-gray-500 text-lg">
              {user?.role === 'shelter'
                ? 'No requests yet. Browse available donations!'
                : 'No pending requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-[#e7da9d] bg-[#f6f1db] p-5">
                <p className="text-5xl font-semibold leading-none text-[#0f172a]">{pendingRequests.length}</p>
                <p className="mt-2 text-[#475569] text-[15px]">Pending Requests</p>
              </div>
              <div className="rounded-2xl border border-[#b8e8c8] bg-[#e8f5ec] p-5">
                <p className="text-5xl font-semibold leading-none text-[#0f172a]">{approvedRequests.length}</p>
                <p className="mt-2 text-[#475569] text-[15px]">Approved Requests</p>
              </div>
              <div className="rounded-2xl border border-[#d6dde6] bg-[#eff2f6] p-5">
                <p className="text-5xl font-semibold leading-none text-[#0f172a]">{rejectedRequests.length}</p>
                <p className="mt-2 text-[#475569] text-[15px]">Rejected Requests</p>
              </div>
            </div>

            <div className="bg-[#e4e7ec] rounded-2xl p-1.5 grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  activeTab === 'pending' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#334155]'
                }`}
              >
                Pending ({pendingRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('approved')}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  activeTab === 'approved' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#334155]'
                }`}
              >
                Approved ({approvedRequests.length})
              </button>
              <button
                onClick={() => setActiveTab('rejected')}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  activeTab === 'rejected' ? 'bg-white text-[#0f172a] shadow-sm' : 'text-[#334155]'
                }`}
              >
                Rejected ({rejectedRequests.length})
              </button>
            </div>

            {tabRequests.length === 0 ? (
              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-8 text-center text-[#64748b]">
                No requests in this status.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {tabRequests.map((req) => {
                  const donorName = req?.donation?.donor?.organizationName || req?.donation?.donor?.name || 'Unknown donor';
                  const shelterName = req?.shelter?.organizationName || req?.shelter?.name || 'Unknown shelter';
                  const quantity = req.requestedQuantity ?? req.quantityRequested ?? 'N/A';
                  const donationDescription = req?.donation?.description || `${req?.foodName || req?.donation?.foodName || 'Donation'} request`;

                  return (
                    <div key={req._id} className="bg-white p-6 rounded-2xl border border-[#d9dde3] shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-[1.95rem] font-bold text-[#0f172a] leading-tight">
                          {req?.donation?.foodName || req.foodName || 'Donation'}
                        </h3>
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadgeClasses[req.status] || statusBadgeClasses.pending}`}>
                          {req.status}
                        </span>
                      </div>

                      <p className="text-[#64748b] text-lg mb-4">
                        {user?.role === 'shelter' ? `Request from: ${shelterName}` : `Requested by: ${shelterName}`}
                      </p>

                      <div className="bg-[#f8fafc] border border-[#edf2f7] rounded-xl px-4 py-3 mb-3 text-base text-[#1f2937]">
                        {donationDescription}
                      </div>

                      {req.message && (
                        <div className="mb-4 border-l-4 border-[#3b82f6] pl-3 text-[#475569] italic">
                          "{req.message}"
                        </div>
                      )}

                      <div className="space-y-3 text-[#334155] mb-5">
                        <div className="flex flex-wrap items-center gap-6 text-base">
                          <span>Qty: {quantity}</span>
                          <span>Expires: {formatDate(req?.donation?.expiryDate)}</span>
                        </div>
                        <div className="text-base">{req?.donation?.location?.address || 'N/A'}</div>
                        <div className="text-sm text-[#64748b]">
                          Requested: {formatDateTime(req.createdAt)}
                          {user?.role === 'shelter' ? '' : ` • Donor: ${donorName}`}
                        </div>
                      </div>

                      {user?.role === 'donor' && req.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleApprove(req._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition text-sm font-semibold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(req._id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition text-sm font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {user?.role === 'shelter' && req.status === 'pending' && (
                        <div className="space-y-3">
                          {editingRequestId === req._id ? (
                            <div className="border border-[#d9dde3] rounded-xl p-4 bg-[#f8fafc]">
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
                                  className="w-full border border-[#d1d5db] rounded-lg px-3 py-2"
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
                                  className="w-full border border-[#d1d5db] rounded-lg px-3 py-2"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateRequest(req._id)}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                                >
                                  Save Update
                                </button>
                                <button
                                  onClick={cancelEditRequest}
                                  className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600 transition text-sm font-semibold"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditRequest(req)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition text-sm font-semibold"
                              >
                                Update Request
                              </button>
                              <button
                                onClick={() => handleDeleteRequest(req._id)}
                                className="bg-gray-700 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition text-sm font-semibold"
                              >
                                Delete Request
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 