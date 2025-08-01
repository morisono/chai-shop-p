import { pgTable, text, integer, uuid, timestamp, boolean, pgEnum, jsonb, index } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import * as t from "drizzle-orm/pg-core"
import { createId } from '@paralleldrive/cuid2'

export const rolesEnum = pgEnum("roles", ["user", "admin", "premium", "tester", "guest"])

// Enhanced User table combining both schemas with security enhancements
export const userTable = pgTable(
  "user",
  {
    id: uuid().defaultRandom().primaryKey(),
    name: text("name").notNull(),
    age: integer(),
    image: text("image"),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    // Security enhancements from Schema.ts
    passwordChangedAt: timestamp('password_changed_at'),
    lastLoginAt: timestamp('last_login_at'),
    loginAttempts: integer('login_attempts').default(0),
    lockedUntil: timestamp('locked_until'),
    mfaEnabled: boolean('mfa_enabled').default(false),
    deviceFingerprint: text('device_fingerprint'),
    // Audit fields
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    createdBy: text('created_by'),
    updatedBy: text('updated_by'),
    role: rolesEnum().default("user"),
  },
  (table) => [
    t.uniqueIndex("email_idx").on(table.email),
    t.index('user_last_login_idx').on(table.lastLoginAt),
  ]
)

// Enhanced Session table with security context
export const sessionTable = pgTable("session", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // Enhanced security fields from Schema.ts
  deviceFingerprint: text('device_fingerprint'),
  geoLocation: jsonb('geo_location').$type<{
    country?: string
    region?: string
    city?: string
    lat?: number
    lng?: number
  }>(),
  securityContext: jsonb('security_context').$type<{
    mfaVerified: boolean
    riskScore: number
    deviceTrusted: boolean
    anomalyFlags?: string[]
  }>(),
  activeExpires: timestamp('active_expires'),
  idleExpires: timestamp('idle_expires'),
  lastActivity: timestamp('last_activity').defaultNow(),
  isRevoked: boolean('is_revoked').default(false),
  revokedAt: timestamp('revoked_at'),
  revokedBy: text('revoked_by'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index('session_user_idx').on(table.userId),
  expiresIdx: index('session_expires_idx').on(table.expiresAt),
  ipIdx: index('session_ip_idx').on(table.ipAddress),
}))

// Enhanced Account table
export const accountTable = pgTable("account", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdx: index('account_user_idx').on(table.userId),
  providerIdx: index('account_provider_idx').on(table.providerId, table.accountId),
}))

// Enhanced Verification table
export const verificationTable = pgTable("verification", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  attempts: integer('attempts').default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  identifierIdx: index('verification_identifier_idx').on(table.identifier),
  valueIdx: index('verification_value_idx').on(table.value),
}))

// Tenant table for multi-tenancy support
export const tenantTable = pgTable('tenant', {
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
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: index('tenant_slug_idx').on(table.slug),
  domainIdx: index('tenant_domain_idx').on(table.domain),
}))

// Team/Organization table
export const teamTable = pgTable('team', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  tenantId: text('tenant_id').notNull().references(() => tenantTable.id, { onDelete: 'cascade' }),
  settings: jsonb('settings').$type<{
    maxMembers?: number
    requireApproval?: boolean
  }>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('team_tenant_idx').on(table.tenantId),
}))

// Role table for RBAC
export const roleTable = pgTable('role', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  tenantId: text('tenant_id').references(() => tenantTable.id, { onDelete: 'cascade' }),
  teamId: text('team_id').references(() => teamTable.id, { onDelete: 'cascade' }),
  permissions: jsonb('permissions').$type<string[]>().notNull(),
  isSystemRole: boolean('is_system_role').default(false),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('role_tenant_idx').on(table.tenantId),
  teamIdx: index('role_team_idx').on(table.teamId),
  nameIdx: index('role_name_idx').on(table.name),
}))

