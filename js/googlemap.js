(function(window, google, mapHelper, $) {

	var options = mapHelper.MAPOPTIONS;
	element = document.getElementById('businessMap');
	map = new google.maps.Map(element, options);

	var directionsService = new google.maps.DirectionsService;
	var directionsDisplay = new google.maps.DirectionsRenderer;

	directionsDisplay.setMap(map);

	document.getElementById('btnGo').addEventListener('click', function() {

		calculateAndDisplayRoute(directionsService, directionsDisplay, false);
	});

	document.getElementById('optroute').addEventListener('click', function() {
		calculateAndDisplayRoute(directionsService, directionsDisplay, true);
	});


	$('input[type=text]').click(function(e) {


		new google.maps.places.Autocomplete(
			document.getElementById($(this).attr('id')), {
				placeIdOnly: true
			});

	});

	function calculateAndDisplayRoute(directionsService, directionsDisplay, boolen) {
		var startingpoint = null,
			endingpoint = null;
		var routeCollection = $('input[type=text]').map(function() {
			return this.value;
		}).get();

		var waypts = [];
		routeCollection = routeCollection.filter(function(n) {
			return n != ''
		});


		if (routeCollection.length > 0) {

			if (routeCollection.length === 2) {

				waypts = [];
				startingpoint = routeCollection[0];
				endingpoint = routeCollection[1];

			} else if (routeCollection.length === 1) {
				alert('Please enter source/ Destination Address');

			} else {
				startingpoint = routeCollection.shift();
				endingpoint = routeCollection.pop();
				routeCollection.forEach(function(element, index) {
					waypts.push({
						location: element,
						stopover: true
					});
				});
			}
			if ((startingpoint != null) || (endingpoint != null)) {

				directionsService.route({
					origin: startingpoint,
					destination: endingpoint,
					waypoints: waypts,
					optimizeWaypoints: boolen,
					travelMode: 'DRIVING',

				}, function(response, status) {
					if (status === 'OK') {

						directionsDisplay.setDirections(response);

						document.getElementById('openMap').addEventListener('click', function() {
							var source = encodeURI(response.request.origin.query);
							var destination = encodeURI(response.request.destination.query);
							var wayquery = '';

							if (response.request.waypoints.length > 0) {
								for (var i = 0; i < response.request.waypoints.length; i++) {
									wayquery += response.request.waypoints[i].location.query;
									if (i < response.request.waypoints.length - 1) {
										wayquery += "|";
									}
								}

							}

							if (wayquery !== '') {
								var pageUrl = "https://www.google.com/maps/dir/?api=1&origin=" + source + "&waypoints=" + encodeURI(wayquery) + "&destination=" + destination + "&travelmode=driving";
							} else {
								var pageUrl = "https://www.google.com/maps/dir/?api=1&origin=" + source + "&destination=" + destination + "&travelmode=driving";
							}
							var win = window.open(pageUrl, '_blank');
							win.focus();

						});

					} else {
						window.alert('Directions request failed due to ' + status);
					}
				});
			}
		}
	}


}(window, google, window.mapHelper || (window.mapHelper = {}), jQuery));