window.onload = function(){
    console.log('dom loaded');
    var iframe = document.querySelector("iframe");

    iframe.addEventListener("loadstart", function(){
        console.log('loadstart');
    });
    iframe.addEventListener("loadstop", function(){
        console.log('loadstop')
    });
    iframe.addEventListener("loadabort", function(){
        console.log('loadabort')
    });
    iframe.addEventListener("exit", function(){
        console.log('exit')
    });

    document.querySelector('input').addEventListener('change', function(e){
        var val = this.value;
        if(val.substr(0,4) !== 'http'){
            val = 'http://' + val;
        }
        iframe.src = val;
        console.log('new iframe val: ' + iframe.src);
    });
};

navigator.dummyServiceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.register().then(
        function (pushRegistration) {
            console.log(pushRegistration.registrationId);
            console.log(pushRegistration.endpoint);
            // The push registration details needed by the application server to push
            // messages to the push service are now available, and can be sent to the
            // application server using, for example, an XMLHttpRequest.
        }, function (error) {
            // During development it often helps to log errors to the console. In a
            // production environment it might make sense to also report information
            // about errors back to the application server.
            console.log(error);
        }
    );
});