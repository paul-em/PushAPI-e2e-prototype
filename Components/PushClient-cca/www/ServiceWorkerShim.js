(function (navigator) {
    var PushManager = function () {
    };

    PushManager.prototype.register = function () {
        return new Promise(function (fulfill, reject) {
            if(chrome.gcm){
            chrome.gcm.register(['1214094664'], function (registrationId) {
                fulfill({
                    registrationId: registrationId,
                    endpoint: 'localhost:8080/gcm'
                })
            });
            } else {
                fulfill({
                    registrationId: 'dummyId',
                    endpoint: 'localhost:8080/gcm'
                })
            }
        });
    };

    var ServiceWorkerRegistration = function () {
        this.pushManager = new PushManager();
    };

    // we do not really operate in a context of serviceWorkers here, this is just a shim to try out the future API usage
    var ServiceWorker = function () {
        var self = this;
        this.serviceWorkerRegistration = new ServiceWorkerRegistration();
        this.ready = new Promise(function (fulfill, reject) {
            fulfill(self.serviceWorkerRegistration);
        })
    };

    ServiceWorker.prototype.register = function (path) {
        var self = this;
        return new Promise(function (fulfill, reject) {
            fulfill(self.serviceWorkerRegistration);
        });
    };


    navigator.dummyServiceWorker = new ServiceWorker();
})(window.navigator);