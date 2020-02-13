const { spawn } = require("child_process");

module.exports = function spawnReactScripts(...args) {
  return new Promise((resolve, reject) => {
    const child = spawn("yarn", ["run", "react-scripts", ...args], {
      stdio: "inherit"
    });
    child.on("close", exitCode => {
      if (exitCode) {
        reject();
      } else {
        resolve();
      }
    });
  });
};
