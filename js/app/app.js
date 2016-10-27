angular.
  module('mapApp').
  controller('mapCtrl', ['$scope', '$http',
    function($scope, $http){
      var map;

      $scope.initMap = function(){
        // Création de la carte google maps via l'API
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 48.85, lng: 2.35},
          zoom: 13,
          search: true
        });

        // Création de la barre de recherche et liaison à l'élément dom
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

        });
      }
    }]);
