// 调试脚本 - 分析资源加载路径
const fs = require('fs');
const path = require('path');

// 创建一个HTML文件检查请求路径
function createDebugHTML() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>资源路径调试</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
    .result { background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0; white-space: pre-wrap; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>资源路径调试</h1>
  
  <h2>当前位置</h2>
  <div class="result" id="location"></div>
  
  <h2>请求的资源</h2>
  <table id="resources">
    <tr>
      <th>URL</th>
      <th>类型</th>
      <th>状态</th>
    </tr>
  </table>

  <h2>页面元素分析</h2>
  <div class="result" id="elements"></div>
  
  <script>
    // 显示当前页面位置
    document.getElementById('location').textContent = JSON.stringify({
      href: location.href,
      origin: location.origin,
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      protocol: location.protocol,
      host: location.host
    }, null, 2);
    
    // 分析资源加载情况
    function checkResources() {
      const resources = performance.getEntriesByType('resource');
      const table = document.getElementById('resources');
      
      resources.forEach(resource => {
        const row = table.insertRow();
        
        const urlCell = row.insertCell();
        urlCell.textContent = resource.name;
        
        const typeCell = row.insertCell();
        typeCell.textContent = resource.initiatorType;
        
        const statusCell = row.insertCell();
        
        // 检查资源是否可用
        fetch(resource.name, { method: 'HEAD', cache: 'no-store' })
          .then(response => {
            statusCell.textContent = response.status;
            if (response.status !== 200) {
              row.style.color = 'red';
            }
          })
          .catch(error => {
            statusCell.textContent = 'Error: ' + error.message;
            row.style.color = 'red';
          });
      });
    }
    
    // 分析页面元素
    function analyzeElements() {
      const scripts = Array.from(document.querySelectorAll('script[src]'))
        .map(el => ({ type: 'script', src: el.src }));
      
      const links = Array.from(document.querySelectorAll('link[href]'))
        .map(el => ({ type: 'link', rel: el.rel, href: el.href }));
      
      const images = Array.from(document.querySelectorAll('img[src]'))
        .map(el => ({ type: 'image', src: el.src }));
      
      document.getElementById('elements').textContent = JSON.stringify({
        scripts,
        links,
        images
      }, null, 2);
    }
    
    // 页面加载完成后执行
    window.addEventListener('load', () => {
      checkResources();
      analyzeElements();
    });
  </script>
</body>
</html>
  `;

  // 写入debug.html文件
  fs.writeFileSync(path.join(__dirname, 'out', 'debug.html'), htmlContent);
  console.log('调试页面已创建: debug.html');
}

// 在out目录中查找所有HTML文件，并添加一个调试链接
function addDebugLinks() {
  const outDir = path.join(__dirname, 'out');
  const files = [];
  
  function findHtmlFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (entry.name.endsWith('.html')) {
        files.push(fullPath);
      }
    }
  }
  
  findHtmlFiles(outDir);
  
  // 修改每个HTML文件
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 添加调试链接
    const debugLink = `
    <div style="position: fixed; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; z-index: 9999;">
      <a href="/debug.html" style="color: white; text-decoration: none;">调试</a>
    </div>
    `;
    
    // 在body结束标签前添加调试链接
    if (content.includes('</body>')) {
      content = content.replace('</body>', debugLink + '</body>');
      fs.writeFileSync(file, content);
      console.log(`已添加调试链接到: ${path.relative(outDir, file)}`);
    }
  });
}

// 主函数
function main() {
  createDebugHTML();
  addDebugLinks();
}

main(); 