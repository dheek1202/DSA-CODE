"use client";

import React from "react";
import { useTracker } from "@/app/providers";
import { CheckCircle2, Flame, Calendar } from "lucide-react";

export default function StatsGrid() {
  const { dbData, activeUserId, activeUser } = useTracker();

  if (!dbData) return null;

  const totalProblems = dbData.problems.length;
  
  // Solved counts
  const userSolved = dbData.completion.filter(
    c => c.user_id === activeUserId && c.completed
  ).length;
  
  const pct = totalProblems > 0 ? Math.round((userSolved / totalProblems) * 100) : 0;
  const remaining = totalProblems - userSolved;

  // Streak Calculation
  const calculateStreak = () => {
    const userCompletions = dbData.completion
      .filter(c => c.user_id === activeUserId && c.completed && c.completed_at)
      .map(c => new Date(c.completed_at!).toDateString());

    const uniqueDates = Array.from(new Set(userCompletions)).map(d => new Date(d));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime()); // descending (newest first)

    if (uniqueDates.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // If no solve today or yesterday, streak is 0
    const latestSolve = uniqueDates[0];
    latestSolve.setHours(0, 0, 0, 0);

    if (latestSolve.getTime() !== today.getTime() && latestSolve.getTime() !== yesterday.getTime()) {
      return 0;
    }

    let streak = 1;
    let current = latestSolve;

    for (let i = 1; i < uniqueDates.length; i++) {
      const next = uniqueDates[i];
      next.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(current.getTime() - next.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
        current = next;
      } else if (diffDays > 1) {
        break; // streak broken
      }
    }

    return streak;
  };

  const streak = calculateStreak();

  // Estimated days remaining
  // Velocity = total solved / unique days since first solve (min 1 day, default speed 3 problems/day if velocity is low)
  const calculateEstimatedRemaining = () => {
    const userCompletions = dbData.completion
      .filter(c => c.user_id === activeUserId && c.completed && c.completed_at)
      .map(c => new Date(c.completed_at!).getTime());

    if (userCompletions.length === 0) return "N/A";

    const firstSolve = Math.min(...userCompletions);
    const lastSolve = Math.max(...userCompletions);
    
    const diffMs = lastSolve - firstSolve;
    const diffDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

    // velocity in problems per day
    const velocity = userSolved / diffDays;
    
    // Fallback to 2 problems per day if velocity is very slow
    const activeVelocity = velocity > 0.2 ? velocity : 2;
    const daysLeft = Math.ceil(remaining / activeVelocity);

    if (daysLeft === 0) return "Completed!";
    return `${daysLeft} days`;
  };

  const estRemaining = calculateEstimatedRemaining();

  // SVG Progress Ring params
  const circleRadius = 30;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (pct / 100) * circleCircumference;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {/* Percentage Circular Ring Card */}
      <div className="flex items-center gap-5 rounded-none border-2 border-border bg-card p-6 transition-all duration-200 hover:bg-main/30">
        <div className="relative flex h-16 w-16 items-center justify-center shrink-0">
          <svg className="h-full w-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="32"
              cy="32"
              r={circleRadius}
              className="stroke-remaining fill-none opacity-40 dark:opacity-20"
              strokeWidth="5"
            />
            {/* Completed progress ring */}
            <circle
              cx="32"
              cy="32"
              r={circleRadius}
              className="stroke-brand fill-none transition-all duration-500 ease-out"
              strokeWidth="5"
              strokeDasharray={circleCircumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute text-xs font-bold text-txt-main">{pct}%</span>
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Overall Progress</span>
          <p className="text-lg font-bold text-txt-main truncate mt-0.5">{activeUser?.name || "User"}</p>
          <p className="text-xs text-txt-muted/80 mt-0.5">{pct}% solved</p>
        </div>
      </div>

      {/* Solved vs Remaining */}
      <div className="flex items-center gap-5 rounded-none border-2 border-border bg-card p-6 transition-all duration-200 hover:bg-main/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-main text-completed shrink-0 border-2 border-border">
          <CheckCircle2 className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Solved vs Remaining</span>
          <p className="text-2xl font-extrabold text-txt-main tracking-tight mt-0.5">
            {userSolved} <span className="text-sm font-normal text-txt-muted">/ {totalProblems}</span>
          </p>
          <p className="text-xs text-txt-muted/80 mt-0.5">{remaining} remaining</p>
        </div>
      </div>

      {/* Daily Streak */}
      <div className="flex items-center gap-5 rounded-none border-2 border-border bg-card p-6 transition-all duration-200 hover:bg-main/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-main text-progress shrink-0 border-2 border-border">
          <Flame className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Current Streak</span>
          <p className="text-2xl font-extrabold text-txt-main tracking-tight mt-0.5">
            {streak} <span className="text-sm font-normal text-txt-muted">days</span>
          </p>
          <p className="text-xs text-txt-muted/80 mt-0.5">Daily solve streak</p>
        </div>
      </div>

      {/* Estimated Remaining */}
      <div className="flex items-center gap-5 rounded-none border-2 border-border bg-card p-6 transition-all duration-200 hover:bg-main/30">
        <div className="flex h-12 w-12 items-center justify-center rounded-none bg-main text-brand shrink-0 border-2 border-border">
          <Calendar className="h-5.5 w-5.5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Est. Completion</span>
          <p className="text-2xl font-extrabold text-txt-main tracking-tight mt-0.5">{estRemaining}</p>
          <p className="text-xs text-txt-muted/80 mt-0.5">Based on solve rate</p>
        </div>
      </div>
    </div>
  );
}
