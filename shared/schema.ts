import { pgTable, text, serial, integer, boolean, timestamp, json, index, uniqueIndex, date, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { ZodiacSign } from "./types";

// Zodiac sign schema for validation
export const zodiacSignSchema = z.enum([
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
]);

// Subscription status schema for validation
export const subscriptionStatusSchema = z.enum([
  'active', 'trialing', 'past_due', 'canceled', 'incomplete', 'incomplete_expired', 'unpaid', 'none'
]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  zodiacSign: text("zodiac_sign"),
  birthdate: text("birthdate"),
  phone: text("phone"),
  smsOptIn: boolean("sms_opt_in").default(true),
  emailOptIn: boolean("email_opt_in").default(false),
  preferredDelivery: text("preferred_delivery").default('sms'),
  // OAuth fields
  googleId: text("google_id").unique(),
  // Premium subscription fields
  // Note: isPremium is not in the database, but we'll handle it in code
  // isPremium: boolean("is_premium").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default('none'),
  subscriptionTier: text("subscription_tier").default('free'),
  subscriptionEndDate: timestamp("subscription_end_date"),
  // Referral system fields
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"), // referral code of the person who referred this user
  referralRewards: integer("referral_rewards").default(0), // number of successful referrals
  createdAt: timestamp("created_at").defaultNow(),
});

// Magic links table for passwordless authentication
export const magicLinks = pgTable("magic_links", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const horoscopes = pgTable("horoscopes", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  date: text("date").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  wellness: text("wellness").notNull(),
  nutrition: text("nutrition"),
  fitness: text("fitness"),
  mindfulness: text("mindfulness"),
  isPremium: boolean("is_premium").default(false),
  isAiGenerated: boolean("is_ai_generated").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deliveryLogs = pgTable("delivery_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  horoscopeId: integer("horoscope_id").notNull(),
  deliveryType: text("delivery_type").notNull(), // 'email' | 'sms'
  status: text("status").notNull(), // 'success' | 'failed'
  createdAt: timestamp("created_at").defaultNow(),
});

export const premiumReports = pgTable("premium_reports", {
  id: serial("id").primaryKey(),
  zodiacSign: text("zodiac_sign").notNull(),
  weekStartDate: text("week_start_date").notNull(),
  weekEndDate: text("week_end_date").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ads = pgTable("ads", {
  id: serial("id").primaryKey(), 
  name: text("name").notNull(),
  content: text("content").notNull(),
  linkUrl: text("link_url").notNull(),
  position: text("position").notNull().default('bottom'), // 'top', 'middle', 'bottom'
  isActive: boolean("is_active").default(true),
  impressions: integer("impressions").default(0),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community features
export const forumTopics = pgTable("forum_topics", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull(),
  zodiacSign: text("zodiac_sign").notNull(),
  category: text("category").notNull().default('general'), // 'general', 'wellness', 'nutrition', etc.
  isPinned: boolean("is_pinned").default(false),
  viewCount: integer("view_count").default(0),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  likeCount: integer("like_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  referredUserId: integer("referred_user_id").notNull(),
  referralCode: text("referral_code").notNull(),
  status: text("status").default('pending'), // pending, completed, rewarded
  rewardType: text("reward_type"), // free_month, premium_upgrade, etc.
  rewardValue: text("reward_value"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertHoroscopeSchema = createInsertSchema(horoscopes).omit({
  id: true,
  createdAt: true,
});

export const insertDeliveryLogSchema = createInsertSchema(deliveryLogs).omit({
  id: true,
  createdAt: true,
});

export const insertPremiumReportSchema = createInsertSchema(premiumReports).omit({
  id: true,
  createdAt: true,
});

export const insertAdSchema = createInsertSchema(ads).omit({
  id: true,
  createdAt: true,
  impressions: true,
  clicks: true,
});

export const insertForumTopicSchema = createInsertSchema(forumTopics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  likeCount: true,
});

export const insertForumReplySchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likeCount: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHoroscope = z.infer<typeof insertHoroscopeSchema>;
export type Horoscope = typeof horoscopes.$inferSelect;

export type InsertDeliveryLog = z.infer<typeof insertDeliveryLogSchema>;
export type DeliveryLog = typeof deliveryLogs.$inferSelect;

export type InsertPremiumReport = z.infer<typeof insertPremiumReportSchema>;
export type PremiumReport = typeof premiumReports.$inferSelect;

export type InsertAd = z.infer<typeof insertAdSchema>;
export type Ad = typeof ads.$inferSelect;

export type InsertForumTopic = z.infer<typeof insertForumTopicSchema>;
export type ForumTopic = typeof forumTopics.$inferSelect;

export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumReply = typeof forumReplies.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

// ============================================
// NEW TABLES FOR REBUILD
// ============================================

// Birth Location Data
export const birthLocations = pgTable("birth_locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  birthTime: text("birth_time"), // "14:30" format
  birthTimezone: text("birth_timezone"), // "America/New_York"
  birthTimeAccuracy: text("birth_time_accuracy").default('exact'), // exact, approximate, unknown
  birthCity: text("birth_city").notNull(),
  birthState: text("birth_state"),
  birthCountry: text("birth_country").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("birth_locations_user_idx").on(table.userId),
}));

// Calculated Birth Charts
export const birthCharts = pgTable("birth_charts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  birthLocationId: integer("birth_location_id").references(() => birthLocations.id, { onDelete: 'cascade' }),
  sunSign: text("sun_sign").notNull(),
  moonSign: text("moon_sign"),
  risingSign: text("rising_sign"),
  planets: json("planets"), // Full planetary positions
  houses: json("houses"), // House cusps
  aspects: json("aspects"), // Planetary aspects
  calculatedAt: timestamp("calculated_at").defaultNow(),
  calculationVersion: text("calculation_version").default('1.0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("birth_charts_user_idx").on(table.userId),
  sunSignIdx: index("birth_charts_sun_sign_idx").on(table.sunSign),
}));

// Lunar Phases Reference Data
export const lunarPhases = pgTable("lunar_phases", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  phase: text("phase").notNull(), // new_moon, waxing_crescent, first_quarter, etc.
  illumination: integer("illumination").notNull(), // 0-100
  moonSign: text("moon_sign").notNull(),
  moonLongitude: real("moon_longitude"),
  wellness: json("wellness"), // Phase-specific wellness tips
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  dateIdx: index("lunar_phases_date_idx").on(table.date),
  phaseIdx: index("lunar_phases_phase_idx").on(table.phase),
}));

// AI Conversations
export const aiConversations = pgTable("ai_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title"),
  topic: text("topic"), // wellness, nutrition, mindfulness, fitness, general
  context: json("context"), // zodiacSign, currentTransits, recentMoods, healthGoals
  isArchived: boolean("is_archived").default(false),
  lastMessageAt: timestamp("last_message_at"),
  messageCount: integer("message_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("ai_conversations_user_idx").on(table.userId),
  userActiveIdx: index("ai_conversations_user_active_idx").on(table.userId, table.isArchived),
}));

