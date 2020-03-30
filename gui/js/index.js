'use strict';


var app = new Vue({
    el: '#app',
    data: {
        printers: [],
        userConfig: {
            printerId: "0",
            servicePort: ""
        },
    },
    methods: {
        searchPrinters: function () {
            this.printers = getListPrinters();
        },
        saveConfigs: function() {
            saveUserConfigs(this.userConfig);
        },
        testPrinter: printerTest
    },
    created() {
        this.printers = getListPrinters();
        this.userConfig = getUserConfig();
    }
})


window.addEventListener('DOMContentLoaded', () => {

})
