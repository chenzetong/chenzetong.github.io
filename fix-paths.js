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
  
  // 5. 修复根路径引用
  content = content.replace(/href="\//g, 'href="./');
  content = content.replace(/src="\//g, 'src="./');
  
  // 6. 修复绝对 URL 引用
  content = content.replace(/https:\/\/chenzetong\.github\.io\/chenzetong\/_next\//g, './_next/');
  content = content.replace(/https:\/\/chenzetong\.github\.io\/_next\//g, './_next/');
  
  // 7. 修复直接引用 _next 目录的资源
  content = content.replace(/href="\/_next\//g, 'href="./_next/');
  content = content.replace(/src="\/_next\//g, 'src="./_next/');

  // 8. 修复 link 和 script 标签中的路径
  content = content.replace(/<link[^>]*href="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`href="/${p1}"`, `href="./${p1}"`);
  });
  
  content = content.replace(/<script[^>]*src="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`src="/${p1}"`, `src="./${p1}"`);
  });
  
  // 9. 修复预加载字体路径
  content = content.replace(/url\(\/chenzetong\/_next\/static\/media\//g, 'url(./_next/static/media/');
  content = content.replace(/url\(\/_next\/static\/media\//g, 'url(./_next/static/media/');
  
  // 10. 修复 JSON-LD 和其他内联脚本中的路径
  content = content.replace(/"url":\s*"\/chenzetong\//g, '"url": "./');
  
  // 11. 处理页面内部的 a 标签链接
  content = content.replace(/<a[^>]*href="\/([^"]*)"[^>]*>/g, (match, p1) => {
    return match.replace(`href="/${p1}"`, `href="./${p1}"`);
  });

  // 12. 修复 preload 链接
  content = content.replace(/rel="preload" href="\/chenzetong\/_next\//g, 'rel="preload" href="./_next/');
  content = content.replace(/rel="preload" href="\/_next\//g, 'rel="preload" href="./_next/');
  
  // 13. 修复预加载字体 - 特别处理带 as 属性的 preload 链接
  content = content.replace(/<link[^>]*rel="preload"[^>]*href="[^"]*\/chenzetong\/_next\/static\/media\/([^"]*)"[^>]*>/g, 
    match => match.replace(/href="[^"]*\/chenzetong\/_next\/static\/media\/([^"]*)"/g, 'href="./_next/static/media/$1"'));
  
  content = content.replace(/<link[^>]*rel="preload"[^>]*href="[^"]*\/_next\/static\/media\/([^"]*)"[^>]*>/g, 
    match => match.replace(/href="[^"]*\/_next\/static\/media\/([^"]*)"/g, 'href="./_next/static/media/$1"'));

  // 14. 修复带有哈希值的CSS和JS文件路径 - 精确匹配长哈希值模式
  content = content.replace(/href="[^"]*\/([a-f0-9]{8,}\.css)"/g, 'href="./static/$1"');
  content = content.replace(/src="[^"]*\/([a-f0-9]{8,}\.js)"/g, 'src="./static/$1"');
  
  // 15. 处理带有破折号的哈希值文件
  content = content.replace(/href="[^"]*\/([a-f0-9]+-[a-f0-9]+\.(?:css|js))"/g, 'href="./static/$1"');
  content = content.replace(/src="[^"]*\/([a-f0-9]+-[a-f0-9]+\.(?:css|js))"/g, 'src="./static/$1"');
  
  // 16. 修复可能的字体文件引用
  content = content.replace(/href="[^"]*\/([a-f0-9]+-[a-f0-9]+\.(?:woff2|woff|ttf|eot))"/g, 'href="./static/$1"');
  content = content.replace(/src="[^"]*\/([a-f0-9]+-[a-f0-9]+\.(?:woff2|woff|ttf|eot))"/g, 'src="./static/$1"');
  
  // 17. 处理直接引用根目录下的哈希值文件
  content = content.replace(/href="\/([a-f0-9]{8,}\.[a-z]+)"/g, 'href="./static/$1"');
  content = content.replace(/src="\/([a-f0-9]{8,}\.[a-z]+)"/g, 'src="./static/$1"');
  
  // 18. 直接处理用户报告的特定文件 (直接匹配完整文件名)
  const specificFiles = [
    '555d41a0fcb396b0.css',
    '4bd1b696-21cefdb9a3c74919.js',
    'webpack-1a627a45f621770c.js',
    'layout-d588d9695c3296e3.js',
    'page-913f98ba578cac95.js',
    '684-836981e0e44cfcdd.js',
    '874-0715c6660f33056f.js',
    'main-app-6fcf18cda217580d.js'
  ];
  
  specificFiles.forEach(file => {
    const baseFile = file.split('/').pop(); // 获取文件名部分
    const isJS = baseFile.endsWith('.js');
    const isCSS = baseFile.endsWith('.css');
    
    if (isJS) {
      // 检查并替换各种可能的JS文件路径模式
      content = content.replace(new RegExp(`src="[^"]*/${baseFile}"`, 'g'), `src="./static/chunks/${baseFile}"`);
      content = content.replace(new RegExp(`src="[^"]*/_next/static/chunks/${baseFile}"`, 'g'), `src="./static/chunks/${baseFile}"`);
    } else if (isCSS) {
      // 检查并替换各种可能的CSS文件路径模式
      content = content.replace(new RegExp(`href="[^"]*/${baseFile}"`, 'g'), `href="./static/css/${baseFile}"`);
      content = content.replace(new RegExp(`href="[^"]*/_next/static/css/${baseFile}"`, 'g'), `href="./static/css/${baseFile}"`);
    }
  });
  
  // 19. 特别处理Next.js页面加载时的字体文件引用
  content = content.replace(
    /https:\/\/chenzetong\.github\.io\/chenzetong\/_next\/static\/media\/a34f9d1faa5f3315-s\.p\.woff2/g, 
    './_next/static/media/a34f9d1faa5f3315-s.p.woff2'
  );
  content = content.replace(
    /https:\/\/chenzetong\.github\.io\/_next\/static\/media\/a34f9d1faa5f3315-s\.p\.woff2/g, 
    './_next/static/media/a34f9d1faa5f3315-s.p.woff2'
  );

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