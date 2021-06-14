//INITIAL VARIABLES
const KEY = '086bf94c958c7afc68924ccc4497a8ee'

console.log(KEY);

const form = document.getElementsByTagName('form')

//GET LOCATION ON LOAD

window.addEventListener('load', () => {
    let lon
    let lat
    let mainTitle = document.getElementsByClassName('main-title')

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            lon = position.coords.longitude
            lat = position.coords.latitude
            //API CALL
            const api = `api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}`

            const weatherData = async () => {
                let response = await fetch('http://' + api)
                //ERROR HANDLING
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                let weather = await response.json()
                return weather
            }

            weatherData()
                .then(data => {
                        const { main, name, sys, weather } = data
                    })
                .catch(e => 'There has been a problem with your fetch operation: ' + e.message)
        })
    } else {
        
    }
})
