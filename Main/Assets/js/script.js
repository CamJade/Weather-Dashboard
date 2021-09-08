//store key in variable
let apiKey = "273d63378f5060d2e6ef12503c6f1cfe";


let button = document.querySelector('.search-btn');
let inputValue = document.querySelector('.form-input');
let cityInput = document.querySelector('#form');
let cityName = document.querySelector('.cityName');
let currentDate = document.querySelector('.date');
let temp = document.querySelector('.temp');
let wind = document.querySelector('.wind');
let humidity = document.querySelector('.humidity');
let uvIndex = document.querySelector('.uvIndex');
let storeCities = document.querySelector('.store-cities');
let cities = [];



//when search button is clicked, start display
button.addEventListener('click', function(){
    fetch("https://api.openweathermap.org/data/2.5/weather?q="+inputValue.value+"&units=imperial&appid=273d63378f5060d2e6ef12503c6f1cfe")
        .then(response => response.json())
        //check -- .then(data => console.log(data))
        .then(data => {
            let cityNameValue = data["name"];
            let currentDateValue = data["dt"];
                let millisec = currentDateValue *1000
                let dateObject = new Date(millisec);
                let humanDateFormat = dateObject.toLocaleString();
            let currentIcon = data["weather"][0]["icon"];
                fetch("http://openweathermap.org/img/wn/" + currentIcon + "@2x.png")
                .then(response => response.json())

            let tempValue = "Temp: " + data["main"]["temp"];
            let windValue = "Wind: " + data["wind"]["speed"];
            let humidityValue = "Humidity: " + data["main"]["humidity"];
            //let uvIndexValue = "UV Index: " + data[0].value;

            cityName.innerHTML = cityNameValue + " " + humanDateFormat + currentIcon;
            temp.innerHTML = tempValue + "°F";
            wind.innerHTML = windValue +" MPH";
            humidity.innerHTML = humidityValue + "%";
            //uvIndex.innerHTML = uvIndexValue;

            //need to call uv seperate
            let lat = data["coord"]["lat"];
            let lon = data["coord"]["lon"];
            fetch("https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=273d63378f5060d2e6ef12503c6f1cfe" + "&cnt=1")
                .then(response => response.json()) 
                .then(data => {
                    // presented with a color that indicates whether the conditions are favorable, moderate, or severe
                    if (data[0].value < 4 ) {
                        uvIndex.setAttribute("class", "green");//favorable
                    }
                    else if (data[0].value < 8) {
                        uvIndex.setAttribute("class", "yellow");//moderate
                    }
                    else {
                        uvIndex.setAttribute("class", "red");//severe
                    }
                    //check --console.log(data[0].value)
                    uvIndex.innerHTML = "UV Index: " + data[0].value;
                    
                });
            
        })
        renderSearch();
    storeSearch();
    init();
})



// The following function renders past searches as <li> elements
function renderSearch() {
    // Clear list
    storeCities.innerHTML = "";
  
    // Render a new li for each city
    for (let i = 0; i < cities.length; i++) {
      let list = cities[i];
  
      let li = document.createElement("li");
      li.textContent = list;
  
      storeCities.appendChild(li);
    }
  }

  // run when loaded
function init() {
    // Get stored cities from localStorage
    let storedCities = JSON.parse(localStorage.getItem("cities"));
  
    // update array
    if (storedCities !== null) {
      cities = storedCities;
    }
  
    // This is a helper function that will render cities to the DOM
    renderSearch();
  };


  function storeSearch() {
    // Stringify and set key in localStorage to array
    localStorage.setItem("cities", JSON.stringify(cities));
    console.log(cities);
  }
  
  // Add submit event to form
cityInput.addEventListener("submit", function(event) {
    event.preventDefault();
  
    let searchText = cityInput.value.trim();
  
    // Return from function early if blank
    if (searchText === "") {
      return;
    }
  
    // Add new text to array, clear the input
    cities.push(searchText);
    cityInput.value = "";
  
    // Store updated city in localStorage, re-render the list
    storeSearch();
    renderSearch();
  });
  
// Add click event to element
storeCities.addEventListener("click", function(event) {
    let element = event.target;
  
    // Checks if element is a button
    if (element.matches("button") === true) {
      // Get its data-index value and remove the element from the list
      let index = element.parentElement.getAttribute("data-index");
      cities.splice(index, 1);
  
      // Store updated cities in localStorage, re-render the list
      storeSearch();
      renderSearch();
    }
  });
  
  // Calls init to retrieve data and render it to the page on load
  init()
  