// AI Messages
export const aiMessages = pgTable("ai_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => aiConversations.id, { onDelete: 'cascade' }),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  aiMetadata: json("ai_metadata"), // model, tokensUsed, finishReason
  rating: integer("rating"), // 1-5
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversationIdx: index("ai_messages_conversation_idx").on(table.conversationId),
}));

// AI Recommendations
export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  category: text("category").notNull(), // wellness, nutrition, fitness, mindfulness, sleep
  title: text("title").notNull(),
  content: text("content").notNull(),
  basedOn: json("based_on"), // zodiacSign, currentTransits, lunarPhase
  validFrom: text("valid_from").notNull(),
  validUntil: text("valid_until").notNull(),
  isViewed: boolean("is_viewed").default(false),
  isDismissed: boolean("is_dismissed").default(false),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdx: index("ai_recommendations_user_idx").on(table.userId),
  categoryIdx: index("ai_recommendations_category_idx").on(table.category),
}));

// Mood Entries
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text("date").notNull(),
  moodScore: integer("mood_score").notNull(), // 1-10
  moodLabel: text("mood_label"), // happy, sad, anxious, calm, energetic, tired
  energyLevel: integer("energy_level"), // 1-10
  stressLevel: integer("stress_level"), // 1-10
  notes: text("notes"),
  tags: json("tags"), // string[]
  sleepHours: integer("sleep_hours"), // in tenths (75 = 7.5 hours)
  exerciseMinutes: integer("exercise_minutes"),
  waterGlasses: integer("water_glasses"),
  astroContext: json("astro_context"), // lunarPhase, moonSign, mercuryRetrograde
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userDateIdx: uniqueIndex("mood_entries_user_date_idx").on(table.userId, table.date),
  moodScoreIdx: index("mood_entries_mood_score_idx").on(table.moodScore),
}));

