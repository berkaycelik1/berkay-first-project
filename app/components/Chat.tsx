"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

// Mesaj Tipi 
type Message = {
  text: string;
  sender: string;
  time: string;
  roomId: string;
};

const Chat = () => {
  const [baglantiDurumu, setBaglantiDurumu] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [mesajListesi, setMesajListesi] = useState<Message[]>([]);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [oda, setOda] = useState("");
  const [odaGirisYapti, setOdaGirisYapti] = useState(false);

  useEffect(() => {
    socket = io("http://localhost:5001", {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      setBaglantiDurumu(true);
    });

    socket.on("disconnect", () => {
      setBaglantiDurumu(false);
    });
    socket.on("load_messages", (eskiMesajlar: any[]) => {
      console.log("📤 Kargo Geldi! Mesajlar:", eskiMesajlar);
      setMesajListesi(eskiMesajlar);
    });
    
    // Santralden gelen mesajı dinle
    socket.on("receive_message", (data: Message) => {
      setMesajListesi((eskiler) => [...eskiler, data]);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("load_messages");
      socket.off("receive_message");
    };
}, []);

  const odayaKatil = () => {
    if (kullaniciAdi !=="" && oda !=="") {
      socket.emit("join_room", oda);
      setOdaGirisYapti(true);
    }
  };
  // Mesaj Gönderme Fonksiyonu
  const mesajGonder = () => {
    if (mesaj.trim() !== "") {
  const mesajVerisi = {
        text: mesaj,
        sender: kullaniciAdi,
        roomId: oda,
        time: new Date().toLocaleTimeString(),
      };

      socket.emit("send_message", mesajVerisi);
      setMesaj("");
    }
  };

  return (
    !odaGirisYapti? (
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto mt-10 border rounded-lg shadow-lg bg-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-center">Sohbet Girişi</h2>
        <input 
        type="text"
        placeholder="Adınız..."
        className="p-2 border rounded text-black"
        onChange={(e) => setKullaniciAdi(e.target.value)}
        />
        <input
         type="text" 
         placeholder="Oda Adı (Örn: yazilim)"
         className="p-2 border rounded text-black"
         onChange={(e) => setOda(e.target.value)}
         />
         <button
         onClick={odayaKatil}
         className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Odaya Katıl
         </button>
      </div>
    ) : (
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
    )
  );
}; 

export default Chat;