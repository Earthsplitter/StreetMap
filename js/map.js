/**
 * Created by wenming on 31/01/2017.
 */
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.86882, lng: 151.209296},
        zoom: 13
    });
}