import { useAuthStore } from "@/lib/store/stateStore";
import React from "react";

export default function Header() {
  const { user } = useAuthStore();

  if (!user) {
    return;
  }

  return (
    <div className="flex items-center justify-between py-2 h-14">
      <h1>Bondspace</h1>
      <div>
        <p className="text-special">{user.username}</p>
      </div>
    </div>
  );
}
