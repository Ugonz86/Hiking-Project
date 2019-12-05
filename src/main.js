import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { findTrails } from './apis/trails';
import { findWeather } from './apis/weather';
//import { findCampgrounds } from './apis/camping';
// import { findDistance } from './apis/distance';

let origins;
navigator.geolocation.getCurrentPosition(getLocation);
function getLocation(location) {
  origins = location.coords.latitude + "," + location.coords.longitude;
}

$(document).ready(function() {
  $("#searchNearby").click(function() {
    $("#hikesNearby").slideDown();
    $("#intro").hide();
  });
  $("#searchDestination").click(function() {
    $("#searchByPlace").slideDown();
    $("#intro").hide();
  });

  $("#find-trails").click(function () {
    $("#resultsDiv").slideDown("ease");
    $("#hikesNearby").hide();
    let maxHikeDistance = $("input#trail-distance").val();
    $("input#trail-distance").val("");
    let hikingDate = $('input#dateInput').val();
    $("input#dateInput").val("");

    findTrails()
      .then((response) => {

        $("#display-results").empty();
        const body = JSON.parse(response);
        const trails = body.trails;

        for (let i in trails){
          if (trails[i].length < maxHikeDistance){

            let trailCoordinates = `${trails[i].latitude},${trails[i].longitude}`;

            findWeather(trailCoordinates, hikingDate)
              .then((response) => {

                let weatherBody = JSON.parse(response);
                let weatherSummary = weatherBody.daily.data[0].summary;
                let temperature = weatherBody.daily.data[0].temperatureHigh;
                temperature = parseInt(temperature);

                $("#display-results").append(`<img src="${trails[i].imgSmallMed}"><br><br>${trails[i].name}<br><br>${trails[i].location}<br>${trails[i].length} mile hike<br>${weatherSummary}<br>${temperature} degree high<br>Difficulty: ${trails[i].difficulty}<br><br><a href="https://www.google.com/maps/dir/${origins}/${trailCoordinates}">Get Directions</a><p></p><br><hr>`);
              },
              function(error) {
                $("#display-results").append(`I am the error message: ${error.message}`);
              });
          }
        }
      },
      function(error) {
        $("#display-results").empty().append(`<h5>There was an error processing your request: ${error.message}</h5>`);
        $("#display-div").show();
      });
  });
  $("#goHome").click(function() {
    $("#resultsDiv").hide();
    $("#intro").slideDown();
  });

  $("#goHome2").click(function() {
    $("#searchByPlace").hide();
    $("#intro").slideDown();
  });
});
