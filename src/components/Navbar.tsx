"use client";

import React, { useState, useEffect } from "react";
import { useTracker } from "@/app/providers";
import { Moon, Sun, Settings, Users, ChevronDown, Check } from "lucide-react";

export default function Navbar() {
  const {
    activeUserId,
    setActiveUserId,
    activeUser,
    dbData,
    mutateUserSettings
  } = useTracker();

  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  
  // Settings Form State
  const [userName1, setUserName1] = useState("");
  const [userAvatar1, setUserAvatar1] = useState("");
  const [userName2, setUserName2] = useState("");
  const [userAvatar2, setUserAvatar2] = useState("");

  // Dark Mode mounting
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark") || 
                   localStorage.getItem("dsa_dark_mode") === "true";
    if (isDark) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dsa_dark_mode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dsa_dark_mode", "false");
    }
  };

  // Sync settings inputs when loaded
  useEffect(() => {
    if (dbData?.users) {
      const u1 = dbData.users[0];
      const u2 = dbData.users[1];
      if (u1) {
        setUserName1(u1.name);
        setUserAvatar1(u1.avatar);
      }
      if (u2) {
        setUserName2(u2.name);
        setUserAvatar2(u2.avatar);
      }
    }
  }, [dbData]);

  const handleSaveSettings = () => {
    if (dbData?.users) {
      const u1 = dbData.users[0];
      const u2 = dbData.users[1];
      mutateUserSettings.mutate([
        { id: u1?.id || "user-1", name: userName1, avatar: userAvatar1 },
        { id: u2?.id || "user-2", name: userName2, avatar: userAvatar2 }
      ]);
    }
    setShowSettings(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-card transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-none bg-brand text-white border-2 border-border font-bold">
              DSA
            </div>
            <div>
              <h1 className="text-base font-extrabold text-txt-main">Co-op DSA</h1>
              <p className="text-xs text-txt-muted">Shared Progress Tracker</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            {/* Quick Profile Swapper */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-2 rounded-none border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-txt-main hover:bg-main transition"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-none text-[10px] font-extrabold uppercase border-2 ${
                  activeUserId === (dbData?.users[0]?.id || "user-1") 
                    ? "border-brand text-brand bg-brand/5" 
                    : "border-completed text-completed bg-completed/5"
                }`}>
                  {activeUser?.avatar || "M"}
                </span>
                <span>{activeUser?.name || "Active Profile"}</span>
                <ChevronDown className="h-4 w-4 text-txt-muted" />
              </button>

              {showProfileDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-none border-2 border-border bg-card p-1 shadow-none z-20">
                    <div className="px-3 py-2 text-xs font-bold text-txt-muted border-b-2 border-border mb-1 uppercase tracking-wider font-mono">
                      Switch Profile
                    </div>
                    {dbData?.users.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setActiveUserId(u.id);
                          setShowProfileDropdown(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-none px-3 py-2 text-left text-sm text-txt-main hover:bg-main transition ${
                          activeUserId === u.id ? "bg-main/50 font-bold" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-none text-[9px] font-extrabold uppercase border-2 ${
                            u.id === (dbData?.users[0]?.id || "user-1") 
                              ? "border-brand text-brand bg-brand/5" 
                              : "border-completed text-completed bg-completed/5"
                          }`}>
                            {u.avatar}
                          </span>
                          <span>{u.name}</span>
                        </div>
                        {activeUserId === u.id && <Check className="h-4 w-4 text-brand" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Dark Mode button */}
            <button
              onClick={toggleDarkMode}
              className="rounded-lg p-2 text-txt-muted hover:bg-main hover:text-txt-main transition border border-transparent hover:border-border"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="rounded-none p-2 text-txt-muted hover:bg-main hover:text-txt-main transition border-2 border-transparent hover:border-border"
              title="Profile Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-none border-2 border-border bg-card p-6 shadow-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-2 border-b-2 border-border pb-4 mb-4">
              <Users className="h-5 w-5 text-brand" />
              <h3 className="text-sm font-extrabold text-txt-main uppercase tracking-wider font-mono">Edit Profiles</h3>
            </div>

            <div className="space-y-4">
              {/* Profile 1 ("Me" by default) */}
              <div className="space-y-2 border-2 border-border rounded-none p-3">
                <span className="text-xs font-bold text-brand uppercase tracking-wider font-mono">Profile 1</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-txt-muted block mb-1">Initials</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={userAvatar1}
                      onChange={e => setUserAvatar1(e.target.value)}
                      className="w-full rounded-none border-2 border-border bg-main px-3 py-1.5 text-center text-sm font-extrabold text-txt-main uppercase focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-bold text-txt-muted block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={userName1}
                      onChange={e => setUserName1(e.target.value)}
                      className="w-full rounded-none border-2 border-border bg-main px-3 py-1.5 text-sm text-txt-main focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Profile 2 ("Partner" by default) */}
              <div className="space-y-2 border-2 border-border rounded-none p-3">
                <span className="text-xs font-bold text-brand uppercase tracking-wider font-mono">Profile 2</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="text-xs font-bold text-txt-muted block mb-1">Initials</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={userAvatar2}
                      onChange={e => setUserAvatar2(e.target.value)}
                      className="w-full rounded-none border-2 border-border bg-main px-3 py-1.5 text-center text-sm font-extrabold text-txt-main uppercase focus:border-brand focus:outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs font-bold text-txt-muted block mb-1">Display Name</label>
                    <input
                      type="text"
                      value={userName2}
                      onChange={e => setUserName2(e.target.value)}
                      className="w-full rounded-none border-2 border-border bg-main px-3 py-1.5 text-sm text-txt-main focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 border-t-2 border-border pt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="rounded-none border-2 border-border px-4 py-2 text-sm font-bold text-txt-main hover:bg-main transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="rounded-none bg-brand px-4 py-2 text-sm font-bold text-white border-2 border-border hover:bg-brand/90 transition"
              >
                Save Profiles
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
