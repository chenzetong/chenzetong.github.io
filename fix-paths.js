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
  content = content.replace(/href="\/chenzetong\/chenzetong\//g, 'href="/');
  content = content.replace(/src="\/chenzetong\/chenzetong\//g, 'src="/');
  content = content.replace(/https:\/\/chenzetong\.github\.io\/chenzetong\/chenzetong\//g, 'https://chenzetong.github.io/');
  content = content.replace(/chenzetong\/chenzetong\//g, '');
  
  // 2. 处理所有特定文件 - 提前处理，这样后面的通用替换规则不会影响它们
  const specificFiles = [
    'a34f9d1faa5f3315-s.p.woff2',  // 字体文件
    '555d41a0fcb396b0.css',        // CSS文件 
    '4bd1b696-21cefdb9a3c74919.js', // JS文件
    'webpack-1a627a45f621770c.js',
    'main-app-6fcf18cda217580d.js',
    'layout-d588d9695c3296e3.js',
    'page-913f98ba578cac95.js',
    '684-836981e0e44cfcdd.js',
    '874-0715c6660f33056f.js'
  ];
  
  specificFiles.forEach(file => {
    // 使用非贪婪匹配，确保能捕获到正确的路径
    if (file.endsWith('.woff2')) {
      // 字体文件特殊处理 - 确保有相对路径和绝对路径两种形式
      content = content.replace(
        new RegExp(`href="[^"]*${file}"`, 'g'),
        `href="/_next/static/media/${file}"`
      );
      content = content.replace(
        new RegExp(`https://chenzetong\\.github\\.io/chenzetong/_next/static/media/${file}`, 'g'),
        `https://chenzetong.github.io/_next/static/media/${file}`
      );
      // 修复preload链接
      content = content.replace(
        new RegExp(`<link[^>]*rel="preload"[^>]*href="[^"]*${file}"[^>]*>`, 'g'),
        match => match.replace(/href="[^"]*"/g, `href="/_next/static/media/${file}"`)
      );
    } else if (file.endsWith('.css')) {
      // CSS文件处理
      content = content.replace(
        new RegExp(`href="[^"]*${file}"`, 'g'), 
        `href="/_next/static/css/${file}"`
      );
    } else if (file.endsWith('.js')) {
      // JS文件处理，根据文件名判断存放位置
      let folder = 'chunks';
      if (file.includes('layout') || file.includes('page')) {
        folder = 'chunks/app';
      }
      content = content.replace(
        new RegExp(`src="[^"]*${file}"`, 'g'), 
        `src="/_next/static/${folder}/${file}"`
      );
    }
  });
  
  // 3. 移除所有/chenzetong前缀
  content = content.replace(/href="\/chenzetong\/_next\//g, 'href="/_next/');
  content = content.replace(/src="\/chenzetong\/_next\//g, 'src="/_next/');
  content = content.replace(/href="\/chenzetong\/static\//g, 'href="/static/');
  content = content.replace(/src="\/chenzetong\/static\//g, 'src="/static/');
  content = content.replace(/href="\/chenzetong\/favicon/g, 'href="/favicon');
  content = content.replace(/href="\/chenzetong\//g, 'href="/');
  content = content.replace(/src="\/chenzetong\//g, 'src="/');
  
  // 4. 修复URL中的域名路径
  content = content.replace(/https:\/\/chenzetong\.github\.io\/chenzetong\//g, 'https://chenzetong.github.io/');
  
  // 5. 特殊处理preload链接，确保as属性正确
  content = content.replace(
    /<link[^>]*rel="preload"[^>]*href="[^"]*a34f9d1faa5f3315-s\.p\.woff2"[^>]*>/g,
    match => {
      if (!/as="font"/.test(match)) {
        return match.replace(/rel="preload"/, 'rel="preload" as="font"');
      }
      return match;
    }
  );

  fs.writeFileSync(htmlFile, content, 'utf8');
  console.log(`已完成文件处理: ${htmlFile}`);
}

// 确保文件可用性
function copyMissingFiles() {
  const outDir = path.join(__dirname, 'out');
  const requiredFiles = [
    {src: '_next/static/css/140248cf6002840f.css', dest: '_next/static/css/555d41a0fcb396b0.css'},
    {src: '_next/static/chunks/app/page-4f4fed0b9c7a3e33.js', dest: '_next/static/chunks/app/page-913f98ba578cac95.js'},
    {src: '_next/static/chunks/app/layout-e772fb76f0d1470d.js', dest: '_next/static/chunks/app/layout-d588d9695c3296e3.js'},
    {src: '_next/static/chunks/main-app-c7464db280b8eb09.js', dest: '_next/static/chunks/main-app-6fcf18cda217580d.js'},
  ];
  
  for (const file of requiredFiles) {
    const srcPath = path.join(outDir, file.src);
    const destPath = path.join(outDir, file.dest);
    if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
      // 确保目标目录存在
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制文件: ${file.src} -> ${file.dest}`);
    }
  }
}

// 主函数
function main() {
  const outDir = path.join(__dirname, 'out');
  
  if (!fs.existsSync(outDir)) {
    console.error('Error: out 目录不存在');
    process.exit(1);
  }
  
  // 复制可能缺失的文件
  copyMissingFiles();
  
  const htmlFiles = findHtmlFiles(outDir);
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  for (const htmlFile of htmlFiles) {
    fixPaths(htmlFile);
  }
  
  console.log('所有文件路径修复完成');
}

main(); 