import { blogs} from "@/app/data/blogs";
import { notFound } from "next/navigation";
import Link from "next/link"; 

export default async function BlogDetailPage( { params}: any) {
  
const resolvedParams = await params;
const slug = resolvedParams.slug;

const blog = blogs.find((b) => b.slug === slug);

if(!blog){
  return (
    <div className="flex justify-center items-center h-center h-screen">
      <h1 className="text-xl font-semibold text-red-500">Blog bulunamadı!</h1>
    </div>
  );

}

return (
  <main className="max-w-3xl mx-auto px-4 py-10">

    <Link href="/" className="text-blue-100 hover:underline mb-4 inline-block">
    ←Listeye geri dön
    </Link>

    <h1 className="text-4xl font-bold mb-6 text-gray-900 leading-tight">
      {blog.title}
    </h1>

    <img src = {blog.image} 
    alt= {blog.title} 
    className="w-full h-80 object-cover rounded-2xl mb-8 shadow-lg"
    />
    <div className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl border border-gray-100">
      { blog.content}
    </div>
  </main>
);
}

