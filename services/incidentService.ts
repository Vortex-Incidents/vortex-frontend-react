import { Incident, Priority, Status } from '../types';

// Centralized Mock Data
let incidents: Incident[] = [
  { 
    id: 'INC-2001', 
    title: 'Critical Server Outage', 
    description: 'Main Database unreachable. Several services are down including Auth and Payments systems. Immediate attention required.', 
    priority: 'Critical', 
    category: 'Infrastructure', 
    status: 'Open', 
    createdAt: new Date(), 
    slaDeadline: new Date(Date.now() - 100000), // Breached
    reporter: 'System Monitor', 
    assignedTo: 'Alex Morgan' 
  },
  { 
    id: 'INC-1024', 
    title: 'VPN Connection Failure', 
    description: 'Cannot connect to US-East server using the standard Cisco client. Error 503 Service Unavailable.', 
    priority: 'High', 
    category: 'Network', 
    status: 'In Progress', 
    createdAt: new Date(), 
    slaDeadline: new Date(Date.now() + 3600000), 
    reporter: 'Me' 
  },
  { 
    id: 'INC-2002', 
    title: 'Email sync issues', 
    description: 'Outlook not syncing for the Sales department. Emails are stuck in outbox.', 
    priority: 'Medium', 
    category: 'Software', 
    status: 'In Progress', 
    createdAt: new Date(), 
    slaDeadline: new Date(Date.now() + 1800000), 
    reporter: 'Jane Doe' 
  },
  { 
    id: 'INC-1021', 
    title: 'Keyboard malfunction', 
    description: 'Spacebar stuck on laptop #4432. Physical damage suspected.', 
    priority: 'Medium', 
    category: 'Hardware', 
    status: 'Open', 
    createdAt: new Date(Date.now() - 7200000), 
    slaDeadline: new Date(Date.now() + 7200000), 
    reporter: 'Me' 
  },
  { 
    id: 'INC-1023', 
    title: 'License Expired Warning', 
    description: 'Adobe suite showing expiration warning on launch despite valid subscription.', 
    priority: 'Low', 
    category: 'Software', 
    status: 'Resolved', 
    createdAt: new Date(Date.now() - 86400000), 
    slaDeadline: new Date(Date.now() - 40000000), 
    reporter: 'Me' 
  },
  { 
    id: 'INC-2003', 
    title: 'New Monitor Request', 
    description: '27 inch monitor needed for new hire in Design department.', 
    priority: 'Low', 
    category: 'Hardware', 
    status: 'Open', 
    createdAt: new Date(), 
    slaDeadline: new Date(Date.now() + 86400000), 
    reporter: 'HR' 
  },
  { 
    id: 'INC-2004', 
    title: 'Wifi spotty in Conf Room B', 
    description: 'Signal drops intermittently during video calls. Affects client meetings.', 
    priority: 'High', 
    category: 'Network', 
    status: 'Open', 
    createdAt: new Date(), 
    slaDeadline: new Date(Date.now() + 5000000), 
    reporter: 'Manager' 
  },
];

export const getAllIncidents = (): Incident[] => {
    return [...incidents];
};

export const getIncidentsByRole = (role: string): Incident[] => {
    if (role === 'employee') {
        // Filter for 'Me' as the reporter for demo purposes
        return incidents.filter(i => i.reporter === 'Me');
    }
    // Support and Admin see all
    return [...incidents];
};

export const getIncidentById = (id: string): Incident | undefined => {
    return incidents.find(i => i.id === id);
};

export const updateIncidentStatus = (id: string, newStatus: Status): void => {
    const index = incidents.findIndex(i => i.id === id);
    if (index !== -1) {
        incidents[index] = { ...incidents[index], status: newStatus };
    }
};

export const createIncident = (incident: Incident): void => {
    incidents.unshift(incident);
};