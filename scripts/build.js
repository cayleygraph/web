const spawnReactScripts = require("./react-scripts");
const copyVS = require("./copy-vs");

async function build() {
  await copyVS();
  await spawnReactScripts(["build"]);
}

build().catch(error => {
  console.error(error);
  process.exit(1);
});
