const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiService = {
  async getMaterials() {
    const res = await fetch(`${API_BASE_URL}/materials`);
    if (!res.ok) throw new Error('Failed to fetch materials');
    return res.json();
  },

  async getRegistrations() {
    const res = await fetch(`${API_BASE_URL}/registrations`);
    if (!res.ok) throw new Error('Failed to fetch registrations');
    return res.json();
  },

  async getContracts() {
    const res = await fetch(`${API_BASE_URL}/contracts`);
    if (!res.ok) throw new Error('Failed to fetch contracts');
    return res.json();
  },

  async createRegistration(data: { material_id: number; weight: number }) {
    const res = await fetch(`${API_BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create registration');
    return res.json();
  }
};