

import { posts } from "./data/posts";
import PostCard from "./components/PostCard";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          description={post.description}
        />
      ))}
    </main>
  );
}
