"use client";

import React, { useState } from "react";
import { useTracker } from "@/app/providers";
import Navbar from "@/components/Navbar";
import StatsGrid from "@/components/StatsGrid";
import PartnerComparison from "@/components/PartnerComparison";
import FiltersBar from "@/components/FiltersBar";
import PatternView from "@/components/PatternView";
import StatsView from "@/components/StatsView";
import AdminReview from "@/components/AdminReview";
import CommandPalette from "@/components/CommandPalette";
import { BookOpen, BarChart3, AlertTriangle, Loader2, Sparkles } from "lucide-react";
import { Problem } from "@/lib/db";

export default function Home() {
  const { dbData, isLoading, isError, refetchDb, activeUserId } = useTracker();
  const [activeTab, setActiveTab] = useState<"sheet" | "analytics" | "admin">("sheet");

  // Dashboard Filters State
  const [search, setSearch] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedRevision, setSelectedRevision] = useState("all");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showCompletionFilter, setShowCompletionFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-main text-txt-muted">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
        <span className="text-sm font-medium">Loading tracker data...</span>
      </div>
    );
  }

  if (isError || !dbData) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-main text-txt-main px-4 text-center">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-bold">Failed to load database</h3>
        <p className="text-sm text-txt-muted max-w-sm">
          Could not read data files. Check if you run the seeding script using <code className="bg-remaining px-1.5 py-0.5 rounded font-mono">npm run seed</code> first.
        </p>
        <button
          onClick={() => refetchDb()}
          className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow hover:bg-brand/90 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Organize problems from dbData into categories & patterns structured array
  const organizeCategories = () => {
    // Unique categories list
    const categoriesMap = new Map<string, { number: string; name: string; patterns: Map<number, { number: number; name: string; problems: Problem[] }> }>();

    for (const problem of dbData.problems) {
      if (!categoriesMap.has(problem.category_number)) {
        categoriesMap.set(problem.category_number, {
          number: problem.category_number,
          name: problem.category,
          patterns: new Map()
        });
      }

      const category = categoriesMap.get(problem.category_number)!;

      if (!category.patterns.has(problem.pattern_number)) {
        category.patterns.set(problem.pattern_number, {
          number: problem.pattern_number,
          name: problem.pattern_name,
          problems: []
        });
      }

      category.patterns.get(problem.pattern_number)!.problems.push(problem);
    }

    // Convert map to array and sort
    const categoriesArray = Array.from(categoriesMap.values()).map(c => {
      const sortedPatterns = Array.from(c.patterns.values()).sort((a, b) => a.number - b.number);
      return {
        ...c,
        patterns: sortedPatterns
      };
    });

    // Sort categories using roman numerals or custom order helper
    const categoryOrder = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
    categoriesArray.sort((a, b) => {
      return categoryOrder.indexOf(a.number) - categoryOrder.indexOf(b.number);
    });

    return categoriesArray;
  };

  const categories = organizeCategories();

  return (
    <div className="min-h-full flex flex-col pb-16">
      {/* Navigation bar */}
      <Navbar />

      {/* Global Command Menu */}
      <CommandPalette />

      {/* Page Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8 w-full flex-1">
        <div className="space-y-8">
          {/* Top Info Stat Widgets */}
          <StatsGrid />

          {/* tab navigation menu */}
          <div className="flex border-b-2 border-border text-xs">
            <button
              onClick={() => setActiveTab("sheet")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-bold uppercase tracking-wider font-mono transition focus:outline-none ${
                activeTab === "sheet"
                  ? "border-brand text-brand"
                  : "border-transparent text-txt-muted hover:text-txt-main"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Sheet Explorer
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-bold uppercase tracking-wider font-mono transition focus:outline-none ${
                activeTab === "analytics"
                  ? "border-brand text-brand"
                  : "border-transparent text-txt-muted hover:text-txt-main"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 font-bold uppercase tracking-wider font-mono transition focus:outline-none ${
                activeTab === "admin"
                  ? "border-brand text-brand"
                  : "border-transparent text-txt-muted hover:text-txt-main"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              Admin Review
            </button>
          </div>

          {/* Active Tab rendering */}
          {activeTab === "sheet" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Category Explorer list (Left 2 columns) */}
              <div className="lg:col-span-2 space-y-8">
                <FiltersBar
                  search={search}
                  setSearch={setSearch}
                  selectedDifficulty={selectedDifficulty}
                  setSelectedDifficulty={setSelectedDifficulty}
                  selectedRevision={selectedRevision}
                  setSelectedRevision={setSelectedRevision}
                  showBookmarkedOnly={showBookmarkedOnly}
                  setShowBookmarkedOnly={setShowBookmarkedOnly}
                  showCompletionFilter={showCompletionFilter}
                  setShowCompletionFilter={setShowCompletionFilter}
                />

                {/* Categories & Patterns list */}
                <div className="space-y-8">
                  {categories.map(category => {
                    // Check if category has any matching patterns after filters are applied
                    // (we skip empty categories in search results)
                    const hasMatchingPatterns = category.patterns.some(pattern => {
                      const filteredProblemsCount = pattern.problems.filter(p => {
                        // Apply filters inside loop to check matching pattern count
                        if (search) {
                          const q = search.toLowerCase();
                          const matchName = p.name.toLowerCase().includes(q);
                          const matchNum = p.leetcode_number.toString().includes(q);
                          const matchPat = p.pattern_name.toLowerCase().includes(q);
                          const matchCat = p.category.toLowerCase().includes(q);
                          if (!matchName && !matchNum && !matchPat && !matchCat) return false;
                        }
                        if (selectedDifficulty !== "all" && p.difficulty !== selectedDifficulty) return false;
                        if (showBookmarkedOnly) {
                          const isBookmarked = dbData.bookmarks.some(b => b.user_id === activeUserId && b.problem_id === p.id);
                          if (!isBookmarked) return false;
                        }
                        if (selectedRevision !== "all") {
                          const rev = dbData.revision.find(r => r.user_id === activeUserId && r.problem_id === p.id);
                          if (selectedRevision === "none" && rev && rev.status !== "none") return false;
                          if (selectedRevision !== "none" && (!rev || rev.status !== selectedRevision)) return false;
                        }
                        if (showCompletionFilter !== "all") {
                          const activeComp = dbData.completion.find(c => c.user_id === activeUserId && c.problem_id === p.id);
                          const partnerComp = dbData.completion.find(c => c.user_id !== activeUserId && c.problem_id === p.id);
                          if (showCompletionFilter === "completed" && (!activeComp || !activeComp.completed)) return false;
                          if (showCompletionFilter === "incomplete" && activeComp && activeComp.completed) return false;
                          if (showCompletionFilter === "partnerCompleted" && (!partnerComp || !partnerComp.completed)) return false;
                          if (showCompletionFilter === "partnerIncomplete" && partnerComp && partnerComp.completed) return false;
                        }
                        return true;
                      }).length;

                      return filteredProblemsCount > 0;
                    });

                    // If filters are active and category doesn't have any matching problems, hide it
                    const hasFilters = search || selectedDifficulty !== "all" || selectedRevision !== "all" || showBookmarkedOnly || showCompletionFilter !== "all";
                    if (hasFilters && !hasMatchingPatterns) return null;

                    return (
                      <div key={category.number} className="space-y-3">
                        {/* Category Label */}
                        <div className="flex items-center gap-3 pt-6 pb-2.5">
                          <span className="font-mono text-[10px] font-bold text-brand bg-brand/5 dark:bg-brand/10 border border-brand/20 px-2 py-0.5 rounded-none uppercase tracking-wider">
                            CATEGORY {category.number}
                          </span>
                          <h2 className="text-[11px] font-extrabold text-txt-main uppercase tracking-[0.12em]">
                            {category.name}
                          </h2>
                          <div className="h-[1px] bg-border/60 flex-1 ml-2" />
                        </div>

                        {/* Collapsible patterns list */}
                        <div className="space-y-3">
                          {category.patterns.map(pattern => (
                            <PatternView
                              key={pattern.number}
                              pattern={pattern}
                              search={search}
                              selectedDifficulty={selectedDifficulty}
                              selectedRevision={selectedRevision}
                              showBookmarkedOnly={showBookmarkedOnly}
                              showCompletionFilter={showCompletionFilter}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar stats & comparison (Right column) */}
              <div className="lg:col-span-1 lg:sticky lg:top-[88px] space-y-6">
                <PartnerComparison />
                <div className="rounded-xl border border-border bg-card p-4 text-xs text-txt-muted shadow-sm">
                  <span className="font-semibold block text-txt-main mb-1 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" /> Quick Shortcuts
                  </span>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Hit <kbd className="font-mono bg-main px-1 py-0.5 rounded border border-border text-txt-main">Ctrl+K</kbd> to search or trigger options.</li>
                    <li>Toggle profiles in the header to check off questions for either person.</li>
                    <li>Notes and revision states auto-save.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <StatsView />
          )}

          {activeTab === "admin" && (
            <AdminReview />
          )}
        </div>
      </main>
    </div>
  );
}
