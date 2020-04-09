const fs = require('fs');
const appConfig = require('../configs-app/configs.json');

const fileConfig = appConfig.userConfigFile;


function getUserConfig() {
    try {
        const text = fs.readFileSync(fileConfig);
        return JSON.parse(text);
    } catch (error) {
        console.error(error);
        return null;
    }
}

function getUserConfigCtr(req, res) {
    const config = getUserConfig();
    const printer = appConfig.devices.find(item => item.id == config.printerId);
    res.json({printer});
}

/**
 * body example: {"printerId":"1","servicePort":"8888"}
 */
function saveUserConfigCtr(req, res) {
    const userConfig = req.body;
    const config = getUserConfig();
    if (userConfig && userConfig.printerId) {
        config.printerId = userConfig.printerId;
        try {
            fs.writeFileSync(fileConfig, JSON.stringify(config));
            res.json({message: 'se guardo correctamente', success: true});
        } catch (error) {
            res.json({message: 'ocurrio un error al guardar la informacion', success: false});
        }
    }
}

function getListPrintersConfigCtr(req, res) {
    res.json(appConfig.devices);
}

module.exports = {
    getUserConfigCtr,
    saveUserConfigCtr,
    getListPrintersConfigCtr,
    getUserConfig
}