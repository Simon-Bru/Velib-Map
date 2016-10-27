<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      html, body { height: 100%; margin: 0; padding: 0; }
      #map { height: 100%;}
      .controls {
        margin-top: 10px;
        border: 1px solid transparent;
        border-radius: 2px 0 0 2px;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        height: 32px;
        outline: none;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
      }

      #pac-input {
        background-color: #fff;
        font-family: Roboto;
        font-size: 15px;
        font-weight: 300;
        margin-left: 12px;
        padding: 0 11px 0 13px;
        text-overflow: ellipsis;
        width: 300px;
      }

      #pac-input:focus {
        border-color: #4d90fe;
      }

      .pac-container {
        font-family: Roboto;
      }
    </style>

    <title>Paris Vélib</title>
  </head>

  <body>
    <input id='pac-input' type="text" class='controls' placeholder="Recherche">
    <div id="map"></div>

    <script type="text/javascript" src="init.js"></script>
    <!-- Inclusion de l'API Javascript google maps avec la bibliothèque Places et les données propres à l'utilisateur google -->
    <script async defer
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5GfMpQO2o9qtjeSMg4yXf693Cu7nuLCM&callback=initMap&signed_in=true&libraries=places">
    </script>
  </body>
</html>
