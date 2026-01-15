import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import { redis } from '../config/redis';
import { jobLogger } from '../logger';

// Connection options for BullMQ
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

// If REDIS_URL is provided, parse it
if (process.env.REDIS_URL) {
  const url = new URL(process.env.REDIS_URL);
  (connection as any).host = url.hostname;
  (connection as any).port = parseInt(url.port) || 6379;
  if (url.password) {
    (connection as any).password = url.password;
  }
}

// Queue definitions
export const queues = {
  horoscope: new Queue('horoscope', { connection }),
  notification: new Queue('notification', { connection }),
  email: new Queue('email', { connection }),
  sms: new Queue('sms', { connection }),
  analytics: new Queue('analytics', { connection }),
  gamification: new Queue('gamification', { connection }),
  ai: new Queue('ai', { connection }),
};

// Job interfaces
export interface HoroscopeJobData {
  type: 'generate_daily' | 'deliver_to_user' | 'generate_premium_report';
  date?: string;
  userId?: number;
  sign?: string;
}

export interface NotificationJobData {
  type: 'push' | 'in_app' | 'batch';
  userId: number;
  notification: {
    type: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
  };
}

export interface EmailJobData {
  type: 'transactional' | 'marketing' | 'horoscope';
  to: string;
  subject: string;
  template: string;
  variables: Record<string, unknown>;
}

export interface SMSJobData {
  type: 'single' | 'broadcast';
  to: string | string[];
  message: string;
}

export interface GamificationJobData {
  type: 'award_xp' | 'check_achievements' | 'update_leaderboard' | 'check_streaks';
  userId?: number;
  xpAmount?: number;
  reason?: string;
}

export interface AIJobData {
  type: 'generate_recommendation' | 'summarize_conversation';
  userId: number;
  conversationId?: number;
  context?: Record<string, unknown>;
}

// Default job options
const defaultJobOptions = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 2000,
  },
  removeOnComplete: {
    count: 1000,
    age: 24 * 3600, // Keep completed jobs for 24 hours
  },
  removeOnFail: {
    count: 5000,
    age: 7 * 24 * 3600, // Keep failed jobs for 7 days
  },
};

