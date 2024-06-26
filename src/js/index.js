/**  ESTRUCTURA DEL JAVASCRIPT PRINCIPAL
            1-Imports
            2-Variables
            3-Funciones
            4-Event Listeners
*/

/*IMPORTS DE JS EXTERNOS----------------------------------------------------*/
import { getDayOfWeek , getMonthOfYear } from "./Dates.js";
import { loadContentInModal } from "./modalContent.js";
import { getCitiesOcurrences } from "./getCitiesList.js";
import { getStartingPoint } from "./getStartPoint.js";
import { toggleClass,dissableClass } from "./toggleDissableClass.js";
import { modalData } from "./modalData.js";
import { changeScreenAppearance } from "./changeDayGradiant.js";

/*VARIABLES A UTILIZAR-------------------------------------------------------*/
const cityInput = document.querySelector('#ciudadInput');//input donde se escribe la búsqueda
const api_key = 'b36342eefc788b8e4ccb10ae5c94bcd3';
let screen = document.querySelector('#weather-screen');//Pantalla donde se muestra el tiempo
const forecastTableBody = document.querySelector('#tableBody');
const forecastTable = document.querySelector('#tableContent');
let currentCoords = document.querySelector('#coords');

//div que muestra las ocurrencias
const suggestions = document.querySelector('#results');

let coords = {lon:undefined,lat:undefined};

const favLocalStorage = window.localStorage;

let favorites_array = [];

//Botón de marcar favorito
const favButton = document.querySelector('#mark-favorite');

//Mostrar favoritos
let favoritesList = document.querySelector('#fav-list');

/*-FUNCIONES DEL SCRIPT -------------------------------------------------------------------------------*/
/**
 * Busca la información del tiempo en base al estado de las coordenadas o el nombre de ciudad introducido por el usuario y devuelve un objeto con el tiempo actual y predicción a 5 días.
 * @param {string} poblacion
 * @returns object
 */
async function getWeatherInfo(poblacion){

    /*Si lat o lon están definidos busca por coords, si no, busca por nombre que es menos preciso en la ubicación*/
    const search = coords.lat == undefined || coords.lon == undefined ? `q=${poblacion}&appid=${api_key}&units=metric&lang=sp` : `lat=${coords.lat}&lon=${coords.lon}&appid=${api_key}&units=metric&lang=sp`;

    const current = `https://api.openweathermap.org/data/2.5/weather?${search}`;
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?${search}`;

    const responseCurrent = await fetch(current);
    const responseForecast = await fetch(forecast);

    if(!responseCurrent.ok || !responseForecast.ok){
        throw new Error('No se ha podido recibir información del tiempo');
    }

    coords = {lon:undefined,lat:undefined};

    return {'current': await responseCurrent.json(),'forecast': await responseForecast.json()};
}


/**
 * Muestra la información del tiempo actual en pantalla.
 * @param {object} informacion
 */
function showCurrentWeather(informacion){
    if(favorites_array.find((element) => element.lon == informacion.current.coord.lon && element.lat == informacion.current.coord.lat) != undefined){
        toggleClass('marked',favButton);
    }else{
        favButton.classList.remove('marked');
    }

    dissableClass('hidden',forecastTable);
    document.querySelector('#mensaje_error').innerHTML = '';

    const{name:city,main:{temp,feels_like,humidity},weather:[{description,icon}],clouds:{all}} = informacion.current;

    if(current.classList.contains('hidden')){
        dissableClass('hidden',current);
        toggleClass('show',current);
    }

    //VENTANA DONDE SE MUESTRA EL TIEMPO ACTUAL
    document.querySelector('#city-name').innerHTML = `${city}`;
    document.querySelector('#current-temperature').textContent = `${temp}ºC`;
    document.querySelector('#feels-like').textContent = `${feels_like}ºC`;
    document.querySelector('#humidity').textContent = `${humidity}%`;
    document.querySelector('#description').textContent = description[0].toUpperCase() + description.slice(1).toLowerCase();
    document.querySelector('#clouds').textContent = `${all}%`;
    document.querySelector('#rain').textContent = `${informacion.current.rain == undefined ? '0.0' : informacion.current.rain['1h']}mm`;
    document.querySelector('#icono').setAttribute('src', `https://openweathermap.org/img/wn/${icon}@2x.png`);
    document.querySelector('#coords').textContent = `${informacion.current.coord.lon},${informacion.current.coord.lat}`;

    dissableClass('neutral',screen);

    changeScreenAppearance(icon);

    showForecast(informacion.forecast.list); //Mostrar la previsión a 5 días
}


/**
 * Carga la previsión del tiempo a 5 días en la tabla de previsión del tiempo
 * @param {object} informacion
 */
function showForecast(informacion){

    toggleClass('hidden',document.querySelector('#sin-datos'));

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
        cell.innerHTML = `<img class="m-auto hover:cursor-pointer"  src=" https://openweathermap.org/img/wn/${informacion[index].weather[0].icon}@2x.png" alt="weather icon"></img><p class="text-center font-bold">${Math.round(informacion[index].main.temp) + 'ºC' }</p>`;
        currCell++;
    }
}


