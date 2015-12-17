App.controller('map-page', function (page) {
    
    function createMap(position) {
        console.log('creating map');
        var mapCanvas = document.querySelector('.app-section.map-container'),
            LatLng = {lat: position.coords.latitude, lng: position.coords.longitude},
            mapOptions = {
                center: LatLng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                draggable: true,
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
            console.log(LatLng);
            var locationString = JSON.stringify(LatLng);
            console.log(locationString);
            console.log(encodeURIComponent(locationString));
            // window.location.hash = locationString;
            window.location.hash = encodeURIComponent(locationString);
            if (kik.enabled) {
                if (kik.send) {
                    kik.send({
                        title: "Location",
                        noForward: true,
                        data: { 
                            chat_widget: true,
                            size: {"width": 300, "height": 500},
                            location: position,
                        },
                    });
                }
            }
        }
    }
    function updateMarker(position){
        return {lat: position.coords.latutide, lng: position.coords.longitude}
    }

    function getLocation() {
        console.log(window.location);
        console.log(window.location.hash);
        if (window.location.hash){
            var position = decodeURIComponent(window.location.hash),
                data = JSON.parse(position.substring(1));
            return App.load('display-page',data);
        }
        if (kik.message){
            console.log('opening via msg');
            console.log(kik.message);
            return App.load('display-page',kik.message);
            // createMap(kik.message);
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
  
    getLocation();

});

App.controller('display-page', function (page, position) {
    console.log('displaying display-page');
    
    // if kik.message works (which it doesnt) use this
    function showPosition(position) {
        console.log(position.coords);
        var pos = position.coords.latitude + "," + position.coords.longitude,
        $map = page.querySelector('.app-section.map-container'),
        img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+pos+"&zoom=14&size=300x300&maptype=roadmap&markers=color%3Ared%7C"+pos;
        $map.style.background = "url(" + img_url + ")";
    }
    
    function renderMap(position) {
        console.log('rendering map');
        var pos = position.lat + "," + position.lng,
        $map = page.querySelector('.app-section.map-container'),
        img_url = "http://maps.googleapis.com/maps/api/staticmap?center="+pos+"&zoom=14&size=300x300&maptype=roadmap&markers=color%3Ared%7C"+pos;
        $map.style.background = "url(" + img_url + ")";
    }
    
    renderMap(position);
});

try {
    App.load('map-page');
} catch (err) {
    // App.load('map-page');
}
