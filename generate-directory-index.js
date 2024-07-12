const fs = require("fs");
const path = require("path");

const rootDir = "./public";

const settings = JSON.parse(fs.readFileSync("settings.json", "utf-8"));
const theme = JSON.parse(fs.readFileSync("theme.json", "utf-8"));

function getFilterList(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return fileContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function formatBytes(bytes, decimals = settings.file_size_decimals) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = settings.file_sizes;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function getDirectoryInfo(dir) {
  let totalSize = 0;
  let fileCount = 0;

  function calculateDirSize(directory) {
    const files = fs.readdirSync(directory);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const filterList = getFilterList(settings.filter_file);
      if (stats.isDirectory()) {
        calculateDirSize(filePath);
      } else if (!filterList.includes(file)) {
        totalSize += stats.size;
        fileCount += 1;
      }
    });
  }

  calculateDirSize(dir);

  return {
    totalSizeBytes: totalSize,
    totalSizeFormatted: formatBytes(totalSize),
    fileCount,
  };
}

function generateIndex(dir) {
  const filterList = getFilterList(settings.filter_file);
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
    .filter((file) => !filterList.includes(file.name));

  const relativeDir = path.relative(rootDir, dir).replace(/\\/g, "/");
  const parentDir = relativeDir.split("/").slice(0, -1).join("/") || "";
  const dirInfo = getDirectoryInfo(dir);

  const content = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${relativeDir || "/"}</title>
        <style>
          * { --color-accent: ${
            theme.colors.accent.default
          }; --color-accent-hover: ${theme.colors.accent.hover}; }
          *, ::after, ::before { box-sizing: border-box; color: ${
            theme.colors.text.general
          }; }
          :root { font-family: "Segoe UI", "Segoe UI Bold", "Segoe UI Italic", sans-serif; }
          body { background: ${
            theme.colors.background.default
          }; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; padding: 20px 10px; }
          .title { font-size: 2em; }
          .files { max-width: 100%; width: 80%; min-width: 300px; background: ${
            theme.colors.elements.files.background
          }; border-radius: ${
    theme.element_styles.files.border_radius
  }; box-shadow: 0 0 5px 0 ${
    theme.colors.elements.files.shadow
  }; padding: 5px 20px; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; }
          ul { width: 100%; margin: 0; padding: 0; list-style: none; display: flex; align-items: center; justify-content: flex-start; flex-direction: column; gap: 5px; }
          li { width: 100%; height: auto; background: ${
            theme.colors.elements.li_file.default
          }; display: flex; align-items: center; justify-content: flex-start; flex-direction: row; padding: 5px; padding-top: 0; border-bottom: 1px solid var(--color-accent-hover); }
          li:hover { background: ${theme.colors.elements.li_file.hover}; }
          li:last-child { border-bottom: none; }
          a, a span { text-decoration: none; color: var(--color-accent); }
          a:hover, a:hover span { text-decoration: underline; color: var(--color-accent-hover); }
          .search { width: 100%; max-width: 600px; padding: 5px 10px; margin-bottom: 20px; border: none; outline: 0; border-radius: ${
            theme.element_styles.search.border_radius
          }; font-size: 1em; background:${
    theme.colors.elements.search.background
  }; }
          .go-home { margin: 20px; }
          .go-home span { color: var(--color-accent) !important; }
          .file-info { gap: 10px;display: flex;align-items: center;justify-content: flex-start;flex-wrap: wrap;margin-bottom: 10px; width: 80%; min-width: 300px; background: ${
            theme.colors.elements.file_info.background
          }; border-radius: ${
    theme.element_styles.file_info.border_radius
  }; padding: 5px 20px; color: ${theme.colors.elements.file_info.text_color}; }
          .file-info p { padding: 0;margin: 0;position: relative;border-right: 1px solid ${
            theme.colors.elements.file_info.seperator
          };padding-right: 10px; }
          .file-info p:last-child { border-right: none;}
          ${
            theme.media_query.use_query === "true"
              ? `@media (max-width: ${theme.media_query.file_info.remove_seperator}) {
            .file-info p { border-right: none; }
          }`
              : ""
          }
          </style>
      </head>
      <body>
        <a class="go-home" href="${
          parentDir ? `/${parentDir}` : "/"
        }" rel="noopener noreferrer" target="_self" style="font-size:${
    theme.element_styles.parent_dir.font_size
  }">..<span style="font-size:${
    theme.element_styles.parent_dir.slash.font_size
  };font-weight:${
    theme.element_styles.parent_dir.slash.font_weight
  };">/</span></a>
        <h1 class="title">${relativeDir || "/"}</h1>
        <input class="search" id="search" onkeyup="filterFiles()" placeholder="Search files...">
        <div class="file-info">
          <p>Total size: ${dirInfo.totalSizeFormatted}</p>
          <p>Number of files: ${dirInfo.fileCount}</p>
        </div>
        <div class="files">
          <ul id="fileList">
            ${files
              .map((file) => {
                // ".": { bgcolor: "#", txtcolor: "black" },

                let bgcolor = "transparent";
                let txtcolor = theme.colors.accent.default;
                const extension = Object.keys(theme.colors.files).find((ext) =>
                  file.name.endsWith(ext)
                );
                if (extension) {
                  ({ bgcolor, txtcolor } = theme.colors.files[extension]);
                }
                return `
                <li class="file-item">
                  <a href="${relativeDir ? `/${relativeDir}` : ""}/${
                  file.name
                }${file.isDirectory ? "/" : ""}" data-name="${
                  file.name
                }" data-is-directory="${
                  file.isDirectory
                }" style="padding: 0 20px; border-radius: ${
                  theme.element_styles.file.border_radius
                };${
                  file.isDirectory
                    ? `background: ${theme.colors.elements.file.is_folder.background}; color: ${theme.colors.elements.file.is_folder.text_color};`
                    : `background:${bgcolor};color:${txtcolor};`
                }">${file.name}</a>
                </li>`;
              })
              .join("")}
          </ul>
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
