import React, { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { AuthTest } from './AuthTest';
import { SecurityTest } from './SecurityTest';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { UserProfile } from './UserProfile';

type Tab = 'overview' | 'auth' | 'security' | 'login' | 'signup' | 'profile';

export const AuthDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData.data);
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();
  }, []);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: '📊' },
    { id: 'auth' as Tab, label: 'Auth Tests', icon: '🧪' },
    { id: 'security' as Tab, label: 'Security Tests', icon: '🔒' },
    { id: 'login' as Tab, label: 'Login', icon: '🔑' },
    { id: 'signup' as Tab, label: 'Sign Up', icon: '📝' },
    { id: 'profile' as Tab, label: 'Profile', icon: '👤' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-2">Better Auth Implementation</h2>
              <p className="text-blue-100">
                Comprehensive authentication system with modern security features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🔐</span>
                  <h3 className="text-lg font-semibold">Authentication</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Email/Password</li>
                  <li>✅ OAuth (GitHub, Google)</li>
                  <li>✅ Passkey (WebAuthn)</li>
                  <li>✅ Two-Factor Auth</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">🛡️</span>
                  <h3 className="text-lg font-semibold">Security</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ CSRF Protection</li>
                  <li>✅ Secure Sessions</li>
                  <li>✅ HttpOnly Cookies</li>
                  <li>✅ JWT Support</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">⚡</span>
                  <h3 className="text-lg font-semibold">Features</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Session Management</li>
                  <li>✅ Password Reset</li>
                  <li>✅ Email Verification</li>
                  <li>✅ Rate Limiting</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Current Session Status</h3>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading session...</span>
                </div>
              ) : session ? (
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-green-600">✅</span>
                    <span className="font-medium text-green-800">Authenticated</span>
                  </div>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>User:</strong> {session.user.name} ({session.user.email})</p>
                    <p><strong>Session ID:</strong> {session.id.substring(0, 16)}...</p>
                    <p><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">⚪</span>
                    <span className="font-medium text-gray-800">Not Authenticated</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Use the Login or Sign Up tabs to authenticate
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-4">Implementation Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Backend Files</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><code>apps/backend/lib/auth.server.ts</code></li>
                    <li><code>apps/backend/lib/auth-utils.ts</code></li>
                    <li><code>apps/backend/lib/db.ts</code></li>
                    <li><code>apps/backend/routes/api.auth.$.ts</code></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Frontend Files</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li><code>apps/frontend/lib/auth-client.ts</code></li>
                    <li><code>apps/frontend/lib/auth.ts</code></li>
                    <li><code>apps/frontend/src/components/AuthProvider.tsx</code></li>
                    <li><code>apps/frontend/src/components/LoginForm.tsx</code></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'auth':
        return <AuthTest />;
      case 'security':
        return <SecurityTest />;
      case 'login':
        return <LoginForm />;
      case 'signup':
        return <SignUpForm />;
      case 'profile':
        return <UserProfile />;
      default:
        return <div>Unknown tab</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
};
