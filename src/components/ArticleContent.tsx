import Link from 'next/link';
import Image from 'next/image';

interface ArticleContentProps {
  content: string;
  frontmatter: {
    title: string;
    category: string;
    date: string;
    author: string;
    coverImage: string;
  };
}

export default function ArticleContent({ content, frontmatter }: ArticleContentProps) {
  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* 返回按钮 */}
      <div>
        <Link
          href="/research"
          className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
        >
          <span>← 返回列表</span>
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{frontmatter.category}</span>
          <span>•</span>
          <time>{frontmatter.date}</time>
          <span>•</span>
          <span>{frontmatter.author}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {frontmatter.title}
        </h1>
      </header>

      {/* 封面图片 */}
      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 文章内容 */}
      <div
        className="prose prose-gray max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* 分享和评论区 */}
      <footer className="border-t pt-8">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-blue-600">
              分享文章
            </button>
            <button className="text-gray-600 hover:text-blue-600">
              添加评论
            </button>
          </div>
          <button className="text-gray-600 hover:text-blue-600">
            返回顶部 ↑
          </button>
        </div>
      </footer>
    </article>
  );
} 