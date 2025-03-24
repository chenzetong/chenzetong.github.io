const fs = require('fs');
const path = require('path');

// 复制 static-site.html 到 out/index.html
function copyStaticSite() {
  const staticSitePath = path.join(__dirname, 'public', 'static-site.html');
  const outIndexPath = path.join(__dirname, 'out', 'index.html');
  
  if (fs.existsSync(staticSitePath)) {
    // 备份原始的 index.html (如果存在)
    if (fs.existsSync(outIndexPath)) {
      const backupPath = path.join(__dirname, 'out', 'index.original.html');
      fs.copyFileSync(outIndexPath, backupPath);
      console.log('已备份原始 index.html');
    }
    
    // 复制 static-site.html 到 index.html
    fs.copyFileSync(staticSitePath, outIndexPath);
    console.log('已复制 static-site.html 到 out/index.html');
  } else {
    console.log('警告: static-site.html 不存在');
  }
}

// 复制 _next 目录中的内容到 out 目录根级
function copyNextContent() {
  const nextDir = path.join(__dirname, 'out', '_next');
  const outDir = path.join(__dirname, 'out');
  
  if (fs.existsSync(nextDir)) {
    // 复制整个 _next 目录到 static 目录
    const staticDir = path.join(outDir, 'static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    // 1. 复制资源到根目录 - 直接从 _next 复制到根目录
    console.log('正在复制资源文件到根目录...');
    copyDirSync(nextDir, outDir);
    
    // 2. 复制各种资源目录到 static 目录
    console.log('正在复制资源文件到 static 目录...');
    ['css', 'js', 'chunks', 'media', 'static'].forEach(dirName => {
      const srcDir = path.join(nextDir, dirName);
      if (fs.existsSync(srcDir)) {
        copyDirSync(srcDir, path.join(staticDir, dirName));
      } else {
        // 可能是子目录的情况
        const staticSrcDir = path.join(nextDir, 'static', dirName);
        if (fs.existsSync(staticSrcDir)) {
          copyDirSync(staticSrcDir, path.join(staticDir, dirName));
        }
      }
    });

    // 直接复制 static 目录的内容
    const nextStaticDir = path.join(nextDir, 'static');
    if (fs.existsSync(nextStaticDir)) {
      copyDirSync(nextStaticDir, staticDir);
    }
    
    console.log('资源文件复制完成');
  }

  // 复制根目录下的文件到 static 目录
  const rootFiles = fs.readdirSync(outDir, { withFileTypes: true });
  const staticDir = path.join(outDir, 'static');
  
  for (const entry of rootFiles) {
    if (!entry.isDirectory() && entry.name.match(/\.(js|css)$/)) {
      const srcPath = path.join(outDir, entry.name);
      const destPath = path.join(staticDir, entry.name);
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制: ${entry.name} 到 static 目录`);
    }
  }
  
  // 处理带有哈希值的文件（如：555d41a0fcb396b0.css, a34f9d1faa5f3315-s.p.woff2）
  const hashFiles = findHashFiles(outDir);
  if (hashFiles.length > 0) {
    console.log(`找到 ${hashFiles.length} 个哈希文件需要复制`);
    for (const file of hashFiles) {
      // 获取相对路径
      const relativePath = path.relative(outDir, file);
      // 创建目标目录（如果不存在）
      const targetDir = path.join(staticDir, path.dirname(relativePath));
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      // 复制文件
      const destPath = path.join(staticDir, relativePath);
      fs.copyFileSync(file, destPath);
      console.log(`已复制哈希文件: ${relativePath} 到 static 目录`);
    }
  }
}

// 查找带有哈希值的文件
function findHashFiles(dir) {
  const results = [];
  
  function findRecursive(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory()) {
        // 忽略已经是 static 目录的路径
        if (entry.name !== 'static') {
          findRecursive(fullPath);
        }
      } else if (
        // 匹配带有哈希值的常见文件模式
        entry.name.match(/[a-f0-9]{8,}\.(?:js|css|woff2|woff|ttf|eot|svg|png|jpg|jpeg|gif)$/) ||
        entry.name.match(/[a-f0-9]+-[a-f0-9]+\.(?:js|css|woff2|woff|ttf|eot|svg|png|jpg|jpeg|gif)$/) ||
        // 匹配 Next.js 特殊格式的字体文件
        entry.name.match(/[a-f0-9]+\.p\.(?:woff2|woff|ttf|eot)$/)
      ) {
        results.push(fullPath);
      }
    }
  }
  
  findRecursive(dir);
  return results;
}

// 特殊处理字体文件，确保正确复制
function copyFontFiles() {
  const outDir = path.join(__dirname, 'out');
  const nextDir = path.join(outDir, '_next');
  const staticDir = path.join(outDir, 'static');
  
  // 创建静态媒体目录
  const staticMediaDir = path.join(staticDir, 'media');
  if (!fs.existsSync(staticMediaDir)) {
    fs.mkdirSync(staticMediaDir, { recursive: true });
  }
  
  // 查找字体文件
  const fontsPattern = /\.(woff2|woff|ttf|eot)$/;
  const fontFiles = [];
  
  // 在 _next/static/media 目录中查找字体文件
  const mediaDir = path.join(nextDir, 'static', 'media');
  if (fs.existsSync(mediaDir)) {
    const entries = fs.readdirSync(mediaDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory() && fontsPattern.test(entry.name)) {
        const srcPath = path.join(mediaDir, entry.name);
        const destPath = path.join(staticMediaDir, entry.name);
        
        // 复制字体文件到静态目录
        fs.copyFileSync(srcPath, destPath);
        fontFiles.push(entry.name);
        console.log(`已复制字体文件: ${entry.name} 到 static/media 目录`);
      }
    }
  }
  
  // 同时复制到 _next/static/media 目录
  const nextMediaDir = path.join(outDir, '_next', 'static', 'media');
  if (!fs.existsSync(nextMediaDir)) {
    fs.mkdirSync(nextMediaDir, { recursive: true });
    
    for (const fontFile of fontFiles) {
      const srcPath = path.join(staticMediaDir, fontFile);
      const destPath = path.join(nextMediaDir, fontFile);
      fs.copyFileSync(srcPath, destPath);
    }
  }
  
  return fontFiles.length;
}

// 递归复制目录
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  
  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    try {
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    } catch (err) {
      console.error(`复制文件失败: ${srcPath} -> ${destPath}`, err.message);
    }
  }
}

// 创建 CNAME 文件，如果你有自定义域名
function createCNAME() {
  const cnamePath = path.join(__dirname, 'out', 'CNAME');
  // 如果你有自定义域名，取消下面这行的注释并填入你的域名
  // fs.writeFileSync(cnamePath, 'yourdomain.com');
  console.log('CNAME 文件处理完成');
}

// 确保 .nojekyll 文件存在
function ensureNoJekyll() {
  const nojekyllPath = path.join(__dirname, 'out', '.nojekyll');
  if (!fs.existsSync(nojekyllPath)) {
    fs.writeFileSync(nojekyllPath, '');
    console.log('已创建 .nojekyll 文件');
  }
}

// 复制 public 中的文件到出口目录
function copyPublicFiles() {
  const publicDir = path.join(__dirname, 'public');
  const outDir = path.join(__dirname, 'out');
  
  if (fs.existsSync(publicDir)) {
    // 确保 public 中的文件优先级高于生成的文件
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const srcPath = path.join(publicDir, entry.name);
      const destPath = path.join(outDir, entry.name);
      
      try {
        if (entry.isDirectory()) {
          copyDirSync(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      } catch (err) {
        console.error(`复制文件失败: ${srcPath} -> ${destPath}`, err.message);
      }
    }
    
    console.log('已复制 public 目录文件');
  }
}

// 复制和处理特定的问题文件
function copySpecificFiles() {
  const outDir = path.join(__dirname, 'out');
  const nextDir = path.join(outDir, '_next');
  const staticDir = path.join(outDir, 'static');
  
  // 确保目标目录存在
  const cssDir = path.join(staticDir, 'css');
  const chunksDir = path.join(staticDir, 'chunks');
  
  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }
  
  if (!fs.existsSync(chunksDir)) {
    fs.mkdirSync(chunksDir, { recursive: true });
  }
  
  // 特定文件列表（从404错误中提取）
  const specificFiles = [
    { name: '555d41a0fcb396b0.css', type: 'css' },
    { name: '4bd1b696-21cefdb9a3c74919.js', type: 'chunks' },
    { name: 'webpack-1a627a45f621770c.js', type: 'chunks' },
    { name: 'layout-d588d9695c3296e3.js', type: 'chunks' },
    { name: 'page-913f98ba578cac95.js', type: 'chunks' },
    { name: '684-836981e0e44cfcdd.js', type: 'chunks' },
    { name: '874-0715c6660f33056f.js', type: 'chunks' },
    { name: 'main-app-6fcf18cda217580d.js', type: 'chunks' }
  ];
  
  let filesFound = 0;
  
  // 搜索和复制每个文件
  for (const file of specificFiles) {
    // 从 _next 目录和子目录搜索
    const foundPaths = findFileInDirectory(nextDir, file.name);
    
    if (foundPaths.length > 0) {
      // 复制到相应的目标目录
      const targetDir = path.join(staticDir, file.type);
      const targetPath = path.join(targetDir, file.name);
      
      try {
        fs.copyFileSync(foundPaths[0], targetPath);
        console.log(`已复制特定文件: ${file.name} 到 static/${file.type} 目录`);
        filesFound++;
      } catch (err) {
        console.error(`复制文件失败: ${file.name}`, err.message);
      }
    } else {
      console.log(`未找到特定文件: ${file.name}`);
    }
  }
  
  return filesFound;
}

// 在目录中查找文件
function findFileInDirectory(startDir, fileName) {
  const results = [];
  
  function findRecursive(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        findRecursive(fullPath);
      } else if (entry.name === fileName) {
        results.push(fullPath);
      }
    }
  }
  
  findRecursive(startDir);
  return results;
}

// 主函数
function main() {
  try {
    copyNextContent();
    const fontCount = copyFontFiles(); // 添加特殊字体文件处理
    if (fontCount > 0) {
      console.log(`已处理 ${fontCount} 个字体文件`);
    }
    const specificCount = copySpecificFiles(); // 添加处理特定文件
    if (specificCount > 0) {
      console.log(`已处理 ${specificCount} 个特定文件`);
    }
    copyPublicFiles();
    createCNAME();
    ensureNoJekyll();
    copyStaticSite();  // 最后复制静态站点文件
    console.log('部署准备完成');
  } catch (err) {
    console.error('部署过程出错:', err);
  }
}

main(); 