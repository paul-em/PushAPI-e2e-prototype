var onNotificationGCM;
var registration;
var ref;
var shim;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    ref = window.open('http://eliteembook:3000', '_blank', 'location=yes,EnableViewPortScale=yes');
    shim = document.getElementById('ServiceWorkerShim').innerText;
    getRegistrationID().then(function (_registration) {
        registration = _registration;
        injectJs();
        ref.addEventListener('loadstop', function () {
            injectJs();
        });
    });
}

function injectJs() {
    ref.executeScript({
        code: 'navigator.dummyServiceWorkerRegistrationId = "' + registration.registrationId + '";' +
        'navigator.dummyServiceWorkerEndpoint = "' + registration.endpoint + '";' + shim
    }, function () {
        console.log('injected script');

    });
}

function getRegistrationID() {
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
                                endpoint: 'http://192.168.1.114:8080'
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
        } else {
            reject('no pushNotification plugin found')
        }
    });
}