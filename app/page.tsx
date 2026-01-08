import { blogs } from "./data/blogs";
import BlogCard from "./components/BlogCard";

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-outo px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>

      <div className="grid gap-6">

      {blogs.map ((blog) => (

        <BlogCard
        key={blog.slug}
        slug={blog.slug}
        title={blog.title}
        description={blog.description}
        image={blog.image}
        />
        
      ))}
      </div>
    </main>
  );
}
