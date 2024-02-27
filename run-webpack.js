import webpack from "webpack";
import { exec } from "child_process";
import webpackDevConfig from "./webpack.dev.js";
import webpackProdConfigPromise from "./webpack.prod.js";

// Determine the mode based on the command-line argument
const mode = process.argv.includes("--prod") ? "production" : "development";
// Determine the action based on the command-line argument
const action = process.argv.find((arg) => arg.startsWith("--action="))?.split("=")[1];

// Flag to track if the build process is running for the first time
let isFirstBuild = true;

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
      if (err || stats.hasErrors()) {
        console.error("[runWebpackBuild] Webpack build error:", err || stats.toString());
        reject(err);
        return;
      }
      console.log("[runWebpackBuild] Webpack build stats:", stats.toString({ colors: true })); // Output build stats

      // After a successful build in development mode, start the Foundry server if the action is 'build'
      if (mode === "development" && action === "build" && isFirstBuild) {
        // Toggle 'isFirstBuild' to ensure server doesn't run on every recompile.
        isFirstBuild = false;

        // Construct the PowerShell command to start the server in a new window
        const serverStartCommand = "powershell -Command \"Start-Process powershell -ArgumentList '-NoExit', '-Command', 'node run-webpack.js --action=server'\"";

        // Execute the command
        exec(serverStartCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`[runWebpackBuild] Failed to start Foundry server: ${error}`);
            reject(error);
            return;
          }
          if (stdout) console.log(`[runWebpackBuild] Foundry server stdout: ${stdout}`);
          if (stderr) console.error(`[runWebpackBuild] Foundry server stderr: ${stderr}`);
        });
      }
      resolve(); // Resolve immediately after logging stats or attempting to start the server
    });
  });
}

// function startFoundryServer() {
//   return new Promise((resolve, reject) => {
//     // Construct the PowerShell command to start the server in a new window
//     const serverStartCommand = `
//     powershell -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', {
//       [System.Media.SystemSounds]::Asterisk.Play();

//       node 'D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/main.js' --world=city-of-knives --dataPath='D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/FoundryDevData' --hotReload | ForEach-Object {
//         \$_;
//         if (\$_ -match 'Server started and listening') {
//           Start-Process 'chrome.exe' -ArgumentList @(
//             '--start-maximized',
//             '--remote-debugging-port=9222',
//             '--auto-open-devtools-for-tabs',
//             '--user-data-dir=\"D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/ChromeDevProfile\"',
//             'http://localhost:30000',
//             'http://localhost:30000'
//           ) -WindowStyle Maximized
//         }
//       }
//     }" -WindowStyle Hidden`;

//     // Execute the command
//     exec(serverStartCommand, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`[startFoundryServer] exec error: ${error}`);
//         reject(error);
//         return;
//       }
//       if (stdout) console.log(`[startFoundryServer] stdout: ${stdout}`);
//       if (stderr) console.error(`[startFoundryServer] stderr: ${stderr}`);
//       resolve(); // Resolve the promise when the command executes successfully
//     });
//   });
// }

// Function to start the Foundry server directly using Node's child_process.exec
// function startFoundryServer() {
//   return new Promise((resolve, reject) => {
//     // Construct the PowerShell command to start the server in a new window
//     // Replace the paths and arguments as necessary to match your original PowerShell script
//     const serverStartCommand = `
//     Start-Process powershell -ArgumentList '-NoExit', '-Command', {
//       [System.Media.SystemSounds]::Asterisk.Play();

//       node 'D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/main.js' --world=city-of-knives --dataPath='D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/FoundryDevData' --hotReload | ForEach-Object {
//         $_;
//         if ($_ -match 'Server started and listening') {
//           Start-Process 'chrome.exe' -ArgumentList @(
//             '--start-maximized',
//             '--remote-debugging-port=9222',
//             '--auto-open-devtools-for-tabs',
//             '--user-data-dir="D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/ChromeDevProfile"',
//             'http://localhost:30000',
//             'http://localhost:30000'
//           ) -WindowStyle Maximized
//         }
//       }
//     } -WindowStyle Minimized;
//     `;

//     // const serverStartCommand = `powershell -Command "Start-Process powershell -ArgumentList '-NoExit', '-Command', &{node 'D:/LTSC Programs/FoundryVTT/Foundry Virtual Tabletop/resources/app/main.js' --world=city-of-knives --dataPath='D:/Users/Ryan/Documents/Projects/.CODING/FoundryVTT/FoundryDevData' --hotReload}"`;

//     // Execute the command
//     exec(serverStartCommand, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`[startFoundryServer] exec error: ${error}`);
//         reject(error);
//         return;
//       }
//       // Log any output received directly from the exec call
//       if (stdout) console.log(`[startFoundryServer] stdout: ${stdout}`);
//       if (stderr) console.error(`[startFoundryServer] stderr: ${stderr}`);
//       resolve(); // Resolve the promise when the command executes successfully
//     });
//   });
// }

// Function to start the Foundry server using Node's child_process.exec
function startFoundryServer() {
  return new Promise((resolve, reject) => {
    // Use a relative path to refer to the PowerShell script in the same directory
    const serverStartCommand = "powershell -File \".\\start-foundry-server.ps1\"";

    // Execute the command
    exec(serverStartCommand, { windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[startFoundryServer] exec error: ${error}`);
        reject(error);
        return;
      }
      // Log any output received directly from the exec call
      if (stdout) console.log(`[startFoundryServer] stdout: ${stdout}`);
      if (stderr) console.error(`[startFoundryServer] stderr: ${stderr}`);
      resolve(); // Resolve the promise when the command executes successfully
    });
  });
}

// Orchestrating the sequence
async function runProcess() {
  try {
    // Run the build process regardless of the action, if specified to do so
    if (action === "build" || !action) {
      await runWebpackBuild();
    }
    // Start the server only if in development mode and the action is 'server'
    if (mode === "development" && (action === "server" || !action)) {
      await startFoundryServer();
    }
  } catch(error) {
    console.error("[runProcess] An error occurred:", error);
  }
}

runProcess().catch((error) => console.error("[runProcess] Failed to run the process:", error));
