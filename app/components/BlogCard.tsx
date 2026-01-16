import Link from "next/link";

type BlogCardProps = {
  slug: string;
  title: string;
  description: string;
  image: string;
};

export default function BlogCard({
  slug,
  title,
  description,
  image,
}: BlogCardProps) {
  return (
    <Link href={`/blogs/${slug}`}>
      <div className="bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-xl overflow-hidden shadow-md transition-colors">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover block"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );
}
