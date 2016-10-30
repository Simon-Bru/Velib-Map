angular.
  module('mapApp').
  controller('mapCtrl', ['$scope', '$http',
    function($scope, $http){
      var map;

      $scope.initMap = function(){

        // Création de la carte google maps via l'API
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 48.85, lng: 2.35},
          zoom: 15,
          search: true
        });

        // Création de la barre de recherche et liaison à l'élément dom
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Ajout des stations vélib grace à la fonction
        $scope.addStations(map);

        // Définition de la région la plus suggérée pour l'autocompletion de la recherche
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        // Evenement de sélection/recherche de lieu
        searchBox.addListener('places_changed', function() {
          // On récupère le lieu sélectionné
          var places = searchBox.getPlaces();

          // Si aucun lieu sélectionné, on quitte l'évènement
          if (places.length == 0) {
            return;
          }

          // Création d'un rectangle délimité par des lat/long
          var bounds = new google.maps.LatLngBounds();

          // Pour chaque lieu, on récupère la localisation exacte
          places.forEach(function(place) {
            // Selon le type de lieu
            if (place.geometry.viewport) {
              // On étend le rectangle grace à la fonction approprié soit à la "portée de vue" du lieu
              bounds.union(place.geometry.viewport);
            } else {
              // Soit à la localisation exacte du point
              bounds.extend(place.geometry.location);
            }
          });
          // On définit l'affichage de la carte afin qu'il contienne le lieu sélectionné
          map.fitBounds(bounds);

          // On ajoute les stations vélib
          $scope.addStations();
        });
      };

      $scope.addStations = function(myMap){
        // Appel asynchrone à l'API vélib opendata au format JSON
        $http.get('http://opendata.paris.fr/api/records/1.0/download/?dataset=stations-velib-disponibilites-en-temps-reel&format=json')
          .then(
            function(response){
              // On crée deux images de marqueurs
              // Une pour les stations sans vélos
              var noCycleIcon = {
                url: 'img/noCycle.png',
                size: new google.maps.Size(80, 51),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 0),
                scaledSize: new google.maps.Size(40, 25)
              };
              // Une pour les stations avec vélo
              var cycleIcon = {
                url: 'img/cycle.png',
                size: new google.maps.Size(80, 51),
                scaledSize: new google.maps.Size(40, 25)
              };

              // En cas de succès, on place un marqueur pour chaque station
              angular.forEach(response.data, function(station, key){
                // On définit l'icone à utiliser selon la disponibilité
                var image;
                switch (station.fields.available_bikes) {
                  case 0:
                    image = noCycleIcon;
                    break;
                  default:
                    image = cycleIcon;
                }


                var myLatlng = new google.maps.LatLng(station.geometry.coordinates[1],station.geometry.coordinates[0]);
                var marker = new google.maps.Marker({
                  position: myLatlng,
                  title: 'Station '+station.fields.name,
                  icon: image
                });
                marker.setMap(myMap);

                contentString = '<div>'+
                                  '<h4 class="text-center station_titles">Station n°'+station.fields.name+'</h4>'+
                                  '<div class="station_address">'+
                                    '<img style="width:25px;" src="img/location.png" alt="adresse"/>'+station.fields.address+''+
                                  '</div>'+
                                  '<div class="text-center dispos">Vélib disponibles: <h4>'+station.fields.available_bikes+' / '+station.fields.bike_stands+'</h4></div>'+
                                '</div>';
                var infos = new google.maps.InfoWindow({
                  content: contentString,
                  pixelOffset: new google.maps.Size(-10, 0)
                });

                marker.addListener('click', function() {
                  infos.open(myMap, marker);
                });


              });
            },
            function(reponse){
              // En cas d'erreur, on affiche un message d'erreur
              console.log(reponse);
            }
          );
      };


    }]);
