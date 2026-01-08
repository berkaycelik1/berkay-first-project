import { blogs } from "@/app/data/blogs";

type Props = {
  params: {
    slug: string;
  };
};

export default function BlogDetailPage({ params }: Props) {
  
  const blog = blogs.find(
    (b) => b.slug === params.slug
  );

  if (!blog) {
    return <div>Blog bulunamadı</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {blog.title}
      </h1>

      <img
        src={blog.image}
        alt={blog.title}
        className="w-full rounded-lg mb-6"
      />

      <p className="text-gray-700 leading-relaxed">
        {blog.content}
      </p>
    </main>
  );
}
