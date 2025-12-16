import { Incident, Role, Status } from '../types';
import { getAllIncidentsApi, createIncidentApi, getIncidentByIdApi } from './javaCoreService';

export const getAllIncidents = async (): Promise<Incident[]> => {
  return await getAllIncidentsApi();
};

export const getIncidentsByRole = async (role: Role): Promise<Incident[]> => {
  const incidents = await getAllIncidentsApi();
  // Client side filtering if needed, for now return all or filter by basic logic
  return incidents;
};

export const getIncidentById = async (id: string): Promise<Incident | undefined> => {
  const incident = await getIncidentByIdApi(id);
  return incident || undefined;
};

export const updateIncidentStatus = async (id: string, newStatus: Status): Promise<void> => {
  console.warn('Update functionality not yet supported by Java Core API');
};

export const createIncident = async (incident: Incident): Promise<void> => {
  await createIncidentApi(incident);
};