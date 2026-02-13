'use client';
import Chat from "./components/Chat";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from "next/link";

interface BLOG_POSTS {
  id: number;
  title: string;
  content: string;
  date?: string;
  category?: string;
}

export default function Home() {
  const [posts, setPosts]= useState<BLOG_POSTS[]>([]);
  const [loading, setLoading]= useState(true);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
      const response = await axios.get('http://localhost:5001/posts');
      setPosts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Veri çekilemedi:", error);
      setLoading(false);
    }
    };
    fetchPosts();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
      <div className="text-xl font-bold text-blue-600 animate-pulse">
      Yazılar mutfaktan getiriliyor...
      </div>
      </div>
    );
  }

  return (

    <div className="space-y-10">

      {/* 1. BÖLÜM: BAŞLIK */}
      <section className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Blog Yazıları
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Teknoloji ve tasarım üzerine düşüncelerim.
        </p>
      </section>

      {/* 2. BÖLÜM: ARAMA VE FİLTRELEME */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Arama Kutusu */}
        <div className="relative flex-grow">
          <input 
            type="text" 
            placeholder="Yazı ara..." 
            className="w-full p-3 pl-4 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition dark:bg-slate-800 dark:border-slate-700 dark:text-white dark:placeholder-slate-500"
          />
        </div>
        
        {/* Kategori Butonları */}
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-sm">
            Hepsi
          </button>
          <button className="px-5 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
            Yazılım
          </button>
        </div>
      </div>

      {/* 3. BÖLÜM: BLOG KARTLARI (DİNAMİK) */}
      
      <div className="grid gap-8 md:grid-cols-2">
        {posts.map((post) => (
          <Link href={`/blog/${post.id}`} key={post.id} className="group">
            <article className="h-full p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 dark:bg-slate-800/50 dark:border-slate-800 dark:hover:border-blue-500/30">
              
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold uppercase dark:bg-blue-900/30 dark:text-blue-400">
                  {post.category}
                </span>
                <span className="text-slate-400 text-xs">{post.date}</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {post.content}
              </p>

              <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all">
                Devamını Oku <span className="ml-1">➡️</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

    </div>
  ); 
} 