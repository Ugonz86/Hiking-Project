const API_KEY = process.env.API_KEY;

export function findTrails(){
  return new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();

    const endPoint = "https://www.hikingproject.com/data/get-trails?";
    let url = `${endPoint}lat=47.6062&lon=-122.3321&maxDistance=10&key=${API_KEY}&maxResults=10`;

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
