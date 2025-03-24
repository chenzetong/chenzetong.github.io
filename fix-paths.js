const fs = require('fs');
const path = require('path');

// 寻找并修改 HTML 文件中的路径
function processHtmlFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // 递归处理子目录
      processHtmlFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      // 处理 HTML 文件
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 移除不正确的前缀
      content = content.replace(/\/chenzetong\/_next\//g, '/_next/');
      
      // 将 /_next/ 替换为相对路径
      content = content.replace(/\"\/_next\//g, '"./_next/');
      
      // 保存修改后的文件
      fs.writeFileSync(fullPath, content);
      console.log(`已修复: ${fullPath}`);
    }
  }
}

// 主函数
function main() {
  const outDir = path.join(__dirname, 'out');
  
  if (fs.existsSync(outDir)) {
    processHtmlFiles(outDir);
    console.log('已修复 HTML 文件中的路径');
  } else {
    console.error('找不到输出目录');
  }
}

main(); 