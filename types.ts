export type Role = 'employee' | 'support' | 'admin' | 'guest';

export interface User {
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'Open' | 'In Progress' | 'Resolved' | 'Closed';

export interface Incident {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  status: Status;
  createdAt: Date;
  slaDeadline: Date;
  assignedTo?: string;
  reporter: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AIClassification {
  priority: Priority;
  category: string;
  reasoning: string;
}
