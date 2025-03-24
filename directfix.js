/**
 * 直接修复HTML文件中的路径问题
 * 这个脚本会扫描out目录下的所有HTML文件，找出并修复错误的资源路径
 */
const fs = require('fs');
const path = require('path');

// 查找所有HTML文件
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

// 直接修复HTML文件中的路径
function fixHtmlFile(filePath) {
  console.log(`处理文件: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  const errors = [];
  
  // 1. 修复双重chenzetong路径
  let count = 0;
  content = content.replace(/["'](\/chenzetong\/chenzetong\/)([^"']+)["']/g, (match, p1, p2) => {
    count++;
    return `"/${p2}"`;
  });
  if (count > 0) errors.push(`修复了 ${count} 个双重chenzetong路径`);
  
  // 2. 修复单个chenzetong路径
  count = 0;
  content = content.replace(/["'](\/chenzetong\/)([^"']+)["']/g, (match, p1, p2) => {
    count++;
    return `"/${p2}"`;
  });
  if (count > 0) errors.push(`修复了 ${count} 个chenzetong前缀路径`);
  
  // 3. 修复硬编码的chenzetong.github.io路径
  count = 0;
  content = content.replace(/["'](https?:\/\/chenzetong\.github\.io\/chenzetong\/)([^"']+)["']/g, (match, p1, p2) => {
    count++;
    return `"https://chenzetong.github.io/${p2}"`;
  });
  if (count > 0) errors.push(`修复了 ${count} 个硬编码域名路径`);
  
  // 4. 修复带有chenzetong的URL()路径 (CSS中的用法)
  count = 0;
  content = content.replace(/url\(["']?(\/chenzetong\/|https?:\/\/chenzetong\.github\.io\/chenzetong\/)([^"'\)]+)["']?\)/g, (match, p1, p2) => {
    count++;
    if (p1.startsWith('http')) {
      return `url(https://chenzetong.github.io/${p2})`;
    }
    return `url(/${p2})`;
  });
  if (count > 0) errors.push(`修复了 ${count} 个CSS URL路径`);
  
  // 5. 特殊处理font preload链接
  count = 0;
  content = content.replace(/<link\s+[^>]*rel=["']preload["'][^>]*href=["'][^"']*\/chenzetong\/[^"']*\.woff2["'][^>]*>/g, (match) => {
    const newMatch = match
      .replace(/href=["'][^"']*\/chenzetong\/([^"']*)["']/, 'href="/$1"')
      .replace(/href=["'][^"']*\/chenzetong\/chenzetong\/([^"']*)["']/, 'href="/$1"');
    
    // 确保添加as="font"属性
    if (!/\s+as=["']font["']/.test(newMatch)) {
      count++;
      return newMatch.replace(/rel=["']preload["']/, 'rel="preload" as="font"');
    }
    
    count++;
    return newMatch;
  });
  if (count > 0) errors.push(`修复了 ${count} 个字体预加载链接`);
  
  // 6. 确保文件中所有script, link, img等标签的路径正确
  let tagsFixed = 0;
  
  // 修复script标签
  content = content.replace(/<script\s+[^>]*src=["']([^"']*)["'][^>]*>/g, (match, src) => {
    if (src.includes('/chenzetong/')) {
      tagsFixed++;
      return match.replace(/src=["'][^"']*\/chenzetong\/([^"']*)["']/, 'src="/$1"');
    }
    return match;
  });
  
  // 修复link标签
  content = content.replace(/<link\s+[^>]*href=["']([^"']*)["'][^>]*>/g, (match, href) => {
    if (href.includes('/chenzetong/')) {
      tagsFixed++;
      return match.replace(/href=["'][^"']*\/chenzetong\/([^"']*)["']/, 'href="/$1"');
    }
    return match;
  });
  
  // 修复img标签
  content = content.replace(/<img\s+[^>]*src=["']([^"']*)["'][^>]*>/g, (match, src) => {
    if (src.includes('/chenzetong/')) {
      tagsFixed++;
      return match.replace(/src=["'][^"']*\/chenzetong\/([^"']*)["']/, 'src="/$1"');
    }
    return match;
  });
  
  if (tagsFixed > 0) errors.push(`修复了 ${tagsFixed} 个HTML标签路径`);
  
  // 7. 创建一个特殊规则来处理已知问题的特定资源文件
  const problemFiles = [
    'a34f9d1faa5f3315-s.p.woff2',
    '555d41a0fcb396b0.css',
    '4bd1b696-21cefdb9a3c74919.js',
    'webpack-1a627a45f621770c.js',
    'main-app-6fcf18cda217580d.js',
    'layout-d588d9695c3296e3.js',
    'page-913f98ba578cac95.js',
    '684-836981e0e44cfcdd.js',
    '874-0715c6660f33056f.js'
  ];
  
  let specificFilesFixed = 0;
  problemFiles.forEach(file => {
    // 确保搜索是大小写敏感的，并且只匹配完整文件名
    const regex = new RegExp(`(["']|\\()([^"'\\(\\)]*\/chenzetong\/[^"'\\(\\)]*)(${file.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})(["']|\\))`, 'g');
    content = content.replace(regex, (match, prefix, path, filename, suffix) => {
      specificFilesFixed++;
      // 确定正确的替换，根据文件扩展名
      if (filename.endsWith('.woff2')) {
        return `${prefix}/_next/static/media/${filename}${suffix}`;
      } else if (filename.endsWith('.css')) {
        return `${prefix}/_next/static/css/${filename}${suffix}`;
      } else if (filename.endsWith('.js')) {
        if (filename.includes('layout') || filename.includes('page')) {
          return `${prefix}/_next/static/chunks/app/${filename}${suffix}`;
        }
        return `${prefix}/_next/static/chunks/${filename}${suffix}`;
      }
      return match;
    });
  });
  
  if (specificFilesFixed > 0) errors.push(`修复了 ${specificFilesFixed} 个特定问题文件路径`);
  
  // 只有在内容有变化时才写入文件
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`已修复文件: ${filePath}`);
    console.log(`  ${errors.join('\n  ')}`);
    return true;
  } else {
    console.log(`文件无需修改: ${filePath}`);
    return false;
  }
}

// 检查HTML文件中是否还有残留的问题
function checkForRemainingIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = {
    chenzetongPaths: [],
    hardCodedPaths: []
  };
  
  // 查找可能包含/chenzetong/的路径
  const chenzetongRegex = /["'](\/chenzetong\/[^"']+)["']/g;
  let match;
  while ((match = chenzetongRegex.exec(content)) !== null) {
    issues.chenzetongPaths.push(match[1]);
  }
  
  // 查找硬编码的域名路径
  const hardCodedRegex = /["'](https?:\/\/chenzetong\.github\.io\/chenzetong[^"']+)["']/g;
  while ((match = hardCodedRegex.exec(content)) !== null) {
    issues.hardCodedPaths.push(match[1]);
  }
  
  return issues;
}

// 复制缺失的资源文件
function ensureResourcesExist() {
  const outDir = path.join(__dirname, 'out');
  const pairs = [
    // CSS文件
    {src: '_next/static/css/140248cf6002840f.css', dest: '_next/static/css/555d41a0fcb396b0.css'},
    
    // JavaScript文件
    {src: '_next/static/chunks/app/page-4f4fed0b9c7a3e33.js', dest: '_next/static/chunks/app/page-913f98ba578cac95.js'},
    {src: '_next/static/chunks/app/layout-e772fb76f0d1470d.js', dest: '_next/static/chunks/app/layout-d588d9695c3296e3.js'},
    {src: '_next/static/chunks/main-app-c7464db280b8eb09.js', dest: '_next/static/chunks/main-app-6fcf18cda217580d.js'},
    {src: '_next/static/chunks/63-48ce1675867889d1.js', dest: '_next/static/chunks/684-836981e0e44cfcdd.js'},
    {src: '_next/static/chunks/framework-859199dea06580b0.js', dest: '_next/static/chunks/4bd1b696-21cefdb9a3c74919.js'},
    
    // 字体文件
    {destDir: '_next/static/media', srcPattern: '*.woff2'}
  ];
  
  let copiedFiles = 0;
  
  pairs.forEach(pair => {
    if (pair.srcPattern) {
      // 对于模式匹配的情况
      const srcDir = path.join(outDir, path.dirname(pair.destDir));
      const destDir = path.join(outDir, pair.destDir);
      
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      if (fs.existsSync(srcDir)) {
        const files = fs.readdirSync(srcDir);
        const matchingFiles = files.filter(file => 
          file.match(new RegExp(pair.srcPattern.replace('*', '.*'))));
        
        matchingFiles.forEach(file => {
          const srcPath = path.join(srcDir, file);
          const destPath = path.join(destDir, file);
          
          if (!fs.existsSync(destPath)) {
            fs.copyFileSync(srcPath, destPath);
            copiedFiles++;
            console.log(`已复制: ${srcPath} -> ${destPath}`);
          }
        });
      }
    } else {
      // 对于特定文件的情况
      const srcPath = path.join(outDir, pair.src);
      const destPath = path.join(outDir, pair.dest);
      
      // 确保目标目录存在
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        copiedFiles++;
        console.log(`已复制: ${pair.src} -> ${pair.dest}`);
      }
    }
  });
  
  console.log(`总共复制了 ${copiedFiles} 个资源文件`);
}

// 主函数
function main() {
  const outDir = path.join(__dirname, 'out');
  if (!fs.existsSync(outDir)) {
    console.error('错误: out目录不存在');
    process.exit(1);
  }
  
  // 确保所有必要的资源文件存在
  ensureResourcesExist();
  
  // 查找所有HTML文件
  const htmlFiles = findHtmlFiles(outDir);
  console.log(`找到 ${htmlFiles.length} 个HTML文件`);
  
  // 修复每个HTML文件
  let fixedFiles = 0;
  htmlFiles.forEach(file => {
    if (fixHtmlFile(file)) {
      fixedFiles++;
    }
  });
  
  // 二次检查是否还有残留问题
  console.log('\n检查是否还有残留问题...');
  
  const remainingIssues = {};
  htmlFiles.forEach(file => {
    const relPath = path.relative(outDir, file);
    const issues = checkForRemainingIssues(file);
    
    if (issues.chenzetongPaths.length > 0 || issues.hardCodedPaths.length > 0) {
      remainingIssues[relPath] = issues;
    }
  });
  
  if (Object.keys(remainingIssues).length > 0) {
    console.log('警告: 以下文件仍然存在路径问题:');
    Object.entries(remainingIssues).forEach(([file, issues]) => {
      console.log(`  ${file}:`);
      
      if (issues.chenzetongPaths.length > 0) {
        console.log(`    - 包含 chenzetong 路径: ${issues.chenzetongPaths.length} 个`);
      }
      
      if (issues.hardCodedPaths.length > 0) {
        console.log(`    - 包含硬编码域名路径: ${issues.hardCodedPaths.length} 个`);
      }
    });
  } else {
    console.log('所有文件检查完毕，未发现残留问题');
  }
  
  console.log(`\n总结: 已修复 ${fixedFiles} 个文件，剩余 ${Object.keys(remainingIssues).length} 个文件有问题`);
}

main(); 