/**
 * Muestra la modal con los datos del tiempo que contiene el objeto pasado como
 * parámetro.
 * @param {object} e
 */
function showModal(e){
    dissableClass('hidden',document.querySelector('#weather-modal'));
    document.querySelector('#fecha').innerHTML = `${new Date(e.dt_txt).getDate()} DE ${getMonthOfYear(new Date(e.dt_txt).getMonth()).toUpperCase().substring(0, 3)}`;
    document.querySelector('#dia-semana').innerHTML = getDayOfWeek(new Date(e.dt_txt).getDay());
    document.querySelector('#hora-dia').innerHTML = `${new Date(e.dt_txt).getHours()}:00`;

    const dataObj = modalData(e);//recogemos el array de objetos con propiedad, valor e icono para cargarlo en la modal.

    loadContentInModal(dataObj,'measure-wrapper','#weather-info');
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

    dissableClass('hidden',document.querySelector('#sin-datos'));
    toggleClass('hidden',forecastTable);
    toggleClass('neutral',screen);

    if(!current.classList.contains('hidden')){
        current.classList.toggle('hidden');
        current.classList.remove('show');
    }
}


//EVENTLISTENERS---------------------------------------------------------------------------------------------//

//Realizar petición a API y traer lista de ocurrencias
cityInput.addEventListener('keyup',async function(){
    suggestions.classList.contains('hidden') ? suggestions.classList.toggle('hidden') : '';
    try{
        getCitiesOcurrences(this,suggestions,api_key,coords);
    }catch(error){
        showError(document.querySelector('#mensaje_error'),error);
    }
});


//Añadir eventlistener al formulario para buscar el tiempo
document.getElementById('formularioTiempo').addEventListener('submit',async event => {
    event.preventDefault();//<- prevenir la recarga de la página al hacer un submit
    const ciudad = cityInput.value;
    if(ciudad || (coords.lat != undefined && coords.lon != undefined)){
        try {
            const infoTiempo = await getWeatherInfo(ciudad);
            showCurrentWeather(infoTiempo);
            console.log(coords);
        } catch (error) {
            showError(document.querySelector('#mensaje_error'),error);
        }
    }
    else{showError(document.querySelector('#mensaje_error'),'Introduce el nombre de una ciudad');}
});

//FAVORITOS------------------------------------------------------------------------------------------------------
//Botón para mostrar los favoritos
document.querySelector('#show-favorites').addEventListener('click',function(){
    favoritesList.parentNode.classList.toggle('hidden');
    favoritesList.innerHTML = '';
    if(favorites_array.length == 0){
        favoritesList.innerHTML = '<li class="fav-element-wrapper"><span>No se encuentran elementos</span></li>';
    }else{
        //Cargar la lista si el array tiene elementos
        favorites_array.forEach(element => {
            let li = document.createElement('li');
            li.setAttribute('class','fav-element-wrapper');
            li.innerHTML= element.city + '<span class="text-base close hover:cursor-pointer" >&times;</span>';
            li.querySelector('.close').addEventListener('click',function(){
                favorites_array = favorites_array.filter(function(e){return e !== element});
                favLocalStorage.setItem('favorites',JSON.stringify(favorites_array));
                this.parentNode.remove();
            });
            li.addEventListener('click',function(){coords.lat = element.lat; coords.lon = element.lon; console.log(coords)});
            favoritesList.appendChild(li);
        });
    }
});


//Cargar ubicaciones guardadas en LocalStorage
window.addEventListener('load',function(){
    if(favLocalStorage.getItem('favorites') != null){
       favorites_array = JSON.parse(favLocalStorage.getItem('favorites'));
    }
});


//Guardar en favs y actualizar localStorage
favButton.addEventListener('click',function(){
    let value = currentCoords.innerHTML.split(',');
    let obj = {lon:Number(value[0]),lat:Number(value[1])};
    if(favButton.classList.contains('marked')){
        //si llega aquí quiere decir que el elemento ya está
        favorites_array = favorites_array.filter(function(e){return e.lat != obj.lat && e.lon != obj.lon});
        dissableClass('marked',favButton);
    }else{
        if(favorites_array.find((element) => element.lon == obj.lon && element.lat == obj.lat) == undefined){
            favorites_array.push({city:document.querySelector('#city-name').innerHTML,lon:Number(value[0]),lat:Number(value[1])});
            toggleClass('marked',favButton);
        }
    }
    favLocalStorage.setItem('favorites',JSON.stringify(favorites_array));
});

favButton.addEventListener('mouseover',function(){
    if(favButton.classList.contains('marked')){
        document.querySelector('#save-message').innerHTML = 'Quitar Ubicación';
    }else{
        document.querySelector('#save-message').innerHTML = 'Guardar Ubicación';
    }
});

document.addEventListener('click',() => {toggleClass('hidden',suggestions);}); // Ocultar/Mostrar barra de sugerencias