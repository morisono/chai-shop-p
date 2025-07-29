// Authentication Components Index
// Export all Better Auth components for easy import

// Core Authentication Forms
export { LoginForm } from '../LoginForm';
export { SignUpForm } from '../SignUpForm';
export { UserProfile } from '../UserProfile';

// Authentication Provider
export { AuthProvider, useAuthClient } from '../AuthProvider';

// Testing and Validation Components
export { AuthTest } from '../AuthTest';
export { SecurityTest } from '../SecurityTest';
export { AuthDashboard } from '../AuthDashboard';

// Re-export auth utilities from lib
export { authClient } from '../../../lib/auth-client';
export { useAuth } from '../../../lib/auth';

// Types
export type { AuthClient, Session, User } from '../../../lib/auth-client';
