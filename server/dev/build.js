const { spawn } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const dotEnv = require("dotenv");

const build = async () => {
  const npx = os.platform() === "win32" ? "npx.cmd" : "npx";
  const distPath = path.join(__dirname, "../dist");
  const distEnvPath = path.join(distPath, ".env");
  const devEnvPath = path.join(__dirname, "../.env");
  const clientDir = path.join(__dirname, "../../client");
  const clientDist = path.join(clientDir, "dist");
  const clientSharedDir = path.join(__dirname, "../../client/src/shared");
  const serverSharedDir = path.join(__dirname, "../src/shared");

  if (fs.existsSync(distPath)) fs.rmSync(distPath, { recursive: true });
  fs.mkdirSync(distPath);

  console.log("build server...");
  await waitTask(spawn(npx, ["tsc", "--build", "--sourceMap", "false"]));
  const packageJSON = require("../package.json");
  delete packageJSON.devDependencies;

  
  if (fs.existsSync(clientSharedDir)) fs.rmSync(clientSharedDir, { recursive: true });
  fs.cpSync(serverSharedDir, clientSharedDir, { recursive: true });

  console.log("build client...");
  await waitTask(spawn(npx, ["vite", "build"], { cwd: clientDir }));

  const env = Object.assign(dotEnv.parse(fs.readFileSync(devEnvPath)), {
    NODE_ENV: "production",
  });

  // ----------------------------------------------
  fs.writeFileSync(
    path.join(distPath, "package.json"),
    JSON.stringify(packageJSON, null, "\t")
  );
  fs.writeFileSync(
    distEnvPath,
    Object.entries(env)
      .map(([key, value]) => `${key}="${value}"`)
      .join("\n")
  );
  fs.cpSync(clientDist, path.join(distPath, "public"), {
    recursive: true,
  });
  fs.cpSync(path.join(__dirname, "../data"), path.join(distPath, "data"), {
    recursive: true,
  });
};

const waitTask = (task) => {
  return new Promise((resolve, reject) => {
    const onClose = (code) => {
      if (code === 0) return resolve();
      reject(code);
    };
    task.stdout.on("data", (buffer) => process.stdout.write(buffer));
    task.stderr.on("data", (buffer) => process.stderr.write(buffer));
    task.on("close", onClose);
    task.on("exit", onClose);
  });
};
build();
