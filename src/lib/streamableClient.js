#!/usr/bin/env node

import ToStreamable from "./index.js";
import minimist from "minimist";
import appCfg from "application-config";
import prompt from "prompt";
import request from "request";
import concat from "concat-stream";
import fileType from "file-type";
import fs from "fs";
import path from "path";
import pkg from "../package.json" assert { type: "json" };

const argv = minimist(process.argv.slice(2), {
  boolean: true,
  alias: {
    version: "v",
    help: "h",
  },
});

const config = appCfg("to-streamable");
const promptSchema = {
  properties: {
    username: {
      required: true,
      message: "Username: ",
    },
    password: {
      hidden: true,
      required: true,
      message: "Password: ",
    },
  },
};

prompt.message = "";
prompt.delimiter = "";
prompt.colors = false;

function printHelp() {
  return fs
    .createReadStream(path.resolve(__dirname, "../help.txt"))
    .pipe(process.stdout)
    .on("close", function () {
      process.exit(1);
    });
}

async function setupAuth() {
  prompt.start();
  return new Promise((resolve, reject) => {
    prompt.get(promptSchema, (err, auth) => {
      if (err) return reject(err);
      resolve(auth);
    });
  });
}

function verifyAuth(auth) {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        url: "http://streamable.com/ajax/check",
        json: true,
        body: auth,
      },
      (err, res) => {
        if (err) return reject(err);
        resolve(res.statusCode === 200);
      }
    );
  });
}

function saveAuth(auth) {
  return new Promise((resolve, reject) => {
    config.write(auth, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function handleSetup() {
  const auth = await setupAuth();
  const isValid = await verifyAuth(auth);

  if (isValid) {
    await saveAuth(auth);
    console.log("Username and password saved successfully!");
    process.exit(0);
  } else {
    console.log("Error: Invalid username/password.");
    process.exit(1);
  }
}

function getAuthFromArgs() {
  if (!argv.auth || typeof argv.auth !== "string") return null;
  const [username, password] = argv.auth.split(":");
  return { username, password };
}

function handleUploadComplete(shortcode) {
  console.log(`Done! http://streamable.com/${shortcode}`);
  process.exit(0);
}

function handleUploadError(message) {
  console.log(`Error: ${message}`);
  process.exit(1);
}

function createUploadParams() {
  const params = [];
  if (argv["no-resize"]) params.push("noresize");
  if (argv["mute"]) params.push("mute");
  return params;
}

function pollUploadStatus(upload, shortcode) {
  const poll = setInterval(() => {
    upload.status((err, body) => {
      if (err) throw err;
      if (body.status === 2) {
        clearInterval(poll);
        handleUploadComplete(shortcode);
      }
      if (body.status === 3) {
        clearInterval(poll);
        handleUploadError(body.message);
      }
    });
  }, 500);
}

function processUpload(auth, file) {
  const params = createUploadParams();
  const upload = new ToStreamable({ file, auth, params });

  console.log("Uploading...");
  upload.upload((err, body) => {
    if (err) throw err;
    console.log("Processing...");
    pollUploadStatus(upload, upload.shortcode);
  });
}

function processFileInput(filePath) {
  return fs.createReadStream(path.resolve(process.cwd(), filePath));
}

function processStdinInput() {
  return new Promise((resolve) => {
    const stream = concat((buf) => {
      const info = fileType(buf);
      resolve({
        value: buf,
        options: {
          filename: `video.${info.ext}`,
          contentType: info.mime,
        },
      });
    });
    process.stdin.pipe(stream);
  });
}

async function runCli() {
  if (argv.help) return printHelp();
  if (argv.version) {
    console.log(pkg.version);
    process.exit(0);
  }

  if (argv.setup) {
    await handleSetup();
    return;
  }

  const auth = await new Promise((resolve, reject) => {
    config.read((err, auth) => {
      if (err) reject(err);
      resolve(auth);
    });
  });

  const argAuth = getAuthFromArgs();
  const finalAuth = argAuth || auth;

  if (!finalAuth?.username || !finalAuth?.password) {
    console.log(
      "Error: No auth passed or previously saved. Run with either `--setup` or an auth pair using `--auth`."
    );
    return printHelp();
  }

  if (argv._[0] && typeof argv._[0] === "string") {
    const file = processFileInput(argv._[0]);
    processUpload(finalAuth, file);
  } else {
    const file = await processStdinInput();
    processUpload(finalAuth, file);
  }
}

runCli().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
