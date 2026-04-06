// Employee Hierarchy — Types
export type EmployeeRole = 'employee' | 'manager' | 'executive';
export type Department =
  | 'executive' | 'engineering' | 'operations' | 'marketing' | 'grants'
  | 'legal' | 'sales' | 'finance' | 'security' | 'bi'
  | 'research' | 'design' | 'channel' | 'corp_dev' | 'professional_services'
  | 'retail' | 'starting5';
export type Shift = 'morning' | 'afternoon' | 'evening' | 'continuous';
export interface Employee {
  id: string; name: string; role: EmployeeRole; department: Department;
  managerId: string | null; colleagues: string[];
  shifts: Shift[]; skills: string[]; tools: string[];
  status: 'idle' | 'working' | 'blocked' | 'off' | 'monitoring';
  inboxPath: string; outboxPath: string; statusPath: string;
}
export interface Manager extends Employee { role: 'manager';
  directReports: string[]; escalationClockHours: number;
  peerHelpThreshold: number; sprintModeActive: boolean;
}
export interface Executive extends Employee { role: 'executive';
  manages: Department[];
}
