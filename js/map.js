/**
 * Created by wenming on 31/01/2017.
 */
var map;
var markers = [];
var largeInfowindow;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.86882, lng: 151.209296},
        zoom: 13
    });

    var bounds = new google.maps.LatLngBounds();

    largeInfowindow = new google.maps.InfoWindow();

    topSights.forEach(function (element,key) {
        var marker = new google.maps.Marker({
            map: map,
            position: element.coordinate,
            title: element.name,
            animation: google.maps.Animation.DROP,
            id: key
        });
        markers.push(marker);
        bounds.extend(element.coordinate);
        markers.forEach(function (element) {
            element.addListener('click', function () {
                populateInfoWindow(this, largeInfowindow);
            });
        });
    });
    map.fitBounds(bounds);
}

function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
            marker.setAnimation(null);
        });
    }
}