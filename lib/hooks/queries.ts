/**
 * TanStack Query hooks — aligned with `/api/v1` backend
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants/config";
import { authApi } from "@/lib/api/endpoints/auth";
import { membersApi } from "@/lib/api/endpoints/members";
import { eventsApi } from "@/lib/api/endpoints/events";
import { sermonsApi } from "@/lib/api/endpoints/sermons";
import { prayerApi } from "@/lib/api/endpoints/prayers";
import { givingApi } from "@/lib/api/endpoints/giving";
import { ministriesApi } from "@/lib/api/endpoints/ministries";
import { livestreamApi } from "@/lib/api/endpoints/livestream";
import { contentApi } from "@/lib/api/endpoints/content";
import { notificationsApi } from "@/lib/api/endpoints/notifications";
import { searchApi } from "@/lib/api/endpoints/search";
import { mediaApi } from "@/lib/api/endpoints/media";
import { adminApi } from "@/lib/api/endpoints/admin";
import type { User, LoginInput, RegisterInput } from "@/lib/types/auth";
import type {
  ChurchEvent,
  MemberProfile,
  PrayerRequestInput,
  Sermon,
} from "@/lib/types/resources";

// ============================================================================
// Auth
// ============================================================================

export const useAuth = () => {
  return useQuery({
    queryKey: QUERY_KEYS.AUTH_ME,
    queryFn: () => authApi.me(),
    enabled: typeof window !== "undefined",
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.AUTH_ME, data.user as User);
    },
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH_ME });
    },
  });
};

// ============================================================================
// Members
// ============================================================================

export const useMembers = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEMBERS, page],
    queryFn: () => membersApi.listMembers(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMemberProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MEMBER("me"),
    queryFn: () => membersApi.getProfile(),
    enabled: typeof window !== "undefined",
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updates: Partial<Pick<MemberProfile, "fullName" | "phone">>) =>
      membersApi.updateProfile(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.MEMBER("me"), data);
    },
  });
};

export const useMembersByBranch = (branchId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEMBERS, "branch", branchId],
    queryFn: () => membersApi.getByBranch(branchId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMembersByMinistry = (ministryId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MEMBERS, "ministry", ministryId],
    queryFn: () => membersApi.getByMinistry(ministryId),
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// Events
// ============================================================================

export const useEvents = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.EVENTS, page],
    queryFn: () => eventsApi.listEvents(page),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
  });
};

export const useEvent = (eventId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENT(eventId),
    queryFn: () => eventsApi.getEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ChurchEvent>) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useUpdateEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ChurchEvent> }) =>
      eventsApi.updateEvent(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.EVENT(data.id), data);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: string) => eventsApi.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useRegisterForEventMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      eventId: string;
      registration: import("@/lib/types/resources").EventRegistrationInput;
    }) => eventsApi.registerForEvent(vars.eventId, vars.registration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
    },
  });
};

export const useEventAttendees = (eventId: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.EVENTS, eventId, "attendees"],
    queryFn: () => eventsApi.getAttendees(eventId),
  });
};

export const useCheckInAttendee = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { eventId: string; attendeeId: string }) =>
      eventsApi.checkInAttendee(vars.eventId, vars.attendeeId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.EVENTS, eventId, "attendees"],
      });
    },
  });
};

// ============================================================================
// Sermons
// ============================================================================

export const useSermons = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SERMONS, page],
    queryFn: () => sermonsApi.listSermons(page),
    staleTime: 10 * 60 * 1000,
  });
};

export const useSermon = (sermonId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.SERMON(sermonId),
    queryFn: () => sermonsApi.getSermon(sermonId),
    enabled: !!sermonId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSearchSermons = (query: string, page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SERMONS, "search", query, page],
    queryFn: () => sermonsApi.searchSermons(query, page),
    enabled: !!query && query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================================================
// Prayer & testimonies
// ============================================================================

export const usePrayerRequests = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRAYERS, page],
    queryFn: () => prayerApi.listPrayerRequests(page),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitPrayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: PrayerRequestInput) =>
      prayerApi.submitPrayerRequest(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PRAYERS });
    },
  });
};

export const useSubmitTestimonyMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: import("@/lib/types/resources").TestimonyInput) =>
      prayerApi.submitTestimony(input),
  });
};

export const useTestimonies = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.PRAYERS, "testimonies"],
    queryFn: () => prayerApi.getTestimonies(),
    staleTime: 5 * 60 * 1000,
  });
};

/** @deprecated No single-prayer endpoint; kept for compatibility */
export const usePrayer = (_prayerId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.PRAYER(_prayerId),
    queryFn: async (): Promise<Sermon | null> => null,
    enabled: false,
  });
};

// ============================================================================
// Giving
// ============================================================================

export const useGivingHistory = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.GIVING, "my-history"],
    queryFn: () => givingApi.getMyHistory(),
    enabled: typeof window !== "undefined",
  });
};

export const useInitiateDonationMutation = () => {
  return useMutation({
    mutationFn: (data: import("@/lib/types/resources").InitiateGivingInput) =>
      givingApi.initiateDonation(data),
  });
};

export const useVerifyPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => givingApi.verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GIVING });
    },
  });
};

// ============================================================================
// Ministries
// ============================================================================

