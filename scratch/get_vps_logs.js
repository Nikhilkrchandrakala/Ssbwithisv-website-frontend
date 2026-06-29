const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  // Fetch error logs from PM2
  conn.exec('pm2 logs --err --lines 200 --nostream 2>&1', (err, stream) => {
    if (err) throw err;
    let stdout = '';
    stream.on('close', () => {
      console.log('--- PM2 ERROR LOGS ---');
      console.log(stdout);
      conn.end();
    }).on('data', (data) => {
      stdout += data;
    }).stderr.on('data', (data) => {
      stdout += '[STDERR] ' + data;
    });
  });
}).on('error', (err) => {
  console.error('Connection Error:', err);
}).connect({
  host: '88.222.214.155',
  port: 22,
  username: 'root',
  password: 'Joint@3services'
});
