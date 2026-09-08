import type { Flight } from '../types/Flight';
import { API_BASE } from './apiBase';

const baseUrl = `${API_BASE}/flights`;

export async function getFlights(): Promise<Flight[]> {
    try {const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
        throw new Error('Failed to fetch flights');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
}

export async function getFlightById(id: number): Promise<Flight> {
    try {const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch flight');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching flight:', error);
        throw error;
    }
}

export async function createFlight(flight: Flight): Promise<Flight> {
    try {const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(flight),
    });
    if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error ?? `Failed to create flight (${response.status})`);
    }
    const data = await response.json();
    return (data.flight ?? data) as Flight;
    } catch (error) {
        console.error('Error creating flight:', error);
        throw error;
    }
}


export async function updateFlight(id: number, flight: Flight): Promise<Flight> {   
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(flight),
    });
    if (!response.ok) {
        throw new Error('Failed to update flight');
    }
    return response.json();
    } catch (error) {
        console.error('Error updating flight:', error);
        throw error;
    }
}

export async function patchFlight(id: number, flight: Flight): Promise<Flight> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(flight),
    });
    if (!response.ok) {
        throw new Error('Failed to patch flight');
    }
    return response.json();
    } catch (error) {
        console.error('Error patching flight:', error);
        throw error;
    }
}

export async function deleteFlight(id: number): Promise<void> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete flight');
    }
    return;
    } catch (error) {
        console.error('Error deleting flight:', error);
        throw error;
    }
}