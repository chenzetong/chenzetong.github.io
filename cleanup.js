const fs = require('fs');
const path = require('path');

// 复制 _next 目录中的内容到 out 目录根级
function copyNextContent() {
  const nextDir = path.join(__dirname, 'out', '_next');
  const staticDir = path.join(nextDir, 'static');
  const outDir = path.join(__dirname, 'out');
  
  if (fs.existsSync(staticDir)) {
    // 创建目标目录
    if (!fs.existsSync(path.join(outDir, 'static'))) {
      fs.mkdirSync(path.join(outDir, 'static'), { recursive: true });
    }
    
    // 复制 static 目录的内容
    copyDirSync(staticDir, path.join(outDir, 'static'));
    console.log('已复制 static 目录内容到根目录');
  }
}

// 递归复制目录
function copyDirSync(src, dest) {
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

// 主函数
function main() {
  copyNextContent();
  createCNAME();
  ensureNoJekyll();
  console.log('部署准备完成');
}

main(); 