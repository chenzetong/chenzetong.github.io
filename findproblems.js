// 查找HTML文件中可能有问题的资源引用
const fs = require('fs');
const path = require('path');

// 分析HTML文件中的资源路径
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const results = {
    chenzetongPaths: [],
    hardCodedPaths: []
  };
  
  // 查找可能包含/chenzetong/的路径
  const chenzetongRegex = /["'](\/chenzetong\/[^"']+)["']/g;
  let match;
  while ((match = chenzetongRegex.exec(content)) !== null) {
    results.chenzetongPaths.push(match[1]);
  }
  
  // 查找硬编码的域名路径
  const hardCodedRegex = /["'](https?:\/\/chenzetong\.github\.io[^"']+)["']/g;
  while ((match = hardCodedRegex.exec(content)) !== null) {
    results.hardCodedPaths.push(match[1]);
  }
  
  return results;
}

// 递归查找目录下的所有HTML文件
function findHtmlFiles(dir) {
  const results = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      results.push(...findHtmlFiles(filePath));
    } else if (path.extname(file.name).toLowerCase() === '.html') {
      results.push(filePath);
    }
  }
  
  return results;
}

// 主函数
function main() {
  const outDir = path.join(__dirname, 'out');
  const htmlFiles = findHtmlFiles(outDir);
  const allResults = {};
  
  htmlFiles.forEach(file => {
    const relPath = path.relative(outDir, file);
    const results = analyzeFile(file);
    
    if (results.chenzetongPaths.length > 0 || results.hardCodedPaths.length > 0) {
      allResults[relPath] = results;
    }
  });
  
  // 生成问题报告
  const reportFilePath = path.join(outDir, 'pathproblems.html');
  
  const reportContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>路径问题分析</title>
  <style>
    body { font-family: sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
    h1, h2, h3 { color: #333; }
    .file { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .file h3 { margin-top: 0; color: #0066cc; }
    .paths { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; white-space: pre-wrap; }
    .none { color: #888; font-style: italic; }
    .warning { background-color: #fff8e1; border-left: 4px solid #ffc107; padding: 10px; margin: 10px 0; }
    .error { background-color: #ffebee; border-left: 4px solid #f44336; padding: 10px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>路径问题分析</h1>
  
  <div class="warning">
    <strong>注意:</strong> 检测到以下HTML文件中可能存在路径问题，导致资源无法正确加载。
  </div>
  
  <h2>问题文件</h2>
  ${Object.keys(allResults).length === 0 ? 
    '<p class="none">未发现问题文件</p>' : 
    Object.entries(allResults).map(([file, results]) => `
      <div class="file">
        <h3>${file}</h3>
        
        <h4>包含 /chenzetong/ 的路径:</h4>
        <div class="paths ${results.chenzetongPaths.length === 0 ? 'none' : 'error'}">
          ${results.chenzetongPaths.length === 0 ? '无' : results.chenzetongPaths.join('\n')}
        </div>
        
        <h4>硬编码域名路径:</h4>
        <div class="paths ${results.hardCodedPaths.length === 0 ? 'none' : 'error'}">
          ${results.hardCodedPaths.length === 0 ? '无' : results.hardCodedPaths.join('\n')}
        </div>
      </div>
    `).join('')
  }

  <div class="warning">
    <p><strong>建议:</strong> 使用相对路径或从根目录引用资源 (例如, "/static/js/script.js" 而不是 "/chenzetong/static/js/script.js")。</p>
    <p>对于硬编码的URL，应该避免使用完整域名，或确保使用正确的路径结构。</p>
  </div>
</body>
</html>
  `;
  
  fs.writeFileSync(reportFilePath, reportContent);
  console.log(`问题分析报告已生成: ${reportFilePath}`);
  
  return Object.keys(allResults).length === 0;
}

main(); 