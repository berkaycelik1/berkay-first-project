"use client";

import { useState } from "react";
import { blogs } from "./data/blogs";
import BlogCard from "./components/BlogCard";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog Yazıları</h1>

      <div className="mb-10">
        <input
        type="text"
        placeholder="Yazı ara..."
        className="w-full p-4 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />
        {search&& (
          <p className="mt-2 text-sm text-gray-500">
            " {search} " için {filteredBlogs.length} sonuç bulundu.
          </p>
        )}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filteredBlogs.map((blog) => (
          <BlogCard key={blog.slug} {...blog} />

        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500">Aradığınız kriterlere uygun yazı bulunamadı.☹️</p>
        </div>
      )}

    </main>
  );
}
