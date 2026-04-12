// Pulse — People Operations Employee
// Migrated from native Zo agent 2026-03-19

import { eventBus, BXTHRE3_EVENTS } from '../events/bus';
import { memory } from '../memory/store';
import { org } from '../hierarchy/org';
import { escalationClock } from '../escalation/clock';

export interface WorkforceHealth {
  employeeId: string;
  status: 'healthy' | 'stressed' | 'overloaded' | 'blocked';
  activeTasks: number;
  completionRate: number;
  blockers: string[];
}

export class PulseEmployee {
  id = 'pulse';
  name = 'Pulse';
  role = 'People Operations';
  department = 'operations';

  private healthInterval: NodeJS.Timeout | null = null;
  private readonly CHECK_INTERVAL_MS = 60_000; // Every minute

  start(): void {
    console.log('[Pulse] People operations active');

    // Run initial health check
    this.runHealthCheck();

    // Schedule hourly health scans
    this.healthInterval = setInterval(() => {
      this.runHealthCheck();
    }, this.CHECK_INTERVAL_MS);
  }

  stop(): void {
    if (this.healthInterval) clearInterval(this.healthInterval);
  }

  runHealthCheck(): void {
    const employees = org.listAll();
    const healthReports: WorkforceHealth[] = [];

    for (const emp of employees) {
      const report = this.checkEmployeeHealth(emp.id);
      if (report) healthReports.push(report);
    }

    // Aggregate workforce health
    const overloaded = healthReports.filter(h => h.status === 'overloaded' || h.status === 'blocked');
    const healthy = healthReports.filter(h => h.status === 'healthy');

    // Publish workforce status
    eventBus.publish(BXTHRE3_EVENTS.WORKFORCE_UPDATED, 'pulse', {
      totalEmployees: employees.length,
      healthy: healthy.length,
      stressed: healthReports.filter(h => h.status === 'stressed').length,
      overloaded: overloaded.length,
      blocked: healthReports.filter(h => h.status === 'blocked').length,
    }, 'normal');

    // Escalate overloaded employees
    for (const emp of overloaded) {
      if (emp.blockers.length > 0) {
        escalationClock.register({
          id: `workforce-${emp.employeeId}`,
          description: `${emp.employeeId} is ${emp.status}: ${emp.blockers.join(', ')}`,
          assignedAgent: emp.employeeId,
          severity: emp.status === 'blocked' ? 'p1' : 'p2',
          resolutionDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // Update status file
    this.updateStatusFile(healthReports);
  }

  private checkEmployeeHealth(employeeId: string): WorkforceHealth | null {
    const emp = org.get(employeeId);
    if (!emp) return null;

    const activeTasks = this.getActiveTasksForEmployee(employeeId);
    const blockers = this.getBlockersForEmployee(employeeId);

    let status: WorkforceHealth['status'] = 'healthy';
    if (blockers.length > 0) status = 'blocked';
    else if (activeTasks > 5) status = 'overloaded';
    else if (activeTasks > 3) status = 'stressed';

    return {
      employeeId,
      status,
      activeTasks,
      completionRate: 0.85, // Would calculate from actual task data
      blockers,
    };
  }

  private getActiveTasksForEmployee(employeeId: string): number {
    const tasks = memory.query({ agentId: employeeId, tags: ['task', 'active'] });
    return Math.min(tasks.length, 8); // Cap at 8
  }

  private getBlockersForEmployee(employeeId: string): string[] {
    const blockers = escalationClock.getActive();
    return blockers
      .filter(b => b.assignedAgent === employeeId)
      .map(b => b.description);
  }

  private updateStatusFile(reports: WorkforceHealth[]): void {
    const fs = require('fs');

    const status = {
      agent: this.id,
      role: this.role,
      last_run: new Date().toISOString(),
      workforce: {
        total: reports.length,
        healthy: reports.filter(r => r.status === 'healthy').length,
        stressed: reports.filter(r => r.status === 'stressed').length,
        overloaded: reports.filter(r => r.status === 'overloaded').length,
        blocked: reports.filter(r => r.status === 'blocked').length,
      },
      alerts: reports.filter(r => r.status !== 'healthy').map(r => ({
        employee: r.employeeId,
        status: r.status,
        activeTasks: r.activeTasks,
        blockers: r.blockers,
      })),
    };

    fs.writeFileSync(
      '/home/workspace/Bxthre3/agents/status/pulse.json',
      JSON.stringify(status, null, 2)
    );
  }

  // Manual trigger
  checkAll(): void {
    this.runHealthCheck();
  }

  getQuickStatus(): { total: number; healthy: number; alerts: number } {
    const employees = org.listAll();
    return {
      total: employees.length,
      healthy: employees.filter(e => e.status === 'working').length,
      alerts: employees.filter(e => e.status === 'blocked').length,
    };
  }
}

export const pulse = new PulseEmployee();
