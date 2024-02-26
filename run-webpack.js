import webpack from "webpack";
import { exec } from "child_process";
import webpackDevConfig from "./webpack.dev.js";
import webpackProdConfigPromise from "./webpack.prod.js";

// Determine the mode based on the command-line argument
const mode = process.argv.includes("--prod") ? "production" : "development";

// Function to asynchronously select and load the appropriate Webpack configuration
async function selectConfig() {
  if (mode === "production") {
    // Await the resolution of the webpackProdConfig promise
    return await webpackProdConfigPromise;
  } else {
    // Directly return the development config if not in production mode
    return webpackDevConfig;
  }
}

// Wrap the Webpack build process in a promise to handle it asynchronously
async function runWebpackBuild() {
  const config = await selectConfig();
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        console.error("[runWebpackBuild] Webpack build error:", err);
        reject(err);
        return;
      }
      console.log("[runWebpackBuild] Webpack build stats:", stats.toString({ colors: true })); // Output build stats
      resolve();
    });
  });
}

// Function to start the Foundry server using Node's child_process.exec
function startFoundryServer() {
  return new Promise((resolve, reject) => {
    const serverProcess = exec("node \"D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/main.js\" --world=city-of-knives --dataPath=\"D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/FoundryDevData\" --hotReload",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`[startFoundryServer] exec error: ${error}`);
          reject(error);
          return;
        }
        // Log any output received directly from the exec call
        if (stdout) console.log(`[startFoundryServer] stdout: ${stdout}`);
        if (stderr) console.error(`[startFoundryServer] stderr: ${stderr}`);
      });

    serverProcess.stdout.on("data", (data) => {
      console.log(data);
      if (data.includes("Server started and listening")) {
        console.log("[startFoundryServer] RESOLVING!");
        resolve();
      }
    });

    // Handle any errors that occur during the process execution
    serverProcess.on("error", (error) => {
      console.error(`[startFoundryServer] exec error: ${error}`);
      reject(error);
    });
  });
}



// Function to open Chrome in debug mode
function openChromeDebugSession() {
  exec("cmd /c start \"\" \"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe\" --remote-debugging-port=9222 --auto-open-devtools-for-tabs --user-data-dir='C:/temp/chrome_dev_test' http://localhost:30000",
  (error, stdout, stderr) => {
    if (error) {
      console.error("[openChromeDebugSession] exec error:", error);
    } else {
      console.log("[openChromeDebugSession] stdout:", stdout);
      console.error("[openChromeDebugSession] stderr:", stderr);
    }
  });
//   exec("cmd /c start chrome --start-maximized --remote-debugging-port=9222 --auto-open-devtools-for-tabs --user-data-dir='C:/temp/chrome_dev_test' http://localhost:30000 http://localhost:30000",
//     (error, stdout, stderr) => {
//       if (error) {
//         console.error("[openChromeDebugSession] exec error:", error);
//         return;
//       }
//       console.log("[openChromeDebugSession] stdout:", stdout);
//       console.error("[openChromeDebugSession] stderr:", stderr);
//     });
}

// Orchestrating the sequence
async function runProcess() {
  try {
    await runWebpackBuild();
    if (mode === "development") {
      // Only run these in development mode
      await startFoundryServer();
      console.log("[runProcess] Awaited Foundry Server, Calling openChromeDebugSession()");
      openChromeDebugSession();
    }
  } catch(error) {
    console.error("[runProcess] An error occurred during the development process:", error);
  }
}

runProcess().catch((error) => console.error("[runProcess] Failed to run the process:", error));