// User-Tenant relationship
export const userTenantTable = pgTable('user_tenant', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  tenantId: text('tenant_id').notNull().references(() => tenantTable.id, { onDelete: 'cascade' }),
  roleId: text('role_id').references(() => roleTable.id),
  status: text('status').$type<'active' | 'suspended' | 'pending'>().default('pending'),
  invitedBy: uuid('invited_by').references(() => userTable.id),
  joinedAt: timestamp('joined_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userTenantIdx: index('user_tenant_idx').on(table.userId, table.tenantId),
}))

// User-Team relationship
export const userTeamTable = pgTable('user_team', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  teamId: text('team_id').notNull().references(() => teamTable.id, { onDelete: 'cascade' }),
  roleId: text('role_id').references(() => roleTable.id),
  status: text('status').$type<'active' | 'suspended' | 'pending'>().default('pending'),
  joinedAt: timestamp('joined_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userTeamIdx: index('user_team_idx').on(table.userId, table.teamId),
}))

// Two-Factor Authentication table
export const twoFactorTable = pgTable('two_factor', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').default(true),
  lastUsed: timestamp('last_used'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('two_factor_user_idx').on(table.userId),
}))

// Enhanced Passkey table with additional security metadata
export const passkeyTable = pgTable('passkey', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' }),
  webauthnUserID: text('webauthn_user_id').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: text('transports'),
  aaguid: text('aaguid'),
  credentialDeviceType: text('credential_device_type').$type<'singleDevice' | 'multiDevice'>(),
  credentialBackedUp: boolean('credential_backed_up'),
  lastUsed: timestamp('last_used'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdx: index('passkey_user_idx').on(table.userId),
  webauthnUserIdIdx: index('passkey_webauthn_user_id_idx').on(table.webauthnUserID),
}))

// Audit Log table for compliance and security monitoring
export const auditLogTable = pgTable('audit_log', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  eventType: text('event_type').notNull(),
  eventCategory: text('event_category').notNull(),
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>().default('low'),
  userId: uuid('user_id').references(() => userTable.id),
  tenantId: text('tenant_id').references(() => tenantTable.id),
  sessionId: uuid('session_id').references(() => sessionTable.id),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  requestId: text('request_id'),
  resource: text('resource'),
  action: text('action'),
  outcome: text('outcome').$type<'success' | 'failure' | 'error'>().notNull(),
  metadata: jsonb('metadata').$type<{
    oldValues?: Record<string, any>
    newValues?: Record<string, any>
    errorCode?: string
    errorMessage?: string
    additionalData?: Record<string, any>
  }>(),
  retentionDate: timestamp('retention_date'),
  isImmutable: boolean('is_immutable').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdx: index('audit_log_user_idx').on(table.userId),
  tenantIdx: index('audit_log_tenant_idx').on(table.tenantId),
  eventTypeIdx: index('audit_log_event_type_idx').on(table.eventType),
  createdAtIdx: index('audit_log_created_at_idx').on(table.createdAt),
  severityIdx: index('audit_log_severity_idx').on(table.severity),
  outcomeIdx: index('audit_log_outcome_idx').on(table.outcome),
}))

// Security incident tracking
export const securityIncidentTable = pgTable('security_incident', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  type: text('type').notNull(),
  severity: text('severity').$type<'low' | 'medium' | 'high' | 'critical'>().notNull(),
  status: text('status').$type<'open' | 'investigating' | 'resolved' | 'false_positive'>().default('open'),
  userId: uuid('user_id').references(() => userTable.id),
  tenantId: text('tenant_id').references(() => tenantTable.id),
  sessionId: uuid('session_id').references(() => sessionTable.id),
  description: text('description').notNull(),
  metadata: jsonb('metadata').$type<{
    ipAddresses?: string[]
    userAgents?: string[]
    attemptCount?: number
    timeWindow?: string
    mitigationActions?: string[]
  }>(),
  resolvedAt: timestamp('resolved_at'),
  resolvedBy: uuid('resolved_by').references(() => userTable.id),
  resolution: text('resolution'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  typeIdx: index('security_incident_type_idx').on(table.type),
  severityIdx: index('security_incident_severity_idx').on(table.severity),
  statusIdx: index('security_incident_status_idx').on(table.status),
  createdAtIdx: index('security_incident_created_at_idx').on(table.createdAt),
}))

