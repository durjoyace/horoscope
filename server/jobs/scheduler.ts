import { queues, addHoroscopeJob, addGamificationJob } from './queues';
import { jobLogger } from '../logger';

// Cron patterns
const CRON_PATTERNS = {
  EVERY_MINUTE: '* * * * *',
  EVERY_5_MINUTES: '*/5 * * * *',
  EVERY_HOUR: '0 * * * *',
  DAILY_1AM: '0 1 * * *',
  DAILY_6AM: '0 6 * * *',
  DAILY_MIDNIGHT: '0 0 * * *',
  WEEKLY_SUNDAY_MIDNIGHT: '0 0 * * 0',
};

// Initialize scheduled jobs
export async function initializeScheduledJobs() {
  jobLogger.info('Initializing scheduled jobs...');

  try {
    // Daily horoscope generation at 1 AM UTC
    await queues.horoscope.add(
      'generate_daily_scheduled',
      { type: 'generate_daily' },
      {
        repeat: {
          pattern: CRON_PATTERNS.DAILY_1AM,
        },
        jobId: 'daily-horoscope-generation',
      }
    );
    jobLogger.info('Scheduled: Daily horoscope generation at 1 AM UTC');

    // Daily horoscope delivery at 6 AM UTC
    await queues.horoscope.add(
      'deliver_daily_scheduled',
      { type: 'deliver_to_user' },
      {
        repeat: {
          pattern: CRON_PATTERNS.DAILY_6AM,
        },
        jobId: 'daily-horoscope-delivery',
      }
    );
    jobLogger.info('Scheduled: Daily horoscope delivery at 6 AM UTC');

    // Weekly premium report generation on Sundays at midnight
    await queues.horoscope.add(
      'generate_premium_reports_scheduled',
      { type: 'generate_premium_report' },
      {
        repeat: {
          pattern: CRON_PATTERNS.WEEKLY_SUNDAY_MIDNIGHT,
        },
        jobId: 'weekly-premium-reports',
      }
    );
    jobLogger.info('Scheduled: Weekly premium report generation on Sundays');

    // Leaderboard refresh every 5 minutes
    await queues.gamification.add(
      'refresh_leaderboard_scheduled',
      { type: 'update_leaderboard' },
      {
        repeat: {
          pattern: CRON_PATTERNS.EVERY_5_MINUTES,
        },
        jobId: 'leaderboard-refresh',
      }
    );
    jobLogger.info('Scheduled: Leaderboard refresh every 5 minutes');

    // Daily streak check at midnight
    await queues.gamification.add(
      'check_streaks_scheduled',
      { type: 'check_streaks' },
      {
        repeat: {
          pattern: CRON_PATTERNS.DAILY_MIDNIGHT,
        },
        jobId: 'daily-streak-check',
      }
    );
    jobLogger.info('Scheduled: Daily streak check at midnight');

    jobLogger.info('All scheduled jobs initialized');
  } catch (error) {
    jobLogger.error({ err: error }, 'Failed to initialize scheduled jobs');
    throw error;
  }
}

// Remove a scheduled job
export async function removeScheduledJob(queueName: keyof typeof queues, jobId: string) {
  try {
    const queue = queues[queueName];
    const repeatableJobs = await queue.getRepeatableJobs();
    const job = repeatableJobs.find((j) => j.id === jobId);

    if (job) {
      await queue.removeRepeatableByKey(job.key);
      jobLogger.info(`Removed scheduled job: ${jobId} from ${queueName}`);
    }
  } catch (error) {
    jobLogger.error({ err: error }, `Failed to remove scheduled job ${jobId}`);
  }
}

// Get all scheduled jobs
export async function getScheduledJobs() {
  const scheduledJobs: Record<string, unknown[]> = {};

  for (const [name, queue] of Object.entries(queues)) {
    const repeatableJobs = await queue.getRepeatableJobs();
    scheduledJobs[name] = repeatableJobs.map((job) => ({
      id: job.id,
      name: job.name,
      pattern: job.pattern,
      next: job.next ? new Date(job.next).toISOString() : null,
    }));
  }

  return scheduledJobs;
}

// Trigger a job manually (useful for testing)
export async function triggerJob(
  queueName: keyof typeof queues,
  jobType: string,
  data: Record<string, unknown> = {}
) {
  const queue = queues[queueName];

  const job = await queue.add(jobType, { type: jobType, ...data }, {
    priority: 1, // High priority for manual triggers
  });

  jobLogger.info({ jobId: job.id }, `Manually triggered job: ${queueName}/${jobType}`);
  return job;
}

// Health check for scheduler
export async function schedulerHealthCheck() {
  const health: Record<string, { connected: boolean; repeatableCount: number }> = {};

  for (const [name, queue] of Object.entries(queues)) {
    try {
      const repeatableJobs = await queue.getRepeatableJobs();
      health[name] = {
        connected: true,
        repeatableCount: repeatableJobs.length,
      };
    } catch (error) {
      health[name] = {
        connected: false,
        repeatableCount: 0,
      };
    }
  }

  return health;
}

export default initializeScheduledJobs;
