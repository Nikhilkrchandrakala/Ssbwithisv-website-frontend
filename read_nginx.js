const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

// Load env variables from backend .env or local .env
const backendEnvPath = path.join(__dirname, "../Ssbwithisv-website-backend/Backend/.env");
if (fs.existsSync(backendEnvPath)) {
    require("dotenv").config({ path: backendEnvPath });
}
require("dotenv").config();

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cat /etc/nginx/sites-enabled/default', (err, stream) => {
    if (err) throw err;
    stream.on('close', (code, signal) => {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '88.222.214.155',
  port: 22,
  username: 'root',
  password: (process.env.VPS_PASS || process.env["Vps-server-Password"] || "").trim()
});