// Habits
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").default('general'), // wellness, fitness, nutrition, mindfulness, sleep
  icon: text("icon"),
  color: text("color"),
  frequency: text("frequency").default('daily'), // daily, weekly, custom
  targetDays: json("target_days"), // [0,1,2,3,4,5,6] for days of week
  targetCount: integer("target_count").default(1),
  reminderEnabled: boolean("reminder_enabled").default(false),
  reminderTime: text("reminder_time"),
  isArchived: boolean("is_archived").default(false),
  archivedAt: timestamp("archived_at"),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  totalCompletions: integer("total_completions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("habits_user_idx").on(table.userId),
  userActiveIdx: index("habits_user_active_idx").on(table.userId, table.isArchived),
}));

// Habit Logs
export const habitLogs = pgTable("habit_logs", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull().references(() => habits.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: text("date").notNull(),
  completed: boolean("completed").default(true),
  completionCount: integer("completion_count").default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  habitDateIdx: uniqueIndex("habit_logs_habit_date_idx").on(table.habitId, table.date),
  userDateIdx: index("habit_logs_user_date_idx").on(table.userId, table.date),
}));

// Friendships
export const friendships = pgTable("friendships", {
  id: serial("id").primaryKey(),
  requesterId: integer("requester_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  addresseeId: integer("addressee_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: text("status").default('pending').notNull(), // pending, accepted, declined
  requestedAt: timestamp("requested_at").defaultNow(),
  respondedAt: timestamp("responded_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  requesterIdx: index("friendships_requester_idx").on(table.requesterId),
  addresseeIdx: index("friendships_addressee_idx").on(table.addresseeId),
  uniquePair: uniqueIndex("friendships_unique_pair_idx").on(table.requesterId, table.addresseeId),
}));

// User Blocks
export const userBlocks = pgTable("user_blocks", {
  id: serial("id").primaryKey(),
  blockerId: integer("blocker_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  blockedId: integer("blocked_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  blockerIdx: index("user_blocks_blocker_idx").on(table.blockerId),
  uniquePair: uniqueIndex("user_blocks_unique_pair_idx").on(table.blockerId, table.blockedId),
}));

// DM Conversations
export const dmConversations = pgTable("dm_conversations", {
  id: serial("id").primaryKey(),
  type: text("type").default('direct').notNull(), // direct, group
  name: text("name"), // null for direct, set for groups
  creatorId: integer("creator_id").references(() => users.id),
  avatar: text("avatar"),
  messageCount: integer("message_count").default(0),
  lastMessageAt: timestamp("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  lastMessageIdx: index("dm_conversations_last_message_idx").on(table.lastMessageAt),
}));

// DM Participants
export const dmParticipants = pgTable("dm_participants", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => dmConversations.id, { onDelete: 'cascade' }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  nickname: text("nickname"),
  isMuted: boolean("is_muted").default(false),
  mutedUntil: timestamp("muted_until"),
  lastReadAt: timestamp("last_read_at"),
  unreadCount: integer("unread_count").default(0),
  role: text("role").default('member'), // owner, admin, member
  leftAt: timestamp("left_at"),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  conversationIdx: index("dm_participants_conversation_idx").on(table.conversationId),
  userIdx: index("dm_participants_user_idx").on(table.userId),
  userConversationIdx: uniqueIndex("dm_participants_user_conversation_idx").on(table.userId, table.conversationId),
}));

// DM Messages
export const dmMessages = pgTable("dm_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => dmConversations.id, { onDelete: 'cascade' }),
  senderId: integer("sender_id").references(() => users.id, { onDelete: 'set null' }),
  content: text("content").notNull(),
  contentType: text("content_type").default('text'), // text, image, file, system
  attachments: json("attachments"), // Array of {type, url, name, size, mimeType}
  replyToId: integer("reply_to_id"),
  isEdited: boolean("is_edited").default(false),
  editedAt: timestamp("edited_at"),
  isDeleted: boolean("is_deleted").default(false),
  deletedAt: timestamp("deleted_at"),
  reactions: json("reactions"), // { "thumbsup": ["userId1", "userId2"] }
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  conversationIdx: index("dm_messages_conversation_idx").on(table.conversationId),
  conversationTimeIdx: index("dm_messages_conversation_time_idx").on(table.conversationId, table.createdAt),
  senderIdx: index("dm_messages_sender_idx").on(table.senderId),
}));

