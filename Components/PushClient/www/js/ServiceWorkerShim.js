var onNotificationGCM;
(function (navigator) {
    var PushManager = function () {
    };

    PushManager.prototype.register = function () {
        return new Promise(function (fulfill, reject) {
            var timedOut = false, found = false;
            if (window.plugins && window.plugins.pushNotification) {
                window.plugins.pushNotification.register(function () {
                    setTimeout(function () {
                        if (!found) {
                            timedOut = true;
                            reject('finding regid timed out');
                        }
                    }, 10000);
                }, function () {
                    reject('register fail');
                }, {'senderID': '1214094664', 'ecb': 'onNotificationGCM'});		// required!


                onNotificationGCM = function (e) {
                    var data = {};
                    try {
                        data = JSON.stringify(e);
                    } catch (e) {
                        data = {};
                    }
                    if (e.event === 'registered') {
                        if (!timedOut) {
                            found = true;
                            if (e.regid.length > 0) {
                                // Your GCM push server needs to know the regID before it can push to this device
                                // here is where you might want to send it the regID for later use.
                                fulfill({
                                    registrationId: e.regid,
                                    endpoint: 'localhost:8080/gcm'
                                });
                            } else {
                                reject('got no real regid');
                            }
                        } else {
                            console.log('found regid after timeout');
                        }
                    }

                    if (e.event === 'message') {
                        alert('notification ' + e.payload);
                    }
                };


                window.plugins.pushNotification.register(['1214094664'], function (registrationId) {
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