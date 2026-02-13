'use client'; // 👈 Client Component (Axios ve Hook'lar için şart)

import { useState, useEffect } from 'react';
import axios from 'axios'; // Mentorün istediği kütüphane
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BlogDetailPage() {
  // 1. URL'deki ID'yi alıyoruz (slug yerine id kullanıyoruz çünkü backend id veriyor)
  const { id } = useParams(); 
  
  // 2. Verileri tutacak kutularımız (State)
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 3. Sayfa açılınca Backend'e git veriyi al
  useEffect(() => {
    if (!id) return; // ID yoksa bekle

    axios.get(`http://localhost:5001/posts/${id}`)
      .then((response) => {
        setBlog(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Hata:", error);
        setLoading(false);
      });
  }, [id]);

  // 4. Yüklenme Ekranı
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold text-blue-500 animate-pulse">Yükleniyor...</h1>
      </div>
    );
  }

  // 5. Veri Bulunamadı Ekranı
  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-semibold text-red-500">Blog bulunamadı! Backend çalışıyor mu?</h1>
      </div>
    );
  }

  // 6. Başarılı Ekran (Senin tasarımın korundu)
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block font-medium">
        ← Listeye geri dön
      </Link>

      <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
        {blog.title}
      </h1>

      {/* Backend'de henüz resim yok, o yüzden geçici (placeholder) bir resim koydum */}
      <img 
        src={`https://picsum.photos/seed/${blog.id}/800/400`} 
        alt={blog.title} 
        className="w-full h-80 object-cover rounded-2xl mb-8 shadow-lg"
      />

      <div className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-8 rounded-xl border border-gray-100 shadow-sm">
        {blog.content}
      </div>
      
    </main>
  );
}