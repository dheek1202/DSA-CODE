"use client";

import React from "react";
import { AlertTriangle, Info, CheckCircle2, Settings } from "lucide-react";

export default function AdminReview() {
  return (
    <div className="rounded-none border-2 border-border bg-card p-6 shadow-none space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b-2 border-border pb-3">
        <h3 className="text-base font-extrabold text-txt-main flex items-center gap-2 font-mono">
          <Settings className="h-5 w-5 text-brand" /> Admin & Data Quality
        </h3>
      </div>

      {/* Notion Warn Callout */}
      <div className="rounded-none border-2 border-amber-500 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div>
            <span className="font-extrabold block uppercase tracking-wider font-mono">Excel Source Anomalies</span>
            As required by the non-negotiables, the system has explicitly flagged and loaded the two ambiguous rows exactly as they appear in the original Swati Ahuja / Thita.ai pattern sheet rather than silently correcting or ignoring them. Below is the active tracking representation:
          </div>
        </div>
      </div>

      {/* Two Flagged Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Issue 1: Stray 1 in Pattern 9 */}
        <div className="rounded-none border-2 border-border bg-main/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand uppercase tracking-wider font-mono">Issue #1</span>
            <span className="rounded-none border-2 border-amber-500 bg-amber-500/10 text-amber-800 dark:text-amber-400 text-[10px] px-2 py-0.5 font-bold font-mono">
              Stray Entry
            </span>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-txt-main">Pattern 9: Stray "1"</h4>
            <p className="text-xs text-txt-muted mt-1 leading-relaxed">
              A stray number <code className="font-bold text-brand bg-main border-2 border-border px-1.5 py-0.5 rounded-none font-mono">1</code> was found in the source sheet immediately preceding LeetCode 1658.
            </p>
          </div>
          <div className="border-t-2 border-border/60 pt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-completed shrink-0" />
              <span className="text-txt-muted">
                <strong>Status:</strong> Active in Database
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-brand shrink-0" />
              <span className="text-txt-muted">
                <strong>Mapping:</strong> Links to LeetCode 1 (Two Sum) but acts as a sliding window pattern placeholder.
              </span>
            </div>
          </div>
        </div>

        {/* Issue 2: Truncated 604. D... in Pattern 93 */}
        <div className="rounded-none border-2 border-border bg-main/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand uppercase tracking-wider font-mono">Issue #2</span>
            <span className="rounded-none border-2 border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] px-2 py-0.5 font-bold font-mono">
              Truncation
            </span>
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-txt-main">Pattern 93: Truncated "604. D..."</h4>
            <p className="text-xs text-txt-muted mt-1 leading-relaxed">
              The final entry in the Design pattern list was cut off mid-word as <code className="font-bold text-brand bg-main border-2 border-border px-1.5 py-0.5 rounded-none font-mono">604. D...</code>.
            </p>
          </div>
          <div className="border-t-2 border-border/60 pt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-completed shrink-0" />
              <span className="text-txt-muted">
                <strong>Status:</strong> Successfully Resolved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-brand shrink-0" />
              <span className="text-txt-muted">
                <strong>Mapping:</strong> Resolved to LeetCode 604: <em>Design Compressed String Iterator</em>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
