
/**
 * Carga la lista de ciudades que coincidan con lo que el usuario está escribiendo en el input text del formulario.
 * @param {*} sender el que envía los datos
 * @param {*} target donde se va a mostrar
 * @param {*} api_key api key de OpenWeather
 * @param {*} coords
 */
export async function getCitiesOcurrences(sender,target,api_key,coords){

    target.innerHTML = '';
    let val = sender.value;
    if(val.length != 0){
        target.innerHTML = '';
        let cities = `https://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${api_key}&lang=sp`;
        let list = await fetch(cities);
        let a = await list.json();
        a.forEach(element => {
            const div = document.createElement("div");
            div.setAttribute('class','element-list');
            div.textContent = `${element.name + ', ' + (element.state == undefined ? '' : element.state + ', ') +  element.country}`;
            div.addEventListener('click',function(){
                coords.lon = element.lon;
                coords.lat = element.lat;
                setCoords(coords,[element.lon,element.lat]);
                sender.value = div.innerHTML;
            });
            target.appendChild(div);
        });
    }
}


/**
 * Actualiza las coords para buscar info del tiempo
 * @param {array} array
 */
function setCoords(coords,array){
    coords.lon = array[0];
    coords.lat = array[1];
}
