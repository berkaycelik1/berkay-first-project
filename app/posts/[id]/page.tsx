import { posts } from "../../data/posts";

type Props = {
  params: {
    id: string;
  };
};

export default function PostDetail({ params }: Props) {
  const post = posts.find(
    (p) => p.id === Number(params.id)
  );

  if (!post) {
    return <div>Post bulunamadı!</div>;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">
        {post.title}
      </h1>
      <p className="text-gray-600">
        {post.description}
      </p>
    </main>
  );
}
