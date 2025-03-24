const fs = require('fs');
const path = require('path');

// 资源文件映射关系
const resourceMappings = [
  {
    src: '.next/static/css/0c4a194ae144006b.css',
    dest: 'out/_next/static/css/555d41a0fcb396b0.css'
  },
  {
    src: '.next/4bd1b696.js',
    dest: 'out/_next/static/chunks/4bd1b696-21cefdb9a3c74919.js'
  },
  {
    src: '.next/684.js',
    dest: 'out/_next/static/chunks/684-836981e0e44cfcdd.js'
  },
  {
    src: '.next/874.js',
    dest: 'out/_next/static/chunks/874-0715c6660f33056f.js'
  },
  {
    src: '.next/webpack.js',
    dest: 'out/_next/static/chunks/webpack-1a627a45f621770c.js'
  },
  {
    src: '.next/main-app.js',
    dest: 'out/_next/static/chunks/main-app-6fcf18cda217580d.js'
  },
  {
    src: '.next/app/layout.js',
    dest: 'out/_next/static/chunks/app/layout-d588d9695c3296e3.js'
  },
  {
    src: '.next/app/page.js',
    dest: 'out/_next/static/chunks/app/page-913f98ba578cac95.js'
  }
];

function fixBuild() {
  let fixedCount = 0;

  resourceMappings.forEach(mapping => {
    const srcPath = path.join(__dirname, mapping.src);
    const destPath = path.join(__dirname, mapping.dest);

    // 确保目标目录存在
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`已复制: ${mapping.src} -> ${mapping.dest}`);
      fixedCount++;
    } else {
      console.log(`源文件不存在: ${mapping.src}`);
    }
  });

  console.log(`\n总共修复了 ${fixedCount} 个资源文件`);
}

fixBuild(); 