'use strict';


var app = new Vue({
    el: '#app',
    data: {
        printers: [],
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
            this.printers = getListPrinters();
        },
        saveConfigs: function() {
            saveUserConfigs(this.userConfig);
            let printer = this.printers.find(item => item.id == this.userConfig.printerId);
            this.currentConfig = {...this.userConfig, printer};
        },
        testPrinter: printerTest
    },
    created() {
        this.printers = getListPrinters();
        this.userConfig = getUserConfig();
        let printer = this.printers.find(item => item.id == this.userConfig.printerId);
        this.currentConfig = {...this.userConfig, printer};
    }
})


window.addEventListener('DOMContentLoaded', () => {

})
