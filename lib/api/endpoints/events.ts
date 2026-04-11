/**
 * Events API — matches `/api/v1/events`
 */

import { apiClient } from "@/lib/api/client";
import { unwrap } from "@/lib/api/unwrap";
import {
  ChurchEvent,
  EventRegistration,
  EventRegistrationInput,
} from "@/lib/types/resources";
import type { ApiResponse } from "@/lib/types/common";

export type EventsListPayload = { data: ChurchEvent[]; total: number };

export const eventsApi = {
  listEvents: async (page: number = 1): Promise<EventsListPayload> => {
    const res = await apiClient.get<ApiResponse<EventsListPayload>>(
      `/events?page=${page}`,
    );
    return unwrap(res);
  },

  getEvent: async (id: string): Promise<ChurchEvent> => {
    const res = await apiClient.get<ApiResponse<ChurchEvent>>(`/events/${id}`);
    return unwrap(res);
  },

  createEvent: async (data: Partial<ChurchEvent>): Promise<ChurchEvent> => {
    const res = await apiClient.post<ApiResponse<ChurchEvent>>("/events", data);
    return unwrap(res);
  },

  updateEvent: async (
    id: string,
    data: Partial<ChurchEvent>,
  ): Promise<ChurchEvent> => {
    const res = await apiClient.put<ApiResponse<ChurchEvent>>(
      `/events/${id}`,
      data,
    );
    return unwrap(res);
  },

  deleteEvent: async (id: string): Promise<void> => {
    await apiClient.delete(`/events/${id}`);
  },

  registerForEvent: async (
    eventId: string,
    registration: EventRegistrationInput,
  ): Promise<EventRegistration> => {
    const res = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/register`,
      registration,
    );
    return unwrap(res);
  },

  getAttendees: async (
    eventId: string,
  ): Promise<{ data: EventRegistration[] }> => {
    const res = await apiClient.get<
      ApiResponse<{ data: EventRegistration[] }>
    >(`/events/${eventId}/attendees`);
    return unwrap(res);
  },

  checkInAttendee: async (
    eventId: string,
    attendeeId: string,
  ): Promise<EventRegistration> => {
    const res = await apiClient.post<ApiResponse<EventRegistration>>(
      `/events/${eventId}/attendees/${attendeeId}/check-in`,
    );
    return unwrap(res);
  },
};
