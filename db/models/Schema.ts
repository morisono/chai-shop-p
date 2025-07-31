// Database schema for Better Auth with RBAC/ABAC and Security Enhancements
import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, index } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

// Better Auth User table with enhanced security fields
export const user = pgTable('user', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  // Security enhancements
  passwordChangedAt: timestamp('passwordChangedAt'),
  lastLoginAt: timestamp('lastLoginAt'),
  loginAttempts: integer('loginAttempts').default(0),
  lockedUntil: timestamp('lockedUntil'),
  mfaEnabled: boolean('mfaEnabled').default(false),
  deviceFingerprint: text('deviceFingerprint'),
  // Audit fields
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  createdBy: text('createdBy'),
  updatedBy: text('updatedBy'),
}, (table) => ({
  emailIdx: index('user_email_idx').on(table.email),
  lastLoginIdx: index('user_last_login_idx').on(table.lastLoginAt),
}))

// Tenant table for multi-tenancy support
export const tenant = pgTable('tenant', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  domain: text('domain'),
  settings: jsonb('settings').$type<{
    mfaRequired: boolean
    sessionTimeout: number
    allowedIpRanges?: string[]
    securityLevel: 'low' | 'medium' | 'high'
  }>(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('tenant_slug_idx').on(table.slug),
  domainIdx: index('tenant_domain_idx').on(table.domain),
}))

// Team/Organization table
export const team = pgTable('team', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  tenantId: text('tenantId').notNull().references(() => tenant.id, { onDelete: 'cascade' }),
  settings: jsonb('settings').$type<{
    maxMembers?: number
    requireApproval?: boolean
  }>(),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('team_tenant_idx').on(table.tenantId),
}))

// Role table for RBAC
export const role = pgTable('role', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  tenantId: text('tenantId').references(() => tenant.id, { onDelete: 'cascade' }),
  teamId: text('teamId').references(() => team.id, { onDelete: 'cascade' }),
  permissions: jsonb('permissions').$type<string[]>().notNull(),
  isSystemRole: boolean('isSystemRole').default(false),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('role_tenant_idx').on(table.tenantId),
  teamIdx: index('role_team_idx').on(table.teamId),
  nameIdx: index('role_name_idx').on(table.name),
}))

// User-Tenant relationship
export const userTenant = pgTable('user_tenant', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tenantId: text('tenantId').notNull().references(() => tenant.id, { onDelete: 'cascade' }),
  roleId: text('roleId').references(() => role.id),
  status: text('status').$type<'active' | 'suspended' | 'pending'>().default('pending'),
  invitedBy: text('invitedBy').references(() => user.id),
  joinedAt: timestamp('joinedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userTenantIdx: index('user_tenant_idx').on(table.userId, table.tenantId),
}))

// User-Team relationship
export const userTeam = pgTable('user_team', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  teamId: text('teamId').notNull().references(() => team.id, { onDelete: 'cascade' }),
  roleId: text('roleId').references(() => role.id),
  status: text('status').$type<'active' | 'suspended' | 'pending'>().default('pending'),
  joinedAt: timestamp('joinedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  userTeamIdx: index('user_team_idx').on(table.userId, table.teamId),
}))

// Enhanced Session table with security context
export const session = pgTable('session', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  expiresAt: timestamp('expiresAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  tenantId: text('tenantId').references(() => tenant.id),
  // Enhanced security fields
  deviceFingerprint: text('deviceFingerprint'),
  geoLocation: jsonb('geoLocation').$type<{
    country?: string
    region?: string
    city?: string
    lat?: number
    lng?: number
  }>(),
  securityContext: jsonb('securityContext').$type<{
    mfaVerified: boolean
    riskScore: number
    deviceTrusted: boolean
    anomalyFlags?: string[]
  }>(),
  activeExpires: timestamp('activeExpires').notNull(),
  idleExpires: timestamp('idleExpires').notNull(),
  lastActivity: timestamp('lastActivity').defaultNow(),
  isRevoked: boolean('isRevoked').default(false),
  revokedAt: timestamp('revokedAt'),
  revokedBy: text('revokedBy'),
}, (table) => ({
  userIdx: index('session_user_idx').on(table.userId),
  expiresIdx: index('session_expires_idx').on(table.expiresAt),
  ipIdx: index('session_ip_idx').on(table.ipAddress),
}))

// Better Auth Account table (for OAuth)
export const account = pgTable('account', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  expiresAt: timestamp('expiresAt'),
  password: text('password'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdx: index('account_user_idx').on(table.userId),
  providerIdx: index('account_provider_idx').on(table.providerId, table.accountId),
}))

// Better Auth Verification table
export const verification = pgTable('verification', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  attempts: integer('attempts').default(0),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  identifierIdx: index('verification_identifier_idx').on(table.identifier),
  valueIdx: index('verification_value_idx').on(table.value),
}))

// Better Auth TwoFactor table
export const twoFactor = pgTable('twoFactor', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  secret: text('secret').notNull(),
  backupCodes: text('backupCodes').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  isActive: boolean('isActive').default(true),
  lastUsed: timestamp('lastUsed'),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdx: index('two_factor_user_idx').on(table.userId),
}))

