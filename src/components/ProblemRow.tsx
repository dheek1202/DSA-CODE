"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTracker } from "@/app/providers";
import { ExternalLink, Bookmark, FileText, Check, Loader2, Users } from "lucide-react";
import { Problem } from "@/lib/db";

interface ProblemRowProps {
  problem: Problem;
}

export default function ProblemRow({ problem }: ProblemRowProps) {
  const {
    activeUserId,
    partnerUser,
    activeUser,
    dbData,
    mutateCompletion,
    mutateNote,
    mutateBookmark,
    mutateRevision
  } = useTracker();

  const [expanded, setExpanded] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const noteDebounceRef = useRef<NodeJS.Timeout | null>(null);


  // Retrieve user completion states for specific users (user 1 is index 0, user 2 is index 1)
  const user1 = dbData!.users[0];
  const user2 = dbData!.users[1];

  const user1Completion = user1
    ? dbData!.completion.find(c => c.user_id === user1.id && c.problem_id === problem.id)
    : undefined;
  const user2Completion = user2
    ? dbData!.completion.find(c => c.user_id === user2.id && c.problem_id === problem.id)
    : undefined;

  const isUser1Completed = !!user1Completion?.completed;
  const isUser2Completed = !!user2Completion?.completed;

  // Retrieve bookmark states
  const activeUserBookmark = dbData!.bookmarks.some(
    b => b.user_id === activeUserId && b.problem_id === problem.id
  );

  // Retrieve revision states
  const activeUserRevision = dbData!.revision.find(
    r => r.user_id === activeUserId && r.problem_id === problem.id
  );
  const activeRevisionStatus = activeUserRevision?.status || "none";

  // Retrieve note states
  const activeUserNote = dbData!.notes.find(
    n => n.user_id === activeUserId && n.problem_id === problem.id
  );
  const partnerUserNote = dbData!.notes.find(
    n => n.user_id !== activeUserId && n.problem_id === problem.id
  );

  // Load note text when expanded or when activeUserNote changes
  useEffect(() => {
    if (activeUserNote) {
      setNoteText(activeUserNote.note);
    } else {
      setNoteText("");
    }
  }, [activeUserNote]);

  // Autosave Notes helper
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);
    setSavingNote(true);

    if (noteDebounceRef.current) {
      clearTimeout(noteDebounceRef.current);
    }

    noteDebounceRef.current = setTimeout(() => {
      mutateNote.mutate(
        { userId: activeUserId, problemId: problem.id, note: text },
        {
          onSuccess: () => {
            setSavingNote(false);
          },
          onError: () => {
            setSavingNote(false);
            alert("Failed to autosave note");
          }
        }
      );
    }, 1000); // 1s debounce
  };

  const handleCheckboxToggle = (userId: string, currentVal: boolean) => {
    mutateCompletion.mutate({
      userId,
      problemId: problem.id,
      completed: !currentVal,
    });
  };

  const handleBookmarkToggle = () => {
    mutateBookmark.mutate({
      userId: activeUserId,
      problemId: problem.id,
    });
  };

  const handleRevisionChange = (status: string) => {
    mutateRevision.mutate({
      userId: activeUserId,
      problemId: problem.id,
      status,
    });
  };

  return (
    <div 
      className={`border-b-2 border-border bg-card transition-colors duration-200 ${
        expanded ? "bg-main/10" : "hover:bg-main/5"
      }`}
    >
      {/* Problem Main Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 px-4.5 text-sm">
        {/* Left Side: Checkboxes, Number, Name */}
        <div className="flex items-center gap-4 min-w-0">
          {/* User 1 Checkbox (Interactive only if profile is User 1) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {user1 && activeUserId === user1.id ? (
              <button
                onClick={() => handleCheckboxToggle(user1.id, isUser1Completed)}
                className={`flex h-5 w-5 items-center justify-center rounded-none border-2 transition-all duration-150 active:scale-90 focus:outline-none ${
                  isUser1Completed
                    ? "bg-brand border-brand text-white shadow-sm"
                    : "border-border bg-card hover:border-brand"
                }`}
                title={`Mark completed for ${user1?.name || "Me"}`}
              >
                {isUser1Completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
              </button>
            ) : (
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-none border-2 cursor-not-allowed opacity-75 ${
                  isUser1Completed
                    ? "bg-slate-400 dark:bg-slate-600 border-slate-400 dark:border-slate-600 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-card/40"
                }`}
                title={`${user1?.name || "Me"}'s progress (Read-only from this profile)`}
              >
                {isUser1Completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
              </div>
            )}
            <span className="text-xs font-bold text-txt-muted/80 sm:hidden" title={user1?.name || "Me"}>
              {user1?.name || "Me"}
            </span>
          </div>

          {/* User 2 Checkbox (Interactive only if profile is User 2) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {user2 && activeUserId === user2.id ? (
              <button
                onClick={() => handleCheckboxToggle(user2.id, isUser2Completed)}
                className={`flex h-5 w-5 items-center justify-center rounded-none border-2 transition-all duration-150 active:scale-90 focus:outline-none ${
                  isUser2Completed
                    ? "bg-brand border-brand text-white shadow-sm"
                    : "border-border bg-card hover:border-brand"
                }`}
                title={`Mark completed for ${user2?.name || "Partner"}`}
              >
                {isUser2Completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
              </button>
            ) : (
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-none border-2 cursor-not-allowed opacity-75 ${
                  isUser2Completed
                    ? "bg-slate-400 dark:bg-slate-600 border-slate-400 dark:border-slate-600 text-white"
                    : "border-slate-300 dark:border-slate-700 bg-card/40"
                }`}
                title={`${user2?.name || "Partner"}'s progress (Read-only from this profile)`}
              >
                {isUser2Completed && <Check className="h-3.5 w-3.5 stroke-[3px]" />}
              </div>
            )}
            <span className="text-xs font-bold text-txt-muted/80 sm:hidden" title={user2?.name || "Partner"}>
              {user2?.name || "Partner"}
            </span>
          </div>

          {/* Number & Name */}
          <div className="flex items-center gap-2.5 truncate">
            <span className="text-[10px] font-bold font-mono text-txt-muted/80 bg-main/85 px-1.5 py-0.5 rounded-none border-2 border-border shrink-0">
              #{problem.leetcode_number}
            </span>
            <span className="font-extrabold text-txt-main truncate text-[13px] tracking-tight transition-colors cursor-default" title={problem.name}>
              {problem.name}
            </span>
          </div>

          {/* Special Data Quality Badges */}
          {problem.is_stray && (
            <span className="rounded-none bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] px-1.5 py-0.5 font-bold border-2 border-red-500 shrink-0">
              Stray 1
            </span>
          )}
          {problem.is_truncated && (
            <span className="rounded-none bg-red-500/10 text-red-600 dark:text-red-400 text-[9px] px-1.5 py-0.5 font-bold border-2 border-red-500 shrink-0">
              Truncated
            </span>
          )}
        </div>

        {/* Right Side: Difficulty, Controls, Notes/Bookmark */}
        <div className="flex items-center gap-3 self-end sm:self-auto text-xs shrink-0">
          {/* Difficulty Dot Indicator */}
          <span className="flex items-center gap-1.5 font-bold font-mono text-[9px] text-txt-muted/80 uppercase tracking-wider bg-main/50 px-2.5 py-1 rounded-none border-2 border-border shrink-0">
            <span className={`h-1.5 w-1.5 rounded-none shrink-0 ${
              problem.difficulty.toLowerCase() === "easy" ? "bg-completed" :
              problem.difficulty.toLowerCase() === "medium" ? "bg-progress" : "bg-red-500"
            }`} />
            {problem.difficulty}
          </span>

          {/* Revision Dropdown */}
          <select
            value={activeRevisionStatus}
            onChange={(e) => handleRevisionChange(e.target.value)}
            className={`rounded-none border-2 border-border bg-card text-xs font-bold px-2.5 py-1 text-txt-main focus:border-brand focus:outline-none transition cursor-pointer ${
              activeRevisionStatus !== "none" ? "border-brand bg-brand/5 text-brand" : "text-txt-muted hover:text-txt-main"
            }`}
          >
            <option value="none">No Revision Tag</option>
            <option value="needs_revision">Needs Revision</option>
            <option value="revised_once">Revised Once</option>
            <option value="mastered">Mastered</option>
          </select>

          {/* Actions group */}
          <div className="flex items-center gap-1 border-l-2 border-border pl-3">
            {/* Open on Leetcode */}
            <a
              href={`https://leetcode.com/problems/${problem.leetcode_slug}/`}
              target="_blank"
              rel="noreferrer"
              className="rounded-none p-1.5 text-txt-muted hover:bg-main hover:text-txt-main transition border-2 border-transparent hover:border-border"
              title="Open on LeetCode"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            {/* Note Toggle */}
            <button
              onClick={() => setExpanded(!expanded)}
              className={`rounded-none p-1.5 border-2 transition ${
                expanded || activeUserNote?.note
                  ? "border-brand bg-brand/5 text-brand"
                  : "border-transparent text-txt-muted hover:bg-main hover:text-txt-main hover:border-border"
              }`}
              title="Problem Notes"
            >
              <FileText className="h-3.5 w-3.5" />
            </button>

            {/* Bookmark Toggle */}
            <button
              onClick={handleBookmarkToggle}
              className={`rounded-none p-1.5 border-2 transition ${
                activeUserBookmark
                  ? "border-amber-500 bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:border-amber-900/50"
                  : "border-transparent text-txt-muted hover:bg-main hover:text-txt-main hover:border-border"
              }`}
              title="Bookmark Problem"
            >
              <Bookmark className={`h-3.5 w-3.5 ${activeUserBookmark ? "fill-amber-500" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Notes Section (Markdown Editor & Partner's note) */}
      {expanded && (
        <div className="border-t-2 border-border px-4 py-3 bg-main/5 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-150 rounded-none">
          {/* Active User's Note Editor */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-txt-main flex items-center gap-1.5 font-mono uppercase tracking-wider">
                <FileText className="h-3.5 w-3.5 text-brand" /> My Notes ({activeUser?.name})
              </span>
              {savingNote ? (
                <span className="text-[10px] text-txt-muted flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin text-brand" /> Saving...
                </span>
              ) : (
                <span className="text-[10px] text-green-600 dark:text-green-400 font-bold font-mono uppercase">Autosaved</span>
              )}
            </div>
            <textarea
              value={noteText}
              onChange={handleNoteChange}
              placeholder="Write your study notes / code logic here... (Auto-saves instantly)"
              className="w-full h-32 rounded-none border-2 border-border bg-card p-3 text-xs text-txt-main placeholder-txt-muted focus:border-brand focus:outline-none font-mono"
            />
          </div>

          {/* Partner's Note display */}
          <div className="space-y-1.5">
            <div className="flex items-center text-xs font-bold text-txt-main gap-1.5 font-mono uppercase tracking-wider">
              <Users className="h-3.5 w-3.5 text-completed" /> {partnerUser?.name}{"'s Notes"}
            </div>
            <div className="w-full h-32 rounded-none border-2 border-border bg-card/60 p-3 text-xs text-txt-muted overflow-auto font-mono">
              {partnerUserNote?.note ? (
                <div className="whitespace-pre-wrap break-words">{partnerUserNote.note}</div>
              ) : (
                <span className="italic text-txt-muted/60">No notes written by {partnerUser?.name} yet.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
