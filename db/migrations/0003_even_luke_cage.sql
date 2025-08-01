CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"event_type" text NOT NULL,
	"event_category" text NOT NULL,
	"severity" text DEFAULT 'low',
	"user_id" uuid,
	"tenant_id" text,
	"session_id" uuid,
	"ip_address" text,
	"user_agent" text,
	"request_id" text,
	"resource" text,
	"action" text,
	"outcome" text NOT NULL,
	"metadata" jsonb,
	"retention_date" timestamp,
	"is_immutable" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" uuid NOT NULL,
	"webauthn_user_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"aaguid" text,
	"credential_device_type" text,
	"credential_backed_up" boolean,
	"last_used" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rate_limit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"type" text NOT NULL,
	"window_start" timestamp NOT NULL,
	"request_count" integer DEFAULT 1,
	"is_blocked" boolean DEFAULT false,
	"metadata" jsonb,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tenant_id" text,
	"team_id" text,
	"permissions" jsonb NOT NULL,
	"is_system_role" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "security_incident" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"status" text DEFAULT 'open',
	"user_id" uuid,
	"tenant_id" text,
	"session_id" uuid,
	"description" text NOT NULL,
	"metadata" jsonb,
	"resolved_at" timestamp,
	"resolved_by" uuid,
	"resolution" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"tenant_id" text NOT NULL,
	"settings" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"domain" text,
	"settings" jsonb,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "two_factor" (
	"id" text PRIMARY KEY NOT NULL,
	"secret" text NOT NULL,
	"backup_codes" text NOT NULL,
	"user_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true,
	"last_used" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_team" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"team_id" text NOT NULL,
	"role_id" text,
	"status" text DEFAULT 'pending',
	"joined_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_tenant" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"tenant_id" text NOT NULL,
	"role_id" text,
	"status" text DEFAULT 'pending',
	"invited_by" uuid,
	"joined_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "device_fingerprint" text;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "geo_location" jsonb;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "security_context" jsonb;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "active_expires" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "idle_expires" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "last_activity" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "is_revoked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "revoked_at" timestamp;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "revoked_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "password_changed_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "login_attempts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "locked_until" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "mfa_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "device_fingerprint" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "created_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "updated_by" text;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "attempts" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_incident" ADD CONSTRAINT "security_incident_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_incident" ADD CONSTRAINT "security_incident_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_incident" ADD CONSTRAINT "security_incident_session_id_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."session"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_incident" ADD CONSTRAINT "security_incident_resolved_by_user_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team" ADD CONSTRAINT "team_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "two_factor" ADD CONSTRAINT "two_factor_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tenant" ADD CONSTRAINT "user_tenant_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_user_idx" ON "audit_log" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_log_tenant_idx" ON "audit_log" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "audit_log_event_type_idx" ON "audit_log" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "audit_log_severity_idx" ON "audit_log" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "audit_log_outcome_idx" ON "audit_log" USING btree ("outcome");--> statement-breakpoint
CREATE INDEX "passkey_user_idx" ON "passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_webauthn_user_id_idx" ON "passkey" USING btree ("webauthn_user_id");--> statement-breakpoint
CREATE INDEX "rate_limit_identifier_idx" ON "rate_limit_log" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "rate_limit_type_idx" ON "rate_limit_log" USING btree ("type");--> statement-breakpoint
CREATE INDEX "rate_limit_window_idx" ON "rate_limit_log" USING btree ("window_start");--> statement-breakpoint
CREATE INDEX "rate_limit_expires_idx" ON "rate_limit_log" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "role_tenant_idx" ON "role" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "role_team_idx" ON "role" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "role_name_idx" ON "role" USING btree ("name");--> statement-breakpoint
CREATE INDEX "security_incident_type_idx" ON "security_incident" USING btree ("type");--> statement-breakpoint
CREATE INDEX "security_incident_severity_idx" ON "security_incident" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "security_incident_status_idx" ON "security_incident" USING btree ("status");--> statement-breakpoint
CREATE INDEX "security_incident_created_at_idx" ON "security_incident" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "team_tenant_idx" ON "team" USING btree ("tenant_id");--> statement-breakpoint
CREATE INDEX "tenant_slug_idx" ON "tenant" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tenant_domain_idx" ON "tenant" USING btree ("domain");--> statement-breakpoint
CREATE INDEX "two_factor_user_idx" ON "two_factor" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_team_idx" ON "user_team" USING btree ("user_id","team_id");--> statement-breakpoint
CREATE INDEX "user_tenant_idx" ON "user_tenant" USING btree ("user_id","tenant_id");--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "account_provider_idx" ON "account" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "session_ip_idx" ON "session" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "user_last_login_idx" ON "user" USING btree ("last_login_at");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "verification_value_idx" ON "verification" USING btree ("value");