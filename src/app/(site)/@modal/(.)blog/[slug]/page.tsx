import { notFound } from "next/navigation";

import BlogDetailModal from "~/features/blog/components/blog-detail-modal";
import { fetchBlogBySlug } from "~/lib/fetch-blog";

export const dynamic = "force-dynamic";

interface BlogDetailModalPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailModalPage({
  params,
}: BlogDetailModalPageProps) {
  const { slug } = await params;
  const blog = await fetchBlogBySlug(slug);
  if (!blog) notFound();

  return <BlogDetailModal blog={blog} />;
}
