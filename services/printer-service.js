const printerDriver = require('../printer-drivers');
const configService = require('./config-services');
const appConfig = require('../configs-app/configs.json');

var printer = null;
var userConfig = null;

function initPrinter() {
    userConfig = configService.getUserConfig();
    if (!userConfig) {
        console.log('No se ha encontrado ninguna configuracion');
        return;
    }
    let deviceConfig = appConfig.devices.find(item => item.id == userConfig.printerId);
    if (!deviceConfig) {
        console.log('Este dispositovo no esta soportado');
        return;
    }
    try {
        printer = printerDriver.getPrinter(deviceConfig);
        if (printer) {
            console.log('La impresoar se inicio correctamente: ', deviceConfig);
        } else {
            console.log('protocolo de impresion no sorpotado');
        }
    } catch (error) {
        console.log(error);
    }
}

function initPrinterCtr(req, res) {
    userConfig = configService.getUserConfig();
    if (!userConfig) {
        res.json({message: 'No se ha encontrado ninguna configuracion', success: false});
        return;
    }
    let deviceConfig = appConfig.devices.find(item => item.id == userConfig.printerId);
    if (!deviceConfig) {
        res.json({message: 'Este dispositovo no esta soportado', success: false});
        return;
    }
    try {
        printer = printerDriver.getPrinter(deviceConfig);
        if (printer) {
            res.json({message: 'la impresora se inicio correctamente', success: true});
        } else {
            res.json({message: 'protocolo de impresion no sorpotado', success: false});
        }
    } catch (error) {
        console.log(error);
        res.json({message: 'No se pudo inicializar la impresora', status: false});
    }
}

function getPrinterStatusCtr(req, res) {
    const status = printer != null && printer.getPrinterStatus();
    res.json({status});
}

function getListPrintersCtr(req, res) {
    const listPrinters = printerDriver.getListPrinters();
    res.json(listPrinters);
}

function printTestCtr(req, res) {
    if (printer != null) {
        printer.printTest();
        res.json({message: "Se envio la impresion correctamente", success: true});
    } else {
        res.json({message: "La impresora no ha sido inicializada", success: false});
    }
}

function printTicketCtr(req, res) {
    const ticket = req.body;
    if (printer == null) {
        res.json({message: "La impresora no ha sido inicializada", success: false});
        return;
    }
    try {
        printer.printTikect(ticket);
        res.json({message: "Se envio la impresion correctamente", success: true});
    } catch (error) {
        console.log('Error al imprimir el ticket', error);
        res.json({message: 'Error al imprimir el ticket', success: false});
    }
}

module.exports = {
    initPrinter,
    initPrinterCtr,
    printTestCtr,
    getPrinterStatusCtr,
    getListPrintersCtr,
    printTicketCtr
}