// Enhanced Passkey table with additional security metadata
export const passkey = pgTable('passkey', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  publicKey: text('publicKey').notNull(),
  userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
  webauthnUserID: text('webauthnUserID').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('deviceType').notNull(),
  backedUp: boolean('backedUp').notNull(),
  transports: text('transports'),
  // Enhanced security metadata
  aaguid: text('aaguid'),
  credentialDeviceType: text('credentialDeviceType').$type<'singleDevice' | 'multiDevice'>(),
  credentialBackedUp: boolean('credentialBackedUp'),
  lastUsed: timestamp('lastUsed'),
  isActive: boolean('isActive').default(true),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
}, (table) => ({
  userIdx: index('passkey_user_idx').on(table.userId),
  webauthnUserIdIdx: index('passkey_webauthn_user_id_idx').on(table.webauthnUserID),
}))

// Audit Log table for compliance and security monitoring
export const auditLog = pgTable('audit_log', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  // Event identification
  eventType: text('eventType').notNull(), // login, logout, password_change, etc.
  eventCategory: text('eventCategory').notNull(), // auth, user_management, system, etc.
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>().default('low'),

  // User and context
  userId: text('userId').references(() => user.id),
  tenantId: text('tenantId').references(() => tenant.id),
  sessionId: text('sessionId').references(() => session.id),

  // Request context
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  requestId: text('requestId'),

  // Event details
  resource: text('resource'), // what was accessed/modified
  action: text('action'), // create, read, update, delete
  outcome: text('outcome').$type<'success' | 'failure' | 'error'>().notNull(),

  // Metadata and details
  metadata: jsonb('metadata').$type<{
    oldValues?: Record<string, any>
    newValues?: Record<string, any>
    errorCode?: string
    errorMessage?: string
    additionalData?: Record<string, any>
  }>(),

  // Compliance fields
  retentionDate: timestamp('retentionDate'),
  isImmutable: boolean('isImmutable').default(true),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('audit_log_user_idx').on(table.userId),
  tenantIdx: index('audit_log_tenant_idx').on(table.tenantId),
  eventTypeIdx: index('audit_log_event_type_idx').on(table.eventType),
  createdAtIdx: index('audit_log_created_at_idx').on(table.createdAt),
  severityIdx: index('audit_log_severity_idx').on(table.severity),
  outcomeIdx: index('audit_log_outcome_idx').on(table.outcome),
}))

// Security incident tracking
export const securityIncident = pgTable('security_incident', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  type: text('type').notNull(), // brute_force, anomalous_login, etc.
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>().notNull(),
  status: text('status').$type<'open' | 'investigating' | 'resolved' | 'false_positive'>().default('open'),

  // Related entities
  userId: text('userId').references(() => user.id),
  tenantId: text('tenantId').references(() => tenant.id),
  sessionId: text('sessionId').references(() => session.id),

  // Incident details
  description: text('description').notNull(),
  metadata: jsonb('metadata').$type<{
    ipAddresses?: string[]
    userAgents?: string[]
    attemptCount?: number
    timeWindow?: string
    mitigationActions?: string[]
  }>(),

  // Resolution
  resolvedAt: timestamp('resolvedAt'),
  resolvedBy: text('resolvedBy').references(() => user.id),
  resolution: text('resolution'),

  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
  typeIdx: index('security_incident_type_idx').on(table.type),
  severityIdx: index('security_incident_severity_idx').on(table.severity),
  statusIdx: index('security_incident_status_idx').on(table.status),
  createdAtIdx: index('security_incident_created_at_idx').on(table.createdAt),
}))

// Rate limiting tracking
export const rateLimitLog = pgTable('rate_limit_log', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  identifier: text('identifier').notNull(), // IP, user ID, etc.
  type: text('type').notNull(), // login, api_call, etc.
  windowStart: timestamp('windowStart').notNull(),
  requestCount: integer('requestCount').default(1),
  isBlocked: boolean('isBlocked').default(false),
  metadata: jsonb('metadata').$type<{
    userAgent?: string
    endpoint?: string
    reason?: string
  }>(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
  identifierIdx: index('rate_limit_identifier_idx').on(table.identifier),
  typeIdx: index('rate_limit_type_idx').on(table.type),
  windowIdx: index('rate_limit_window_idx').on(table.windowStart),
  expiresIdx: index('rate_limit_expires_idx').on(table.expiresAt),
}))

// Export all tables
export { user as users } // Keep compatibility if needed

// Export types for TypeScript
export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
export type Tenant = typeof tenant.$inferSelect
export type NewTenant = typeof tenant.$inferInsert
export type Team = typeof team.$inferSelect
export type NewTeam = typeof team.$inferInsert
export type Role = typeof role.$inferSelect
export type NewRole = typeof role.$inferInsert
export type Session = typeof session.$inferSelect
export type NewSession = typeof session.$inferInsert
export type Passkey = typeof passkey.$inferSelect
export type NewPasskey = typeof passkey.$inferInsert
export type AuditLog = typeof auditLog.$inferSelect
export type NewAuditLog = typeof auditLog.$inferInsert