// User Progress (Gamification)
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalXp: integer("total_xp").default(0).notNull(),
  currentLevel: integer("current_level").default(1).notNull(),
  xpToNextLevel: integer("xp_to_next_level").default(100).notNull(),
  dailyStreak: integer("daily_streak").default(0),
  longestDailyStreak: integer("longest_daily_streak").default(0),
  lastActivityDate: text("last_activity_date"),
  weeklyXp: integer("weekly_xp").default(0),
  monthlyXp: integer("monthly_xp").default(0),
  weeklyResetAt: timestamp("weekly_reset_at"),
  monthlyResetAt: timestamp("monthly_reset_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("user_progress_user_idx").on(table.userId),
  levelIdx: index("user_progress_level_idx").on(table.currentLevel),
  totalXpIdx: index("user_progress_total_xp_idx").on(table.totalXp),
}));

// XP Transactions
export const xpTransactions = pgTable("xp_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(), // daily_login, mood_logged, habit_completed, etc.
  description: text("description"),
  sourceType: text("source_type"), // habit, mood, challenge, achievement, streak
  sourceId: integer("source_id"),
  balanceAfter: integer("balance_after").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdx: index("xp_transactions_user_idx").on(table.userId),
  reasonIdx: index("xp_transactions_reason_idx").on(table.reason),
}));

// Achievements
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(), // streak, wellness, social, astrology, habit, milestone
  icon: text("icon").notNull(),
  badgeImage: text("badge_image"),
  rarity: text("rarity").default('common'), // common, uncommon, rare, epic, legendary
  xpReward: integer("xp_reward").default(0),
  criteriaType: text("criteria_type").notNull(), // count, streak, date, custom
  criteriaTarget: integer("criteria_target"),
  criteriaDetails: json("criteria_details"), // action, minValue, timeframe, conditions
  isActive: boolean("is_active").default(true),
  isSecret: boolean("is_secret").default(false),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  categoryIdx: index("achievements_category_idx").on(table.category),
  rarityIdx: index("achievements_rarity_idx").on(table.rarity),
}));

// User Achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id, { onDelete: 'cascade' }),
  progress: integer("progress").default(0),
  progressTarget: integer("progress_target"),
  unlockedAt: timestamp("unlocked_at"),
  isNotified: boolean("is_notified").default(false),
  isDisplayed: boolean("is_displayed").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("user_achievements_user_idx").on(table.userId),
  achievementIdx: index("user_achievements_achievement_idx").on(table.achievementId),
  userAchievementIdx: uniqueIndex("user_achievements_user_achievement_idx").on(table.userId, table.achievementId),
}));

// Challenges
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  creatorId: integer("creator_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, special_event, community
  category: text("category").notNull(), // fitness, nutrition, mindfulness, etc.
  icon: text("icon"),
  bannerImage: text("banner_image"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  goalType: text("goal_type").notNull(), // count, streak, score
  goalTarget: integer("goal_target").notNull(),
  goalDescription: text("goal_description"),
  xpReward: integer("xp_reward").default(0),
  achievementId: integer("achievement_id").references(() => achievements.id),
  participantCount: integer("participant_count").default(0),
  completionCount: integer("completion_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  startDateIdx: index("challenges_start_date_idx").on(table.startDate),
  endDateIdx: index("challenges_end_date_idx").on(table.endDate),
  activeIdx: index("challenges_active_idx").on(table.isActive),
}));

// User Challenges
export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id, { onDelete: 'cascade' }),
  currentProgress: integer("current_progress").default(0),
  status: text("status").default('active'), // active, completed, failed
  completedAt: timestamp("completed_at"),
  xpClaimed: boolean("xp_claimed").default(false),
  joinedAt: timestamp("joined_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("user_challenges_user_idx").on(table.userId),
  challengeIdx: index("user_challenges_challenge_idx").on(table.challengeId),
  userChallengeIdx: uniqueIndex("user_challenges_user_challenge_idx").on(table.userId, table.challengeId),
}));

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text("type").notNull(), // achievement_unlocked, friend_request, dm_received, etc.
  title: text("title").notNull(),
  body: text("body").notNull(),
  icon: text("icon"),
  imageUrl: text("image_url"),
  actionUrl: text("action_url"),
  actionData: json("action_data"),
  sourceType: text("source_type"), // user, system, achievement, challenge
  sourceId: integer("source_id"),
  isRead: boolean("is_read").default(false),
  readAt: timestamp("read_at"),
  isDismissed: boolean("is_dismissed").default(false),
  dismissedAt: timestamp("dismissed_at"),
  deliveryChannels: json("delivery_channels"), // { inApp, push, email, sms }
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
}, (table) => ({
  userIdx: index("notifications_user_idx").on(table.userId),
  userUnreadIdx: index("notifications_user_unread_idx").on(table.userId, table.isRead),
  typeIdx: index("notifications_type_idx").on(table.type),
}));

