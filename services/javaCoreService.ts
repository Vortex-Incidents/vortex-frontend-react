import { Incident } from '../types';

const API_URL = 'https://vortex-java-core.onrender.com/api/v1/incidents';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const createIncidentApi = async (incident: Partial<Incident>): Promise<Incident> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        title: incident.title,
        description: incident.description,
      }),
    });

    if (!response.ok) {
      throw new Error(`Java Service Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create incident:', error);
    throw error;
  }
};

export const getAllIncidentsApi = async (): Promise<Incident[]> => {
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Java Service List Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch incidents:', error);
    // Return empty array to avoid crashing UI if auth fails or server is down
    return [];
  }
};

export const getIncidentByIdApi = async (id: string): Promise<Incident | null> => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) return null;
    return await response.json();
  } catch (e) {
    console.error(e);
    return null;
  }
};
