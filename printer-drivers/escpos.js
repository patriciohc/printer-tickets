/** 
 * Todos los drivers, deben implementar las funciones
 * initDevice, printTikect, printTest, getPrinterStatus
*/
const escpos = require('escpos');
escpos.USB = require('escpos-usb');

const options = { encoding: "GB18030" /* default */ }

var printer = null;
var device = null;

function initDevice(idVendor, idProduct) {
    try {
        device = new escpos.USB(idVendor, idProduct);
        printer = new escpos.Printer(device, options);
    } catch (error) {
        console.log('No se pudo inicializar la impresora', error);
    }

}

function getPrinterStatus() {
    return printer != null;
}

/**
 * Ejemplo de datos recibidos
{
    'ticket_tipo': recarga|regular
    'socio': {
        'razon_social': 'Papeleria Payito'    
    },
    'unidad': {
        'direccion': '2 Sur no 2 Puebla centro',
        'telefono': '(222) 2-44-60-70'                    
    },
    'recarga': {
        'fecha': '2017-04-02 3:18',
        'compania': 'Telcel',
        'folio': '1234567890',
        'telefono': '1234567890',
        'descripcion': 'Recarca $20'
    },
    "productos": [{
        "producto": "Libreta Scribe cuadro 7 mm",
        "cantidad": "100",
        "total": "1500"
    }]
}
*/
function printTikect(data) {
    device.open(function (error) {
        if (error) {
            console.error(error);
            return;
        }
        try {
            printer
                .font('a')
                .align('ct')
                .style('bu')
                .size(1, 1)
                .text(data.socio.razon_social)
                .text(data.unidad.direccion + ", " + data.unidad.telefono)
            
            if (data.tipo == 'recarga') {
                printer
                    .text('RECARGA TELEFONICA')
                    .text('Fecha: ' + data.data.fecha)
                    .text('Compania: ' + data.data.compania)
                    .text('Folio: ' + data.data.folio)
                    .text('Telefono: ' + data.data.telefono)
                    .text('Descripcion: ' + data.data.descripcion)
            } else if (data.tipo == 'regular') {
                let printerItems = getDataPrinterItem(data.productos)
                printer
                    .table(["Concepto", "Cantidad", "Total"])
                    .tableCustom(printerItems, { encoding: 'cp857', size: [1, 1] } // Optional
                )
            }
            printer.cut().close();
        } catch(error) {
            console.error(error);
        }

    });
}

function getDataPrinterItem(items) {
    var printerProducts = []
    for (let i = 0; i < items.length; i++) {
        printerProducts.push({ text: items[i].producto, align: "LEFT", width: 0.80 })
        printerProducts.push({ text: items[i].cantidad, align: "CENTER", width: 0.1 })
        printerProducts.push({ text: items[i].total, align: "RIGHT", width: 0.1 })
    }
    return printerProducts;
}

function printTest() {
    device.open(function (error) {
        if (error) {
            console.error(error);
            return;
        }
        try {
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .text('敏捷的棕色狐狸跳过懒狗')
            .barcode('1234567', 'EAN8')
            .table(["One", "Two", "Three"])
            .tableCustom(
                [
                    { text: "Left", align: "LEFT", width: 0.33, style: 'B' },
                    { text: "Center", align: "CENTER", width: 0.33 },
                    { text: "Right", align: "RIGHT", width: 0.33 }
                ],
                { encoding: 'cp857', size: [1, 1] } // Optional
            )
            .qrimage('https://github.com/song940/node-escpos', function (err) {
                printer.cut();
                printer.close();
            });
        } catch(error) {
            console.error(error);
        }

    });
}

module.exports = {
    initDevice,
    printTikect,
    printTest,
    getPrinterStatus
}