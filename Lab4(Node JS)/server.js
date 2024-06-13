require('dotenv').config();

const http = require('http');
const fs = require('fs');
const path = require('path');

const LOG_FILE_PATH = process.env.LOG_FILE_PATH || './logs';
const LOG_FILE_NAME = process.env.LOG_FILE_NAME || 'connections.log';
const LOG_FILE_FORMAT = process.env.LOG_FILE_FORMAT || 'txt';

const logFilePath = path.join(LOG_FILE_PATH, `${LOG_FILE_NAME}.${LOG_FILE_FORMAT}`);

if (!fs.existsSync(LOG_FILE_PATH)){
  fs.mkdirSync(LOG_FILE_PATH, { recursive: true });
}

const logConnection = (logData) => {
  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error('Error writing to log file', err);
    }
  });
};

const server = http.createServer((req, res) => {
  const { method, url, headers } = req;
  const logData = `Method: ${method}\nURL: ${url}\nHeaders: ${JSON.stringify(headers, null, 2)}\nTimestamp: ${new Date().toISOString()}\n\n`;

  logConnection(logData);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Request logged\n');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
