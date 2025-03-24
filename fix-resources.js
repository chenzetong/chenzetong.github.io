const fs = require('fs');
const path = require('path');

// 资源文件映射关系
const resourceMappings = [
  {
    src: '_next/static/css/e0a3fc9c87d157b0.css',
    dest: '_next/static/css/555d41a0fcb396b0.css'
  },
  {
    src: '_next/static/chunks/app/layout-b7b2f8b39f695ab9.js',
    dest: '_next/static/chunks/app/layout-d588d9695c3296e3.js'
  },
  {
    src: '_next/static/chunks/webpack-decb145ea5426c4a.js',
    dest: '_next/static/chunks/webpack-1a627a45f621770c.js'
  },
  {
    src: '_next/static/chunks/684-19cbf8c69392678d.js',
    dest: '_next/static/chunks/684-836981e0e44cfcdd.js'
  }
];

function fixResources() {
  const outDir = path.join(__dirname, 'out');
  let fixedCount = 0;

  resourceMappings.forEach(mapping => {
    const srcPath = path.join(outDir, mapping.src);
    const destPath = path.join(outDir, mapping.dest);

    // 确保目标目录存在
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(srcPath)) {
      fs.renameSync(srcPath, destPath);
      console.log(`已重命名: ${mapping.src} -> ${mapping.dest}`);
      fixedCount++;
    } else {
      console.log(`源文件不存在: ${mapping.src}`);
    }
  });

  console.log(`\n总共修复了 ${fixedCount} 个资源文件`);
}

fixResources(); 