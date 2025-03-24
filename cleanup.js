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
  
  // 复制整个 _next 目录到 static 目录
  if (fs.existsSync(nextDir)) {
    // 创建 static 目录
    const staticDir = path.join(outDir, 'static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }
    
    // 复制各种资源目录
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
    
    console.log('已复制资源文件到 static 目录');
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
}

// 递归复制目录
function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
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
      
      if (entry.isDirectory()) {
        copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
    
    console.log('已复制 public 目录文件');
  }
}

// 主函数
function main() {
  copyStaticSite();  // 先复制静态站点文件
  copyNextContent();
  copyPublicFiles();
  createCNAME();
  ensureNoJekyll();
  console.log('部署准备完成');
}

main(); 