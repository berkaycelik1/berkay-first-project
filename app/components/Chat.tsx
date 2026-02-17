"use client";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

let socket: any;

type Message = {
  text: string;
  sender: string;
  time: string;
  roomId: string;
};

const Chat = () => {
  const [girisYapildi, setGirisYapildi] = useState(false);

  const [hataMesaji, setHataMesaji] = useState("");
  const [sifre, setSifre] = useState("");

  const [baglantiDurumu, setBaglantiDurumu] = useState(false);
  const [aktifKullanicilar, setAktifKullanicilar] = useState<string[]>([]);
  const [mesajListesi, setMesajListesi] = useState<Message[]>([]);
  const [kullaniciAdi, setKullaniciAdi] = useState("");
  const [mesaj, setMesaj] = useState("");

  const [seciliOda, setSeciliOda] = useState<string | null>(null);
  const [seciliKisi, setSeciliKisi] = useState<string | null>(null);
  const [grupAdi, setGrupAdi] = useState("");

  const mesajSonuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket = io("http://localhost:5001", {
      transports: ["websocket"] 
    });

    socket.on("connect", () => setBaglantiDurumu(true));
    socket.on("disconnect", () => setBaglantiDurumu(false));    
  
    socket.on("receive_message", (data: Message) => {
      setMesajListesi((eskiler) => [...eskiler, data]);
    });
    socket.on("load_messages", (eskiMesajlar: Message[]) => {
      setMesajListesi(eskiMesajlar);
    });

    socket.on("login_success", () => {
      setGirisYapildi(true);
      setHataMesaji("");
    });

    socket.on("login_error", (msg: string) => {
      setHataMesaji(msg);
      setTimeout(() => setHataMesaji(""), 3000);
    })

    socket.on("active_users", (users: string[]) => {
      setAktifKullanicilar(users);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
      socket.off("disconnect");
      socket.off("receive_message");
      socket.off("load_messages");
      socket.off("active_users");
      socket.off("login_success");
      socket.off("login_error");
    };
  }, []);

  useEffect (() => {
    mesajSonuRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mesajListesi, seciliOda]);

  const sistemeGiris = () => {
    if (kullaniciAdi !== "") {
      socket.emit("login", { username: kullaniciAdi, password: sifre});
      } else {
        setHataMesaji("Lütfen adını ve şifreni gir!");
      }
      };

    const sohbetiAc = (hedefKullanici: string) => {
    const ozelOda = [kullaniciAdi, hedefKullanici].sort().join("-");
    setSeciliKisi(hedefKullanici);
    setSeciliOda(ozelOda);
    socket.emit("join_room" ,ozelOda);
    };
    const grubaKatil = () => {
      if (grupAdi !== "") {
        setSeciliOda(grupAdi);
        setSeciliKisi("#" + grupAdi);
        socket.emit("join_room", grupAdi);
        setGrupAdi("");
      }
    };

  const mesajGonder = () => {
    if(mesaj.trim() !== "" && seciliOda) {
      const mesajVerisi = {
        text: mesaj,
        sender: kullaniciAdi,
        roomId: seciliOda,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      socket.emit("send_message", mesajVerisi);
      setMesaj("");
    }
  };

  // 1. EKRAN: LOGIN
  if (!girisYapildi) {
    return (
      <div className="flex flex-col gap-4 p-6 max-w-sm mx-auto mt-20 rounded-xl shadow-2xl bg-white dark:bg-slate-800">
        <h2 className="text-2xl font-bold text-center">Güvenli Giriş 🔐</h2>
        {hataMesaji && <div className="bg-red-100 text-red-600 p-2 rounded 
        
        text-sm text-center">{hataMesaji}</div>}
        
        <input 
          type="text"
          placeholder="Kullanıcı Adı?"
          className="p-3 border rounded text-black dark:text-white dark:bg-slate-700"
          onChange={(e) => setKullaniciAdi(e.target.value)}
        />
        <input type="password"
        placeholder="Şifre"
        className="p-3 border rounded text-black dark:text-white dark:bg-slate-700"
        onChange={(e) => setSifre(e.target.value)}
         />

         <button
           onClick={sistemeGiris}
           className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-bold"
         >
          Giriş
         </button>
      </div>
    );
  }

  // 2. EKRAN
    return (
      <div className="flex h-screen max-h-[90vh] max-w-6xl mx-auto mt-5 border rounded-2xl shadow-2xl overflow-hidden bg-white dark:bg-slate-900">
    
        {/* SOL KUTU: */}
        <div className="w-1/3 border-r dark:border-slate-700 flex flex-col bg-gray-50 dark:bg-slate-800">
          
          <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
          <span className="font-bold">Ben: {kullaniciAdi}</span>
          <div className={`w-3 h-3 rounded-full ${baglantiDurumu ? "bg-green-500" : "bg-red-500"}`} ></div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {aktifKullanicilar.map((user, index) => (
              user !== kullaniciAdi && (
                <button
                key={index}
                onClick={() => sohbetiAc(user)}
                className={`flex items-center gap-3 w-full p-3 rounded-lg transition text-left
                        ${seciliKisi === user ? "bg-blue-100 border-l-4 border-blue-600" : "hover:bg-gray-200"} 
                        `}
                        >
                          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                            {user[0].toUpperCase()}
                          </div>
                          <div className="text-black dark:text-white">
                            <p className="font-bold">{user}</p>
                            <p className="text-xs text-gray-500">Çevrimiçi</p>
                          </div>
                </button>
              )
            ))}
            </div>
            <div className="p-4 border-t dark:border-slate-700 bg-white dark:bg-slate-800">
                <p className="text-xs text-gray-400 font-bold mb-2">GRUP SOHBETİ</p>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        placeholder="Grup adı (örn: proje)" 
                        className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:text-white"
                        value={grupAdi}
                        onChange={(e) => setGrupAdi(e.target.value)}
                    />
                    <button 
                        onClick={grubaKatil}
                        className="bg-green-600 text-white p-2 rounded text-sm font-bold hover:bg-green-700"
                    >
                        Katıl
                    </button>
                </div>
            </div>
            </div>
            
        {/* SAĞ KUTU:  */}
        <div className="w-2/3 flex flex-col bg-white dark:bg-slate-900">
        {seciliOda ? (
          <>
          <div className="p-4 border-b flex items-center gap-3 bg-gray-50 dark:bg-slate-800">
            <h3 className="font-bold text-lg"> {seciliKisi}</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {mesajListesi
            .filter((msg) => msg.roomId === seciliOda)
            .map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === kullaniciAdi ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-2 rounded-xl max-w-[70%] shadow-md ${
                msg.sender === kullaniciAdi
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-100 text-black dark:bg-slate-700 dark:text-white rounded-bl-none"
              }`}>
                {msg.sender !== kullaniciAdi && (
                  <span className="text-xs font-bold text-orange-600 mb-1"> ~ {msg.sender} </span>
                )}
                <span className="text-sm">{msg.text}</span>
                <span className="text-[10px] block text-right opacity-70 mt-1">{msg.time}</span>
            </div>
            </div>
            ))}
            <div ref={mesajSonuRef}/>
            </div>

            <div className="p-4 border-t flex gap-2 bg-gray-50 dark:bg-slate-800">
                <input 
                  type="text" 
                  value={mesaj} 
                  onChange={(e) => setMesaj(e.target.value)} 
                  className="flex-1 p-3 border rounded-full text-black dark:bg-slate-700 dark:text-white outline-none" 
                  placeholder="Mesaj yaz..." 
                  onKeyDown={(e) => e.key === "Enter" && mesajGonder()}
                />
                <button onClick={mesajGonder} className="bg-blue-600 text-white p-3 rounded-full w-12 h-12 flex justify-center items-center">➡️</button>
            </div>
            
        </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <div className="text-6xl mb-4">💬</div>
             <p>Soldan bir kişi seçip konuşmaya başla.</p>
          </div>
        )}
      </div> 
    </div> 
    );
    };
export default Chat;