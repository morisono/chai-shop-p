# Merged Database Schema Documentation

## Overview

The database schema has been successfully merged, combining the simple authentication tables with a comprehensive security-enhanced schema that includes multi-tenancy, RBAC (Role-Based Access Control), audit logging, and advanced security features.

## Schema Structure

### Core Authentication Tables

#### 1. User Table (`userTable`)
Enhanced user table with security features:
- **Basic Fields**: `id`, `name`, `age`, `image`, `email`, `emailVerified`, `role`
- **Security Enhancements**:
  - `passwordChangedAt`, `lastLoginAt`, `loginAttempts`, `lockedUntil`
  - `mfaEnabled`, `deviceFingerprint`
- **Audit Fields**: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`

#### 2. Session Table (`sessionTable`)
Enhanced session management with security context:
- **Basic Fields**: `id`, `userId`, `token`, `expiresAt`, `ipAddress`, `userAgent`
- **Security Enhancements**:
  - `deviceFingerprint`, `geoLocation`, `securityContext`
  - `activeExpires`, `idleExpires`, `lastActivity`
  - `isRevoked`, `revokedAt`, `revokedBy`

#### 3. Account Table (`accountTable`)
OAuth and authentication provider integration:
- Provider management (`providerId`, `accountId`)
- Token management (`accessToken`, `refreshToken`, `idToken`)
- Token expiration tracking
- Password storage for local authentication

#### 4. Verification Table (`verificationTable`)
Email verification and password reset:
- Enhanced with `attempts` counter for security
- Indexed for performance

### Multi-Tenancy Support

#### 5. Tenant Table (`tenantTable`)
Multi-tenant organization support:
- Tenant identification (`name`, `slug`, `domain`)
- Security settings (MFA requirements, session timeout, IP ranges)
- Activity status management

#### 6. Team Table (`teamTable`)
Team/organization management within tenants:
- Team hierarchy under tenants
- Configurable team settings
- Member management capabilities

#### 7. Role Table (`roleTable`)
Flexible role-based access control:
- Tenant and team-scoped roles
- JSON-based permissions system
- System vs custom role distinction

#### 8. User-Tenant Relationship (`userTenantTable`)
Many-to-many relationship between users and tenants:
- Role assignment per tenant
- Invitation and approval workflow
- Status tracking (active, suspended, pending)

#### 9. User-Team Relationship (`userTeamTable`)
Many-to-many relationship between users and teams:
- Role assignment per team
- Team membership management
- Status tracking

### Advanced Security Features

#### 10. Two-Factor Authentication (`twoFactorTable`)
TOTP and backup code management:
- Secret key storage
- Backup codes
- Usage tracking
- Active status management

#### 11. Passkey Table (`passkeyTable`)
WebAuthn/FIDO2 passkey support:
- Comprehensive WebAuthn metadata
- Device type and backup status
- Security attestation data
- Usage tracking

#### 12. Audit Log Table (`auditLogTable`)
Comprehensive audit trail:
- Event categorization and severity
- Full context capture (user, tenant, session)
- Request tracking and metadata
- Compliance features (retention, immutability)

#### 13. Security Incident Table (`securityIncidentTable`)
Security monitoring and incident response:
- Incident classification and severity
- Resolution workflow
- Metadata collection for forensics
- Status tracking

#### 14. Rate Limit Log Table (`rateLimitLogTable`)
Rate limiting and abuse prevention:
- Identifier-based tracking
- Window-based counting
- Block status management
- Metadata for analysis

### Compatibility Tables

#### 15. Example Table (`exampleTable`)
Simple example table maintained for compatibility

#### 16. Message Table (`messageTable`)
Simple messaging functionality with user references

## Key Features

### 1. **Security-First Design**
- Comprehensive audit logging
- Multi-factor authentication support
- Device fingerprinting
- Geographic location tracking
- Security context management

### 2. **Multi-Tenancy**
- Tenant isolation
- Hierarchical team structure
- Flexible role-based permissions
- Invitation and approval workflows

### 3. **Compliance Ready**
- Immutable audit logs
- Data retention management
- Security incident tracking
- Rate limiting compliance

### 4. **Performance Optimized**
- Strategic indexing on all tables
- Query optimization for common patterns
- Efficient relationship structures

### 5. **Modern Authentication**
- WebAuthn/Passkey support
- OAuth provider integration
- Session security enhancements
- MFA capabilities

## Data Types and Relationships

### Primary Key Strategy
- **UUID**: Used for user-facing entities (users, sessions, accounts)
- **CUID2**: Used for internal entities (tenants, teams, roles)

### Foreign Key Relationships
- Cascade deletion for dependent entities
- Proper referential integrity
- Indexed for performance

### JSON Storage
- Settings and configuration data
- Metadata and context information
- Flexible schema evolution

## Usage Examples

### Basic User Authentication
```typescript
import { userTable, sessionTable } from '@/db/orm/schema';

// User with security enhancements
const user: User = {
  id: uuid(),
  name: 'John Doe',
  email: 'john@example.com',
  emailVerified: false,
  mfaEnabled: true,
  role: 'user'
};

// Enhanced session with security context
const session: Session = {
  id: uuid(),
  userId: user.id,
  token: 'secure-token',
  expiresAt: new Date(),
  securityContext: {
    mfaVerified: true,
    riskScore: 0.2,
    deviceTrusted: true
  }
};
```

### Multi-Tenant Setup
```typescript
import { tenantTable, userTenantTable, roleTable } from '@/db/orm/schema';

// Create tenant
const tenant: Tenant = {
  id: createId(),
  name: 'Acme Corp',
  slug: 'acme-corp',
  settings: {
    mfaRequired: true,
    sessionTimeout: 3600,
    securityLevel: 'high'
  }
};

// Assign user to tenant with role
const userTenant: UserTenant = {
  id: createId(),
  userId: user.id,
  tenantId: tenant.id,
  roleId: adminRole.id,
  status: 'active'
};
```

### Audit Logging
```typescript
import { auditLogTable } from '@/db/orm/schema';

const auditEntry: AuditLog = {
  id: createId(),
  eventType: 'user_login',
  eventCategory: 'authentication',
  severity: 'low',
  userId: user.id,
  outcome: 'success',
  metadata: {
    ipAddress: '192.168.1.1',
    userAgent: 'Mozilla/5.0...'
  }
};
```

## Migration Notes

### Breaking Changes
- Enhanced user table with additional security fields
- Session table restructured with security context
- New multi-tenancy tables added

### Compatibility
- Existing simple tables preserved
- Relations maintained
- TypeScript types updated

### Performance Considerations
- Added strategic indexes
- Optimized for common query patterns
- JSON fields for flexible metadata

## Next Steps

1. **Update Application Code**: Modify queries to use enhanced fields
2. **Implement Security Features**: Utilize MFA, audit logging, and security monitoring
3. **Multi-Tenancy Integration**: Implement tenant-aware queries and UI
4. **Monitoring Setup**: Configure audit log analysis and security incident response
5. **Performance Monitoring**: Monitor query performance with new indexes

The merged schema provides a solid foundation for a production-ready authentication system with enterprise-grade security features while maintaining backward compatibility with existing functionality.
