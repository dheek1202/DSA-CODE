"use client";

import React from "react";
import { useTracker } from "@/app/providers";
import { BarChart3, Bookmark } from "lucide-react";

export default function StatsView() {
  const { dbData, activeUserId, activeUser } = useTracker();

  if (!dbData) return null;

  // Active user completions
  const activeCompletions = dbData.completion.filter(c => c.user_id === activeUserId && c.completed);

  // Difficulty breakdown
  const difficulties = ["Easy", "Medium", "Hard"];
  
  const getDifficultyStats = (userId: string) => {
    return difficulties.map(diff => {
      const total = dbData.problems.filter(p => p.difficulty === diff).length;
      const solved = dbData.problems.filter(p => {
        if (p.difficulty !== diff) return false;
        return dbData.completion.some(c => c.user_id === userId && c.problem_id === p.id && c.completed);
      }).length;
      return {
        name: diff,
        solved,
        total,
        pct: total > 0 ? Math.round((solved / total) * 100) : 0
      };
    });
  };

  const activeDiffStats = getDifficultyStats(activeUserId);
  // Revision Stats
  const getRevisionStats = () => {
    const statuses = ["needs_revision", "revised_once", "mastered"];
    return statuses.map(status => {
      const count = dbData.revision.filter(r => r.user_id === activeUserId && r.status === status).length;
      let label = "";
      let color = "";
      if (status === "needs_revision") {
        label = "Needs Revision";
        color = "text-red-600 bg-red-50 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50";
      } else if (status === "revised_once") {
        label = "Revised Once";
        color = "text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
      } else if (status === "mastered") {
        label = "Mastered";
        color = "text-green-600 bg-green-50 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50";
      }
      return { label, count, color };
    });
  };
  const revisionStats = getRevisionStats();
  const bookmarkedCount = dbData.bookmarks.filter(b => b.user_id === activeUserId).length;

  // Heatmap generation
  // We'll show the last 20 weeks (140 days)
  const generateHeatmapDays = () => {
    const days: { date: Date; dateString: string; count: number }[] = [];
    const today = new Date();
    
    // We want to align the start to the Sunday of 20 weeks ago
    const totalDays = 20 * 7;
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - totalDays + 1);

    // Create maps of date strings to solve counts
    const solveMap = new Map<string, number>();
    activeCompletions.forEach(c => {
      if (c.completed_at) {
        const dateStr = new Date(c.completed_at).toDateString();
        solveMap.set(dateStr, (solveMap.get(dateStr) || 0) + 1);
      }
    });

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toDateString();
      days.push({
        date,
        dateString: dateStr,
        count: solveMap.get(dateStr) || 0
      });
    }

    return days;
  };

  const heatmapDays = generateHeatmapDays();

  // Heatmap styling colors
  const getHeatmapColorClass = (count: number) => {
    if (count === 0) return "bg-remaining dark:bg-slate-800";
    if (count === 1) return "bg-green-100 dark:bg-green-950 text-green-700";
    if (count === 2) return "bg-green-200 dark:bg-green-900/60 text-green-800";
    if (count === 3) return "bg-green-400 dark:bg-green-700/80 text-green-900";
    return "bg-green-600 dark:bg-green-600 text-white"; // 4+ solves
  };

  // Weekly counts for last 8 weeks
  const generateWeeklyStats = () => {
    const weeks: { weekNum: number; count: number; dateRange: string }[] = [];
    const today = new Date();

    // Map solve times
    const solveTimes = activeCompletions.map(c => new Date(c.completed_at!).getTime());

    for (let i = 7; i >= 0; i--) {
      const start = new Date(today);
      start.setDate(today.getDate() - (i + 1) * 7 + 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(today);
      end.setDate(today.getDate() - i * 7);
      end.setHours(23, 59, 59, 999);

      const count = solveTimes.filter(t => t >= start.getTime() && t <= end.getTime()).length;
      
      const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      weeks.push({
        weekNum: 8 - i,
        count,
        dateRange: `${startStr} - ${endStr}`
      });
    }

    return weeks;
  };

  const weeklyStats = generateWeeklyStats();
  const maxWeeklyCount = Math.max(1, ...weeklyStats.map(w => w.count));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <h3 className="text-base font-semibold text-txt-main flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand" /> Study Analytics ({activeUser?.name})
        </h3>
      </div>

      {/* Grid containing heatmap and stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Heatmap Column */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_6px_12px_-4px_rgba(0,0,0,0.02)] dark:shadow-none space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Activity Map</span>
            <p className="text-xs text-txt-muted/80 mt-0.5">Solve frequency over the last 20 weeks</p>
          </div>

          {/* GitHub Grid */}
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[420px]">
              <div 
                className="grid grid-flow-col gap-1.5 justify-start"
                style={{ gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
              >
                {heatmapDays.map((day, idx) => (
                  <div
                    key={idx}
                    className={`h-3 w-3 rounded-sm transition-all hover:scale-125 cursor-help ${getHeatmapColorClass(day.count)}`}
                    title={`${day.count} problem${day.count !== 1 ? "s" : ""} solved on ${day.date.toLocaleDateString()}`}
                  />
                ))}
              </div>
              
              {/* Grid Label Helpers */}
              <div className="flex items-center justify-between text-[10px] text-txt-muted mt-3 px-1">
                <span>20 weeks ago</span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="h-2.5 w-2.5 rounded-sm bg-remaining dark:bg-slate-800" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-green-100 dark:bg-green-950" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-green-200 dark:bg-green-900/60" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-green-400 dark:bg-green-700/80" />
                  <div className="h-2.5 w-2.5 rounded-sm bg-green-600" />
                  <span>More</span>
                </div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Numbers / Details */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_6px_12px_-4px_rgba(0,0,0,0.02)] dark:shadow-none space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Revision & Bookmarks</span>
            <p className="text-xs text-txt-muted/80 mt-0.5">Bookmarks and question revision counts</p>
          </div>

          <div className="space-y-3">
            {/* Revision Items */}
            {revisionStats.map((stat, idx) => (
              <div 
                key={idx}
                className={`flex items-center justify-between border rounded-lg p-2.5 ${stat.color}`}
              >
                <span className="text-xs font-semibold">{stat.label}</span>
                <span className="text-sm font-bold">{stat.count}</span>
              </div>
            ))}

            {/* Bookmarks */}
            <div className="flex items-center justify-between border border-border bg-main/30 rounded-lg p-2.5">
              <span className="text-xs font-semibold text-txt-muted flex items-center gap-1.5">
                <Bookmark className="h-4 w-4 text-amber-500 fill-amber-500" /> Bookmarked Problems
              </span>
              <span className="text-sm font-bold text-txt-main">{bookmarkedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Difficulty and Weekly Graphs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Difficulty Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_6px_12px_-4px_rgba(0,0,0,0.02)] dark:shadow-none space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Difficulty Breakdown</span>
            <p className="text-xs text-txt-muted/80 mt-0.5">Solve rates partitioned by difficulty level</p>
          </div>

          <div className="space-y-4">
            {activeDiffStats.map(stat => (
              <div key={stat.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-txt-main flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      stat.name === "Easy" ? "bg-completed" :
                      stat.name === "Medium" ? "bg-progress" : "bg-red-500"
                    }`} />
                    {stat.name}
                  </span>
                  <span className="text-txt-muted/80">
                    <span className="font-bold text-txt-main">{stat.solved}</span> / {stat.total} ({stat.pct}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-remaining rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      stat.name === "Easy" ? "bg-completed" :
                      stat.name === "Medium" ? "bg-progress" : "bg-red-500"
                    }`}
                    style={{ width: `${stat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Solved Chart */}
        <div className="rounded-none border-2 border-border bg-card p-6 shadow-none space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-txt-muted">Weekly Solve Volume</span>
            <p className="text-xs text-txt-muted/80 mt-0.5 font-mono">DSA solved count per week (last 8 weeks)</p>
          </div>

          {/* Simple CSS Bar Graph */}
          <div className="flex h-48 items-end gap-3 justify-between pt-4 border-b-2 border-border">
            {weeklyStats.map(week => {
              const hPct = Math.round((week.count / maxWeeklyCount) * 100);
              return (
                <div key={week.weekNum} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                  {/* Tooltip */}
                  <span className="absolute -top-6 scale-0 rounded-none border-2 border-border bg-card text-txt-main text-[10px] px-1.5 py-0.5 group-hover:scale-100 transition-all font-bold font-mono z-10 shadow-none">
                    {week.count} solves
                  </span>
                  
                  {/* Bar */}
                  <div 
                    className="w-full bg-brand rounded-none hover:bg-brand/90 transition-all duration-300 border-t-2 border-x-2 border-border"
                    style={{ height: `${Math.max(4, hPct)}%` }}
                  />

                  {/* X-axis labels */}
                  <span className="text-[9px] text-txt-muted text-center mt-2 font-bold font-mono truncate max-w-full">
                    W{week.weekNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
