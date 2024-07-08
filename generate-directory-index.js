const fs = require("fs");
const path = require("path");

const rootDir = "./public";

function generateIndex(dir) {
  const files = fs.readdirSync(dir).map((file) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    return {
      name: file,
      isDirectory: stats.isDirectory(),
    };
  }).filter(file => file.name !== "index.html");

  const relativeDir = path.relative(rootDir, dir).replace(/\\/g, "/");
  const parentDir = relativeDir.split("/").slice(0, -1).join("/") || "";

  function getDirectoryInfo(dir) {
    let totalSize = 0;
    let fileCount = 0;
  
    function calculateDirSize(directory) {
      const files = fs.readdirSync(directory);
  
      files.forEach(file => {
        const filePath = path.join(directory, file);
        const stats = fs.statSync(filePath);
  
        if (stats.isDirectory()) {
          calculateDirSize(filePath);
        } else if (file !== "index.html") {
          totalSize += stats.size;
          fileCount += 1;
        }
      });
    }
  
    calculateDirSize(dir);
  
    return { totalSize, fileCount };
  }

  const content = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${relativeDir || "/"}</title>
        <style>
          * { --color-accent: #ae7ce4; --color-accent-hover: #75559f; }
          *, ::after, ::before { box-sizing: border-box; color: #fff; }
          :root { font-family: "Segoe UI", "Segoe UI Bold", "Segoe UI Italic", sans-serif; }
          body { background: #191919; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; padding: 20px 10px; }
          .title { font-size: 2em; }
          .files { max-width: 100%; width: 80%; min-width: 300px; background: #232323; border-radius: 5px; box-shadow: 0 0 5px 0 rgba(0, 0, 0, .1); padding: 5px 20px; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; }
          ul { width: 100%; margin: 0; padding: 0; list-style: none; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; gap: 5px; }
          li { width: 100%; height: auto; background: rgba(0, 0, 0, .1); display: flex; align-items: center; justify-content: flex-start; flex-direction: row; padding: 5px; padding-top: 0; border-bottom: 1px solid var(--color-accent-hover); }
          li:hover { background: rgba(0, 0, 0, .2); }
          li:last-child { border-bottom: none; }
          a { text-decoration: none; color: var(--color-accent); }
          a:hover { text-decoration: underline; color: var(--color-accent-hover); }
          .search { width: 100%; max-width: 600px; padding: 5px 10px; margin-bottom: 10px; border: none; outline: 0; border-radius: 5px; font-size: 1em; background: #2d2d2d; }
          .go-home { margin: 20px; }
          .go-home span { color: var(--color-accent) !important; }
          .file-info { margin-top: 20px; width: 80%; min-width: 300px; background: #232323; border-radius: 5px; padding: 0 20px; color: #fff; }
        </style>
      </head>
      <body>
        <a class="go-home" href="${parentDir ? `/${parentDir}` : "/"}" rel="noopener noreferrer" target="_self">Go to <span>..</span></a>
        <h1 class="title">${relativeDir || "/"}</h1>
        <input class="search" id="search" onkeyup="filterFiles()" placeholder="Search files...">
        <div class="files">
          <ul id="fileList">
            ${files.map(file => `
              <li class="file-item">
                <a href="${relativeDir ? `/${relativeDir}` : ""}/${file.name}${file.isDirectory ? "/" : ""}" data-name="${file.name}" data-is-directory="${file.isDirectory}" style="${file.isDirectory ? "background: #ae7ce4; color: rgb(25,25,25); padding: 0 20px; border-radius: 5px;" : ""}">${file.name}</a>
              </li>`).join("")}
          </ul>
        </div>
        <div class="file-info">
          <p>Total size: ${getDirectoryInfo(dir).totalSize} bytes</p>
          <p>Number of files: ${getDirectoryInfo(dir).fileCount}</p>
        </div>
        <script>
          function filterFiles() {
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
          }
        </script>
      </body>
    </html>
  `;

  fs.writeFileSync(path.join(dir, "index.html"), content);

  files
    .filter((file) => file.isDirectory)
    .forEach((file) => generateIndex(path.join(dir, file.name)));
}

generateIndex(rootDir);
