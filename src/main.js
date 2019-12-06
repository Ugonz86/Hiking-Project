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
    $(".footer").css("display", "none");
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

                $("#display-results").append(`<img src="${trails[i].imgSmallMed}"><br><h4 id="trail-name">${trails[i].name}</h4><p>Location:  ${trails[i].location}</p><p>Length:  ${trails[i].length} mile hike</p><p>Summary:  ${weatherSummary}<p>Temperature:  ${temperature} degree high</p><p>Difficulty: ${trails[i].difficulty}</p><a href="https://www.google.com/maps/dir/${origins}/${trailCoordinates}">Get Directions</a><br><br><br><hr>`);
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
  $("#homeButton").click(function() {
    window.location.reload();
  });
});
