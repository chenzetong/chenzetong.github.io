/**
 * 创建一个页面，用于检查线上网站的资源加载情况
 */
const fs = require('fs');
const path = require('path');

// 生成在线检查页面
function createCheckPage() {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>线上网站检查</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
    h1, h2, h3 { color: #333; }
    .section { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .success { color: #4caf50; font-weight: bold; }
    .error { color: #f44336; font-weight: bold; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
    button { margin: 5px; padding: 8px 15px; cursor: pointer; background: #0066cc; color: white; border: none; border-radius: 4px; }
    button:hover { background: #0055aa; }
    .loader { border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: inline-block; margin-left: 10px; vertical-align: middle; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .hide { display: none; }
    .action-row { display: flex; align-items: center; margin-bottom: 10px; }
    .action-row button { flex-shrink: 0; }
    .action-row input { flex-grow: 1; padding: 8px; margin-right: 10px; }
    .status-badge { display: inline-block; padding: 3px 7px; border-radius: 3px; font-size: 0.8em; margin-left: 5px; }
    .status-200 { background-color: #e8f5e9; color: #2e7d32; }
    .status-404 { background-color: #ffebee; color: #c62828; }
    .status-other { background-color: #fff8e1; color: #ff8f00; }
  </style>
</head>
<body>
  <h1>线上网站资源检查工具</h1>
  <p>这个工具用于检查网站的资源加载情况，特别是对于出现404错误的资源。</p>
  
  <div class="section">
    <h2>1. 检查常见问题资源</h2>
    <p>点击下面的按钮检查已知可能有问题的资源：</p>
    <button onclick="checkProblemResources()">检查问题资源</button>
    <div id="result-problems" class="hide">
      <h3>检查结果：</h3>
      <table id="problems-table">
        <tr>
          <th>资源</th>
          <th>状态</th>
        </tr>
      </table>
    </div>
  </div>
  
  <div class="section">
    <h2>2. 页面资源分析</h2>
    <p>分析当前页面加载的所有资源：</p>
    <button onclick="analyzePageResources()">分析页面资源</button>
    <div id="result-resources" class="hide">
      <h3>分析结果：</h3>
      <table id="resources-table">
        <tr>
          <th>资源URL</th>
          <th>类型</th>
          <th>状态</th>
        </tr>
      </table>
    </div>
  </div>
  
  <div class="section">
    <h2>3. 检查特定资源</h2>
    <p>输入要检查的资源URL：</p>
    <div class="action-row">
      <input type="text" id="resource-url" placeholder="输入资源URL，例如: /_next/static/css/555d41a0fcb396b0.css" />
      <button onclick="checkSpecificResource()">检查</button>
    </div>
    <div id="result-specific" class="hide">
      <h3>检查结果：</h3>
      <pre id="specific-result"></pre>
    </div>
  </div>
  
  <div class="section">
    <h2>4. 清除缓存并刷新</h2>
    <p>如果资源仍然无法加载，可能是由于浏览器缓存。点击下面的按钮清除缓存并重新加载页面：</p>
    <button onclick="clearCacheAndReload()">清除缓存并刷新</button>
  </div>
  
  <script>
    // 检查问题资源
    async function checkProblemResources() {
      const problemResources = [
        { name: '字体文件', url: '/_next/static/media/a34f9d1faa5f3315-s.p.woff2' },
        { name: 'CSS文件', url: '/_next/static/css/555d41a0fcb396b0.css' },
        { name: 'JS文件 (4bd1b696)', url: '/_next/static/chunks/4bd1b696-21cefdb9a3c74919.js' },
        { name: 'JS文件 (webpack)', url: '/_next/static/chunks/webpack-1a627a45f621770c.js' },
        { name: 'JS文件 (684)', url: '/_next/static/chunks/684-836981e0e44cfcdd.js' },
        { name: 'JS文件 (main-app)', url: '/_next/static/chunks/main-app-6fcf18cda217580d.js' },
        { name: 'JS文件 (874)', url: '/_next/static/chunks/874-0715c6660f33056f.js' },
        { name: 'JS文件 (layout)', url: '/_next/static/chunks/app/layout-d588d9695c3296e3.js' },
        { name: 'JS文件 (page)', url: '/_next/static/chunks/app/page-913f98ba578cac95.js' },
        // 检查旧版本的路径是否仍在被请求
        { name: '带chenzetong前缀的字体文件', url: '/chenzetong/_next/static/media/a34f9d1faa5f3315-s.p.woff2' },
        { name: '带chenzetong前缀的CSS文件', url: '/chenzetong/_next/static/css/555d41a0fcb396b0.css' }
      ];
      
      const resultDiv = document.getElementById('result-problems');
      resultDiv.classList.remove('hide');
      
      const table = document.getElementById('problems-table');
      // 清除旧结果，但保留表头
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      
      // 添加加载指示器
      const loadingRow = table.insertRow();
      const loadingCell = loadingRow.insertCell();
      loadingCell.colSpan = 2;
      loadingCell.innerHTML = '<div class="loader"></div> 正在检查资源...';
      
      // 检查每个资源
      for (const resource of problemResources) {
        try {
          const response = await fetch(resource.url, { method: 'HEAD', cache: 'no-store' });
          const row = table.insertRow();
          
          const nameCell = row.insertCell();
          nameCell.textContent = resource.name + ': ' + resource.url;
          
          const statusCell = row.insertCell();
          const statusClass = response.status === 200 ? 'status-200' : 
                            response.status === 404 ? 'status-404' : 'status-other';
          
          statusCell.innerHTML = \`<span class="status-badge \${statusClass}">\${response.status}</span>\`;
          
          if (response.status !== 200) {
            row.classList.add('error');
          } else {
            row.classList.add('success');
          }
        } catch (error) {
          const row = table.insertRow();
          const nameCell = row.insertCell();
          nameCell.textContent = resource.name + ': ' + resource.url;
          
          const statusCell = row.insertCell();
          statusCell.textContent = 'Error: ' + error.message;
          row.classList.add('error');
        }
      }
      
      // 移除加载指示器
      table.deleteRow(1);
    }
    
    // 分析页面资源
    function analyzePageResources() {
      const resources = performance.getEntriesByType('resource');
      const resultDiv = document.getElementById('result-resources');
      resultDiv.classList.remove('hide');
      
      const table = document.getElementById('resources-table');
      // 清除旧结果，但保留表头
      while (table.rows.length > 1) {
        table.deleteRow(1);
      }
      
      // 添加加载指示器
      const loadingRow = table.insertRow();
      const loadingCell = loadingRow.insertCell();
      loadingCell.colSpan = 3;
      loadingCell.innerHTML = '<div class="loader"></div> 正在分析资源...';
      
      // 检查不使用异步以避免过多请求
      let processedCount = 0;
      
      resources.forEach(resource => {
        // 创建一个表格行
        const row = document.createElement('tr');
        
        // URL列
        const urlCell = document.createElement('td');
        urlCell.textContent = resource.name;
        row.appendChild(urlCell);
        
        // 类型列
        const typeCell = document.createElement('td');
        typeCell.textContent = resource.initiatorType;
        row.appendChild(typeCell);
        
        // 状态列 - 异步检查
        const statusCell = document.createElement('td');
        statusCell.innerHTML = '<div class="loader"></div>';
        row.appendChild(statusCell);
        
        // 检查资源状态
        fetch(resource.name, { method: 'HEAD', cache: 'no-store' })
          .then(response => {
            const statusClass = response.status === 200 ? 'status-200' : 
                              response.status === 404 ? 'status-404' : 'status-other';
            
            statusCell.innerHTML = \`<span class="status-badge \${statusClass}">\${response.status}</span>\`;
            
            if (response.status !== 200) {
              row.classList.add('error');
            }
            
            processedCount++;
            if (processedCount === resources.length) {
              // 所有资源处理完毕，移除加载指示器
              table.deleteRow(1);
            }
          })
          .catch(error => {
            statusCell.textContent = 'Error: ' + error.message;
            row.classList.add('error');
            
            processedCount++;
            if (processedCount === resources.length) {
              // 所有资源处理完毕，移除加载指示器
              table.deleteRow(1);
            }
          });
        
        // 在加载指示器行后添加此资源行
        table.appendChild(row);
      });
      
      // 如果没有资源，移除加载指示器并显示消息
      if (resources.length === 0) {
        loadingCell.innerHTML = '没有找到资源';
      }
    }
    
    // 检查特定资源
    async function checkSpecificResource() {
      const resourceUrl = document.getElementById('resource-url').value.trim();
      if (!resourceUrl) {
        alert('请输入资源URL');
        return;
      }
      
      const resultDiv = document.getElementById('result-specific');
      resultDiv.classList.remove('hide');
      
      const resultPre = document.getElementById('specific-result');
      resultPre.innerHTML = '<div class="loader"></div> 正在检查资源...';
      
      try {
        const response = await fetch(resourceUrl, { cache: 'no-store' });
        const status = response.status;
        const headers = {};
        
        for (const [key, value] of response.headers.entries()) {
          headers[key] = value;
        }
        
        const result = {
          url: resourceUrl,
          status,
          headers,
          ok: response.ok
        };
        
        if (response.ok) {
          resultPre.innerHTML = '<span class="success">✓ 资源加载成功</span>\\n\\n' + 
                               JSON.stringify(result, null, 2);
        } else {
          resultPre.innerHTML = '<span class="error">✗ 资源加载失败</span>\\n\\n' + 
                               JSON.stringify(result, null, 2);
        }
      } catch (error) {
        resultPre.innerHTML = '<span class="error">✗ 请求错误</span>\\n\\n' + 
                             JSON.stringify({
                               url: resourceUrl,
                               error: error.message
                             }, null, 2);
      }
    }
    
    // 清除缓存并刷新
    function clearCacheAndReload() {
      if (window.caches) {
        caches.keys().then(names => {
          for (let name of names) {
            caches.delete(name);
          }
        });
      }
      
      // 强制刷新页面，绕过缓存
      location.reload(true);
    }
  </script>
</body>
</html>
  `;

  // 写入检查页面
  fs.writeFileSync(path.join(__dirname, 'out', 'check.html'), htmlContent);
  console.log('检查页面已创建: check.html');
  
  // 尝试在现有的所有HTML文件中添加一个链接到这个检查页面
  const outDir = path.join(__dirname, 'out');
  
  function findHtmlFiles(dir) {
    const results = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        results.push(...findHtmlFiles(filePath));
      } else if (path.extname(file.name).toLowerCase() === '.html' && file.name !== 'check.html') {
        results.push(filePath);
      }
    }
    
    return results;
  }
  
  const htmlFiles = findHtmlFiles(outDir);
  
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // 添加检查链接
    const checkLink = `
    <div style="position: fixed; bottom: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 4px; z-index: 9999;">
      <a href="/check.html" style="color: white; text-decoration: none;">资源检查</a>
    </div>
    `;
    
    // 在body结束标签前添加链接
    if (content.includes('</body>')) {
      content = content.replace('</body>', checkLink + '</body>');
      fs.writeFileSync(file, content);
      console.log(`已添加检查链接到: ${path.relative(outDir, file)}`);
    }
  });
}

// 主函数
function main() {
  createCheckPage();
}

main(); 