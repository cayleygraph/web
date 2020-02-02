const path = require("path");
const fs = require("fs-extra");

/** Copy minified monaco to build folder */
module.exports = function copyVS() {
  const sourceVSPath = path.join("node_modules", "monaco-editor", "min", "vs");
  const publicVSPath = path.join("public", "vs");
  return fs.copy(sourceVSPath, publicVSPath);
};
