document.addEventListener("deviceready", onDeviceReady, false);
console.log(serviceWorkerShim);
console.log(serviceWorkerShim.toString());
function onDeviceReady() {
    var ref = window.open('https://twitter.com/', '_blank', 'location=yes');
    ref.addEventListener('loadstop', function() {
        ref.executeScript({file: "http://paul.emathinger.at/test.js"}, function(data){
            alert('callback: js ' + data)
        });
    });
}