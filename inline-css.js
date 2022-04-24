const Critters = require("critters");
const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { walk } = require("@root/walk");
const { minify } = require("html-minifier-terser");

function removeExternalStyles(html) {
  return html.replaceAll(/<link rel="stylesheet" href=".*\.css">/g, "");
}

const optimize = async function () {
  // inline @fonts in style
  const c = new Critters({
    inlineFonts: true,
    path: "./dist",
    publicPath: "/",
    preload: "body",
  });

  await fse.remove("./optimized");
  await walk("./dist", async (err, pathname, dirent) => {
    if (err) {
      throw err;
    }
    if (dirent.isDirectory() && dirent.name.startsWith(".")) {
      return false;
    }
    if (!dirent.name.match(/.*\.html$/)) {
      if (dirent.name.indexOf(".") !== -1) {
        //copy assets to optimized folder
        await fse.copy(pathname, pathname.replace("dist", "optimized"));
      }
      return;
    }

    const html = fs.readFileSync(pathname, "utf-8");
    const res = await c.process(html);
    const optimizedPath = pathname.replace("dist", "optimized");
    // remove external styles, since critters doesn't actually remove the inline styles
    const htmlNoExternalStyle = removeExternalStyles(res);
    console.log(htmlNoExternalStyle);
    const minifiedHtml = await minify(htmlNoExternalStyle, {
      removeComments: true,
      minifyJS: true,
      minifyCSS: {
        level: 2,
      },
    });

    await fse.outputFile(optimizedPath, minifiedHtml);
    console.log("name:", dirent.name, "in", path.dirname(pathname));
  });

  await fse.remove("./dist");
  await fs.renameSync("./optimized", "./dist");
};

optimize();
