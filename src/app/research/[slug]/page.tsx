import { Metadata } from 'next';
import { getArticleBySlug, getAllArticles } from '@/lib/mdx';
import ArticleContent from '@/components/ArticleContent';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { frontmatter } = await getArticleBySlug(params.slug);
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

// @ts-expect-error - Next.js type issue with dynamic routes
export default async function Page(props) {
  const { content, frontmatter } = await getArticleBySlug(props.params.slug);
  return <ArticleContent content={content} frontmatter={frontmatter} />;
} 