//API key for OpenWeather
const KEY = '086bf94c958c7afc68924ccc4497a8ee';

//set global variables
const form = document.querySelector('.search form');
const input = document.querySelector('.search input');
const mainTitle = document.querySelector('.main-title');
const list = document.querySelector('.cities');

//mark up for adding cities
const content = (name, country, temp, icon, description) => {
  return `<h2 class='city-name' data-name='${name}, ${country}'>
            <span>${name}</span>
            <sup>${country}</sup>
        </h2>
        <span class='temp'>${temp}<sup>°C</sup></span>
        <figure>
            <img class='icon' src=${icon} alt=${description}>
            <figcaption>${description}</figcaption>
        </figure>
        `;
};

//Try to get current location on load
window.addEventListener('load', () => {
  let lon;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      lon = position.coords.longitude;
      lat = position.coords.latitude;
      mainTitle.textContent = 'Fetching your location data..';

      //API call
      const api = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${KEY}`;

      const weatherData = async () => {
        let response = await fetch('https://' + api);

        let weather = await response.json();
        return weather;
      };

      weatherData()
        .then((data) => {
          //set variables
          const { main, name, sys, weather } = data;
          const icon = `https://openweathermap.org/img/wn/${weather[0]['icon']}@2x.png`;
          //change main title
          mainTitle.textContent = 'Search for another city below';
          //create list and add mark up
          const li = document.createElement('li');
          li.classList.add('city');

          li.innerHTML = content(
            name,
            sys.country,
            main.temp,
            icon,
            weather[0]['description']
          );
          list.appendChild(li);
        })
        .catch((e) => {
          e.textContent = `Can't seem to find your current location 😞`;
        });
    });
  }
});

//Change Main Title if location is not available
mainTitle.textContent = 'Search for a city below';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let inputVal = input.value;

  //confirm if city is already displayed
  const listItems = list.querySelectorAll('.city');
  const listArray = Array.from(listItems);

  if (listArray.length > 0) {
    const filteredArray = listArray.filter((item) => {
      let content = '';
      if (inputVal.includes(',')) {
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          content = item
            .querySelector('.city-name span')
            .textContent.toLowerCase();
        } else {
          content = item.querySelector('.city-name').dataset.name.toLowerCase();
        }
      } else {
        content = item
          .querySelector('.city-name span')
          .textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      mainTitle.style.fontSize = '1.5rem';
      mainTitle.textContent = `You already know the weather for ${
        filteredArray[0].querySelector('.city-name span').textContent
      },
                if you are refering to a different city please provide the country code as well`;
      form.reset();
      input.focus();
      return;
    }
  }
  //API Call
  const api = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${KEY}&units=metric`;

  const weatherData = async () => {
    let response = await fetch(api);

    let weather = await response.json();
    return weather;
  };

  weatherData()
    .then((data) => {
      //set variables
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]['icon']}@2x.png`;
      //change main title
      mainTitle.textContent = 'Search for another city below';
      //create list and add mark up
      const li = document.createElement('li');
      li.classList.add('city');

      li.innerHTML = content(
        name,
        sys.country,
        main.temp,
        icon,
        weather[0]['description']
      );
      list.appendChild(li);
    })
    .catch((e) => {
      mainTitle.textContent = `Please search for a valid city!`;
    });
  mainTitle.textContent = 'Search for another city below';
  form.reset();
  input.focus();
});
