const fs = require('fs');
const printerDrivers = require('../printer-drivers');
const appConfig = require('../configs-app/configs.json');
const http = require('http');

const fileConfig = appConfig.userConfigFile;

var printer = null;
var userConfig = null;
var server = null;


function getUserConfig() {
  const text = fs.readFileSync(fileConfig);
  return JSON.parse(text);
}

function initialize() {
    userConfig = getUserConfig();
    let deviceConfig = appConfig.devices.find(item => item.id == userConfig.printerId);
    printer = printerDrivers.getPrinter(deviceConfig);
    initServer();
}

function initServer() {
    if (server) {
        server.close();
    }
    server = http
        .createServer(httpListener)
        .listen(userConfig.servicePort);
}

async function httpListener(req, res) {
    let body = await getData(req);
    console.log("body: ", body);
    printer.printTest();
    sendData(res, {success: true});
}

function getData(request) {
    return new Promise((resolve, reject) => {
        let body = [];
        request.on('error', (err) => {
            reject(error);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            resolve(JSON.parse(body));
        });
    }) 
}

function sendData(response, message) {
    response.on('error', (err) => {
        console.error(err);
    });
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.write(JSON.stringify(message));
    response.end();
}

function printTest() {
    if (printer != null) {
        printer.printTest();
    }
}

module.exports = {
    initialize,
    printTest
}

