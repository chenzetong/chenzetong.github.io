const fs = require('fs');
const path = require('path');

// 从 out/_next 目录复制到 out 目录
function copyDir(src, dest) {
  // 创建目标目录
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录中的所有文件和子目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 主函数
function main() {
  const nextDir = path.join(__dirname, 'out', '_next');
  
  if (fs.existsSync(nextDir)) {
    // 复制 _next 目录的内容到根目录
    copyDir(nextDir, path.join(__dirname, 'out'));
    console.log('资源文件已复制到根目录');
  } else {
    console.error('找不到 _next 目录');
  }
}

main(); 