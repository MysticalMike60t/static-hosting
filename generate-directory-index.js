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
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${dir}</title>
    <style>
    * {
      --color-accent: #ae7ce4;
      --color-accent-hover: #75559f;
    }
    *,*::before,*::after {box-sizing: border-box;color:white;}
    :root {font-family: 'Segoe UI', 'Segoe UI Bold', 'Segoe UI Italic', sans-serif;}
    body {background: rgb(25,25,25);display:flex;align-items:center;justify-content:flex-start;flex-direction:column;padding:20px 10px;}
    .title {font-size:2em;}
    .files {max-width:100%;min-width: 300px;background:rgb(35,35,35);border-radius:5px;box-shadow:0 0 5px 0 rgba(0,0,0,0.1);padding: 5px 20px;display:flex;align-items:center;justify-content:flex-start;flex-direction:column;}
    ul {width:100%;margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:flex-start;flex-direction:column;gap:5px;}
    li {width:100%;height:auto;background:rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:flex-start;flex-direction:row;padding:5px;padding-top:0;border-bottom:1px solid var(--color-accent-hover);border-radius:5px;}
    li:hover {background:rgba(0,0,0,0.2);}
    li:last-child {border-bottom:none;}
    a {text-decoration:none;color:var(--color-accent);}
    a:hover {text-decoration:underline;color:var(--color-accent-hover);}
    </style>
    </head>
    <body>
    <h1 className="title">
      ${dir}
    </h1>
    <div class="files">
    <ul>
      ${files.map(file => `
        <li>
          <a href="${file.name}${file.isDirectory ? '/' : ''}">${file.name}</a>
        </li>
      `).join('')}
    </ul>
    </div>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), content);

  files.filter(file => file.isDirectory).forEach(file => generateIndex(path.join(dir, file.name)));
}

generateIndex(rootDir);
