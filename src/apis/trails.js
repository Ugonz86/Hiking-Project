const API_KEY = process.env.API_KEY;

export function findTrails(){
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();

    const endPoint = "https://www.hikingproject.com/data/get-trails?";
    let url = `${endPoint}lat=47.6062&lon=-122.3321&maxDistance=25&key=${API_KEY}&maxResults=15`;

    request.onload = function() {
      if (this.status === 200) {
        resolve(request.response);
      }
      else {
        reject(Error(request.statusText));
      }
    };
    request.open("GET", url, true);
    request.send();
  });
}


/*

Change the url string to use geolocation. Add lat, lon as arguments in findTrails(). Have geo location save lat and lon seperate from the origins, in order to use them separately with findTrails. That way this API can utilize geolocation as well as the maps API that currently uses it. Enter lat and lon variables in main.js when calling the function finTrails.

lat=${lat}&lon=${lon}

Seattle/Coordinates
lat=47.6062&lon=-122.3321

*/
