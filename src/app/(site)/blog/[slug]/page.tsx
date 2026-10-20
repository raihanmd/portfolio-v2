import "@fontsource-variable/source-serif-4/opsz.css";
import "@fontsource-variable/archivo";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import AuroraBackground from "~/_components/ui/aurora-background";
import { PAGE_SEO, SITE_CONFIG } from "~/constant/seo";
import BlogDetail from "~/features/blog/components/blog-detail";
import { getBlogBySlug } from "~/lib/query-blog";
import { generateBreadcrumbSchema } from "~/lib/seo-schema";

export const dynamic = "force-dynamic";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogBySlug(slug);
  if (!article) return {};
  const url = `${SITE_CONFIG.url}/blog/${article.slug}`;
  const description = article.excerpt || PAGE_SEO.blog.description;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description,
      url,
      type: "article",
      siteName: SITE_CONFIG.name,
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [SITE_CONFIG.author.name],
    },
    twitter: { card: "summary_large_image", title: article.title, description },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const article = await getBlogBySlug(slug, { populateUploads: true });
  if (!article) notFound();
  const url = `${SITE_CONFIG.url}/blog/${article.slug}`;
  const description = article.excerpt || PAGE_SEO.blog.description;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Blog", url: `${SITE_CONFIG.url}/blog` },
    { name: article.title, url },
  ]);
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: {
      "@type": "Person",
      name: SITE_CONFIG.author.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    mainEntityOfPage: url,
    ...(article.coverURL ? { image: article.coverURL } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <AuroraBackground animateBackground={false}>
        <div className="mx-auto min-h-screen w-full max-w-6xl px-6 pt-24">
          <BlogDetail article={article} />
        </div>
      </AuroraBackground>
    </>
  );
}
