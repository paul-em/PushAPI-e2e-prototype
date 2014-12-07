(function (navigator) {
    var PushManager = function () {
    };

    PushManager.prototype.register = function () {
        return new Promise(function (fulfill, reject) {
            if(navigator.dummyServiceWorkerRegistrationId && navigator.dummyServiceWorkerEndpoint) {
                fulfill({
                    registrationId: navigator.dummyServiceWorkerRegistrationId,
                    endpoint: navigator.dummyServiceWorkerEndpoint
                })
            } else {
                reject('could not find registrationId or endpoint')
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