/*IMPORTS DE JS EXTERNOS*/
import { getDayOfWeek , getMonthOfYear } from "./Dates.js";
import { loadContentInModal } from "./modalContent.js";
import { getCitiesOcurrences } from "./getCitiesList.js";

/*-----------------------*/

/*VARIABLES A UTILIZAR*/
const appForm = document.getElementById('formularioTiempo');

//input donde se escribe la búsqueda
const cityInput = document.querySelector('#ciudadInput');
const api_key = 'b36342eefc788b8e4ccb10ae5c94bcd3';

//Pantalla donde se muestra el tiempo
let screen = document.querySelector('#weather-screen');
const forecastTableBody = document.querySelector('#tableBody');
const forecastTable = document.querySelector('#tableContent');
const nodata = document.querySelector('#no-data');
let currentCoords = document.querySelector('#coords');

//div que muestra las ocurrencias
const suggestions = document.querySelector('#results');


let coords = {
    lon:undefined,
    lat:undefined,
};

//LocalStorage
const favStorage = window.localStorage;

//Favoritos
let favorites = [];

//Botón de marcar favorito
const favButton = document.querySelector('#mark-favorite');

//Mostrar favoritos
let favoritesBtn = document.querySelector('#show-favorites');
let favoritesList = document.querySelector('#fav-list');

favoritesBtn.addEventListener('click',function(){
    favoritesList.parentNode.classList.toggle('hidden');
    favoritesList.innerHTML = '';
    if(favorites.length == 0){
        favoritesList.innerHTML = '<li class="fav-element-wrapper"><span>No se encuentran elementos</span></li>';
    }else{
        favorites.forEach(element => {
            let li = document.createElement('li');
            li.setAttribute('class','fav-element-wrapper');
            li.innerHTML= element.city + '<span class="text-base close hover:cursor-pointer">&times;</span>';
            li.querySelector('.close').addEventListener('click',function(){
                favorites = favorites.filter(function(e){return e !== element});
                favStorage.setItem('favorites',JSON.stringify(favorites));
                this.parentNode.remove();
            });
            li.addEventListener('click',function(){coords.lat = element.lat; coords.lon = element.lon; console.log(coords)});
            favoritesList.appendChild(li);
        });
    }
});



window.addEventListener('load',function(){
    if(favStorage.getItem('favorites') != null){
       favorites = JSON.parse(favStorage.getItem('favorites'));
    }
});

//Guardar en favs y actualizar localStorage
favButton.addEventListener('click',function(){
    let value = currentCoords.innerHTML.split(',');
    let obj = {lon:Number(value[0]),lat:Number(value[1])};
    if(favorites.find((element) => element.lon == obj.lon && element.lat == obj.lat) == undefined){
        favorites.push({city:document.querySelector('#city').innerHTML,lon:Number(value[0]),lat:Number(value[1])});
    }
    favStorage.setItem('favorites',JSON.stringify(favorites));
    console.log(favorites);
});



/*---------------------------------------------------------*/

//FUNCIONES Y EVENTLISTENERS--------------------------------//

document.addEventListener('click',function(){
    !suggestions.classList.contains('hidden') ? suggestions.classList.toggle('hidden') : '';
});

/**
 * Trae la lista de ciudades que coinciden con el nombre escrito en el input
 */
cityInput.addEventListener('keyup',async function(){
    suggestions.classList.contains('hidden') ? suggestions.classList.toggle('hidden') : '';
    try{

        getCitiesOcurrences(this,suggestions,api_key,coords);
    }catch(error){
        showError(document.querySelector('#mensaje_error'),error);
    }
});

//buscar información del tiempo
appForm.addEventListener('submit',async event => {
    event.preventDefault();//<- prevenir la recarga de la página al hacer un submit
    const ciudad = cityInput.value;
    if(ciudad){
        try {
            const infoTiempo = await getWeatherInfo(ciudad);
            showCurrentWeather(infoTiempo);

        } catch (error) {
            //mostrar el error
            console.error(error);
            showError(document.querySelector('#mensaje_error'),error);
        }

    }
    else{showError(document.querySelector('#mensaje_error'),'Introduce el nombre de una ciudad');}
});





