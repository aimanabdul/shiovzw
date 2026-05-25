"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminDeleteButtonProps {
  id: number;
  title: string;
}

export default function AdminDeleteButton({ id, title }: AdminDeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/achievements/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete achievement");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-1.5 text-sm bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 rounded-lg transition-colors font-medium"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