// Add job to horoscope queue
export async function addHoroscopeJob(data: HoroscopeJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.horoscope.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Add job to notification queue
export async function addNotificationJob(data: NotificationJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.notification.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Add job to email queue
export async function addEmailJob(data: EmailJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.email.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Add job to SMS queue
export async function addSMSJob(data: SMSJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.sms.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Add job to gamification queue
export async function addGamificationJob(data: GamificationJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.gamification.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Add job to AI queue
export async function addAIJob(data: AIJobData, options?: Partial<typeof defaultJobOptions>) {
  return queues.ai.add(data.type, data, { ...defaultJobOptions, ...options });
}

// Worker processors (to be implemented in separate worker files)
export const workers: Record<string, Worker> = {};

// Initialize workers
export function initializeWorkers() {
  // Horoscope worker
  workers.horoscope = new Worker(
    'horoscope',
    async (job: Job<HoroscopeJobData>) => {
      jobLogger.info({ jobId: job.id, data: job.data }, `Processing horoscope job: ${job.name}`);

      switch (job.data.type) {
        case 'generate_daily':
          // TODO: Call horoscope generation service
          jobLogger.info('Generating daily horoscopes...');
          break;
        case 'deliver_to_user':
          // TODO: Call delivery service
          jobLogger.info(`Delivering horoscope to user ${job.data.userId}`);
          break;
        case 'generate_premium_report':
          // TODO: Call premium report service
          jobLogger.info(`Generating premium report for ${job.data.sign}`);
          break;
      }
    },
    { connection, concurrency: 5 }
  );

  // Notification worker
  workers.notification = new Worker(
    'notification',
    async (job: Job<NotificationJobData>) => {
      jobLogger.info({ jobId: job.id }, `Processing notification job: ${job.name}`);

      // TODO: Implement notification sending logic
      const { userId, notification } = job.data;
      jobLogger.info(`Sending notification to user ${userId}: ${notification.title}`);
    },
    { connection, concurrency: 10 }
  );

  // Email worker
  workers.email = new Worker(
    'email',
    async (job: Job<EmailJobData>) => {
      jobLogger.info({ jobId: job.id, to: job.data.to }, `Processing email job: ${job.name}`);

      // TODO: Implement email sending via SendGrid
      jobLogger.info(`Sending email to ${job.data.to}: ${job.data.subject}`);
    },
    { connection, concurrency: 5 }
  );

  // SMS worker
  workers.sms = new Worker(
    'sms',
    async (job: Job<SMSJobData>) => {
      jobLogger.info({ jobId: job.id }, `Processing SMS job: ${job.name}`);

      // TODO: Implement SMS sending via Twilio
      const recipients = Array.isArray(job.data.to) ? job.data.to : [job.data.to];
      jobLogger.info(`Sending SMS to ${recipients.length} recipient(s)`);
    },
    { connection, concurrency: 5 }
  );

  // Gamification worker
  workers.gamification = new Worker(
    'gamification',
    async (job: Job<GamificationJobData>) => {
      jobLogger.info({ jobId: job.id }, `Processing gamification job: ${job.name}`);

      switch (job.data.type) {
        case 'award_xp':
          // TODO: Award XP to user
          jobLogger.info(`Awarding ${job.data.xpAmount} XP to user ${job.data.userId}`);
          break;
        case 'check_achievements':
          // TODO: Check and award achievements
          jobLogger.info(`Checking achievements for user ${job.data.userId}`);
          break;
        case 'update_leaderboard':
          // TODO: Update leaderboards
          jobLogger.info('Updating leaderboards...');
          break;
        case 'check_streaks':
          // TODO: Check and update streaks
          jobLogger.info('Checking streaks...');
          break;
      }
    },
    { connection, concurrency: 5 }
  );

  // AI worker
  workers.ai = new Worker(
    'ai',
    async (job: Job<AIJobData>) => {
      jobLogger.info({ jobId: job.id }, `Processing AI job: ${job.name}`);

      switch (job.data.type) {
        case 'generate_recommendation':
          // TODO: Generate AI recommendation
          jobLogger.info(`Generating AI recommendation for user ${job.data.userId}`);
          break;
        case 'summarize_conversation':
          // TODO: Summarize conversation for context window
          jobLogger.info(`Summarizing conversation ${job.data.conversationId}`);
          break;
      }
    },
    { connection, concurrency: 3 }
  );

  // Set up event handlers for all workers
  Object.entries(workers).forEach(([name, worker]) => {
    worker.on('completed', (job) => {
      jobLogger.info(`Job completed: ${name}/${job.id}`);
    });

    worker.on('failed', (job, err) => {
      jobLogger.error({ error: err.message }, `Job failed: ${name}/${job?.id}`);
    });

    worker.on('error', (err) => {
      jobLogger.error({ error: err.message }, `Worker error: ${name}`);
    });
  });

  jobLogger.info('All workers initialized');
}

// Graceful shutdown
export async function shutdownWorkers() {
  jobLogger.info('Shutting down workers...');

  await Promise.all(
    Object.values(workers).map((worker) => worker.close())
  );

  await Promise.all(
    Object.values(queues).map((queue) => queue.close())
  );

  jobLogger.info('All workers and queues closed');
}

// Get queue statistics
export async function getQueueStats() {
  const stats: Record<string, { waiting: number; active: number; completed: number; failed: number }> = {};

  for (const [name, queue] of Object.entries(queues)) {
    const [waiting, active, completed, failed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
    ]);

    stats[name] = { waiting, active, completed, failed };
  }

  return stats;
}

export default queues;
