import type { User, LoginResponse } from '../types/User';
import { API_BASE } from './apiBase';

const baseUrl = `${API_BASE}/users`;

export async function getUsers(): Promise<User[]> {
    try {const response = await fetch(`${baseUrl}`);
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function getUserById(id: number): Promise<User> {
    try {const response = await fetch(`${baseUrl}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    return response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export async function createUser(user: User): Promise<User> {
    try {const response = await fetch(`${baseUrl}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to create user');
    }
    return response.json();
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

export async function updateUser(id: number, user: User): Promise<User> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to update user');
    }
    return response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

export async function patchUser(id: number, user: User): Promise<User> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        throw new Error('Failed to patch user');
    }
    return response.json();
    } catch (error) {
        console.error('Error patching user:', error);
        throw error;
    }
}

export async function deleteUser(id: number): Promise<void> {
    try {const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete user');
    }
    return;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
    try {const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email: email, user_password: password }),
    });
    if (!response.ok) {
        throw new Error('Failed to login');
    }
    return response.json() as Promise<LoginResponse>;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}