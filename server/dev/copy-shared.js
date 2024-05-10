const { existsSync, rmSync, cpSync, cp } = require("fs");
const nodemon = require("nodemon");
const path = require("path");

const main = () => {
  const copyFiles = (files) => {
    files.forEach((file) => {
      const subPath = file.slice(serverSharedDir.length);
      const destFile = path.join(clientSharedDir, subPath);
      cp(file, destFile, () => {});
    });
  };
  // ----------------------------------------------
  const clientSharedDir = path.join(__dirname, "../../client/src/shared");
  const serverSharedDir = path.join(__dirname, "../src/shared");
   
  if (existsSync(clientSharedDir)) rmSync(clientSharedDir, { recursive: true });
  cpSync(serverSharedDir, clientSharedDir, { recursive: true });

  const mon = nodemon({
    watch: serverSharedDir,
    exec: " ",
    delay: 100,
    ext: ".ts",
  });

  mon.on("restart", copyFiles);
};

main();
