'use client';

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [brandId, setBrandId] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend.phonxai.com/api';

  // Step 1: Initiate OAuth
  const initiateAuth = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_URL}/ghl/initiate-auth`, {
        brandId,
      });
      setAuthUrl(response.data.data.authorizationUrl);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate auth');
      setLoading(false);
    }
  };

  // Step 2: Check OAuth Status
  const checkStatus = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/ghl/status`, {
        params: { brandId },
      });
      setStatus(response.data.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check status');
      setLoading(false);
    }
  };

  // Step 3: Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/ghl/users`, {
        params: { brandId },
      });
      setUsers(response.data.data.users);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  // Step 4: Fetch Calendar
  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_URL}/ghl/calendar`, {
        params: {
          brandId,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
        },
      });
      setCalendarEvents(response.data.data.events);
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch calendar');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          GHL OAuth Integration Tester
        </h1>

        {/* Brand ID Input */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand ID
          </label>
          <input
            type="text"
            value={brandId}
            onChange={(e) => setBrandId(e.target.value)}
            placeholder="Enter your brand ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Initiate OAuth */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Step 1: Initiate OAuth
          </h2>
          <button
            onClick={initiateAuth}
            disabled={!brandId || loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Generate Auth URL'}
          </button>

          {authUrl && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Click the link below to authorize:
              </p>
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {authUrl}
              </a>
            </div>
          )}
        </div>

        {/* Step 2: Check Status */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Step 2: Check OAuth Status
          </h2>
          <button
            onClick={checkStatus}
            disabled={!brandId || loading}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Check Status'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-gray-50 rounded text-black">
              <p className="text-sm">
                <strong>Connected:</strong>{' '}
                {status.isConnected ? '✅ Yes' : '❌ No'}
              </p>
              {status.locationId && (
                <p className="text-sm">
                  <strong>Location ID:</strong> {status.locationId}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Fetch Users */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Step 3: Fetch Users
          </h2>
          <button
            onClick={fetchUsers}
            disabled={!brandId || loading}
            className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch Users'}
          </button>

          {users.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-black">Users ({users.length}):</h3>
              <div className="space-y-2">
                {users.map((user, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded text-black">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    {user.phone && (
                      <p className="text-sm text-gray-600">{user.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Fetch Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Step 4: Fetch Calendar Events
          </h2>
          <button
            onClick={fetchCalendar}
            disabled={!brandId || loading}
            className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Fetch Calendar'}
          </button>

          {calendarEvents.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2 text-black">
                Events ({calendarEvents.length}):
              </h3>
              <div className="space-y-2">
                {calendarEvents.map((event, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded text-black">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.startTime).toLocaleString()} -{' '}
                      {new Date(event.endTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {event.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
