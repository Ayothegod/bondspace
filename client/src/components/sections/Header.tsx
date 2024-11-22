import { useAuthStore } from "@/lib/store/stateStore";
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const { user } = useAuthStore();

  if (!user) {
    return;
  }

  return (
    <div className="flex items-center justify-between py-2 h-14">
      <Link to={user ? "/play" : "/"}>
        <h1 className="text-xl font-bold text-primary">Bondspace</h1>
      </Link>

      <div>
        <p className="text-special">{user.username}</p>
      </div>
    </div>
  );
}
