'use client';

export default function InlineStyles() {
  return (
    <style jsx global>{`
      /* 基本样式 */
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f7f7f7;
        color: #333;
      }
      
      /* 导航样式 */
      nav {
        background-color: #fff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      /* 链接样式 */
      a {
        color: #0070f3;
        text-decoration: none;
      }
      
      a:hover {
        text-decoration: underline;
      }
      
      /* 按钮样式 */
      button {
        background-color: #0070f3;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        cursor: pointer;
      }
      
      button:hover {
        background-color: #0051a2;
      }
      
      /* 容器样式 */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1rem;
      }
      
      /* 标题样式 */
      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.25;
        margin-bottom: 1rem;
      }
      
      h1 {
        font-size: 2rem;
      }
      
      /* 文本样式 */
      p {
        line-height: 1.5;
        margin-bottom: 1rem;
      }
      
      /* 卡片样式 */
      .card {
        background-color: white;
        border-radius: 0.5rem;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        padding: 1.5rem;
        margin-bottom: 1.5rem;
      }
    `}</style>
  );
} 