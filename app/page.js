import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">欢迎来到我的网站</h1>
      <nav className="space-x-4">
        <Link href="/resume" className="text-blue-600 hover:text-blue-800">
          个人简历
        </Link>
        <Link href="/research" className="text-blue-600 hover:text-blue-800">
          研究内容
        </Link>
      </nav>
    </main>
  )
} 