import React from 'react';
import { useSession } from 'better-auth/react';
import { useAuth } from '../../lib/auth';

export const UserProfile: React.FC = () => {
  const { data: session, isLoading } = useSession();
  const { signOut, addPasskey, enableTwoFactor } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const { user } = session;

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddPasskey = async () => {
    const { error } = await addPasskey();
    if (error) {
      alert(`Error adding passkey: ${error}`);
    } else {
      alert('Passkey added successfully!');
    }
  };

  const handleEnable2FA = async () => {
    const { error } = await enableTwoFactor();
    if (error) {
      alert(`Error enabling 2FA: ${error}`);
    } else {
      alert('2FA enabled successfully!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>

      <div className="space-y-6">
        {/* User Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Account Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Name:</span>
              <span className="ml-2 text-sm text-gray-900">{user.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <span className="ml-2 text-sm text-gray-900">{user.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email Verified:</span>
              <span className="ml-2 text-sm text-gray-900">
                {user.emailVerified ? '✅ Verified' : '❌ Not Verified'}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Account Created:</span>
              <span className="ml-2 text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Security Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Passkey Authentication</h4>
                <p className="text-sm text-gray-500">Add a passkey for passwordless login</p>
              </div>
              <button
                onClick={handleAddPasskey}
                className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
              >
                Add Passkey
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
              </div>
              <button
                onClick={handleEnable2FA}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                Enable 2FA
              </button>
            </div>
          </div>
        </div>

        {/* Session Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Session Information</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-500">Session ID:</span>
              <span className="ml-2 text-sm text-gray-900 font-mono">
                {session.id.substring(0, 8)}...
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Expires At:</span>
              <span className="ml-2 text-sm text-gray-900">
                {new Date(session.expiresAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
