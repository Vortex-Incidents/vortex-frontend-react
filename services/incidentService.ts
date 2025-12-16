import { mainApi } from './api';
import { Incident, Role, Status } from '../types';

// Helper to revive dates from JSON strings
const reviveDates = (incident: any): Incident => {
  return {
    ...incident,
    createdAt: incident.createdAt ? new Date(incident.createdAt) : new Date(),
    slaDeadline: incident.slaDeadline ? new Date(incident.slaDeadline) : new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};

export const getAllIncidents = async (): Promise<Incident[]> => {
  const response = await mainApi.get<any[]>('/incidents');
  return response.data.map(reviveDates);
};

export const getIncidentsByRole = async (role: Role): Promise<Incident[]> => {
  // If backend supports filtering by role: /incidents?role=...
  // Or simply get all and filter (if API doesn't support params yet)
  // Ideally: const response = await mainApi.get<any[]>(`/incidents?role=${role}`);

  // For now, getting all (Axios)
  const response = await mainApi.get<any[]>('/incidents');
  return response.data.map(reviveDates);
};

export const getIncidentById = async (id: string): Promise<Incident | undefined> => {
  try {
    const response = await mainApi.get<any>(`/incidents/${id}`);
    return reviveDates(response.data);
  } catch (e) {
    return undefined;
  }
};

export const updateIncidentStatus = async (id: string, newStatus: Status): Promise<void> => {
  await mainApi.patch(`/incidents/${id}/status`, { status: newStatus });
};

export const createIncident = async (incident: Partial<Incident>): Promise<void> => {
  await mainApi.post('/incidents', incident);
};