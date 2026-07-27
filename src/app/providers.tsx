"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QueryClient, QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DatabaseSchema, User } from "@/lib/db";

// Context Types
interface TrackerContextType {
  activeUserId: string;
  setActiveUserId: (id: string) => void;
  activeUser: User | undefined;
  partnerUser: User | undefined;
  dbData: DatabaseSchema | undefined;
  isLoading: boolean;
  isError: boolean;
  refetchDb: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateCompletion: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateNote: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateBookmark: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateRevision: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateUserSettings: any;
  isSupabase: boolean;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return context;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 5000,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <TrackerProviderInternal>{children}</TrackerProviderInternal>
    </QueryClientProvider>
  );
}

function TrackerProviderInternal({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [activeUserId, setActiveUserIdState] = useState<string>("user-1");

  // Load active user from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dsa_active_user_id");
    if (saved) {
      setActiveUserIdState(saved);
    }
  }, []);

  const setActiveUserId = (id: string) => {
    setActiveUserIdState(id);
    localStorage.setItem("dsa_active_user_id", id);
  };

  // React Query to fetch the entire database state
  const { data: dbData, isLoading, isError, refetch: refetchDb } = useQuery<DatabaseSchema>({
    queryKey: ["db"],
    queryFn: async () => {
      const res = await fetch("/api/db");
      if (!res.ok) throw new Error("Failed to fetch database");
      return res.json();
    },
  });

  const activeUser = dbData?.users.find(u => u.id === activeUserId);
  const partnerUser = dbData?.users.find(u => u.id !== activeUserId);

  // Mutations for instant visual sync
  const mutateCompletion = useMutation({
    mutationFn: async ({ userId, problemId, completed }: { userId: string; problemId: string; completed: boolean }) => {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateCompletion", userId, problemId, completed }),
      });
      return res.json();
    },
    onMutate: async ({ userId, problemId, completed }) => {
      await queryClient.cancelQueries({ queryKey: ["db"] });
      const previousDb = queryClient.getQueryData<DatabaseSchema>(["db"]);

      if (previousDb) {
        queryClient.setQueryData<DatabaseSchema>(["db"], {
          ...previousDb,
          completion: [
            ...previousDb.completion.filter(c => !(c.user_id === userId && c.problem_id === problemId)),
            { user_id: userId, problem_id: problemId, completed, completed_at: completed ? new Date().toISOString() : null }
          ]
        });
      }

      return { previousDb };
    },
    onError: (err, variables, context) => {
      if (context?.previousDb) {
        queryClient.setQueryData(["db"], context.previousDb);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["db"] });
    },
  });

  const mutateNote = useMutation({
    mutationFn: async ({ userId, problemId, note }: { userId: string; problemId: string; note: string }) => {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateNote", userId, problemId, note }),
      });
      return res.json();
    },
    onMutate: async ({ userId, problemId, note }) => {
      await queryClient.cancelQueries({ queryKey: ["db"] });
      const previousDb = queryClient.getQueryData<DatabaseSchema>(["db"]);

      if (previousDb) {
        queryClient.setQueryData<DatabaseSchema>(["db"], {
          ...previousDb,
          notes: [
            ...previousDb.notes.filter(n => !(n.user_id === userId && n.problem_id === problemId)),
            { user_id: userId, problem_id: problemId, note, updated_at: new Date().toISOString() }
          ]
        });
      }

      return { previousDb };
    },
    onError: (err, variables, context) => {
      if (context?.previousDb) {
        queryClient.setQueryData(["db"], context.previousDb);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["db"] });
    },
  });

  const mutateBookmark = useMutation({
    mutationFn: async ({ userId, problemId }: { userId: string; problemId: string }) => {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleBookmark", userId, problemId }),
      });
      return res.json();
    },
    onMutate: async ({ userId, problemId }) => {
      await queryClient.cancelQueries({ queryKey: ["db"] });
      const previousDb = queryClient.getQueryData<DatabaseSchema>(["db"]);

      if (previousDb) {
        const isBookmarked = previousDb.bookmarks.some(b => b.user_id === userId && b.problem_id === problemId);
        queryClient.setQueryData<DatabaseSchema>(["db"], {
          ...previousDb,
          bookmarks: isBookmarked
            ? previousDb.bookmarks.filter(b => !(b.user_id === userId && b.problem_id === problemId))
            : [...previousDb.bookmarks, { user_id: userId, problem_id: problemId }]
        });
      }

      return { previousDb };
    },
    onError: (err, variables, context) => {
      if (context?.previousDb) {
        queryClient.setQueryData(["db"], context.previousDb);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["db"] });
    },
  });

  const mutateRevision = useMutation({
    mutationFn: async ({ userId, problemId, status }: { userId: string; problemId: string; status: "none" | "needs_revision" | "revised_once" | "mastered" }) => {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateRevision", userId, problemId, status }),
      });
      return res.json();
    },
    onMutate: async ({ userId, problemId, status }) => {
      await queryClient.cancelQueries({ queryKey: ["db"] });
      const previousDb = queryClient.getQueryData<DatabaseSchema>(["db"]);

      if (previousDb) {
        queryClient.setQueryData<DatabaseSchema>(["db"], {
          ...previousDb,
          revision: [
            ...previousDb.revision.filter(r => !(r.user_id === userId && r.problem_id === problemId)),
            { user_id: userId, problem_id: problemId, status }
          ]
        });
      }

      return { previousDb };
    },
    onError: (err, variables, context) => {
      if (context?.previousDb) {
        queryClient.setQueryData(["db"], context.previousDb);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["db"] });
    },
  });

  const mutateUserSettings = useMutation({
    mutationFn: async (users: User[]) => {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateUserSettings", users }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["db"] });
    },
  });

  const isSupabase = false; // Resolved on backend API

  return (
    <TrackerContext.Provider
      value={{
        activeUserId,
        setActiveUserId,
        activeUser,
        partnerUser,
        dbData,
        isLoading,
        isError,
        refetchDb,
        mutateCompletion,
        mutateNote,
        mutateBookmark,
        mutateRevision,
        mutateUserSettings,
        isSupabase,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
}
