"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTracker } from "@/app/providers";
import ProblemRow from "./ProblemRow";
import { ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { Problem } from "@/lib/db";
import confetti from "canvas-confetti";

interface PatternViewProps {
  pattern: {
    number: number;
    name: string;
    problems: Problem[];
  };
  search: string;
  selectedDifficulty: string;
  selectedRevision: string;
  showBookmarkedOnly: boolean;
  showCompletionFilter: string;
}

export default function PatternView({
  pattern,
  search,
  selectedDifficulty,
  selectedRevision,
  showBookmarkedOnly,
  showCompletionFilter,
}: PatternViewProps) {
  const { dbData, activeUserId } = useTracker();
  const [isExpanded, setIsExpanded] = useState(false);
  const prevCompletedCountRef = useRef<number | null>(null);

  // Filter problems in this pattern based on the dashboard filters
  const filteredProblems = pattern.problems.filter(p => {
    // 1. Search text
    if (search) {
      const q = search.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchNum = p.leetcode_number.toString().includes(q);
      const matchPat = p.pattern_name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      if (!matchName && !matchNum && !matchPat && !matchCat) return false;
    }

    // 2. Difficulty
    if (selectedDifficulty !== "all" && p.difficulty !== selectedDifficulty) {
      return false;
    }

    // 3. Bookmarks
    if (showBookmarkedOnly) {
      const isBookmarked = dbData!.bookmarks.some(
        b => b.user_id === activeUserId && b.problem_id === p.id
      );
      if (!isBookmarked) return false;
    }

    // 4. Revision Status
    if (selectedRevision !== "all") {
      const rev = dbData!.revision.find(
        r => r.user_id === activeUserId && r.problem_id === p.id
      );
      if (selectedRevision === "none" && rev && rev.status !== "none") return false;
      if (selectedRevision !== "none" && (!rev || rev.status !== selectedRevision)) return false;
    }

    // 5. Completion Filter
    if (showCompletionFilter !== "all") {
      const activeComp = dbData!.completion.find(
        c => c.user_id === activeUserId && c.problem_id === p.id
      );
      const partnerComp = dbData!.completion.find(
        c => c.user_id !== activeUserId && c.problem_id === p.id
      );

      if (showCompletionFilter === "completed" && (!activeComp || !activeComp.completed)) return false;
      if (showCompletionFilter === "incomplete" && activeComp && activeComp.completed) return false;
      
      if (showCompletionFilter === "partnerCompleted" && (!partnerComp || !partnerComp.completed)) return false;
      if (showCompletionFilter === "partnerIncomplete" && partnerComp && partnerComp.completed) return false;
    }

    return true;
  });

  // Calculate completion count for active user (on ALL problems in this pattern, regardless of filter)
  const patternProblemsList = pattern.problems;
  const completedCount = patternProblemsList.filter(p => {
    const comp = dbData!.completion.find(
      c => c.user_id === activeUserId && c.problem_id === p.id
    );
    return !!comp?.completed;
  }).length;

  const totalCount = patternProblemsList.length;
  const isCompleted100 = totalCount > 0 && completedCount === totalCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Trigger Confetti ONLY when a pattern hits 100% completion in response to user toggle
  useEffect(() => {
    if (prevCompletedCountRef.current !== null) {
      const prevCompleted = prevCompletedCountRef.current;
      if (prevCompleted < totalCount && completedCount === totalCount) {
        // Trigger confetti!
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#2563EB", "#16A34A", "#F59E0B"]
        });
      }
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, totalCount]);

  // Expand automatically if searching and there are matching problems
  useEffect(() => {
    if (search && filteredProblems.length > 0) {
      setIsExpanded(true);
    }
  }, [search, filteredProblems.length]);

  // If there are filters active and no problems match, hide the pattern entirely
  const hasActiveFilters = search || selectedDifficulty !== "all" || selectedRevision !== "all" || showBookmarkedOnly || showCompletionFilter !== "all";
  if (hasActiveFilters && filteredProblems.length === 0) {
    return null;
  }

  return (
    <div className="rounded-none border-2 border-border bg-card shadow-none transition-all duration-200">
      {/* Header section of Pattern */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-4.5 text-left hover:bg-main/10 transition focus:outline-none"
      >
        <div className="flex items-center gap-3.5 min-w-0 mr-4">
          <span className="px-2 py-0.5 bg-main border-2 border-border rounded-none text-[9px] font-extrabold text-txt-muted uppercase tracking-wider font-mono shrink-0">
            P{pattern.number}
          </span>
          <span className="font-extrabold text-txt-main truncate text-sm transition-colors">
            {pattern.name}
          </span>
          {isCompleted100 && (
            <CheckCircle className="h-4 w-4 text-completed shrink-0" />
          )}
        </div>

        {/* Progress Bar & Solved ratio */}
        <div className="flex items-center gap-4 shrink-0 text-xs text-txt-muted">
          <div className="hidden sm:flex items-center gap-3">
            <span className="font-semibold text-txt-main text-xs font-mono">
              {completedCount} <span className="font-normal text-txt-muted/80">/ {totalCount}</span>
            </span>
            <div className="h-2.5 w-24 bg-remaining border border-border rounded-none overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  isCompleted100 ? "bg-completed" : "bg-brand"
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
          <span className="sm:hidden font-bold text-txt-main font-mono">
            {completedCount}/{totalCount}
          </span>
          
          {isExpanded ? (
            <ChevronDown className="h-4.5 w-4.5 text-txt-muted" />
          ) : (
            <ChevronRight className="h-4.5 w-4.5 text-txt-muted" />
          )}
        </div>
      </button>

      {/* Expanded Problem list */}
      {isExpanded && (
        <div className="border-t-2 border-border divide-y-2 divide-border bg-card">
          {filteredProblems.map(problem => (
            <ProblemRow key={problem.id} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
