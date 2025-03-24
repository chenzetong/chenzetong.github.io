const fs = require('fs');
const path = require('path');

// 查找所有HTML文件
function findHtmlFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 递归查找子目录
      results = results.concat(findHtmlFiles(filePath));
    } else if (path.extname(file) === '.html') {
      results.push(filePath);
    }
  }
  
  return results;
}

// 修复HTML文件中的路径
function fixPaths(htmlFile) {
  console.log(`正在处理文件: ${htmlFile}`);
  
  let content = fs.readFileSync(htmlFile, 'utf8');
  
  // 修复各种路径问题
  // 1. 修复 _next 路径 (去掉 /chenzetong 前缀)
  content = content.replace(/href="\/chenzetong\/_next\//g, 'href="./_next/');
  content = content.replace(/src="\/chenzetong\/_next\//g, 'src="./_next/');
  
  // 2. 修复静态资源路径 (从绝对路径转为相对路径)
  content = content.replace(/href="\/chenzetong\/static\//g, 'href="./static/');
  content = content.replace(/src="\/chenzetong\/static\//g, 'src="./static/');
  
  // 3. 修复 favicon 等静态资源路径
  content = content.replace(/href="\/chenzetong\/favicon/g, 'href="./favicon');
  
  // 4. 修复其他 href 和 src 属性中的路径
  content = content.replace(/href="\/chenzetong\//g, 'href="./');
  content = content.replace(/src="\/chenzetong\//g, 'src="./');
  
  // 5. 修复 link 和 script 标签中的路径
  content = content.replace(/<link[^>]*href="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`href="/${p1}"`, `href="./${p1}"`);
  });
  
  content = content.replace(/<script[^>]*src="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`src="/${p1}"`, `src="./${p1}"`);
  });
  
  // 6. 修复预加载字体路径
  content = content.replace(/url\(\/chenzetong\/_next\/static\/media\//g, 'url(./_next/static/media/');
  
  // 7. 修复 JSON-LD 和其他内联脚本中的路径
  content = content.replace(/"url":\s*"\/chenzetong\//g, '"url": "./');
  
  // 8. 修复根路径引用
  content = content.replace(/href="\//g, 'href="./');
  content = content.replace(/src="\//g, 'src="./');
  
  // 9. 处理页面内部的 a 标签链接
  content = content.replace(/<a[^>]*href="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`href="/${p1}"`, `href="./${p1}"`);
  });
  
  fs.writeFileSync(htmlFile, content, 'utf8');
  console.log(`已完成文件处理: ${htmlFile}`);
}

// 主函数
function main() {
  const outDir = path.join(__dirname, 'out');
  
  if (!fs.existsSync(outDir)) {
    console.error('Error: out 目录不存在');
    process.exit(1);
  }
  
  const htmlFiles = findHtmlFiles(outDir);
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  for (const htmlFile of htmlFiles) {
    fixPaths(htmlFile);
  }
  
  console.log('所有文件路径修复完成');
}

main(); 