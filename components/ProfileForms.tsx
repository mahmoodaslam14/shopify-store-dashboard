"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { focusRing, inputBase, radius, typography } from "@/lib/ui-styles";

const input = cn(inputBase, radius.control, focusRing.brand, "px-4 py-2.5");

export function ProfileNameForm({ initialName }: { initialName: string | null }) {
  const [name, setName] = useState(initialName ?? "");
  const [saved, setSaved] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-wrap items-end gap-4">
      <div className="min-w-0 flex-1">
        <label className={typography.label}>Display name</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setSaved(false);
          }}
          className={cn("mt-2 w-full max-w-md", input)}
          maxLength={120}
        />
      </div>
      <Button variant="secondary" type="submit" className="rounded-full px-6">
        Save
      </Button>
      {saved && (
        <p className="w-full text-sm text-emerald-800">Saved (UI only).</p>
      )}
    </form>
  );
}

export function PasswordChangeForm() {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOk(false);
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    setCurrent("");
    setNewPassword("");
    setOk(true);
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 max-w-md space-y-4">
      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      {ok && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Password updated (simulated).
        </p>
      )}
      <div>
        <label className={typography.label}>Current password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          className={cn("mt-2 w-full", input)}
          autoComplete="current-password"
        />
      </div>
      <div>
        <label className={typography.label}>New password (min 8)</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={8}
          className={cn("mt-2 w-full", input)}
          autoComplete="new-password"
        />
      </div>
      <Button variant="secondary" type="submit" className="rounded-full">
        Update password
      </Button>
    </form>
  );
}
