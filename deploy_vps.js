const { Client } = require("ssh2");
const fs = require("fs");
const path = require("path");

// Load env variables from backend .env or local .env
const backendEnvPath = path.join(__dirname, "../Ssbwithisv-website-backend/Backend/.env");
if (fs.existsSync(backendEnvPath)) {
    require("dotenv").config({ path: backendEnvPath });
}
require("dotenv").config();

const config = {
    host: "88.222.214.155",
    port: 22,
    username: "root",
    password: (process.env.VPS_PASS || process.env["Vps-server-Password"] || "").trim(),
    // Try to load private key if available, otherwise fall back to password
    privateKey: fs.existsSync(path.join(__dirname, "vps_deploy_key")) 
        ? fs.readFileSync(path.join(__dirname, "vps_deploy_key")) 
        : undefined
};

const localBuildPath = path.join(__dirname, "build");
const remotePath = "/var/www/ssbwithisv/frontend/build";

const conn = new Client();

conn.on("ready", () => {
    console.log("⚡ SSH Connection Established!");
    
    // Ensure remote directory exists
    conn.exec(`mkdir -p ${remotePath}`, (err, stream) => {
        if (err) throw err;
        stream.on("close", (code, signal) => {
            console.log("📂 Remote build directory verified.");
            uploadFiles();
        }).on("data", (data) => {
            console.log("STDOUT: " + data);
        }).stderr.on("data", (data) => {
            console.log("STDERR: " + data);
        });
    });
}).connect(config);

function uploadFiles() {
    conn.sftp((err, sftp) => {
        if (err) throw err;
        
        console.log("🚀 Commencing file upload...");
        const filesToUpload = [];
        
        function walkDir(currentLocalPath, currentRemotePath) {
            const list = fs.readdirSync(currentLocalPath);
            list.forEach(file => {
                const localFilePath = path.join(currentLocalPath, file);
                const remoteFilePath = path.posix.join(currentRemotePath, file);
                const stat = fs.statSync(localFilePath);
                
                if (stat.isDirectory()) {
                    filesToUpload.push({ type: "dir", local: localFilePath, remote: remoteFilePath });
                    walkDir(localFilePath, remoteFilePath);
                } else {
                    filesToUpload.push({ type: "file", local: localFilePath, remote: remoteFilePath });
                }
            });
        }
        
        walkDir(localBuildPath, remotePath);
        
        let fileIndex = 0;
        
        function processNext() {
            if (fileIndex >= filesToUpload.length) {
                console.log("✅ File upload complete!");
                restartNginx();
                return;
            }
            
            const item = filesToUpload[fileIndex++];
            if (item.type === "dir") {
                sftp.mkdir(item.remote, (err) => {
                    // Ignore error if directory already exists
                    processNext();
                });
            } else {
                console.log(`📤 Uploading: ${path.relative(localBuildPath, item.local)}`);
                sftp.fastPut(item.local, item.remote, (err) => {
                    if (err) {
                        console.error(`❌ Error uploading ${item.local}:`, err.message);
                        conn.end();
                        return;
                    }
                    processNext();
                });
            }
        }
        
        processNext();
    });
}

function restartNginx() {
    console.log("🔄 Restarting Nginx service on VPS...");
    conn.exec("systemctl restart nginx", (err, stream) => {
        if (err) throw err;
        stream.on("close", (code, signal) => {
            console.log("✨ Deployment successfully completed!");
            conn.end();
        }).on("data", (data) => {
            console.log(data.toString());
        });
    });
}
