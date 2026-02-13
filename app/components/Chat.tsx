"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

// Socket bağlantısı
const socket = io("http://localhost:5001", {
  transports: ["websocket"],
});

const Chat = () => {
  const [baglantiDurumu, setBaglantiDurumu] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Telsiz Bağlandı! ID:", socket.id);
      setBaglantiDurumu(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Bağlantı Koptu.");
      setBaglantiDurumu(false);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 mb-8">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
        💬 Canlı Sohbet Odası
      </h2>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">Bağlantı Durumu:</span>
        <span className={`px-2 py-1 rounded text-xs font-bold ${baglantiDurumu ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {baglantiDurumu ? "🟢 ONLINE" : "🔴 OFFLINE"}
        </span>
      </div>
    </div>
  );
};


export default Chat;