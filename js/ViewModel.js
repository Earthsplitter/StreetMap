/**
 * Created by wenming on 30/01/2017.
 */
var mediaQuery = window.matchMedia("(max-width:960px)");
var topSights = [
    {name: "Sydney Opera House", coordinate: {lat: -33.856802, lng: 151.215254}, visible: true},
    {name: "Sydney Harbour Bridge", coordinate: {lat: -33.852030, lng: 151.210776}, visible: true},
    {name: "The Rocks", coordinate: {lat: -33.859243, lng: 151.208196}, visible: true},
    {name: "Darling Harbour", coordinate: {lat: -33.874871, lng: 151.200911}, visible: true}
];

var ViewModel = function () {
    /**
     * bind this to self
     */
    var self = this;
    /**
     * Data Storage: if show sideBar
     */
    this.showSearchBar = ko.observable(!mediaQuery.matches);
    /**
     * Data Storage: App's name
     */
    this.appName = ko.observable("Sydney Sites");
    /**
     * Data Storage: the list of sites, an observableArray of observable object
     */
    this.sights = ko.observableArray([]);
    topSights.forEach(function (element) {
        self.sights.push(ko.observable(element));
    });
    /**
     * Data Storage: the value of input
     */
    this.currentSearch = ko.observable("");
    /**
     * When search bar updates, this method updates list and map
     */
    this.setVisible = function () {
        /**
         * Update the list
         */
        self.sights().forEach(function (element,key) {
            var tempString;
            /**
             * if search bar is empty, show all items
             */
            if (self.currentSearch() === "") {
                tempString = element();
                tempString.visible = true;
                element(tempString);
            /**
             * if search bar is not empty, use string.include do judgement
             */
            } else if (!element().name.toLowerCase().includes(self.currentSearch().toLowerCase())) {
                tempString = element();
                tempString.visible = false;
                element(tempString);
            }
        })
        /**
         * Update the map
         */
        var bounds = new google.maps.LatLngBounds();
        markers.forEach(function (element,key) {
            var ifVisible = self.sights()[key]().visible;
            element.setMap(ifVisible?map:null);
            if (ifVisible) {
                bounds.extend(element.position);
                element.setAnimation(google.maps.Animation.DROP);
            }
        });
        map.fitBounds(bounds);
    };

    /**
     * hide or show search bar
     */
    this.toggleSideBar = function () {
        self.showSearchBar(!self.showSearchBar());
        /**
         * When div changes, redraw the map.
         * Since there is a transition when side bar hide/show,
         * we set a timer so that map will redraw after the transition
         */
        setTimeout(google.maps.event.trigger,200,map,'resize');
    };

    /**
     * show infoWindow when click items in the list
     */
    this.showInfoWindow = function (place) {
        //Find the corresponding marker
        var popSite;
        for (var i = 0; i < markers.length; i++) {
            if (markers[i].title === place.name) {
                popSite = markers[i];
                break;
            }
        }
        populateInfoWindow(popSite, largeInfowindow);
    }
};
ko.applyBindings(new ViewModel());