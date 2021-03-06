const appConfig = require('../configs-app/configs.json');

function getPrinter(printerConfig) {
    switch (printerConfig.protocol) {
        case 'escpos': {
            const printer = require('./escpos');
            printer.initDevice();
            return printer;
        }
        default: {
            return null;
        }
    }
}

/** 
 * Todos los drivers, deben implementar las funciones
 * initDevice, printTikect, printTest, getPrinterStatus
*/
function getListPrinters() {
    let listDeviceDsc = [];
    const escpos = require('escpos');
    escpos.USB = require('escpos-usb');
    try {
        new escpos.USB();
        var listDevice = escpos.USB.findPrinter();
    } catch (error) {
        console.log('No se puedieron obtener impresoras', error);
        return listDeviceDsc;
    }
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