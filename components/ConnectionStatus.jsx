// components/ConnectionStatus.js
import React, { useEffect, useState } from "react";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function ConnectionStatus() {
  const isOnline = useOnlineStatus();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOnline) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 text-center text-sm z-50 w-full ${
        isOnline ? "bg-green-500" : "bg-red-500"
      } text-white`}
    >
      {isOnline ? "Back Online" : "Offline"}
    </div>
  );
}
