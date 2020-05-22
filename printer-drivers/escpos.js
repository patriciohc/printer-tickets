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
    'no_ticket': string,
    'tipo': 'recarga'|'regular'
    'fecha': string,
    'total': number,
    'socio': {
        'razon_social': 'Papeleria Payito'    
    },
    'unidad': {
        'direccion': '2 Sur no 2 Puebla centro',
        'telefono': '(222) 2-44-60-70'                    
    },
    'items': {
        'fecha': '2017-04-02 3:18',
        'compania': 'Telcel',
        'folio': '1234567890',
        'telefono': '1234567890',
        'descripcion': 'Recarca $20'
    },
    "items": [{
        "producto": "Libreta Scribe cuadro 7 mm",
        "cantidad": "100",
        "total": "1500"
    }]
}
*/
function printTikect(data) {
    console.log(data);
    device.open(function (error) {
        if (error) {
            console.error(error);
            return;
        }
        try {
            printer
                .font('a')
                .align('ct')
                .size(1, 1)
                .style('B')
                .text(data.socio.razon_social)
                .style('NORMAL')
                .text('')
                .text(data.unidad.direccion + ", tel: " + data.unidad.telefono)
                .text('No ticket: ' + data.no_ticket)
                .text('Fecha: ' + data.fecha)
                .text('')
                .align('lt')
            if (data.tipo == 'recarga') {
                printer
                    .text('RECARGA TELEFONICA')
                    .text('Compania: ' + data.items.compania)
                    .text('Folio: ' + data.items.folio)
                    .text('Telefono: ' + data.items.telefono)
                    .text('Descripcion: ' + data.items.descripcion)
            } else if (data.tipo == 'regular') {
                // let printerItems = getDataPrinterItem(data.items)
                for (let i = 0; i < data.items.length; i++) {
                    let item = data.items[i];
                    let name = item.cantidad + ' - ' + item.producto;
                    let total = '$' + item.total;
                    let text = completeText(name, total);
                    printer.text(text);
                }
                //printer
                    // .table(["Concepto", "Cantidad", "Total"])
                //    .tableCustom(printerItems, { encoding: 'cp857', size: [1, 1] } // Optional
                //)
            }
            printer
                .style('B')
                .text('')
                .align('rt')
                .text('TOTAL: $' + data.total)
                .text('')
            printer.cut().close();
        } catch(error) {
            console.error(error);
        }

    });
}

function completeText(name, total) {
    let white = '                                   ';
    let size = name.length + total.length;
    let missing = 32 - (size % 32);
    return name + white.substring(1, missing) + total;
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