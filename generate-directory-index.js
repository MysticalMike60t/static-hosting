const fs = require('fs');
const path = require('path');

const rootDir = './public';

function generateIndex(dir) {
  const files = fs.readdirSync(dir).map(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      isDirectory: stats.isDirectory(),
    };
  });

  const content = `
    <!doctypehtml><html lang=en><meta charset=UTF-8><meta content="width=device-width,initial-scale=1"name=viewport><title>${dir.replace("./public","").replace("public/","")}</title><style>*{--color-accent:#ae7ce4;--color-accent-hover:#75559f}*,::after,::before{box-sizing:border-box;color:#fff}:root{font-family:"Segoe UI","Segoe UI Bold","Segoe UI Italic",sans-serif}body{background:#191919;display:flex;align-items:center;justify-content:flex-start;flex-direction:column;padding:20px 10px}.title{font-size:2em}.files{max-width:100%;width:80%;min-width:300px;background:#232323;border-radius:5px;box-shadow:0 0 5px 0 rgba(0,0,0,.1);padding:5px 20px;display:flex;align-items:center;justify-content:flex-start;flex-direction:column}ul{width:100%;margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:flex-start;flex-direction:column;gap:5px}li{width:100%;height:auto;background:rgba(0,0,0,.1);display:flex;align-items:center;justify-content:flex-start;flex-direction:row;padding:5px;padding-top:0;border-bottom:1px solid var(--color-accent-hover)}li:hover{background:rgba(0,0,0,.2)}li:last-child{border-bottom:none}a{text-decoration:none;color:var(--color-accent)}a:hover{text-decoration:underline;color:var(--color-accent-hover)}.search{width:100%;max-width:600px;padding:5px 10px;margin-bottom:10px;border:none;outline:0;border-radius:5px;font-size:1em;background:#2d2d2d}</style><h1 class=title>${dir.replace("./public","").replace("public/","")}</h1><input class=search id=search onkeyup=filterFiles() placeholder="Search files..."><div class=files><ul id=fileList>${files.map(file => `<li class=file-item><a href="${file.name}${file.isDirectory ? '/' : ''}">${file.name}</a></li>`).join('')}</ul></div><script>function filterFiles() {
        const searchInput = document.getElementById('search').value.toLowerCase();
        const fileItems = document.querySelectorAll('.file-item');
        
        fileItems.forEach(item => {
          const fileName = item.textContent.toLowerCase();
          if (fileName.includes(searchInput)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      }</script>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), content);

  files.filter(file => file.isDirectory).forEach(file => generateIndex(path.join(dir, file.name)));
}

generateIndex(rootDir);
