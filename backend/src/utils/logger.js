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
export constinfo = (message) => writeLog('INFO', message);
export constwarn = (message) => writeLog('WARN', message);
export consterror = (message) => writeLog('ERROR', message);
