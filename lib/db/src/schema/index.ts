import { pgTable, serial, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const templateTypeEnum = pgEnum("template_type", ["email", "whatsapp"]);
export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "running", "completed", "failed"]);
export const creditTypeEnum = pgEnum("credit_type", ["credit", "debit"]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull(),
  name: text("name"),
  creditsRemaining: integer("credits_remaining").notNull().default(10),
  creditsUsed: integer("credits_used").notNull().default(0),
  planId: text("plan_id"),
  planName: text("plan_name"),
  planExpiresAt: timestamp("plan_expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const templatesTable = pgTable("templates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  name: text("name").notNull(),
  type: templateTypeEnum("type").notNull(),
  subject: text("subject"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const campaignsTable = pgTable("campaigns", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  name: text("name").notNull(),
  niche: text("niche").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  emailSubject: text("email_subject"),
  emailBody: text("email_body"),
  whatsappMessage: text("whatsapp_message"),
  sendEmail: boolean("send_email").notNull().default(false),
  sendWhatsapp: boolean("send_whatsapp").notNull().default(false),
  totalLeads: integer("total_leads").notNull().default(0),
  emailsSent: integer("emails_sent").notNull().default(0),
  whatsappSent: integer("whatsapp_sent").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const gmailIntegrationsTable = pgTable("gmail_integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id).unique(),
  senderEmail: text("sender_email").notNull(),
  appPasswordEncrypted: text("app_password_encrypted").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const whatsappSessionsTable = pgTable("whatsapp_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id).unique(),
  sessionData: text("session_data"),
  phone: text("phone"),
  isConnected: boolean("is_connected").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  planId: text("plan_id").notNull(),
  planName: text("plan_name").notNull(),
  status: text("status").notNull().default("active"),
  transactionId: text("transaction_id"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const creditTransactionsTable = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  type: creditTypeEnum("type").notNull(),
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertTemplateSchema = createInsertSchema(templatesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertCampaignSchema = createInsertSchema(campaignsTable).omit({ id: true, createdAt: true, updatedAt: true });

export type User = typeof usersTable.$inferSelect;
export type Template = typeof templatesTable.$inferSelect;
export type Campaign = typeof campaignsTable.$inferSelect;
export type GmailIntegration = typeof gmailIntegrationsTable.$inferSelect;
export type WhatsappSession = typeof whatsappSessionsTable.$inferSelect;
export type Subscription = typeof subscriptionsTable.$inferSelect;
export type CreditTransaction = typeof creditTransactionsTable.$inferSelect;
