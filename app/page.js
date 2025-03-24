import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <h1>欢迎来到我的网站</h1>
      <nav>
        <ul>
          <li>
            <a href="/chenzetong/resume">个人简历</a>
          </li>
          <li>
            <a href="/chenzetong/research">研究内容</a>
          </li>
          <li>
            <a href="/chenzetong/debug" className="text-red-600">调试信息</a>
          </li>
        </ul>
      </nav>
    </main>
  )
} 