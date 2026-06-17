const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');
  conn.exec('cat /var/www/ssbwithisv/Backend/.env', (err, stream) => {
    if (err) throw err;
    let stdout = '';
    stream.on('close', (code, signal) => {
      console.log('--- REMOTE .env CONTENTS ---');
      console.log(stdout);
      console.log('----------------------------');
      conn.end();
    }).on('data', (data) => {
      stdout += data;
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
