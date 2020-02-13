const spawnReactScripts = require("./react-scripts");
const copyVS = require("./copy-vs");

async function start() {
  await copyVS();
  await spawnReactScripts(["start"]);
}

start().catch(error => {
  console.error(error);
  process.exit(1);
});
