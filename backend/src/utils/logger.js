const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

// Write a log message to the log file
const writeLog = (level, message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;

  fs.appendFile(logFile, logMessage, (err) => {
    if (err) console.error('Failed to write log:', err);
  });
};

// Export logging functions
exports.info = (message) => writeLog('INFO', message);
exports.warn = (message) => writeLog('WARN', message);
exports.error = (message) => writeLog('ERROR', message);
