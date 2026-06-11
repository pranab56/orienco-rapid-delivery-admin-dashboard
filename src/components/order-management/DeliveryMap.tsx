"use client";

const GOOGLE_MAPS_API_KEY = "AIzaSyDwBdLOatYV5UMXO-zGDQMj2R1ErlK8Pqs";

interface DeliveryMapProps {
  pickupLat: number;
  pickupLng: number;
  dropLat: number;
  dropLng: number;
  pickupAddress: string;
  dropAddress: string;
}

export default function DeliveryMap({
  pickupLat,
  pickupLng,
  dropLat,
  dropLng,
  pickupAddress,
  dropAddress,
}: DeliveryMapProps) {
  const safePickup = pickupAddress.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
  const safeDrop = dropAddress.replace(/'/g, "&#39;").replace(/"/g, "&quot;");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #map { width: 100%; height: 100%; overflow: hidden; }
</style>
</head>
<body>
<div id="map"></div>
<script>
function initMap() {
  var pickupLatLng = { lat: ${pickupLat}, lng: ${pickupLng} };
  var dropLatLng   = { lat: ${dropLat},   lng: ${dropLng}   };

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {
      lat: (${pickupLat} + ${dropLat}) / 2,
      lng: (${pickupLng} + ${dropLng}) / 2
    },
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    styles: [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] }
    ]
  });

  /* ── Pickup marker (red) ── */
  var pickupMarker = new google.maps.Marker({
    position: pickupLatLng,
    map: map,
    title: 'Pickup',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 9,
      fillColor: '#EF4444',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2.5
    },
    zIndex: 10
  });

  var pickupInfo = new google.maps.InfoWindow({
    content: '<div style="font-size:12px;max-width:180px"><b style=\\'color:#EF4444\\'>Pickup</b><br>' + '${safePickup}' + '</div>'
  });
  pickupMarker.addListener('click', function() { pickupInfo.open(map, pickupMarker); });

  /* ── Dropoff marker (dark blue) ── */
  var dropMarker = new google.maps.Marker({
    position: dropLatLng,
    map: map,
    title: 'Dropoff',
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 9,
      fillColor: '#1A365D',
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2.5
    },
    zIndex: 10
  });

  var dropInfo = new google.maps.InfoWindow({
    content: '<div style="font-size:12px;max-width:180px"><b style=\\'color:#1A365D\\'>Dropoff</b><br>' + '${safeDrop}' + '</div>'
  });
  dropMarker.addListener('click', function() { dropInfo.open(map, dropMarker); });

  /* ── Directions (orange route line) ── */
  var directionsService  = new google.maps.DirectionsService();
  var directionsRenderer = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true,
    polylineOptions: {
      strokeColor:  '#FF4A00',
      strokeWeight: 4,
      strokeOpacity: 0.85
    }
  });
  directionsRenderer.setMap(map);

  directionsService.route({
    origin:      pickupLatLng,
    destination: dropLatLng,
    travelMode:  google.maps.TravelMode.DRIVING
  }, function(result, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
      /* fit map to the actual route bounds */
      map.fitBounds(result.routes[0].bounds);
    } else {
      /* fallback: just fit both markers */
      var bounds = new google.maps.LatLngBounds();
      bounds.extend(pickupLatLng);
      bounds.extend(dropLatLng);
      map.fitBounds(bounds);
    }
  });
}
</script>
<script
  src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap"
  async defer>
</script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={html}
      className="absolute inset-0 w-full h-full"
      style={{ border: "none" }}
      title="Delivery Route Map"
    />
  );
}
