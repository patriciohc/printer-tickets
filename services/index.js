const configService = require('./config-services');
const printerService = require('./printer-service');
const SimpleHTTPService = require('../http');

var service = null;

function start() {
    const userConfig = configService.getUserConfig();
    if (!userConfig || !userConfig.servicePort) {
        console.log('no se puede iniciar el servicio, no se ha configurado el puerto');
        return;
    }
    printerService.initPrinter();
    service = new SimpleHTTPService(userConfig.servicePort);
    service
        .get('/getListPrinters', printerService.getListPrintersCtr)
        .get('/getPrinterStatus', printerService.getPrinterStatusCtr)
        .get('/initPrinter', printerService.initPrinterCtr)
        .get('/printerTest', printerService.printTestCtr)
        .post('/printerTicket', printerService.printTicketCtr)

        .get('/getListPrintersConfig', configService.getListPrintersConfigCtr)
        .get('/getUserConfig', configService.getUserConfigCtr)
        .post('/saveUserConfig', configService.saveUserConfigCtr)

        .get('/testConecction', function(req, res) {
            res.json({message: 'Conexion exitosa', success: true })
        });
}

function quit() {
    if (service =! null) {
        service.close();
    }
}

async function restart() {
    if (service =! null) {
        service.close();
        await sleep(5000);
        start();
    } else {
        start();
    }
}

async function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    });
}

module.exports = {
    start,
    restart,
    quit
}
