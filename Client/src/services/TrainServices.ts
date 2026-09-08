import type { Train } from '../types/Train';
import { API_BASE } from './apiBase';

const baseUrl = `${API_BASE}/trains`;

export async function getTrains(): Promise<Train[]> {
    try {const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
        throw new Error('Failed to fetch trains');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching trains:', error);
        throw error;
    }
}

export async function getTrainById(id: number): Promise<Train> {
    try {const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch train');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching train:', error);
        throw error;
    }
}

export async function createTrain(train: Train): Promise<Train> {
    try {const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(train),
    });
    if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error ?? `Failed to create train (${response.status})`);
    }
    const data = await response.json();
    return (data.train ?? data) as Train;
    } catch (error) {
        console.error('Error creating train:', error);
        throw error;
    }
}

export async function updateTrain(id: number, train: Train): Promise<Train> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(train),
    });
    if (!response.ok) {
        throw new Error('Failed to update train');
    }
    const data = await response.json();
    return (data.train ?? data) as Train;
    } catch (error) {
        console.error('Error updating train:', error);
        throw error;
    }
}

export async function patchTrain(id: number, train: Train): Promise<Train> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(train),
    });
    if (!response.ok) {
        throw new Error('Failed to patch train');
    }
    return response.json();
    } catch (error) {
        console.error('Error patching train:', error);
        throw error;
    }
}

export async function deleteTrain(id: number): Promise<void> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    });
    if (!response.ok) {
        throw new Error('Failed to delete train');
    }
    return;
    } catch (error) {
        console.error('Error deleting train:', error);
        throw error;
    }
}