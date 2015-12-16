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
        
        var $accuracy = document.querySelector('.accuracy-text'),
            accuracyText = String(position.coords.accuracy);
        
        $accuracy.innerHTML = 'Accurate to ' + accuracyText.substring(0,2) + 'm';
        
        var $sendBtn = document.querySelector('.app-button.send');
        Clickable($sendBtn);
        $sendBtn.addEventListener('click', function () {
            sendMap();
        }, true);
        
        function sendMap() {
            if (kik.enabled) {
                if (kik.send) {
                    kik.send({
                        title: "Location",
                        noForward: true,
                        data: { 
                            chat_widget: true,
                            size: {"width": 300, "height": 300},
                            location: position,
                        },
                    });
                }
            }
        }
    }

    function getLocation() {
        if (kik.message){
            createMap(kik.message.location);
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(createMap,showError);
        } else {
            console.error('Geolocation is not supported');
        }
    }
  
    function showError(error) {
        var x = document.querySelector('.accuracy-text');
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
    // for sending worse maps
    function showPosition(position) {
        console.log(position.coords);
        var pos = position.coords.latitude + "," + position.coords.longitude,
        $map = document.querySelector('.app-section.map-container'),
        img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+pos+"&zoom=14&size=500x500&sensor=false";
        $map.innerHTML = "<img src='" + img_url + "'>";
    }
  
    getLocation();

});

try {
    App.restore();
} catch (err) {
    App.load('map-page');
}
