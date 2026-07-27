"use client";

import React from "react";
import { Search, Bookmark } from "lucide-react";

interface FiltersBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (val: string) => void;
  selectedRevision: string;
  setSelectedRevision: (val: string) => void;
  showBookmarkedOnly: boolean;
  setShowBookmarkedOnly: (val: boolean) => void;
  showCompletionFilter: string;
  setShowCompletionFilter: (val: string) => void;
}

export default function FiltersBar({
  search,
  setSearch,
  selectedDifficulty,
  setSelectedDifficulty,
  selectedRevision,
  setSelectedRevision,
  showBookmarkedOnly,
  setShowBookmarkedOnly,
  showCompletionFilter,
  setShowCompletionFilter,
}: FiltersBarProps) {
  return (
    <div className="rounded-none border-2 border-border bg-card p-5 shadow-none space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <Search className="h-4 w-4 text-txt-muted/80" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, or pattern... (Ctrl+K)"
          className="w-full rounded-none border-2 border-border bg-main py-2.5 pl-10 pr-4 text-sm text-txt-main placeholder-txt-muted focus:bg-card focus:border-brand focus:outline-none transition-all duration-200"
        />
      </div>

      {/* Filter Buttons group */}
      <div className="flex flex-wrap items-center gap-3 text-xs md:justify-end">
        {/* Difficulty Selector */}
        <div className="flex items-center rounded-none border-2 border-border bg-main p-1">
          <button
            onClick={() => setSelectedDifficulty("all")}
            className={`rounded-none px-3 py-1.5 font-bold transition-all ${
              selectedDifficulty === "all" ? "bg-brand text-white" : "text-txt-muted hover:text-txt-main"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedDifficulty("Easy")}
            className={`rounded-none px-3 py-1.5 font-bold transition-all ${
              selectedDifficulty === "Easy" ? "bg-completed text-white" : "text-txt-muted hover:text-txt-main"
            }`}
          >
            Easy
          </button>
          <button
            onClick={() => setSelectedDifficulty("Medium")}
            className={`rounded-none px-3 py-1.5 font-bold transition-all ${
              selectedDifficulty === "Medium" ? "bg-progress text-white" : "text-txt-muted hover:text-txt-main"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setSelectedDifficulty("Hard")}
            className={`rounded-none px-3 py-1.5 font-bold transition-all ${
              selectedDifficulty === "Hard" ? "bg-red-600 text-white" : "text-txt-muted hover:text-txt-main"
            }`}
          >
            Hard
          </button>
        </div>

        {/* Completion Selector */}
        <select
          value={showCompletionFilter}
          onChange={(e) => setShowCompletionFilter(e.target.value)}
          className="rounded-none border-2 border-border bg-card px-3 py-2 text-xs font-bold text-txt-main hover:bg-main focus:border-brand focus:outline-none transition cursor-pointer"
        >
          <option value="all">Show All Progress</option>
          <option value="completed">Solved by Me</option>
          <option value="incomplete">Incomplete by Me</option>
          <option value="partnerCompleted">Solved by Partner</option>
          <option value="partnerIncomplete">Incomplete by Partner</option>
        </select>

        {/* Revision Selector */}
        <select
          value={selectedRevision}
          onChange={(e) => setSelectedRevision(e.target.value)}
          className="rounded-none border-2 border-border bg-card px-3 py-2 text-xs font-bold text-txt-main hover:bg-main focus:border-brand focus:outline-none transition cursor-pointer"
        >
          <option value="all">All Revision Tags</option>
          <option value="needs_revision">Needs Revision</option>
          <option value="revised_once">Revised Once</option>
          <option value="mastered">Mastered</option>
        </select>

        {/* Bookmarked toggle */}
        <button
          onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
          className={`flex items-center gap-1.5 rounded-none border-2 px-3 py-2 font-bold transition-all duration-200 ${
            showBookmarkedOnly
              ? "border-brand bg-brand/5 text-brand"
              : "border-border bg-card text-txt-muted hover:text-txt-main hover:border-txt-muted"
          }`}
        >
          <Bookmark className={`h-3.5 w-3.5 ${showBookmarkedOnly ? "fill-brand" : ""}`} />
          Bookmarked
        </button>

        {/* Clear Filters helper */}
        {(search || selectedDifficulty !== "all" || selectedRevision !== "all" || showBookmarkedOnly || showCompletionFilter !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedDifficulty("all");
              setSelectedRevision("all");
              setShowBookmarkedOnly(false);
              setShowCompletionFilter("all");
            }}
            className="rounded-none border-2 border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 px-3.5 py-2 font-bold hover:bg-red-500/20 transition-all duration-200"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
