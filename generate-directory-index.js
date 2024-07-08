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
    <html>
    <body>
      <ul>
        ${files.map(file => `
          <li>
            <a href="${file.name}${file.isDirectory ? '/' : ''}">${file.name}</a>
          </li>
        `).join('')}
      </ul>
    </body>
    </html>
  `;

  fs.writeFileSync(path.join(dir, 'index.html'), content);

  files.filter(file => file.isDirectory).forEach(file => generateIndex(path.join(dir, file.name)));
}

generateIndex(rootDir);
