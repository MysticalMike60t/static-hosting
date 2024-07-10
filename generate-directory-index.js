const fs = require("fs");
const path = require("path");

const rootDir = "./public";

function generateIndex(dir) {
  const files = fs
    .readdirSync(dir)
    .map((file) => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: stats.isDirectory(),
      };
    })
    .filter((file) => file.name !== "index.html")
    .filter((file) => file.name !== ".gitkeep")
    .filter((file) => file.name !== ".gitignore");

  const relativeDir = path.relative(rootDir, dir).replace(/\\/g, "/");
  const parentDir = relativeDir.split("/").slice(0, -1).join("/") || "";

  function getDirectoryInfo(dir) {
    let totalSize = 0;
    let fileCount = 0;

    function calculateDirSize(directory) {
      const files = fs.readdirSync(directory);

      files.forEach((file) => {
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
        <a class="go-home" href="${
          parentDir ? `/${parentDir}` : "/"
        }" rel="noopener noreferrer" target="_self">Go to <span>..</span></a>
        <h1 class="title">${relativeDir || "/"}</h1>
        <input class="search" id="search" onkeyup="filterFiles()" placeholder="Search files...">
        <div class="files">
          <ul id="fileList">
            ${files
              .map((file) => {
                const fileColorMap = {
                  ".7z": { bgcolor: "#e7a923", txtcolor: "black" },
                  ".aac": { bgcolor: "#d9e79e", txtcolor: "black" },
                  ".accdb": { bgcolor: "#fc1313", txtcolor: "black" },
                  ".app": { bgcolor: "#bdf0ef", txtcolor: "black" },
                  ".avi": { bgcolor: "#9ebbe7", txtcolor: "black" },
                  ".bat": { bgcolor: "#cdeee9", txtcolor: "black" },
                  ".bmp": { bgcolor: "#48c7e6", txtcolor: "black" },
                  ".class": { bgcolor: "#b07219", txtcolor: "white" },
                  ".cpl": { bgcolor: "#d4c5e3", txtcolor: "black" },
                  ".cpp": { bgcolor: "#f34b7d", txtcolor: "white" },
                  ".csv": { bgcolor: "#9ee7a7", txtcolor: "black" },
                  ".css": { bgcolor: "#264de4", txtcolor: "white" },
                  ".db": { bgcolor: "#f0bb2c", txtcolor: "black" },
                  ".dll": { bgcolor: "#d4c5e3", txtcolor: "black" },
                  ".doc": { bgcolor: "#9ee7c9", txtcolor: "black" },
                  ".docx": { bgcolor: "#9ee7c9", txtcolor: "black" },
                  ".dwg": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".dxf": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".erb": { bgcolor: "#701516", txtcolor: "white" },
                  ".exe": { bgcolor: "#c5dde3", txtcolor: "black" },
                  ".ffmpeg": { bgcolor: "#438496", txtcolor: "black" },
                  ".flac": { bgcolor: "#d9e79e", txtcolor: "black" },
                  ".flac": { bgcolor: "#d765d1", txtcolor: "black" },
                  ".gif": { bgcolor: "#48c7e6", txtcolor: "black" },
                  ".gz": { bgcolor: "#d9eaea", txtcolor: "black" },
                  ".h": { bgcolor: "#f34b7d", txtcolor: "white" },
                  ".html": { bgcolor: "#e34f26", txtcolor: "black" },
                  ".ico": { bgcolor: "#65acd7", txtcolor: "black" },
                  ".ini": { bgcolor: "#e3e0c5", txtcolor: "black" },
                  ".ipynb": { bgcolor: "#3776ab", txtcolor: "white" },
                  ".java": { bgcolor: "#b07219", txtcolor: "white" },
                  ".jpeg": { bgcolor: "#48c7e6", txtcolor: "black" },
                  ".jpg": { bgcolor: "#48c7e6", txtcolor: "black" },
                  ".js": { bgcolor: "#f7df1e", txtcolor: "black" },
                  ".json": { bgcolor: "#f7df1e", txtcolor: "black" },
                  ".md": { bgcolor: "#005b96", txtcolor: "white" },
                  ".mdb": { bgcolor: "#fc1313", txtcolor: "black" },
                  ".mov": { bgcolor: "#438496", txtcolor: "black" },
                  ".mp3": { bgcolor: "#d765d1", txtcolor: "black" },
                  ".mp4": { bgcolor: "#438496", txtcolor: "black" },
                  ".msi": { bgcolor: "#c5dde3", txtcolor: "black" },
                  ".obj": { bgcolor: "#c7f5f5", txtcolor: "black" },
                  ".odt": { bgcolor: "#9ee7c9", txtcolor: "black" },
                  ".ods": { bgcolor: "#9ee7a7", txtcolor: "black" },
                  ".otf": { bgcolor: "#9b51dc", txtcolor: "black" },
                  ".pdf": { bgcolor: "#d76c5b", txtcolor: "black" },
                  ".php": { bgcolor: "#9b51dc", txtcolor: "black" },
                  ".png": { bgcolor: "#48c7e6", txtcolor: "black" },
                  ".ps1": { bgcolor: "#cdeee9", txtcolor: "black" },
                  ".py": { bgcolor: "#3776ab", txtcolor: "white" },
                  ".pyw": { bgcolor: "#3776ab", txtcolor: "white" },
                  ".rar": { bgcolor: "#e7a923", txtcolor: "black" },
                  ".rb": { bgcolor: "#701516", txtcolor: "white" },
                  ".rtf": { bgcolor: "#9ee7c9", txtcolor: "black" },
                  ".sass": { bgcolor: "#cc6699", txtcolor: "black" },
                  ".scss": { bgcolor: "#cc6699", txtcolor: "black" },
                  ".sh": { bgcolor: "#cdeee9", txtcolor: "black" },
                  ".sql": { bgcolor: "#f29111", txtcolor: "black" },
                  ".sql": { bgcolor: "#f0bb2c", txtcolor: "black" },
                  ".stl": { bgcolor: "#c7f5f5", txtcolor: "black" },
                  ".svg": { bgcolor: "#e6e148", txtcolor: "black" },
                  ".sys": { bgcolor: "#d4c5e3", txtcolor: "black" },
                  ".tar": { bgcolor: "#d9eaea", txtcolor: "black" },
                  ".tar.gz": { bgcolor: "#e7a923", txtcolor: "black" },
                  ".ttf": { bgcolor: "#9b51dc", txtcolor: "black" },
                  ".txt": { bgcolor: "#9ee7c9", txtcolor: "black" },
                  ".wav": { bgcolor: "#d765d1", txtcolor: "black" },
                  ".webp": { bgcolor: "#36a62c", txtcolor: "black" },
                  ".wmv": { bgcolor: "#9ebbe7", txtcolor: "black" },
                  ".woff": { bgcolor: "#9b51dc", txtcolor: "black" },
                  ".xls": { bgcolor: "#9ee7a7", txtcolor: "black" },
                  ".xlsx": { bgcolor: "#9ee7a7", txtcolor: "black" },
                  ".xml": { bgcolor: "#1cbd2a", txtcolor: "black" },
                  ".zip": { bgcolor: "#e7a923", txtcolor: "black" },
                  ".log": { bgcolor: "#c9dade", txtcolor: "black" },
                  ".tex": { bgcolor: "#c9dade", txtcolor: "black" },
                  ".wks": { bgcolor: "#c9dade", txtcolor: "black" },
                  ".yaml": { bgcolor: "#d194c5", txtcolor: "black" },
                  ".yml": { bgcolor: "#d194c5", txtcolor: "black" },
                  ".tsv": { bgcolor: "#d194c5", txtcolor: "black" },
                  ".dbf": { bgcolor: "#d194c5", txtcolor: "black" },
                  ".sav": { bgcolor: "#d194c5", txtcolor: "black" },
                  ".tiff": { bgcolor: "#9497d1", txtcolor: "black" },
                  ".tif": { bgcolor: "#9497d1", txtcolor: "black" },
                  ".heic": { bgcolor: "#9497d1", txtcolor: "black" },
                  ".ogg": { bgcolor: "#c694d1", txtcolor: "black" },
                  ".m4a": { bgcolor: "#c694d1", txtcolor: "black" },
                  ".wma": { bgcolor: "#c694d1", txtcolor: "black" },
                  ".aiff": { bgcolor: "#c694d1", txtcolor: "black" },
                  ".mkv": { bgcolor: "#4868d4", txtcolor: "white" },
                  ".flv": { bgcolor: "#4868d4", txtcolor: "white" },
                  ".m4v": { bgcolor: "#4868d4", txtcolor: "white" },
                  ".webm": { bgcolor: "#4868d4", txtcolor: "white" },
                  ".bz2": { bgcolor: "#9948d4", txtcolor: "white" },
                  ".xz": { bgcolor: "#9948d4", txtcolor: "white" },
                  ".iso": { bgcolor: "#9948d4", txtcolor: "white" },
                  ".apk": { bgcolor: "#48d466", txtcolor: "black" },
                  ".bin": { bgcolor: "#48d466", txtcolor: "black" },
                  ".run": { bgcolor: "#48d466", txtcolor: "black" },
                  ".asp": { bgcolor: "#48d466", txtcolor: "black" },
                  ".aspx": { bgcolor: "#48d466", txtcolor: "black" },
                  ".jsp": { bgcolor: "#d49248", txtcolor: "black" },
                  ".htm": { bgcolor: "#e34f26", txtcolor: "black" },
                  ".vue": { bgcolor: "#48d472", txtcolor: "black" },
                  ".conf": { bgcolor: "#c2e8e8", txtcolor: "black" },
                  ".bak": { bgcolor: "#c2e8e8", txtcolor: "black" },
                  ".dmg": { bgcolor: "#c2e8e8", txtcolor: "black" },
                  ".efi": { bgcolor: "#c2e8e8", txtcolor: "black" },
                  ".eot": { bgcolor: "#9b51dc", txtcolor: "black" },
                  ".sqlite": { bgcolor: "#6bb9ff", txtcolor: "black" },
                  ".sqlite3": { bgcolor: "#6bb9ff", txtcolor: "black" },
                  ".db3": { bgcolor: "#6bb9ff", txtcolor: "black" },
                  ".skp": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".3ds": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".iges": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".igs": { bgcolor: "#f02c38", txtcolor: "black" },
                  ".fbx": { bgcolor: "#1d71bc", txtcolor: "white" },
                  ".dae": { bgcolor: "#1d71bc", txtcolor: "white" },
                  ".blend": { bgcolor: "#ffb843", txtcolor: "black" },
                  ".ppt": { bgcolor: "#f2912a", txtcolor: "black" },
                  ".pptx": { bgcolor: "#f2912a", txtcolor: "black" },
                  ".odp": { bgcolor: "#f2912a", txtcolor: "black" },
                  ".key": { bgcolor: "#f2912a", txtcolor: "black" },
                  ".epub": { bgcolor: "#6c74da", txtcolor: "black" },
                  ".mobi": { bgcolor: "#6c74da", txtcolor: "black" },
                  ".azw": { bgcolor: "#6c74da", txtcolor: "black" },
                  ".pak": { bgcolor: "#a2a5c9", txtcolor: "black" },
                  ".torrent": { bgcolor: "#e1d2f3", txtcolor: "black" },
                  ".ics": { bgcolor: "#e1d2f3", txtcolor: "black" },
                  ".vcf": { bgcolor: "#e1d2f3", txtcolor: "black" },
                  ".gpx": { bgcolor: "#e1d2f3", txtcolor: "black" },
                  ".tmp": { bgcolor: "#e1d2f3", txtcolor: "black" },
                  ".old": { bgcolor: "#e1d2f3", txtcolor: "black" },
                };

                // ".": { bgcolor: "#", txtcolor: "black" },

                let bgcolor = "transparent";
                let txtcolor = "#ae7ce4";

                const extension = Object.keys(fileColorMap).find((ext) =>
                  file.name.endsWith(ext)
                );
                if (extension) {
                  ({ bgcolor, txtcolor } = fileColorMap[extension]);
                }

                return `
                <li class="file-item">
                  <a href="${relativeDir ? `/${relativeDir}` : ""}/${
                  file.name
                }${file.isDirectory ? "/" : ""}" data-name="${
                  file.name
                }" data-is-directory="${
                  file.isDirectory
                }" style="padding: 0 20px; border-radius: 5px;${
                  file.isDirectory
                    ? "background: #ae7ce4; color: rgb(25,25,25);"
                    : `background:${bgcolor};color:${txtcolor};`
                }">${file.name}</a>
                </li>`;
              })
              .join("")}
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