export const useMinistries = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MINISTRIES, page, limit],
    queryFn: () => ministriesApi.list(page, limit),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 10,
  });
};

export const useMinistry = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.MINISTRIES, id],
    queryFn: () => ministriesApi.getById(id),
    enabled: !!id && typeof window !== "undefined",
    staleTime: 1000 * 60 * 10,
  });
};

export const useCreateMinistryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => ministriesApi.create(data as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINISTRIES });
    },
  });
};

export const useUpdateMinistryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      ministriesApi.update(id, data as never),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINISTRIES });
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.MINISTRIES, id],
      });
    },
  });
};

export const useDeleteMinistryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ministriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINISTRIES });
    },
  });
};

// ============================================================================
// Livestream
// ============================================================================

export const useLivestreamActive = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LIVESTREAM, "active"],
    queryFn: () => livestreamApi.getActive(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 30,
  });
};

export const useLivestreamSchedule = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LIVESTREAM, "schedule"],
    queryFn: () => livestreamApi.getSchedule(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60,
  });
};

/** @deprecated Prefer useLivestreamActive */
export const useLivestream = (_id?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.LIVESTREAM,
    queryFn: () => livestreamApi.getActive(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 30,
  });
};

export const useCreateLivestreamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: unknown) => livestreamApi.create(payload as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVESTREAM });
    },
  });
};

export const useStartLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => livestreamApi.goLive(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVESTREAM });
    },
  });
};

export const useEndLivestream = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => livestreamApi.end(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LIVESTREAM });
    },
  });
};

// ============================================================================
// Content
// ============================================================================

export const useContent = (page: number = 1, type?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, "list", page, type],
    queryFn: () => contentApi.listContent(page, type),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useDevotion = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, "devotion", page],
    queryFn: () => contentApi.getDevotion(page),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useBlogPosts = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, "blog", page],
    queryFn: () => contentApi.getBlogPosts(page),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useAnnouncements = (page: number = 1) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, "announcements", page],
    queryFn: () => contentApi.getAnnouncements(page),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useContentById = (id: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.CONTENT, id],
    queryFn: () => contentApi.getById(id),
    enabled: !!id && typeof window !== "undefined",
    staleTime: 1000 * 60 * 10,
  });
};

/** @deprecated use useContentById */
export const useContentBySlug = useContentById;

export const useCreateContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => contentApi.createContent(data as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT });
    },
  });
};

export const useUpdateContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      contentApi.updateContent(id, data as never),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT });
    },
  });
};

export const useDeleteContentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contentApi.deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CONTENT });
    },
  });
};

// ============================================================================
// Notifications
// ============================================================================

export const useNotifications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: () => notificationsApi.list(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 30,
    refetchInterval: 1000 * 60,
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      notificationsApi.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
};

export const useMarkAllNotificationsAsReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
    },
  });
};

// ============================================================================
// Search
// ============================================================================

export const useSearch = (query: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SEARCH, query],
    queryFn: () => searchApi.global(query),
    enabled: !!query && query.length >= 2 && typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useSearchByType = (
  query: string,
  resource: "sermons" | "events" | "posts",
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SEARCH, query, resource],
    queryFn: () => searchApi.global(query, resource),
    enabled: !!query && query.length >= 2 && typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

// ============================================================================
// Media
// ============================================================================

export const useMediaPresignMutation = () => {
  return useMutation({
    mutationFn: (vars: { filename: string; mimeType: string }) =>
      mediaApi.presign(vars.filename, vars.mimeType),
  });
};

export const useGetUploadUrlMutation = useMediaPresignMutation;

// ============================================================================
// Admin
// ============================================================================

export const useDashboardStats = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "dashboard"],
    queryFn: () => adminApi.getDashboardStats(),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminMembers = (
  page: number = 1,
  limit: number = 25,
  status?: string,
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "members", page, limit, status],
    queryFn: () => adminApi.listMembers(page, limit, status),
    enabled: typeof window !== "undefined",
    staleTime: 1000 * 60 * 10,
  });
};

export const useAdminMember = (id?: string) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "members", id],
    queryFn: () => adminApi.getMember(id as string),
    enabled: !!id && typeof window !== "undefined",
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminGiving = (page: number = 1, limit: number = 25) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "giving", page, limit],
    queryFn: () => adminApi.listGiving(page, limit),
    enabled: typeof window !== "undefined",
  });
};

export const useAdminGivingSummary = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "giving-summary"],
    queryFn: () => adminApi.givingSummary(),
    enabled: typeof window !== "undefined",
  });
};

export const useAdminPrayerRequests = (
  page: number = 1,
  limit: number = 25,
) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "prayer-requests", page, limit],
    queryFn: () => adminApi.listPrayerRequests(page, limit),
    enabled: typeof window !== "undefined",
  });
};

export const useUpdatePrayerRequestStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; status: string }) =>
      adminApi.updatePrayerStatus(vars.id, vars.status),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.ADMIN, "prayer-requests"],
      });
    },
  });
};

export const useSystemHealth = () => {
  return useQuery({
    queryKey: [...QUERY_KEYS.ADMIN, "health"],
    queryFn: async () => ({
      status: "UP",
      lastCheck: new Date().toISOString(),
    }),
    staleTime: 60 * 1000,
  });
};
