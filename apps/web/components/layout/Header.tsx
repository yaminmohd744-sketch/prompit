"use client";

import { useAuthStore } from "@/stores/authStore";
import { useTheme } from "next-themes";
import { Sun, Moon, LogOut, Coins } from "lucide-react";

export function Header() {
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-border bg-card px-6 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-medium text-foreground">{user.credits}</span>
            <span>credits</span>
          </div>
        )}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-md hover:bg-accent transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        {user && (
          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
