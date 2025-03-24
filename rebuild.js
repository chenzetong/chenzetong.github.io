const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 清理输出目录
function cleanOutput() {
  const outDir = path.join(__dirname, 'out');
  if (fs.existsSync(outDir)) {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outDir);
}

// 重新构建项目
function rebuild() {
  try {
    // 清理输出目录
    cleanOutput();
    
    // 安装依赖
    console.log('正在安装依赖...');
    execSync('npm install', { stdio: 'inherit' });
    
    // 构建项目
    console.log('正在构建项目...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // 导出静态文件
    console.log('正在导出静态文件...');
    execSync('npm run export', { stdio: 'inherit' });
    
    console.log('构建完成！');
  } catch (error) {
    console.error('构建过程中出错：', error);
    process.exit(1);
  }
}

rebuild(); 