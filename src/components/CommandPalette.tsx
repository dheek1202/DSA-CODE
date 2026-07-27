"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTracker } from "@/app/providers";
import { Search, ExternalLink, Sun, Users } from "lucide-react";
import { Problem } from "@/lib/db";

export default function CommandPalette() {
  const { dbData, setActiveUserId, partnerUser } = useTracker();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle Command Palette visibility with Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(prev => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen || !dbData) return null;

  // Filter problems based on query
  const filteredProblems = dbData.problems
    .filter(p => {
      const q = query.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.leetcode_number.toString().includes(q) ||
        p.pattern_name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    })
    .slice(0, 8); // Limit to 8 results for premium look

  // Extra Commands
  const commands = [
    {
      id: "switch-profile",
      title: `Switch Profile to ${partnerUser?.name || "Partner"}`,
      subtitle: "Switch active progress tracker profile",
      action: () => {
        if (partnerUser) setActiveUserId(partnerUser.id);
        setIsOpen(false);
      },
      icon: <Users className="h-4.5 w-4.5" />
    },
    {
      id: "toggle-theme",
      title: "Toggle Dark / Light Mode",
      subtitle: "Switch theme mode",
      action: () => {
        const isDark = document.documentElement.classList.contains("dark");
        if (isDark) {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("dsa_dark_mode", "false");
        } else {
          document.documentElement.classList.add("dark");
          localStorage.setItem("dsa_dark_mode", "true");
        }
        setIsOpen(false);
      },
      icon: <Sun className="h-4.5 w-4.5" />
    }
  ].filter(c => c.title.toLowerCase().includes(query.toLowerCase()));

  const allItems = [
    ...commands.map(c => ({ type: "command" as const, ...c })),
    ...filteredProblems.map(p => ({ type: "problem" as const, ...p }))
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = allItems[selectedIndex];
      if (item) {
        if (item.type === "command") {
          (item as unknown as { action: () => void }).action();
        } else if (item.type === "problem") {
          const p = item as Problem;
          window.open(`https://leetcode.com/problems/${p.leetcode_slug}/`, "_blank");
          setIsOpen(false);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-4 pt-[15vh]">
      <div 
        ref={containerRef}
        className="w-full max-w-lg rounded-none border-2 border-border bg-card shadow-none overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input block */}
        <div className="flex items-center gap-2 px-4 border-b-2 border-border bg-main/10">
          <Search className="h-5 w-5 text-txt-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search problems..."
            className="w-full bg-transparent py-4 text-sm text-txt-main placeholder-txt-muted focus:outline-none font-mono"
          />
          <span className="text-[10px] bg-main border-2 border-border rounded-none px-1.5 py-0.5 text-txt-muted font-bold">
            ESC
          </span>
        </div>

        {/* Search Results list */}
        <div className="max-h-[320px] overflow-y-auto p-2">
          {allItems.length === 0 ? (
            <div className="text-center py-8 text-sm text-txt-muted font-mono">
              No matching commands or problems found.
            </div>
          ) : (
            <div className="space-y-0.5">
              {allItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                if (item.type === "command") {
                  return (
                    <button
                      key={item.id}
                      onClick={() => (item as unknown as { action: () => void }).action()}
                      className={`flex w-full items-center justify-between rounded-none px-3 py-2.5 text-left transition ${
                        isSelected ? "bg-brand text-white font-bold" : "hover:bg-main/40 text-txt-main font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`shrink-0 ${isSelected ? "text-white" : "text-brand"}`}>
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs">{item.title}</p>
                          <p className={`text-[10px] ${isSelected ? "text-white/80" : "text-txt-muted"}`}>
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono ${isSelected ? "text-white" : "text-txt-muted"}`}>
                        Command
                      </span>
                    </button>
                  );
                } else {
                  const p = item as Problem;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        window.open(`https://leetcode.com/problems/${p.leetcode_slug}/`, "_blank");
                        setIsOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-none px-3 py-2.5 text-left transition ${
                        isSelected ? "bg-brand text-white font-bold" : "hover:bg-main/40 text-txt-main font-semibold"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold text-txt-muted group-hover:text-txt-main font-mono">
                          #{p.leetcode_number}
                        </span>
                        <div className="truncate">
                          <p className="text-xs truncate">{p.name}</p>
                          <p className={`text-[10px] truncate ${isSelected ? "text-white/80" : "text-txt-muted"}`}>
                            {p.category} · {p.pattern_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] rounded-none px-1.5 py-0.5 border-2 ${
                          isSelected 
                            ? "bg-white/20 border-transparent text-white" 
                            : "bg-main border-border text-txt-muted font-bold"
                        }`}>
                          {p.difficulty}
                        </span>
                        <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                      </div>
                    </button>
                  );
                }
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t-2 border-border px-4 py-2 bg-main/10 text-[10px] text-txt-muted font-bold font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
          </div>
          <span>Press Ctrl+K at any time</span>
        </div>
      </div>
    </div>
  );
}
