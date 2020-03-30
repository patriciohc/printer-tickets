const fs = require('fs');
const appConfig = require('./configs-app/configs.json');
const printerService = require('./printer-service/printer-service');
const printerDriver = require('./printer-drivers');

const fileConfig = appConfig.userConfigFile;

window.addEventListener('DOMContentLoaded', () => {
});

window.getUserConfig = function() {
  const text = fs.readFileSync(fileConfig);
  return JSON.parse(text);
}

window.saveUserConfigs = function(userConfig) {
  const fileConfig = appConfig.userConfigFile;
  fs.writeFileSync(fileConfig, JSON.stringify(userConfig));
  printerService.initialize();
}

window.getListPrinters = printerDriver.getListPrinters;
window.printerTest = printerService.printTest;