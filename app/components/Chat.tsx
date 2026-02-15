"use client";

import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket: any;

type Message = {
  text: string;
  sender: string;
  time: string;
  roomId: string;
};

const Chat = () => {
  const [ekran, setEkran] = useState("login");
  const [aktifKullanicilar, setAktifKullanicilar] = useState<string[]>([]); 
  const [baglantiDurumu, setBaglantiDurumu] = useState(false);
  const [mesaj, setMesaj] = useState("");
  const [mesajListesi, setMesajListesi] = useState<Message[]>([]);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [oda, setOda] = useState("");
  
  useEffect(() => {
    socket = io("http://localhost:5001", {
      transports: ["websocket"] 
    });

    socket.on("connect", () => setBaglantiDurumu(true));
    socket.on("disconnect", () => setBaglantiDurumu(false));    
  
    socket.on("receive_message", (data: Message) => {
      setMesajListesi((eskiler) => [...eskiler, data]);
    });

    socket.on("load_messages", (eskiMesajlar: any[]) => {
      setMesajListesi(eskiMesajlar);
    });

    socket.on("active_users", (users: string[]) => {
      console.log("Aktif Kullanıcılar:", users);
      setAktifKullanicilar(users);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("load_messages");
      socket.off("receive_message");
      socket.off("active_users");
    };
  }, []);

  const sistemeGiris = () => {
    if (kullaniciAdi !== "") {
      socket.emit("login", kullaniciAdi);
      setEkran("lobby");
    }
  };
 
  const odayaKatil = (hedefOda: string) => {
    setOda(hedefOda);
    socket.emit("join_room", hedefOda);
    setEkran("chat");
  };

  const ozelSohbetBaslat = (hedefKullanici: string) => {
    const ozelOda = [kullaniciAdi, hedefKullanici].sort().join("-");
    odayaKatil(ozelOda);
  };

  const mesajGonder = () => {
    if(mesaj.trim() !== "") {
      const mesajVerisi = {
        text: mesaj,
        sender: kullaniciAdi,
        roomId: oda,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit("send_message", mesajVerisi);
      setMesaj("");
    }
  };

  // 1. EKRAN: LOGIN
  if (ekran === "login") {
    return (
      <div className="flex flex-col gap-4 p-4 max-w-md mx-auto mt-10 border rounded-lg shadow-lg bg-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-center">Sohbet Girişi</h2>
        <input 
          type="text"
          placeholder="Adın ne?"
          className="p-2 border rounded text-black dark:text-white dark:bg-slate-700"
          onChange={(e) => setKullaniciAdi(e.target.value)}
        />
         <button
           onClick={sistemeGiris}
           className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold"
         >
          Giriş
         </button>
      </div>
    );
  }

  // 2. EKRAN: LOBİ (Bunu yanlışlıkla silmiştin, geri ekledim)
  if (ekran === "lobby") {
    return (
      <div className="p-6 max-w-4xl mx-auto mt-10 grid md:grid-cols-2 gap-8">
        
        {/* SOL KUTU: Online Kişiler */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-green-600 border-b pb-2">🟢 Online Kişiler</h3>
          
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {aktifKullanicilar.length === 0 || (aktifKullanicilar.length === 1 && aktifKullanicilar.includes(kullaniciAdi)) ? (
              <p className="text-gray-400 text-sm italic">Şu an kimse yok...</p>
            ) : (
              aktifKullanicilar.map((user, index) => (
                user !== kullaniciAdi && (
                  <button
                    key={index}
                    onClick={() => ozelSohbetBaslat(user)}
                    className="flex items-center gap-3 w-full text-left p-3 bg-gray-50 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition"
                  >
                    <span className="text-xl">💬</span>
                    <span className="font-medium">{user}</span>
                  </button>
                )
              ))
            )}
          </div>
        </div>

        {/* SAĞ KUTU: Manuel Giriş */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border dark:border-slate-700 h-fit">
          <h3 className="text-xl font-bold mb-4 border-b pb-2">📢 Odaya Katıl</h3>
          <p className="text-sm text-gray-500 mb-4">Bir grup adı yaz ve katıl.</p>
          <input 
            type="text" 
            placeholder="Oda Adı (Örn: yazilim)" 
            className="p-3 border rounded-lg w-full mb-4 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 outline-none" 
            onChange={(e) => setOda(e.target.value)} 
          />
          <button 
            onClick={() => odayaKatil(oda)} 
            className="bg-gray-800 text-white p-3 rounded-lg w-full hover:bg-black font-bold transition"
          >
            Giriş Yap
          </button>
        </div>
      </div>
    );
  }

  // 3. EKRAN: SOHBET
  return (
    <div className="p-4 border rounded-xl bg-white dark:bg-slate-800 mb-8 max-w-md mx-auto shadow-lg mt-10">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold">Oda: {oda}</h2>
        <button 
          onClick={() => setEkran("lobby")} 
          className="text-red-500 font-bold text-xs"
        >
          ÇIKIŞ
        </button>
      </div>
      
      {/* Mesaj Listesi (DÜZELTİLDİ: Renk ayarlı versiyon) */}
      <div className="h-80 overflow-y-auto bg-gray-50 dark:bg-slate-900 p-3 rounded-lg mb-4 flex flex-col gap-2 border dark:border-slate-700">
         {mesajListesi.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === kullaniciAdi ? "items-end" : "items-start"}`}>
               <div 
                 className={`px-4 py-2 rounded-xl max-w-[85%] shadow-sm ${
                   msg.sender === kullaniciAdi 
                     ? "bg-blue-600 text-white rounded-br-none" 
                     : "bg-white text-black dark:bg-slate-700 dark:text-white rounded-bl-none border border-gray-200 dark:border-none"
                 }`}
               >
                 <span className={`text-[10px] font-bold block mb-1 opacity-70 ${msg.sender === kullaniciAdi ? "text-blue-100" : "text-blue-600 dark:text-blue-400"}`}>
                    {msg.sender}
                 </span>
                 <span className="text-sm font-medium">{msg.text}</span>
               </div>
               <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
            </div>
         ))}
      </div>
      
      {/* Input Alanı */}
      <div className="flex gap-2">
        <input 
          type="text" 
          value={mesaj} 
          onChange={(e) => setMesaj(e.target.value)} 
          className="flex-1 p-2 border rounded text-black dark:text-white dark:bg-slate-700" 
          placeholder="Mesaj..." 
          onKeyDown={(e) => e.key === "Enter" && mesajGonder()}
        />
        <button 
          onClick={mesajGonder} 
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default Chat;