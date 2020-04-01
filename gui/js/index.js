'use strict';


var app = new Vue({
    el: '#app',
    data: {
        printerStatus: false,
        printersSystem: [],
        printersConfig: [],
        userConfig: {
            printerId: "0",
            servicePort: ""
        },
        currentConfig: {
            printerId: "",
            printer: {},
            servicePort: ""
        }
    },
    methods: {
        searchPrinters: function () {
            this.printersSystem = getListPrinters();
        },
        saveConfigs: function() {
            saveUserConfigs(this.userConfig);
            printerInitialize();
            this.printerStatus = getPrinterStatus();
            let printer = this.printersConfig.find(item => item.id == this.userConfig.printerId);
            this.currentConfig = {...this.userConfig, printer};
        },
        reconect: function() {
            printerInitialize();
            this.printerStatus = getPrinterStatus();
        },
        testPrinter: printerTest
    },
    created() {
        this.printersSystem = getListPrinters();
        this.userConfig = getUserConfig();
        this.printersConfig = getListPrintersConfig();
        this.printerStatus = getPrinterStatus();
        console.log('status printer', this.printerStatus);
        let printer = this.printersConfig.find(item => item.id == this.userConfig.printerId);
        this.currentConfig = {...this.userConfig, printer};
    }
})


window.addEventListener('DOMContentLoaded', () => {

})