//Buscar información de lo que busca el usuario
async function getWeatherInfo(poblacion){
    /*Si lat o lon están definidos busca por coords, si no, busca por nombre que es menos preciso en la ubicación*/
    const current = coords.lat == undefined || coords.lon == undefined
    ? `https://api.openweathermap.org/data/2.5/weather?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `
    :
    `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric&lang=sp`
    ;

    const forecast = coords.lat == undefined || coords.lon == undefined//previsión a 5 días
    ?
    `https://api.openweathermap.org/data/2.5/forecast?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `
    :
    `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric&lang=sp `
    ;



    const responseCurrent = await fetch(current);
    const responseForecast = await fetch(forecast);

    if(!responseCurrent.ok || !responseForecast.ok){
        throw new Error('No se ha podido recibir información del tiempo');
    }

    coords = {
        lon:undefined,
        lat:undefined,
    };

    return {'current': await responseCurrent.json(),'forecast': await responseForecast.json()};
}

/**
 * Muestra la información del tiempo en pantalla.
 * @param {object} informacion
 */
function showCurrentWeather(informacion){
    if(favorites.find((element) => element.lon == informacion.current.coord.lon && element.lat == informacion.current.coord.lat) != undefined){
        favButton.classList.toggle('marked');
    }else{
        favButton.classList.remove('marked');
    }

    forecastTable.classList.contains('hidden') ? forecastTable.classList.toggle('hidden') : '';
    document.querySelector('#mensaje_error').innerHTML = '';

    const{name:city,main:{temp,feels_like,humidity},weather:[{description,icon}],clouds:{all}} = informacion.current;

    if(current.classList.contains('hidden')){
        current.classList.toggle('hidden');
        current.classList.toggle('show');
    }

    //VENTANA DONDE SE MUESTRA EL TIEMPO ACTUAL
    document.querySelector('#city').innerHTML = `${city}`; //display del nombre de la Ciudad
    document.querySelector('#temp').textContent = `${temp}ºC`; //display de la temperatura
    document.querySelector('#feels_like').textContent = `${feels_like}ºC`; //display de la sensación térmica
    document.querySelector('#humidity').textContent = `${humidity}%`; //display del porcentaje de humedad
    document.querySelector('#description').textContent = description[0].toUpperCase() + description.slice(1).toLowerCase();//descripción del tiempo
    document.querySelector('#clouds').textContent = `${all}%`;//porcentaje de nubes
    document.querySelector('#rain').textContent = `${informacion.current.rain == undefined ? '0.0' : informacion.current.rain['1h']}mm`;
    document.querySelector('#icono').setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`); //icono del tiempo
    document.querySelector('#coords').textContent = `${informacion.current.coord.lon},${informacion.current.coord.lat}`;

    if(screen.classList.contains('neutral')){
        screen.classList.toggle('neutral');
    }
    changeScreenAppearance(icon);

    showForecast(informacion.forecast.list); //Mostrar la previsión a 5 días
}



function showForecast(informacion){
    if(!nodata.classList.contains('hidden')){
        nodata.classList.toggle('hidden');
    }
    forecastTableBody.innerHTML = '';
    let fecha = new Date();
    let dia = fecha.getDate();//dia actual
    let currRow = 0;
    let row  = forecastTableBody.insertRow(currRow);
    let cell = row.insertCell(0);
    cell.setAttribute('class','font-bold text-center');
    let currCell =  1;
    cell.innerHTML = `<p>${getDayOfWeek(fecha.getDay())} ${fecha.getDate()} de ${getMonthOfYear(fecha.getMonth())}</p>`;
    while(currCell < getStartingPoint(new Date(informacion[0].dt_txt).getHours()) + 1){
        cell= row.insertCell(currCell);
        currCell++;
    }
    /*Rellena la tabla de los datos del tiempo a 5 días, recorre el array y genera cada una de las filas de la tabla*/
    for (let index = 0; index < informacion.length; index++) {
        let currDay = new Date(informacion[index].dt_txt).getDate();
        let currDate = new Date(informacion[index].dt_txt);
        //si el día es distinto se inserta nueva fila
        if(currDay != dia){
            currRow++;
            row = forecastTableBody.insertRow(currRow);
            cell = row.insertCell(0);
            cell.innerHTML = `<p>${getDayOfWeek(currDate.getDay())} ${currDate.getDate()} de ${getMonthOfYear(currDate.getMonth())}</p>`;
            cell.setAttribute('class','font-bold text-center');
            cell.setAttribute('id',`dia${currDate.getDate()}`);
            currCell = 1;
            dia = currDay;
        }

        cell = row.insertCell(currCell);
        cell.addEventListener('click',function(){showModal(informacion[index])});
        cell.innerHTML = `<img class="m-auto hover:cursor-pointer"  src=" https://openweathermap.org/img/wn/${informacion[index].weather[0].icon}@2x.png" alt=""></img><p class="text-center font-bold">${Math.round(informacion[index].main.temp) + 'ºC' }</p>`;
        currCell++;

    }
}


/**
 * Cambia el gradiante de la pantalla en función de si el icono contiene 'n'(night) o 'd'(day).
 * @param {string} icon
 */
function changeScreenAppearance(icon){
    if(icon.indexOf('n') != -1){
        screen.classList.remove('day');
        if(!screen.classList.contains('night')){screen.classList.toggle('night');}
    }else{
        screen.classList.remove('night');
        if(!screen.classList.contains('day')){screen.classList.toggle('day');}
    }
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

    const data = [
        {prop: "Temperatura",value:`${e.main.temp}ºC`,icon: '<span class="material-icons-outlined"> thermostat </span>'},
        {prop: "Humedad",value: `${e.main.humidity}%`,icon: '<span class="material-symbols-outlined">humidity_percentage</span>'},
        {prop: "Sensación termica",value: `${e.main.feels_like}ºC`,icon: '<span class="material-symbols-outlined">thermostat</span>'},
        {prop: "Nubes",value: `${e.clouds.all}%`,icon: '<span class="material-symbols-outlined">cloud</span>'},
        {prop: "Velocidad viento",value: `${e.wind.gust}m/s`,icon: '<span class="material-symbols-outlined">airwave</span>'},
        {prop: "Orientación Viento",value: `${e.wind.deg}deg`,icon: '<span class="material-symbols-outlined"> trending_flat </span>'},
        {prop: "Prov Lluvia",value: `${Math.round(e.pop * 100)}%`,icon: '<span class="material-symbols-outlined"> umbrella </span>'},
        {prop: "Lluvia acumulada",value: `${e.rain == undefined ? '0.0' : e.rain['3h']}mm`,icon: '<span class="material-symbols-outlined"> rainy_light </span>'},
    ];
    //CONTENIDO DE LA MODAL
    loadContentInModal(data,'measure-wrapper','#weather-info');
}


/**
 * Mostrar error en el elemento del DOM objetivo
 * @param {object} target
 * @param {string} text
 */
function showError(target,text){
    clearScreenContent();
    target.innerHTML = text
}


/**
 * Limpia el contenido de la pantalla y de la tabla de previsión del tiempo
 */
function clearScreenContent(){
    forecastTableBody.innerHTML = '';
    if(nodata.classList.contains('hidden')){
        nodata.classList.toggle('hidden');
    }

    if(!forecastTable.classList.contains('hidden')){
    forecastTable.classList.toggle('hidden');
    }

    if(!screen.classList.contains('neutral')){screen.classList.toggle('neutral');}
    if(!current.classList.contains('hidden')){
        current.classList.toggle('hidden');
        current.classList.remove('show');
    }
}