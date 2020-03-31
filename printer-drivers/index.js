const appConfig = require('../configs-app/configs.json');


function getPrinter(printerConfig) {
    switch (printerConfig.protocol) {
        case 'escpos': {
            const printer = require('./escpos');
            printer.initDevice();
            return printer;
        }
    }
}

function getListPrinters() {
    let listDeviceDsc = [];
    const escpos = require('escpos');
    escpos.USB = require('escpos-usb');
    new escpos.USB();
    let listDevice = escpos.USB.findPrinter();
    for (let i = 0; i < listDevice.length; i++) {
        let idVendor = listDevice[i].deviceDescriptor['idVendor'];
        let idProduct = listDevice[i].deviceDescriptor['idProduct'];
        listDeviceDsc.push(findPrinterProperties(idVendor, idProduct))
    }
    return listDeviceDsc;
}


function findPrinterProperties(idVendor, idProduct) {
    const device = appConfig.devices
        .find(item => item.idVendor == idVendor && item.idProduct == idProduct);

    if (!device) {
        return {
            name: idVendor + " - " + idProduct,
            idVendor,
            idProduct
        }
    } else {
        return device
    }
}


module.exports = {
    getPrinter,
    getListPrinters
}