// Rate limiting tracking
export const rateLimitLogTable = pgTable('rate_limit_log', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  identifier: text('identifier').notNull(),
  type: text('type').notNull(),
  windowStart: timestamp('window_start').notNull(),
  requestCount: integer('request_count').default(1),
  isBlocked: boolean('is_blocked').default(false),
  metadata: jsonb('metadata').$type<{
    userAgent?: string
    endpoint?: string
    reason?: string
  }>(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  identifierIdx: index('rate_limit_identifier_idx').on(table.identifier),
  typeIdx: index('rate_limit_type_idx').on(table.type),
  windowIdx: index('rate_limit_window_idx').on(table.windowStart),
  expiresIdx: index('rate_limit_expires_idx').on(table.expiresAt),
}))

// Keep existing simple tables for compatibility
export const exampleTable = pgTable("example", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const messageTable = pgTable("message", {
  id: uuid().defaultRandom().primaryKey(),
  message: text("message").notNull(),
  senderId: uuid("sender_id").references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const sessionToUserRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const messageToUserRelations = relations(messageTable, ({ one }) => ({
  sender: one(userTable, {
    fields: [messageTable.senderId],
    references: [userTable.id],
  }),
}))

export const userTenantRelations = relations(userTenantTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userTenantTable.userId],
    references: [userTable.id],
  }),
  tenant: one(tenantTable, {
    fields: [userTenantTable.tenantId],
    references: [tenantTable.id],
  }),
  role: one(roleTable, {
    fields: [userTenantTable.roleId],
    references: [roleTable.id],
  }),
}))

export const userTeamRelations = relations(userTeamTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userTeamTable.userId],
    references: [userTable.id],
  }),
  team: one(teamTable, {
    fields: [userTeamTable.teamId],
    references: [teamTable.id],
  }),
  role: one(roleTable, {
    fields: [userTeamTable.roleId],
    references: [roleTable.id],
  }),
}))

export const teamTenantRelations = relations(teamTable, ({ one }) => ({
  tenant: one(tenantTable, {
    fields: [teamTable.tenantId],
    references: [tenantTable.id],
  }),
}))

// Export types for TypeScript
export type User = typeof userTable.$inferSelect
export type NewUser = typeof userTable.$inferInsert
export type Session = typeof sessionTable.$inferSelect
export type NewSession = typeof sessionTable.$inferInsert
export type Account = typeof accountTable.$inferSelect
export type NewAccount = typeof accountTable.$inferInsert
export type Verification = typeof verificationTable.$inferSelect
export type NewVerification = typeof verificationTable.$inferInsert
export type Tenant = typeof tenantTable.$inferSelect
export type NewTenant = typeof tenantTable.$inferInsert
export type Team = typeof teamTable.$inferSelect
export type NewTeam = typeof teamTable.$inferInsert
export type Role = typeof roleTable.$inferSelect
export type NewRole = typeof roleTable.$inferInsert
export type UserTenant = typeof userTenantTable.$inferSelect
export type NewUserTenant = typeof userTenantTable.$inferInsert
export type UserTeam = typeof userTeamTable.$inferSelect
export type NewUserTeam = typeof userTeamTable.$inferInsert
export type TwoFactor = typeof twoFactorTable.$inferSelect
export type NewTwoFactor = typeof twoFactorTable.$inferInsert
export type Passkey = typeof passkeyTable.$inferSelect
export type NewPasskey = typeof passkeyTable.$inferInsert
export type AuditLog = typeof auditLogTable.$inferSelect
export type NewAuditLog = typeof auditLogTable.$inferInsert
export type SecurityIncident = typeof securityIncidentTable.$inferSelect
export type NewSecurityIncident = typeof securityIncidentTable.$inferInsert
export type RateLimitLog = typeof rateLimitLogTable.$inferSelect
export type NewRateLimitLog = typeof rateLimitLogTable.$inferInsert
export type Example = typeof exampleTable.$inferSelect
export type NewExample = typeof exampleTable.$inferInsert
export type Message = typeof messageTable.$inferSelect
export type NewMessage = typeof messageTable.$inferInsert