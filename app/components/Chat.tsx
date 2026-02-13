"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001", {
  transports: ["websocket"],
});

// Mesaj Tipi 
type Message = {
  text: string;
  sender: string;
  time: string;
};

const Chat = () => {
  const [baglantiDurumu, setBaglantiDurumu] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [mesajListesi, setMesajListesi] = useState<Message[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      setBaglantiDurumu(true);
    });

    socket.on("disconnect", () => {
      setBaglantiDurumu(false);
    });

    // Santralden gelen mesajı dinle
    socket.on("receive_message", (data: Message) => {
      setMesajListesi((eskiler) => [...eskiler, data]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
    };
  }, []);

  // Mesaj Gönderme Fonksiyonu
  const mesajGonder = () => {
    if (mesaj.trim() !== "") {
      const mesajVerisi = {
        text: mesaj,
        sender: "Ben", // İlerde buraya kullanıcı adı gelecek
        time: new Date().toLocaleTimeString(),
      };

      
      socket.emit("send_message", mesajVerisi);
      setMesaj(""); // Kutuyu temizle
    }
  };

  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-slate-800/50 mb-8 max-w-md mx-auto shadow-lg">
      
      {/* Üst Kısım */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold flex items-center gap-2">💬 Canlı Sohbet</h2>
        <span className={`text-xs px-2 py-1 rounded font-bold ${baglantiDurumu ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {baglantiDurumu ? "ONLINE" : "OFFLINE"}
        </span>
      </div>

      {/* Mesaj Alanı */}
      <div className="h-48 overflow-y-auto bg-white dark:bg-slate-900 p-2 rounded-lg mb-4 border border-gray-200 dark:border-gray-700">
        {mesajListesi.length === 0 ? (
          <p className="text-gray-400 text-center text-sm mt-10">Henüz mesaj yok. İlk yazan sen ol! 👋</p>
        ) : (
          mesajListesi.map((msg, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold text-blue-600 text-sm">{msg.sender}: </span>
              <span className="text-gray-800 dark:text-gray-200">{msg.text}</span>
              <span className="text-xs text-gray-400 ml-2">{msg.time}</span>
            </div>
          ))
        )}
      </div>

      {/* Yazma Alanı */}
      <div className="flex gap-2">
        <input
          type="text"
          value={mesaj}
          onChange={(e) => setMesaj(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && mesajGonder()}
          placeholder="Bir şeyler yaz..."
          className="flex-1 p-2 border rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={mesajGonder}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default Chat;