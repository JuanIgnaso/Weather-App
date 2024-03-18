//API KEY - b36342eefc788b8e4ccb10ae5c94bcd3
//ISO country codes - https://www.iso.org/obp/ui/#search


import { getDayOfWeek , getMonthOfYear } from "./Dates.js";
import { loadContentInModal } from "./modalContent.js";

//formulario donde se escribe para buscar
const formulario = document.getElementById('formularioTiempo');

//input donde se escribe la búsqueda
const ciudadInput = document.querySelector('#ciudadInput');

//llave de la API
const api_key = 'b36342eefc788b8e4ccb10ae5c94bcd3';

//Pantalla donde se muestra el tiempo
let screen = document.querySelector('#weather-screen');

//Tabla donde se muestran las previsiones del tiempo a 5 días
let prevTableBody = document.querySelector('#tableBody');
const table = document.querySelector('#tableContent');
const nodata = document.querySelector('#no-data');

//div que muestra las ocurrencias
const auto = document.querySelector('#results');

let coords = {
    lon:undefined,
    lat:undefined,
}

/**
 * Trae la lista de ciudades que coinciden con el nombre escrito en el input
 */
ciudadInput.addEventListener('keyup',async function(){
    coords = {
        lon:undefined,
        lat:undefined,
    }
    auto.innerHTML = '';
    let val = this.value;
    if(val.length != 0){
        auto.innerHTML = '';
        let cities = `http://api.openweathermap.org/geo/1.0/direct?q=${val}&limit=5&appid=${api_key}&lang=sp`;
        let list = await fetch(cities);
        let a = await list.json();
        a.forEach(element => {
            const div = document.createElement("div");
            div.setAttribute('class','element-list');
            div.textContent = `${element.name + ', ' + (element.state == undefined ? '' : element.state + ', ') +  element.country}`;
            div.addEventListener('click',function(){
                setCoords([element.lon,element.lat]);
                ciudadInput.value = div.innerHTML;
            });
            auto.appendChild(div);
        });
    }

});
/**
 * Actualiza las coords para buscar info del tiempo
 * @param {array} array
 */
function setCoords(array){
coords.lon = array[0];
coords.lat = array[1];
}

//buscar información del tiempo
formulario.addEventListener('submit',async event => {
    event.preventDefault();//<- prevenir la recarga de la página al hacer un submit
    const ciudad = ciudadInput.value;
    if(ciudad){
        try {
            const infoTiempo = await getInfoTiempo(ciudad);
            mostrarInfoTiempo(infoTiempo);
        } catch (error) {
            //mostrar el error
            console.error(error);
            mostrarError(document.querySelector('#mensaje_error'),error);
        }
    }
    else{mostrarError(document.querySelector('#mensaje_error'),'Introduce el nombre de una ciudad');}
});

//Buscar información de lo que busca el usuario
async function getInfoTiempo(poblacion){
    /*
    Parámetros adicionales:
    units='valor' <- para cambiar las medias
    lang='código idioma' <- para recibirlo en idioma a elegir
    */
    const current = coords.lat == undefined || coords.lon == undefined
    ? `https://api.openweathermap.org/data/2.5/weather?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `
    :
    `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric&lang=sp`
    ;

    const forecast = coords.lat == undefined || coords.lon == undefined
    ?
    `https://api.openweathermap.org/data/2.5/forecast?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `
    :
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric&lang=sp `
    ;//previsión a 5 días

    const responseCurrent = await fetch(current);
    const responseForecast = await fetch(forecast);

    //Si ocurre algún error al escribir el nombre de la ciudad o no la encuentra
    if(!responseCurrent.ok || !responseForecast.ok){
        throw new Error('No se ha podido recibir información del tiempo');
    }

    return {'current': await responseCurrent.json(),'forecast': await responseForecast.json()};
}

/**
 * Muestra la información del tiempo en pantalla.
 * @param {object} informacion
 */
function mostrarInfoTiempo(informacion){
    console.log(informacion.current);
    table.classList.contains('hidden') ? table.classList.toggle('hidden') : '';
    document.querySelector('#mensaje_error').innerHTML = '';
    const{
        name:city,
        main:{temp,feels_like,humidity},
        weather:[{id,description,icon}],
        clouds:{all},
    } = informacion.current;

    if(current.classList.contains('hidden')){
        current.classList.toggle('hidden');
        current.classList.toggle('show');
    }

    document.querySelector('#city').textContent = city; //display del nombre de la Ciudad
    document.querySelector('#temp').textContent = `${temp}ºC`; //display de la temperatura
    document.querySelector('#feels_like').textContent = `${feels_like}ºC`; //display de la sensación térmica
    document.querySelector('#humidity').textContent = `${humidity}%`; //display del porcentaje de humedad
    document.querySelector('#description').textContent = description[0].toUpperCase() + description.slice(1).toLowerCase();//descripción del tiempo
    document.querySelector('#clouds').textContent = `${all}%`;//porcentaje de nubes
    document.querySelector('#rain').textContent = `${informacion.current.rain == undefined ? '0.0' : informacion.current.rain['1h']}mm`;
    document.querySelector('#icono').setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`); //icono del tiempo

    if(screen.classList.contains('neutral')){
        screen.classList.toggle('neutral');
    }
    changeScreen(icon);

    mostrarPrevision(informacion.forecast.list); //Mostrar la previsión a 5 días
}

/**
 * Cambia el gradiante de la pantalla en función de si el icono contiene 'n'(night) o 'd'(day).
 * @param {string} icon
 */
