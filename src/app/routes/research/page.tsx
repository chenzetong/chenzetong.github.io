import Link from 'next/link';
import { getAllArticles } from '@/lib/mdx';

export default async function ResearchPage() {
  const articles = await getAllArticles();

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          研究内容
        </h1>
        <p className="text-lg text-gray-600">
          这里展示我的研究项目、论文发表和技术博客
        </p>
      </header>

      {/* 分类导航 */}
      <nav className="flex justify-center space-x-4">
        {['全部', '项目', '论文', '博客'].map((category) => (
          <button
            key={category}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            {category}
          </button>
        ))}
      </nav>

      {/* 文章列表 */}
      <div className="space-y-8">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="flex flex-col space-y-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-600">
                {article.category}
              </span>
              <time className="text-sm text-gray-500">{article.date}</time>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                <Link
                  href={`/routes/research/${article.slug}`}
                  className="hover:text-blue-600"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 text-gray-600">{article.description}</p>
            </div>
            <div className="flex justify-end">
              <Link
                href={`/routes/research/${article.slug}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                阅读更多 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
} 