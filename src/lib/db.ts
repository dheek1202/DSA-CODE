import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Type Definitions
export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Problem {
  id: string;
  leetcode_number: number;
  leetcode_slug: string;
  name: string;
  category: string;
  category_number: string;
  pattern_number: number;
  pattern_name: string;
  difficulty: string;
  order_in_pattern: number;
  order_overall: number;
  is_stray: boolean;
  is_truncated: boolean;
}

export interface Completion {
  user_id: string;
  problem_id: string;
  completed: boolean;
  completed_at: string | null;
}

export interface Note {
  user_id: string;
  problem_id: string;
  note: string;
  updated_at: string;
}

export interface Bookmark {
  user_id: string;
  problem_id: string;
}

export interface Revision {
  user_id: string;
  problem_id: string;
  status: "none" | "needs_revision" | "revised_once" | "mastered";
}

export interface DatabaseSchema {
  users: User[];
  problems: Problem[];
  completion: Completion[];
  notes: Note[];
  bookmarks: Bookmark[];
  revision: Revision[];
}

const dbFilePath = path.join(process.cwd(), "data", "db.json");
const seededProblemsPath = path.join(process.cwd(), "data", "problems-seeded.json");

// Check if Supabase env vars are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const isSupabaseEnabled = supabaseUrl !== "" && supabaseAnonKey !== "";

const supabase = isSupabaseEnabled ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Initialize JSON database if it doesn't exist
function initLocalDb(): DatabaseSchema {
  if (!fs.existsSync(path.dirname(dbFilePath))) {
    fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });
  }

  if (fs.existsSync(dbFilePath)) {
    try {
      const data = fs.readFileSync(dbFilePath, "utf8");
      return JSON.parse(data) as DatabaseSchema;
    } catch (e) {
      console.error("Error reading local db, re-initializing:", e);
    }
  }

  // Load seeded problems
  let problems: Problem[] = [];
  if (fs.existsSync(seededProblemsPath)) {
    problems = JSON.parse(fs.readFileSync(seededProblemsPath, "utf8")) as Problem[];
  }

  const initialDb: DatabaseSchema = {
    users: [
      { id: "user-1", name: "Me", avatar: "M" },
      { id: "user-2", name: "Partner", avatar: "P" },
    ],
    problems,
    completion: [],
    notes: [],
    bookmarks: [],
    revision: [],
  };

  fs.writeFileSync(dbFilePath, JSON.stringify(initialDb, null, 2), "utf8");
  return initialDb;
}

// Local DB Helpers
function readLocalDb(): DatabaseSchema {
  return initLocalDb();
}

function writeLocalDb(data: DatabaseSchema) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf8");
}

// Unified Database Service API
export const DbService = {
  isSupabase() {
    return isSupabaseEnabled;
  },

  async getDb(): Promise<DatabaseSchema> {
    if (isSupabaseEnabled && supabase) {
      // Fetch all from Supabase
      const [
        { data: users },
        { data: problems },
        { data: completion },
        { data: notes },
        { data: bookmarks },
        { data: revision }
      ] = await Promise.all([
        supabase.from("users").select("*"),
        supabase.from("problems").select("*").order("order_overall" as any),
        supabase.from("completion").select("*"),
        supabase.from("notes").select("*"),
        supabase.from("bookmarks").select("*"),
        supabase.from("revision").select("*")
      ]);

      return {
        users: users || [],
        problems: problems || [],
        completion: completion || [],
        notes: notes || [],
        bookmarks: bookmarks || [],
        revision: revision || [],
      };
    } else {
      return readLocalDb();
    }
  },

  async updateCompletion(userId: string, problemId: string, completed: boolean): Promise<Completion> {
    if (isSupabaseEnabled && supabase) {
      const completedAt = completed ? new Date().toISOString() : null;
      const { data, error } = await supabase
        .from("completion")
        .upsert({ user_id: userId, problem_id: problemId, completed, completed_at: completedAt })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const db = readLocalDb();
      const existingIdx = db.completion.findIndex(c => c.user_id === userId && c.problem_id === problemId);
      
      const newCompletion: Completion = {
        user_id: userId,
        problem_id: problemId,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      };

      if (existingIdx >= 0) {
        db.completion[existingIdx] = newCompletion;
      } else {
        db.completion.push(newCompletion);
      }

      writeLocalDb(db);
      return newCompletion;
    }
  },

  async updateNote(userId: string, problemId: string, noteText: string): Promise<Note> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase
        .from("notes")
        .upsert({ user_id: userId, problem_id: problemId, note: noteText, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const db = readLocalDb();
      const existingIdx = db.notes.findIndex(n => n.user_id === userId && n.problem_id === problemId);

      const newNote: Note = {
        user_id: userId,
        problem_id: problemId,
        note: noteText,
        updated_at: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        db.notes[existingIdx] = newNote;
      } else {
        db.notes.push(newNote);
      }

      writeLocalDb(db);
      return newNote;
    }
  },

  async toggleBookmark(userId: string, problemId: string): Promise<{ bookmarked: boolean }> {
    if (isSupabaseEnabled && supabase) {
      // Check if it exists
      const { data: existing } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", userId)
        .eq("problem_id", problemId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("bookmarks")
          .delete()
          .eq("user_id", userId)
          .eq("problem_id", problemId);
        if (error) throw error;
        return { bookmarked: false };
      } else {
        const { error } = await supabase
          .from("bookmarks")
          .insert({ user_id: userId, problem_id: problemId });
        if (error) throw error;
        return { bookmarked: true };
      }
    } else {
      const db = readLocalDb();
      const existingIdx = db.bookmarks.findIndex(b => b.user_id === userId && b.problem_id === problemId);

      if (existingIdx >= 0) {
        db.bookmarks.splice(existingIdx, 1);
        writeLocalDb(db);
        return { bookmarked: false };
      } else {
        db.bookmarks.push({ user_id: userId, problem_id: problemId });
        writeLocalDb(db);
        return { bookmarked: true };
      }
    }
  },

  async updateRevision(userId: string, problemId: string, status: Revision["status"]): Promise<Revision> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase
        .from("revision")
        .upsert({ user_id: userId, problem_id: problemId, status })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const db = readLocalDb();
      const existingIdx = db.revision.findIndex(r => r.user_id === userId && r.problem_id === problemId);

      const newRevision: Revision = {
        user_id: userId,
        problem_id: problemId,
        status
      };

      if (existingIdx >= 0) {
        db.revision[existingIdx] = newRevision;
      } else {
        db.revision.push(newRevision);
      }

      writeLocalDb(db);
      return newRevision;
    }
  },

  async updateUserSettings(users: User[]): Promise<User[]> {
    if (isSupabaseEnabled && supabase) {
      const { data, error } = await supabase
        .from("users")
        .upsert(users)
        .select();
      if (error) throw error;
      return data;
    } else {
      const db = readLocalDb();
      db.users = users;
      writeLocalDb(db);
      return users;
    }
  }
};