function changeScreen(icon){
    if(icon.indexOf('n') != -1){
        screen.classList.remove('day');
        if(!screen.classList.contains('night')){screen.classList.toggle('night');}
    }else{
        screen.classList.remove('night');
        if(!screen.classList.contains('day')){screen.classList.toggle('day');}
    }
}

function mostrarPrevision(informacion){
    if(!nodata.classList.contains('hidden')){
        nodata.classList.toggle('hidden');
    }
    console.log(informacion);
    prevTableBody.innerHTML = '';
    let fecha = new Date();
    let dia = fecha.getDate();//dia actual
    let currRow = 0;
    let row  = prevTableBody.insertRow(currRow);
    let cell = row.insertCell(0);
    let temp_max = -100;
    let temp_min = 999;
    cell.setAttribute('class','font-bold text-center');
    let currCell =  1;
    cell.innerHTML = `<p>${getDayOfWeek(fecha.getDay())} ${fecha.getDate()} de ${getMonthOfYear(fecha.getMonth())}</p>`;
    while(currCell < getStartingPoint(new Date(informacion[0].dt_txt).getHours()) + 1){
        cell= row.insertCell(currCell);
        currCell++;
    }
    for (let index = 0; index < informacion.length; index++) {
        let currDay = new Date(informacion[index].dt_txt).getDate();
        let currDate = new Date(informacion[index].dt_txt);
        //si el día es distinto se inserta nueva fila
        if(currDay != dia){
            currRow++;
            row = prevTableBody.insertRow(currRow);
            cell = row.insertCell(0);
            cell.innerHTML = `<p>${getDayOfWeek(currDate.getDay())} ${currDate.getDate()} de ${getMonthOfYear(currDate.getMonth())}</p>`;
            cell.setAttribute('class','font-bold text-center');
            cell.setAttribute('id',`dia${currDate.getDate()}`);
            currCell = 1;
            dia = currDay;
            temp_max = -100;
            temp_min = 999;
        }


        cell = row.insertCell(currCell);
        cell.addEventListener('click',function(){showModal(informacion[index])});
        cell.innerHTML = `<img class="m-auto hover:cursor-pointer"  src=" https://openweathermap.org/img/wn/${informacion[index].weather[0].icon}@2x.png" alt=""></img><p class="text-center font-bold">${Math.round(informacion[index].main.temp) + 'ºC' }</p>`;
        currCell++;

    }
//https://www.w3schools.com/jsreF/met_table_insertrow.asp
}

/**
 * Devuelve el punto de partida de la primera fila dependiendo de la hora del primer
 * objeto del array.
 *
 * @param {number} hour
 * @returns {number} index del punto de inicio
 */
function getStartingPoint(hour){
    return [0,3,6,9,12,15,18,21].indexOf(hour);
}

/**
 * Muestra la modal con los datos del tiempo que contiene el objeto pasado como
 * parámetro.
 * @param {object} e
 */
function showModal(e){
    document.querySelector('#weather-modal').classList.toggle('hidden');
    const dia = document.querySelector('#dia-semana');
    const hora = document.querySelector('#hora-dia');
    const fecha = document.querySelector('#fecha');
    fecha.innerHTML = `${new Date(e.dt_txt).getDate()} DE ${getMonthOfYear(new Date(e.dt_txt).getMonth()).toUpperCase().substring(0, 3)}`;
    dia.innerHTML = getDayOfWeek(new Date(e.dt_txt).getDay());
    hora.innerHTML = `${new Date(e.dt_txt).getHours()}:00`;

    const data = [{
        prop: "Temperatura",
        value: `${e.main.temp}ºC`,
        icon: '<span class="material-icons-outlined"> thermostat </span>'
      },
      {
        prop: "Humedad",
        value: `${e.main.humidity}%`,
        icon: '<span class="material-symbols-outlined">humidity_percentage</span>'
      },
      {
        prop: "Sensación termica",
        value: `${e.main.feels_like}ºC`,
        icon: '<span class="material-symbols-outlined">thermostat</span>'
      },
      {
        prop: "Nubes",
        value: `${e.clouds.all}%`,
        icon: '<span class="material-symbols-outlined">cloud</span>'
      },
      {
        prop: "Velocidad viento",
        value: `${e.wind.gust}m/s`,
        icon: '<span class="material-symbols-outlined">airwave</span>'
      },
      {
        prop: "Orientación Viento",
        value: `${e.wind.deg}deg`,
        icon: '<span class="material-symbols-outlined"> trending_flat </span>'
      },
      {
        prop: "Prov Lluvia",
        value: `${Math.round(e.pop * 100)}%`,
        icon: '<span class="material-symbols-outlined"> umbrella </span>'
      },
      {
        prop: "Lluvia acumulada",
        value: `${e.rain == undefined ? '0.0' : e.rain['3h']}mm`,
        icon: '<span class="material-symbols-outlined"> rainy_light </span>'
      },
    ];
    //CONTENIDO DE LA MODAL
    loadContentInModal(data,'measure-wrapper','#weather-info');

}

//Mostrar error
function mostrarError(target,text){
    clearScreen();
    target.innerHTML = text
}

function clearScreen(){
    prevTableBody.innerHTML = '';
    if(nodata.classList.contains('hidden')){
        nodata.classList.toggle('hidden');
    }

    if(!table.classList.contains('hidden')){
    table.classList.toggle('hidden');
    }
    if(!screen.classList.contains('neutral')){screen.classList.toggle('neutral');}
    if(!current.classList.contains('hidden')){
        current.classList.toggle('hidden');
        current.classList.remove('show');
    }
}
