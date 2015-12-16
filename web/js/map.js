App.controller('map-page', function (page) {
    
    function createMap(position) {
        var mapCanvas = document.querySelector('.app-section.map-container'),
            LatLng = {lat: position.coords.latitude, lng: position.coords.longitude},
            mapOptions = {
                center: LatLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: false,
            };
            map = new google.maps.Map(mapCanvas, mapOptions);
            marker = new google.maps.Marker({
                position: LatLng,
                map: map,
            });
        
        var $accuracy = document.querySelector('.accuracy-text');
        $accuracy.innerHTML = 'Accurate to ' + position.coords.accuracy + 'm';
        
        var $sendBtn = document.querySelector('.app-button.send');
        Clickable($sendBtn);
        $sendBtn.addEventListener('click', function () {
            sendMap();
        }, true);
        
        function sendMap() {
            console.log('test');
            console.log(LatLng); 		

        }
    }
    //TODO
    // take in location param otherwise, fetch location
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(createMap,showError);
        } else {
            console.error('Geolocation is not supported');
        }
    }
  
    function showError(error) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                x.innerHTML = "User denied the request for Geolocation."
                break;
            case error.POSITION_UNAVAILABLE:
                x.innerHTML = "Location information is unavailable."
                break;
            case error.TIMEOUT:
                x.innerHTML = "The request to get user location timed out."
                break;
            case error.UNKNOWN_ERROR:
                x.innerHTML = "An unknown error occurred."
                break;
            }
        }
  
    getLocation();

});

App.controller('send', function (page) {
  // put stuff here
});

try {
    App.restore();
} catch (err) {
    App.load('map-page');
}
