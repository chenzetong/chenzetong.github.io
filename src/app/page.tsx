import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* 个人介绍部分 */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          欢迎来到我的博客
        </h1>
        <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
          这里是我分享个人经历、研究成果和技术见解的地方。通过这个平台，我希望能与更多志同道合的人交流和分享。
        </p>
      </section>

      {/* 导航卡片 */}
      <section className="grid md:grid-cols-2 gap-8 pt-8">
        <Link
          href="/routes/resume"
          className="group relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">个人简历</h2>
            <p className="text-gray-500">
              了解我的教育背景、工作经历和专业技能
            </p>
          </div>
        </Link>
        <Link
          href="/routes/research"
          className="group relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900">研究内容</h2>
            <p className="text-gray-500">
              浏览我的研究项目、论文发表和技术博客
            </p>
          </div>
        </Link>
      </section>
    </div>
  );
}
