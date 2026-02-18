"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setEmail(data.email));
  }, []);

  return (
    <div className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
      <div className="text-sm text-gray-400">
        Welcome back
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold">
          {email ? email[0].toUpperCase() : "U"}
        </div>
        <span className="text-sm text-gray-300">{email}</span>
      </div>
    </div>
  );
}