// Notification Preferences
export const notificationPreferences = pgTable("notification_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  pushEnabled: boolean("push_enabled").default(true),
  emailEnabled: boolean("email_enabled").default(true),
  smsEnabled: boolean("sms_enabled").default(false),
  preferences: json("preferences"), // type-specific settings
  quietHoursEnabled: boolean("quiet_hours_enabled").default(false),
  quietHoursStart: text("quiet_hours_start").default('22:00'),
  quietHoursEnd: text("quiet_hours_end").default('08:00'),
  timezone: text("timezone").default('America/New_York'),
  pushTokens: json("push_tokens"), // [{ token, platform, createdAt }]
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("notification_preferences_user_idx").on(table.userId),
}));

// User Presence
export const userPresence = pgTable("user_presence", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  status: text("status").default('offline'), // online, away, busy, offline
  customStatus: text("custom_status"),
  customStatusEmoji: text("custom_status_emoji"),
  lastSeenAt: timestamp("last_seen_at").defaultNow(),
  lastActiveAt: timestamp("last_active_at"),
  currentActivity: text("current_activity"), // reading_horoscope, chatting, logging_mood
  deviceType: text("device_type"), // mobile, tablet, desktop, web
  showOnlineStatus: boolean("show_online_status").default(true),
  showLastSeen: boolean("show_last_seen").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  userIdx: index("user_presence_user_idx").on(table.userId),
  statusIdx: index("user_presence_status_idx").on(table.status),
}));

// ============================================
// INSERT SCHEMAS FOR NEW TABLES
// ============================================

export const insertBirthLocationSchema = createInsertSchema(birthLocations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBirthChartSchema = createInsertSchema(birthCharts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  calculatedAt: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastMessageAt: true,
  messageCount: true,
});

export const insertAiMessageSchema = createInsertSchema(aiMessages).omit({
  id: true,
  createdAt: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  currentStreak: true,
  longestStreak: true,
  totalCompletions: true,
  archivedAt: true,
});

export const insertHabitLogSchema = createInsertSchema(habitLogs).omit({
  id: true,
  createdAt: true,
});

export const insertFriendshipSchema = createInsertSchema(friendships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  requestedAt: true,
  respondedAt: true,
});

export const insertDmConversationSchema = createInsertSchema(dmConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  messageCount: true,
  lastMessageAt: true,
  lastMessagePreview: true,
});

export const insertDmMessageSchema = createInsertSchema(dmMessages).omit({
  id: true,
  createdAt: true,
  isEdited: true,
  editedAt: true,
  isDeleted: true,
  deletedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  participantCount: true,
  completionCount: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
  readAt: true,
  dismissedAt: true,
});

// ============================================
// TYPE EXPORTS FOR NEW TABLES
// ============================================

export type InsertBirthLocation = z.infer<typeof insertBirthLocationSchema>;
export type BirthLocation = typeof birthLocations.$inferSelect;

export type InsertBirthChart = z.infer<typeof insertBirthChartSchema>;
export type BirthChart = typeof birthCharts.$inferSelect;

export type LunarPhase = typeof lunarPhases.$inferSelect;

export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;

export type InsertAiMessage = z.infer<typeof insertAiMessageSchema>;
export type AiMessage = typeof aiMessages.$inferSelect;

export type AiRecommendation = typeof aiRecommendations.$inferSelect;

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

export type InsertHabitLog = z.infer<typeof insertHabitLogSchema>;
export type HabitLog = typeof habitLogs.$inferSelect;

export type InsertFriendship = z.infer<typeof insertFriendshipSchema>;
export type Friendship = typeof friendships.$inferSelect;

export type UserBlock = typeof userBlocks.$inferSelect;

export type InsertDmConversation = z.infer<typeof insertDmConversationSchema>;
export type DmConversation = typeof dmConversations.$inferSelect;

export type DmParticipant = typeof dmParticipants.$inferSelect;

export type InsertDmMessage = z.infer<typeof insertDmMessageSchema>;
export type DmMessage = typeof dmMessages.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgressData = typeof userProgress.$inferSelect;

export type XpTransaction = typeof xpTransactions.$inferSelect;

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export type UserAchievement = typeof userAchievements.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type UserChallenge = typeof userChallenges.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type NotificationPreference = typeof notificationPreferences.$inferSelect;

export type UserPresenceData = typeof userPresence.$inferSelect;
