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
  
  // 1. 修复双重 chenzetong 路径问题 (最高优先级)
  content = content.replace(/href="\/chenzetong\/chenzetong\//g, 'href="/chenzetong/');
  content = content.replace(/src="\/chenzetong\/chenzetong\//g, 'src="/chenzetong/');
  content = content.replace(/https:\/\/chenzetong\.github\.io\/chenzetong\/chenzetong\//g, 'https://chenzetong.github.io/chenzetong/');
  content = content.replace(/chenzetong\/chenzetong\//g, 'chenzetong/');
  
  // 2. 修复路径前缀
  content = content.replace(/href="\/chenzetong\/_next\//g, 'href="/chenzetong/_next/');
  content = content.replace(/src="\/chenzetong\/_next\//g, 'src="/chenzetong/_next/');
  
  // 3. 修复静态资源路径
  content = content.replace(/href="\/chenzetong\/static\//g, 'href="./static/');
  content = content.replace(/src="\/chenzetong\/static\//g, 'src="./static/');
  content = content.replace(/href="\/chenzetong\/favicon/g, 'href="./favicon');
  
  // 4. 修复相对路径
  content = content.replace(/href="\/chenzetong\//g, 'href="./');
  content = content.replace(/src="\/chenzetong\//g, 'src="./');
  
  // 5. 修复根路径引用
  content = content.replace(/href="\//g, 'href="./');
  content = content.replace(/src="\//g, 'src="./');
  
  // 6. 修复绝对 URL 引用
  content = content.replace(/https:\/\/chenzetong\.github\.io\/chenzetong\/_next\//g, './_next/');
  
  // 7. 修复 preload 链接
  content = content.replace(/<link[^>]*rel="preload"[^>]*href="\/chenzetong\/chenzetong\/_next\/static\/media\/([^"]*)"[^>]*>/g, 
    match => match.replace(/href="\/chenzetong\/chenzetong\/_next\/static\/media\/([^"]*)"/g, 'href="/chenzetong/_next/static/media/$1"'));
  
  // 8. 修复特定文件路径 - 只处理最重要的几个
  const importantFiles = [
    'a34f9d1faa5f3315-s.p.woff2',  // 关键字体文件
    '555d41a0fcb396b0.css',
    'webpack-1a627a45f621770c.js',
    'main-app-6fcf18cda217580d.js'
  ];
  
  importantFiles.forEach(file => {
    if (file.endsWith('.woff2')) {
      // 字体文件特殊处理
      content = content.replace(
        new RegExp(`https://chenzetong\\.github\\.io/chenzetong/_next/static/media/${file}`, 'g'),
        './_next/static/media/' + file
      );
    } else if (file.endsWith('.css')) {
      // CSS文件处理
      content = content.replace(
        new RegExp(`href="[^"]*/${file}"`, 'g'), 
        `href="./static/css/${file}"`
      );
    } else if (file.endsWith('.js')) {
      // JS文件处理
      content = content.replace(
        new RegExp(`src="[^"]*/${file}"`, 'g'), 
        `src="./static/chunks/${file}"`
      );
    }
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