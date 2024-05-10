const { spawn, exec } = require("child_process");
const { existsSync, rmSync, mkdirSync, writeFileSync } = require("fs");
const os = require("os");
const path = require("path");
const nodemon = require("nodemon");

const main = async () => {
  const npx = os.platform() === "win32" ? "npx.cmd" : "npx";
  const node = os.platform() === "win32" ? "node.cmd" : "node";

  const distPath = path.join(__dirname, "../dist");

  if (existsSync(distPath)) rmSync(distPath, { recursive: true });
  mkdirSync(distPath);

  writeFileSync(path.join(distPath, "app.js"), 'console.log("wait compile!")');

  spawn(
    npx,
    [
      "concurrently",
      `tsc --watch --preserveWatchOutput`,
      `nodemon ${JSON.stringify(
        path.join(distPath, "app.js")
      )} --watch ${JSON.stringify(distPath)}`,
      `${node} dev/copy-shared.js`,
    ],
    {
      stdio: "inherit",
    }
  );
};

main();
