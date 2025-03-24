import './globals.css'

export const metadata = {
  title: '陈泽桐的个人网站',
  description: '陈泽桐的个人网站与学术研究',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh">
      <body>
        <header>
          <nav className="container">
            <ul>
              <li><a href="/chenzetong">首页</a></li>
              <li><a href="/chenzetong/resume">简历</a></li>
              <li><a href="/chenzetong/research">研究</a></li>
              <li><a href="/chenzetong/debug" className="text-red-600">调试</a></li>
            </ul>
          </nav>
        </header>
        <div className="container">
          {children}
        </div>
        <footer>
          <p>© {new Date().getFullYear()} 陈泽桐</p>
        </footer>
      </body>
    </html>
  )
} 