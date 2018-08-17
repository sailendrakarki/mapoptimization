var _defaultLatit = 39.833851;
var _defaultLong = -74.871826;
var map = null;
var infoWindow = null;
var businessMap = document.getElementById('businessMap');
var autocompletelocation = [document.getElementById('StartingpointId'),
	document.getElementById('DestinationpointId'),
]

function initMap() {

	//to display map
	var mapOptions = {
		center: new google.maps.LatLng(_defaultLatit, _defaultLong),
		zoom: 5
	};
	
	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

	map = new google.maps.Map(businessMap, mapOptions);
	directionsDisplay.setMap(map);
	var onChangeHandler = function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay);
	};


	//document.getElementById('DestinationpointId1').addEventListener('change', onChangeHandler());
	//	document.getElementById('DestinationpointId2').addEventListener('change', onChangeHandler());
	//to add marker

	findLocation();

	autoComplete();

	document.getElementById('StartingpointId').addEventListener('change', onChangeHandler);
	document.getElementById('DestinationpointId').addEventListener('change', onChangeHandler);


	
}

function autoComplete() {
	autocompletelocation.forEach(function(element, index) {
		var autocompleteForSource = new google.maps.places.Autocomplete(element);
		
	});
}

function flagMarker(latitude = _defaultLatit, longitude = _defaultLong, zoom = 5) {
	var marker = new google.maps.Marker({
		position: {
			lat: latitude,
			lng: longitude
		},
		map: map,
		visible: true,
		animation: google.maps.Animation.DROP
	});
	map.panTo(marker.position);
	map.setZoom(zoom);
}

function findLocation() {
	infoWindow = new google.maps.InfoWindow;

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude,
			};
			var getAddress = new google.maps.Geocoder();
			getAddress.geocode({
					'latLng': pos
				},
				function(results, status) {
					if (status == google.maps.GeocoderStatus.OK && results[0]) {
						autocompletelocation[0].value = results[0].formatted_address;
						flagMarker(pos.lat, pos.lng, 17);
					}
				}
			);

		}, function() {
			flagMarker(_defaultLatit, _defaultLong);
			//handleError(true, infoWindow, map.getCente220r());
		});
	} else {
		flagMarker(_defaultLatit, _defaultLong);
		//handleError(false, infoWindow, map.getCenter());
	}
}

function handleError(browserHasGeolocation, infoWindow, pos) {

	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
	console.log('aaaaa');
	directionsService.route({
		origin: document.getElementById('StartingpointId').value,
		destination: document.getElementById('DestinationpointId').value,
		travelMode: 'DRIVING'
	}, function(response, status) {
		console.log(response)
		if (status === 'OK') {

			directionsDisplay.setDirections(response);
		} else {
			window.alert('Directions request failed due to ' + status);
		}
	});
}