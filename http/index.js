const http = require('http');


class SimpleHTTPSerivice {

    server = null;
    callbacks = [];

    constructor(port) {
        if (!port || isNaN(port)) {
            console.log('No se puede iniciar el servidor, el purto debe ser numerico');
            return;
        }
        if (this.server) {
            return;
        }
        try {
            this.server = http
                .createServer(this.httpListener.bind(this))
                .listen(port);
            console.log('se inicio el servidor en el puerto: ' + port);
        } catch (error) {
            console.log('Error al iniciar el servidor: ', error);
        }
    }

    close() {
        if (this.server) this.server.close();
    }

    async httpListener(req, res) {
        const { method, url } = req;

        res.setHeader('Access-Control-Allow-Origin', '*');
	    res.setHeader('Access-Control-Request-Method', '*');
	    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	    res.setHeader('Access-Control-Allow-Headers', '*');
	    
        if ( method === 'OPTIONS' ) {
		    res.writeHead(200);
		    res.end();
		    return;
	    }

        var body = null;
        var callback = this.callbacks
            .find(item => item.route == url && item.method == method);
        if (callback == undefined) {
            this.sendData(res, { message: 'route not found' , success: false}, 404);
            return;
        }
        if (method == 'POST') {
            try {
                body = await this.getData(req);
            } catch (error) {
                this.sendData(res, { message: 'bad request' , success: false}, 400);
                return;
            }

        }
        req.body = body;
        res.json = (data, status=200) => {
            this.sendData(res, data, status);
        }
        callback.callback(req, res);
    }

    post(route, callback) {
        let method = 'POST';
        this.callbacks.push({route, callback, method});
        return this;
    }

    get(route, callback) {
        let method = 'GET';
        this.callbacks.push({route, callback, method});
        return this;
    }

    getData(request) {
        return new Promise((resolve, reject) => {
            let body = [];
            request.on('error', (error) => {
                reject(error);
            }).on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                try {
                    body = JSON.parse(body);
                    resolve(body);
                } catch (pError) {
                    reject(pError);
                }
            });
        })
    }

    sendData(response, data, statusCode = 200) {
        response.on('error', (err) => {
            console.error(err);
        });
        response.statusCode = statusCode;
        response.setHeader('Content-Type', 'application/json');
        response.write(JSON.stringify(data));
        response.end();
    }

}


module.exports = SimpleHTTPSerivice

