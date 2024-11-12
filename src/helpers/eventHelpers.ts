// src/lib/event/eventHelpers.ts

import apiClient from './apiClient';
import { Album, Event } from '@/utils/types';

// Fetch all events
export async function fetchEvents(): Promise<Event[]> {
  const response = await apiClient.get('/event');
  return response.data;
}

// Fetch a specific event by ID
export async function fetchEventById(eventId: string): Promise<Event> {
  const response = await apiClient.get(`/event/${eventId}`);
  return response.data;
}

// Fetch an event by its path
export async function fetchEventByPath(eventPath: string): Promise<Event> {
  const response = await apiClient.get(`/event/${eventPath}`);
  console.log("RESPONSE", response)
  return response.data;
}

export async function fetchAlbumsForEvent(eventName: string): Promise<Album[]> {
    const response = await apiClient.get(`/event/${eventName}`)
    return response.data;
}

// Create a new event
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const response = await apiClient.post('/event', eventData);
  return response.data;
}

// Update an existing event
export async function updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
  const response = await apiClient.put(`/event/${eventId}`, eventData);
  return response.data;
}

// Delete an event
export async function deleteEvent(eventId: string): Promise<void> {
  await apiClient.delete(`/event/${eventId}`);
}

// Fetch events for a specific admin user
export async function fetchAdminEvents(adminId: string): Promise<Event[]> {
  const response = await apiClient.get(`/admin/events?adminId=${adminId}`);
  return response.data;
}
