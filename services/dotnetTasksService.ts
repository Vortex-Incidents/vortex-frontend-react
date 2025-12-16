
const BASE_URL = 'https://vortex-dotnet-tasks.onrender.com/api/v1/assignments';

export interface Technician {
    id?: string;
    name: string;
    email: string;
    currentLoad?: number;
}

export const getAvailableTechniciansApi = async (): Promise<Technician[]> => {
    try {
        const response = await fetch(`${BASE_URL}/technicians`);
        if (!response.ok) throw new Error('Failed to fetch technicians');
        return await response.json();
    } catch (error) {
        console.error('Error fetching technicians:', error);
        return [];
    }
};

export const assignTechnicianApi = async (incidentId: string, category: string): Promise<Technician> => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ incidentId, category }),
        });

        if (!response.ok) throw new Error('Assignment Failed');

        return await response.json();
    } catch (error) {
        console.error('Error assigning technician:', error);
        throw error;
    }
};
