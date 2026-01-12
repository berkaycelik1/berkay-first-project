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
      <div className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition cursor-pointer bg-white">
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
