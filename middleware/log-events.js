const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const PATH_FOLDERNAME = '../logs';
const PATH_LOGFOLDER = path.join(__dirname, PATH_FOLDERNAME);

const logEvents = async (msg, filename) => {

    let dateTimeFormatted = `${format(new Date(), '[yyyy-MM-dd]\tHH:mm:ss')}`;
    let logMessage = `${dateTimeFormatted}\t${uuid()}\t${msg}\n`;

    try {
        if (!fs.existsSync(PATH_LOGFOLDER)) {
            await fsPromises.mkdir(PATH_LOGFOLDER);
        }
        const logfilePath = path.join(__dirname, PATH_FOLDERNAME, filename);
        await fsPromises.appendFile(logfilePath, logMessage);
        console.log(`[CONSOLE_LOG] ${logMessage}`);
    } catch (err) {
        console.error(err.message);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}\t`, 'req-log.txt');
    console.log(`[CONSOLE_LOG] ${req.method} ${req.path}`);
    next();
}

module.exports = { logEvents, logger }