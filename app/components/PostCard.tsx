import Link from "next/link";

type PostCardProps = {
  id: number;
  title: string;
  description: string;
};

export default function PostCard({ id, title, description }: PostCardProps) {
  return (
    <Link href={`/posts/${id}`}>
      <div className="border border-gray-300 rounded-lg p-6 mb-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-50">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </Link>
  );
}
