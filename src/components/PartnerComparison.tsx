"use client";

import React from "react";
import { useTracker } from "@/app/providers";
import { Users } from "lucide-react";

export default function PartnerComparison() {
  const { dbData } = useTracker();

  if (!dbData) return null;

  const totalProblems = dbData.problems.length;
  const user1 = dbData.users[0];
  const user2 = dbData.users[1];

  if (!user1 || !user2) return null;

  // Solved counts
  const user1SolvedList = dbData.completion.filter(c => c.user_id === user1.id && c.completed);
  const user2SolvedList = dbData.completion.filter(c => c.user_id === user2.id && c.completed);
  
  const user1SolvedCount = user1SolvedList.length;
  const user2SolvedCount = user2SolvedList.length;

  const user1Pct = totalProblems > 0 ? Math.round((user1SolvedCount / totalProblems) * 100) : 0;
  const user2Pct = totalProblems > 0 ? Math.round((user2SolvedCount / totalProblems) * 100) : 0;

  // Today's solved
  const isToday = (dateStr: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const user1SolvedToday = user1SolvedList.filter(c => isToday(c.completed_at)).length;
  const user2SolvedToday = user2SolvedList.filter(c => isToday(c.completed_at)).length;

  // Weekly solved
  const isThisWeek = (dateStr: string | null) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return date.getTime() >= oneWeekAgo.getTime();
  };

  const user1SolvedWeek = user1SolvedList.filter(c => isThisWeek(c.completed_at)).length;
  const user2SolvedWeek = user2SolvedList.filter(c => isThisWeek(c.completed_at)).length;

  // Difference explanation
  const diff = Math.abs(user1SolvedCount - user2SolvedCount);
  let diffMessage = "";
  if (user1SolvedCount > user2SolvedCount) {
    diffMessage = `${user1.name} is ${diff} problem${diff !== 1 ? "s" : ""} ahead of ${user2.name}`;
  } else if (user2SolvedCount > user1SolvedCount) {
    diffMessage = `${user2.name} is ${diff} problem${diff !== 1 ? "s" : ""} ahead of ${user1.name}`;
  } else {
    diffMessage = "You are currently neck and neck!";
  }

  return (
    <div className="rounded-none border-2 border-border bg-card p-6 shadow-none transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b-2 border-border pb-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-txt-main flex items-center gap-2 font-mono">
          <Users className="h-4 w-4 text-brand" /> Partner Progress
        </h3>
        <span className="text-[10px] font-extrabold text-brand bg-brand/5 dark:bg-brand/10 border-2 border-brand px-2.5 py-0.5 rounded-none uppercase tracking-wider self-start sm:self-auto">
          {diffMessage}
        </span>
      </div>

      <div className="space-y-6">
        {/* User 1 Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-none text-[9px] font-extrabold text-brand bg-brand/5 border-2 border-brand uppercase">
                {user1.avatar}
              </span>
              <span className="font-bold text-txt-main">{user1.name}</span>
            </div>
            <div className="text-txt-muted/80">
              <span className="font-bold text-txt-main">{user1SolvedCount}</span> / {totalProblems} ({user1Pct}%)
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-remaining border border-border rounded-none overflow-hidden">
            <div 
              className="h-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${user1Pct}%` }}
            />
          </div>
        </div>

        {/* User 2 Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-none text-[9px] font-extrabold text-completed bg-completed/5 border-2 border-completed uppercase">
                {user2.avatar}
              </span>
              <span className="font-bold text-txt-main">{user2.name}</span>
            </div>
            <div className="text-txt-muted/80">
              <span className="font-bold text-txt-main">{user2SolvedCount}</span> / {totalProblems} ({user2Pct}%)
            </div>
          </div>
          {/* Progress Bar */}
          <div className="h-2 w-full bg-remaining border border-border rounded-none overflow-hidden">
            <div 
              className="h-full bg-completed transition-all duration-500 ease-out"
              style={{ width: `${user2Pct}%` }}
            />
          </div>
        </div>

        {/* Stat comparison grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border text-center">
          <div className="rounded-none bg-main border-2 border-border p-3">
            <span className="text-[10px] text-txt-muted/80 font-bold uppercase tracking-wider block">Solved Today</span>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div>
                <span className="text-[10px] font-semibold text-txt-muted block truncate max-w-[50px]">{user1.name}</span>
                <span className="text-sm font-bold text-txt-main">{user1SolvedToday}</span>
              </div>
              <div className="h-6 w-px bg-border/80" />
              <div>
                <span className="text-[10px] font-semibold text-txt-muted block truncate max-w-[50px]">{user2.name}</span>
                <span className="text-sm font-bold text-txt-main">{user2SolvedToday}</span>
              </div>
            </div>
          </div>

          <div className="rounded-none bg-main border-2 border-border p-3">
            <span className="text-[10px] text-txt-muted/80 font-bold uppercase tracking-wider block">Solved This Week</span>
            <div className="flex items-center justify-center gap-4 mt-2">
              <div>
                <span className="text-[10px] font-semibold text-txt-muted block truncate max-w-[50px]">{user1.name}</span>
                <span className="text-sm font-bold text-txt-main">{user1SolvedWeek}</span>
              </div>
              <div className="h-6 w-px bg-border/80" />
              <div>
                <span className="text-[10px] font-semibold text-txt-muted block truncate max-w-[50px]">{user2.name}</span>
                <span className="text-sm font-bold text-txt-main">{user2SolvedWeek}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
