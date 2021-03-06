/**
 * Created by wenming on 31/01/2017.
 */
var map;
var markers = [];
var largeInfowindow;
//since no const in ES5, I use var
var initCenter = {lat: -33.86882, lng: 151.209296};
/**
 * initialize google maps
 */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: initCenter,
        //this parameter is meaningless, since map.fitBounds will change it
        zoom: 13
    });

    var bounds = new google.maps.LatLngBounds();

    largeInfowindow = new google.maps.InfoWindow();

    topSights.forEach(function (element, key) {
        element.marker = new google.maps.Marker({
            map: map,
            position: element.coordinate,
            title: element.name,
            animation: google.maps.Animation.DROP,
            id: key,
            info: ""
        });
        bounds.extend(element.coordinate);
        element.marker.addListener('click', function () {
            populateInfoWindow(this, largeInfowindow);
        });
    });
    map.fitBounds(bounds);
}

/**
 * send ajax request to wikipedia, using jquery
 */
var Request = function (marker) {
    var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + marker.title + "&format=json&callback=wikiCallback";
    return $.ajax({url: wikiURL, dataType: "jsonp"});
};

/**
 * open detail infoWindow
 * @param marker    the marker user click
 * @param infowindow
 */
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        //if there is a infowindow already open, stop its animation
        if (infowindow.marker) {
            infowindow.marker.setAnimation(null);
        }
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.marker = marker;

        // open infowindow and show content
        var display = function (marker, infowindow) {
            infowindow.setContent(marker.info);
            infowindow.open(map, marker);
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function () {
                marker.setAnimation(null);
                infowindow.marker = null;
            });
        };

        var xhr;
        /**
         * if this is the first time open this marker, call ajax function
         * to request data from web and cache data
         */
        if (marker.info === "") {
            xhr = Request(marker, infowindow);
            // success, store data in marker.info
            xhr.done(function (response) {
                var articleList = response[1];
                var output = [];
                articleList.forEach(function (element) {
                    var url = "http://en.wikipedia.org/wiki/" + element;
                    output.push("<p><a href='" + url + "'>" + element + "</a></p>");
                });
                marker.info = "<div>" + "<p>" + marker.title + "</p><hr/><p>See wikipedia:</p>" + output.join(" ") + "</div>";
                display(marker, infowindow);
            });
            // fail, set error message
            xhr.fail(function () {
                marker.info = "<div>" + "Failed to fetch information, Please check your network." + "</div>";
                display(marker, infowindow);
            })
        } else {
            //if this is not the first time, no need to request data, just show it
            display(marker, infowindow);
        }
    }
}

function googleError() {
    $("#map").append("<div class='errorMessage'>There is something wrong with Google Maps. Please reload this page later.</div>");
    alert("error");
}