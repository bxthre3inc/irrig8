// Scheduler — Functional task timing & execution
// Uses node-cron for actual scheduling when available, falls back to setInterval

let cron: any = null;
try {
  cron = require('node-cron');
} catch {
  // node-cron not available — use setInterval fallback
}

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string; // cron expression
  handler: () => void | Promise<void>;
  isRunning: boolean;
  intervalMs?: number; // setInterval fallback
  intervalHandle?: ReturnType<typeof setInterval>;
  nextRun?: Date;
}

function cronToMs(cronExpr: string): number {
  // Crude setInterval approximation for common patterns
  const parts = cronExpr.trim().split(/\s+/);
  if (parts.length < 5) return 60_000;
  const [min, hour, , , dow] = parts;
  if (min === '*' && hour === '*') return 60_000; // Every minute
  if (min === '0' && hour === '7,19') return 12 * 60 * 60 * 1000; // Twice daily
  if (min === '0' && hour === '9') return 24 * 60 * 60 * 1000; // Daily
  return 60_000;
}

function validateCron(expr: string): boolean {
  if (!cron) return true;
  try { return cron.validate(expr); } catch { return true; }
}

export class Scheduler {
  private tasks = new Map<string, ScheduledTask>();
  private isActive = false;

  // Core 12-hour briefings: 7:00 AM and 7:00 PM
  scheduleBriefings(handler: () => void | Promise<void>): string {
    return this.schedule('briefing-12h', '0 7,19 * * *', handler);
  }

  // Daily employee checks at 9:00 AM
  scheduleDailyCheck(name: string, handler: () => void | Promise<void>): string {
    return this.schedule(`daily-check-${name}`, '0 9 * * *', handler);
  }

  // Every-minute check for time-sensitive operations
  scheduleEveryMinute(name: string, handler: () => void | Promise<void>): string {
    return this.schedule(`minute-${name}`, '* * * * *', handler);
  }

  // Every 5 minutes
  scheduleEveryFiveMinutes(name: string, handler: () => void | Promise<void>): string {
    return this.schedule(`five-min-${name}`, '*/5 * * * *', handler);
  }

  // Generic schedule method
  schedule(id: string, cronExpression: string, handler: () => void | Promise<void>): string {
    if (!validateCron(cronExpression)) {
      throw new Error(`Invalid cron expression: ${cronExpression}`);
    }

    const task: ScheduledTask = {
      id,
      name: id,
      schedule: cronExpression,
      handler,
      isRunning: false,
    };

    if (cron && cron.schedule) {
      // Use node-cron
      task.nextRun = cron.schedule(cronExpression, async () => {
        console.log(`[Scheduler] Running task: ${id} at ${new Date().toISOString()}`);
        task.isRunning = true;
        try {
          await handler();
        } catch (err) {
          console.error(`[Scheduler] Task ${id} failed:`, err);
        } finally {
          task.isRunning = false;
        }
      }, { scheduled: false }) as any;
    } else {
      // setInterval fallback
      task.intervalMs = cronToMs(cronExpression);
      task.intervalHandle = setInterval(async () => {
        console.log(`[Scheduler] Running task: ${id} at ${new Date().toISOString()}`);
        task.isRunning = true;
        try {
          await handler();
        } catch (err) {
          console.error(`[Scheduler] Task ${id} failed:`, err);
        } finally {
          task.isRunning = false;
        }
      }, task.intervalMs);
    }

    this.tasks.set(id, task);
    console.log(`[Scheduler] Registered task: ${id} (${cronExpression}${task.intervalMs ? ` ~${task.intervalMs}ms` : ''})`);
    return id;
  }

  start(): void {
    if (this.isActive) return;

    for (const task of this.tasks.values()) {
      if (task.intervalHandle) {
        // Already running via setInterval
      } else if (task.nextRun?.start) {
        (task.nextRun as any).start();
      }
    }

    this.isActive = true;
    console.log(`[Scheduler] Active with ${this.tasks.size} tasks (${cron ? 'node-cron' : 'setInterval fallback'})`);
  }

  stop(): void {
    for (const task of this.tasks.values()) {
      if (task.intervalHandle) {
        clearInterval(task.intervalHandle);
        task.intervalHandle = undefined;
      } else if (task.nextRun?.stop) {
        (task.nextRun as any).stop();
      }
      task.isRunning = false;
    }
    this.isActive = false;
    console.log('[Scheduler] All tasks stopped');
  }

  getStatus() {
    const tasks = Array.from(this.tasks.values()).map(t => ({
      id: t.id,
      schedule: t.schedule,
      intervalMs: t.intervalMs,
      isRunning: t.isRunning,
    }));

    return {
      active: this.isActive,
      taskCount: this.tasks.size,
      mode: cron ? 'node-cron' : 'setInterval',
      tasks,
    };
  }
}

export const scheduler = new Scheduler();
