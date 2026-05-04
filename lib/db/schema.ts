import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name"),
    role: text("role").notNull().default("customer"),
    suspended: boolean("suspended").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)]
);

export const shopifyCustomerLinks = pgTable(
  "shopify_customer_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shopDomain: text("shop_domain").notNull(),
    shopifyCustomerId: text("shopify_customer_id").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("shopify_link_user_shop").on(t.userId, t.shopDomain),
    index("shopify_link_customer_idx").on(
      t.shopDomain,
      t.shopifyCustomerId
    ),
  ]
);

export const ordersCache = pgTable(
  "orders_cache",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shopDomain: text("shop_domain").notNull(),
    shopifyOrderId: text("shopify_order_id").notNull(),
    shopifyCustomerId: text("shopify_customer_id").notNull(),
    orderNumber: text("order_number"),
    totalPrice: text("total_price"),
    currency: text("currency"),
    financialStatus: text("financial_status"),
    fulfillmentStatus: text("fulfillment_status"),
    lineItemsJson: text("line_items_json"),
    createdAtShopify: timestamp("created_at_shopify", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("orders_shop_order_unique").on(t.shopDomain, t.shopifyOrderId),
    index("orders_customer_idx").on(t.shopDomain, t.shopifyCustomerId),
  ]
);

export const submissions = pgTable(
  "submissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    platform: text("platform").notNull(),
    postUrl: text("post_url").notNull(),
    postUrlNormalized: text("post_url_normalized").notNull(),
    notes: text("notes"),
    status: text("status").notNull().default("pending"),
    pointsAwarded: integer("points_awarded").notNull().default(0),
    adminNote: text("admin_note"),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("submissions_user_idx").on(t.userId),
    index("submissions_status_idx").on(t.status),
    index("submissions_norm_idx").on(t.postUrlNormalized),
  ]
);

export const ledgerEntries = pgTable(
  "ledger_entries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    delta: integer("delta").notNull(),
    reason: text("reason").notNull(),
    refType: text("ref_type"),
    refId: uuid("ref_id"),
    adminUserId: uuid("admin_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("ledger_user_idx").on(t.userId)]
);

export const redemptions = pgTable("redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  points: integer("points").notNull(),
  status: text("status").notNull().default("pending"),
  discountCode: text("discount_code"),
  shopifyDiscountId: text("shopify_discount_id"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    idempotencyKey: text("idempotency_key").notNull(),
    topic: text("topic").notNull(),
    shopDomain: text("shop_domain").notNull(),
    processed: boolean("processed").notNull().default(false),
    receivedAt: timestamp("received_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("webhook_idem_unique").on(t.idempotencyKey)]
);

export const adminAuditLog = pgTable("admin_audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminUserId: uuid("admin_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  meta: text("meta"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  shopifyLinks: many(shopifyCustomerLinks),
  submissions: many(submissions),
  ledger: many(ledgerEntries),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
}));
