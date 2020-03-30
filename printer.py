from escpos.printer import Usb
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
from sys import argv
import SocketServer
import json
import cgi

'''
data = {
    'socio': {
        'razon_social': 'Papeleria Payito'    
    },
    'unidad': {
        'direccion': '2 Sur no 2 Puebla centro',
        'telefono': '(222) 2-44-60-70'                    
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


class Commands:

    idVendor = 0x6868
    idProduct = 0x0200

    def __init__(self):
        self.__printer = None
        self.init_printer()
    
    def init_printer(self):
        try: 
            self.__printer = Usb(self.idVendor, self.idProduct,0, 0x81,0x02)
        except Exception as error:
            print(error) 

    def print_firma(self, socio, unidad):
        self.__printer.text('\n')
        self.__printer.text(socio['razon_social'].upper() + '\n')
        self.__printer.text(unidad['direccion'] + '\n')
        self.__printer.text('Tel: ' + unidad['telefono'] + '\n\n')

    def print_recarga(self, data):
        self.__printer.text('Recarga eletronica ' + data['compania'] + '\n')
        self.__printer.text('Fecha:' + data['fecha'] + '\n')
        self.__printer.text('Folio: ' + data['folio'] + '\n')
        self.__printer.text('Telefono: ' + data['telefono'] + '\n')
        self.__printer.text(data['descripcion'] + '\n')
        self.__printer.cut()

    def test(self):
        self.__printer.barcode('1324354657687', 'EAN13', 64, 2, '', '')
        self.__printer.cut()


if __name__ == "__main__":
    commands = Commands()
    commands.test()

