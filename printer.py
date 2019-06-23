from escpos.printer import Usb
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from sys import argv
import SocketServer
import json
import cgi

idVendor = 0x6868
idProduct = 0x0200

'''
data = {
    'socio': {
        'razon_social': 'Papeleria Payito'    
    },
    'unidad': {
        'direccion': 'Carr. Fed. Mex-Pue Km 98 No 6',
        'telefono': '(222) 2-21-00-90'                    
    },
    'data': {
        'fecha': '2017-04-02 3:18',
        'compania': 'Telcel',
        'folio': '1234567890',
        'telefono': '1234567890',
        'descripcion': 'Recarca $20'
    }
}
'''

def printFirma(socio, unidad):
    p.text('\n')
    p.text(socio['razon_social'].upper() + '\n')    
    p.text(unidad['direccion'] + '\n')
    p.text('Tel: ' + unidad['telefono'] + '\n\n')


def printRecarga(data):
    p.text('Recarga eletronica ' + data['compania'] + '\n')
    p.text('Fecha:' + data['fecha'] + '\n')
    p.text('Folio: ' + data['folio'] + '\n')
    p.text('Telefono: ' + data['telefono'] + '\n')
    p.text(data['descripcion'] + '\n')
    p.cut()


def init_printer():
    try: 
        p = Usb(idVendor, idProduct,0, 0x81,0x02)
    Execption: 
    
if __name__ == "__main__":
    if len(argv) == 2:
        run(port=int(argv[1]))
    else:
        run()

# p.barcode('1324354657687', 'EAN13', 64, 2, '', '')

