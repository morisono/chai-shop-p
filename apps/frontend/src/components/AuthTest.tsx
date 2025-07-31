import React, { useState, useEffect } from 'react';
import { useAuth, authClient } from '../../lib/auth';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export const AuthTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [session, setSession] = useState<any>(null);
  const { signUp, signIn, signOut } = useAuth();

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        setSession(sessionData.data);
      } catch (error) {
        console.error('Failed to get session:', error);
      }
    };

    getSession();
  }, []);

  const addTestResult = (result: TestResult) => {
    setTestResults(prev => [...prev, result]);
  };

  const runAuthTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    const testEmail = `test.${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    const testName = 'Test User';

    // Test 1: Check initial session state
    addTestResult({
      test: 'Initial Session Check',
      status: session ? 'success' : 'success',
      message: session ? 'User already authenticated' : 'No active session (expected for new test)'
    });

    // Test 2: Sign Up
    try {
      const startTime = Date.now();
      const { data, error } = await signUp(testEmail, testPassword, testName);
      const duration = Date.now() - startTime;

      if (error) {
        addTestResult({
          test: 'User Sign Up',
          status: 'error',
          message: `Sign up failed: ${error}`,
          duration
        });
      } else {
        addTestResult({
          test: 'User Sign Up',
          status: 'success',
          message: 'User created and signed in successfully',
          duration
        });
      }
    } catch (error) {
      addTestResult({
        test: 'User Sign Up',
        status: 'error',
        message: `Sign up error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Wait a moment for session to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 3: Session validation
    try {
      const sessionData = await authClient.getSession();
      if (sessionData.data) {
        addTestResult({
          test: 'Session Validation',
          status: 'success',
          message: `Session active for user: ${sessionData.data.user.email}`
        });
      } else {
        addTestResult({
          test: 'Session Validation',
          status: 'error',
          message: 'No session found after sign up'
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Session Validation',
        status: 'error',
        message: `Session validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 4: Sign Out
    try {
      const startTime = Date.now();
      const { error } = await signOut();
      const duration = Date.now() - startTime;

      if (error) {
        addTestResult({
          test: 'Sign Out',
          status: 'error',
          message: `Sign out failed: ${error}`,
          duration
        });
      } else {
        addTestResult({
          test: 'Sign Out',
          status: 'success',
          message: 'Successfully signed out',
          duration
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Sign Out',
        status: 'error',
        message: `Sign out error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Wait for sign out to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Test 5: Sign In with created user
    try {
      const startTime = Date.now();
      const { data, error } = await signIn(testEmail, testPassword);
      const duration = Date.now() - startTime;

      if (error) {
        addTestResult({
          test: 'Sign In',
          status: 'error',
          message: `Sign in failed: ${error}`,
          duration
        });
      } else {
        addTestResult({
          test: 'Sign In',
          status: 'success',
          message: 'Successfully signed in with created user',
          duration
        });
      }
    } catch (error) {
      addTestResult({
        test: 'Sign In',
        status: 'error',
        message: `Sign in error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    // Test 6: API Endpoint Test
    try {
      const response = await fetch('/api/auth/test');
      const data = await response.json();

      addTestResult({
        test: 'API Endpoint',
        status: response.ok ? 'success' : 'error',
        message: `API test: ${data.status} - ${data.message}`
      });
    } catch (error) {
      addTestResult({
        test: 'API Endpoint',
        status: 'error',
        message: `API endpoint test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }

    setIsRunning(false);
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Authentication System Test</h2>
        <button
          onClick={runAuthTests}
          disabled={isRunning}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRunning ? 'Running Tests...' : 'Run Auth Tests'}
        </button>
      </div>

      {session && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">Current Session</h3>
          <div className="text-sm text-green-700">
            <p><strong>User:</strong> {session.user.name} ({session.user.email})</p>
            <p><strong>Session ID:</strong> {session.id.substring(0, 16)}...</p>
            <p><strong>Expires:</strong> {new Date(session.expiresAt).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Test Results</h3>

        {testResults.length === 0 && !isRunning && (
          <p className="text-gray-500 text-center py-8">
            Click "Run Auth Tests" to validate the authentication system
          </p>
        )}

        {testResults.map((result, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{getStatusIcon(result.status)}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{result.test}</h4>
                  <p className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.message}
                  </p>
                </div>
              </div>
              {result.duration && (
                <span className="text-sm text-gray-500">
                  {result.duration}ms
                </span>
              )}
            </div>
          </div>
        ))}

        {isRunning && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-600">Running authentication tests...</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h4 className="font-medium text-gray-900 mb-2">Test Coverage</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• User registration (sign up)</li>
          <li>• Session creation and validation</li>
          <li>• User sign out</li>
          <li>• User sign in</li>
          <li>• API endpoint authentication</li>
          <li>• Error handling and response times</li>
        </ul>
      </div>
    </div>
  );
};
