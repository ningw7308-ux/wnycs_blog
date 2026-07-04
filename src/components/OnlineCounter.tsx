"use client";

import { useState, useEffect, useRef } from "react";

export default function OnlineCounter() {
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const userIdRef = useRef<string>("");

  useEffect(() => {
    let uid = sessionStorage.getItem("warmspace_uid");
    if (!uid) {
      uid = `anon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem("warmspace_uid", uid);
    }
    userIdRef.current = uid;

    const heartbeat = async () => {
      try {
        const res = await fetch(`/api/online?userId=${encodeURIComponent(userIdRef.current)}`);
        if (res.ok) {
          const data = await res.json();
          setOnlineCount(data.count);
        }
      } catch {
        // 静默失败
      }
    };

    heartbeat();
    const interval = setInterval(heartbeat, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (onlineCount === null) return null;

  return (
    <div className="card card-dark p-4 text-center">
      <p className="text-xs text-marble-500/60">
        <span className="inline-block w-1.5 h-1.5 bg-bronze-500 rounded-full mr-1.5 animate-pulse" />
        <span className="font-medium text-marble-600/80">{onlineCount}</span> 人正在阅读
      </p>
    </div>
  );
}