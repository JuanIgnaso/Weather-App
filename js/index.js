//API KEY - b36342eefc788b8e4ccb10ae5c94bcd3

import { getDayOfWeek , getMonthOfYear } from "./Dates.js";

const formulario = document.getElementById('formularioTiempo');
const ciudadInput = formulario.querySelector('#ciudadInput');
const actual = document.querySelector('#current');
const api_key = 'b36342eefc788b8e4ccb10ae5c94bcd3';
let screen = document.querySelector('#weather-screen');
let prevTableBody = document.querySelector('#tableBody');
const table = document.querySelector('#tableContent');
const nodata = document.querySelector('#no-data');


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
            mostrarError(error);
        }
    }
    else{mostrarError('Introduce el nombre de una ciudad');}
});

//Buscar información de lo que busca el usuario
async function getInfoTiempo(poblacion){
    /*
    Parámetros adicionales:
    units='valor' <- para cambiar las medias
    lang='código idioma' <- para recibirlo en idioma a elegir
    */
    const current = `https://api.openweathermap.org/data/2.5/weather?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `;
    const forecast = `https://api.openweathermap.org/data/2.5/forecast?q=${poblacion}&appid=${api_key}&units=metric&lang=sp `;//previsión a 5 días

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
    table.classList.contains('hidden') ? table.classList.toggle('hidden') : '';
    document.querySelector('#mensaje_error').innerHTML = '';
    const{
        name:city,
        main:{temp,feels_like,humidity},
        weather:[{id,description,icon}]
    } = informacion.current;

    current.classList.contains('hidden') ? current.classList.toggle('hidden') : '';

    document.querySelector('#city').textContent = city; //display del nombre de la Ciudad
    document.querySelector('#temp').textContent = `${temp}ºC`; //display de la temperatura
    document.querySelector('#feels_like').textContent = `${feels_like}ºC`; //display de la sensación térmica
    document.querySelector('#humidity').textContent = `${humidity}%`; //display del porcentaje de humedad
    document.querySelector('#description').textContent = description[0].toUpperCase() + description.slice(1).toLowerCase();//descripción del tiempo
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
    cell.setAttribute('class','font-bold');
    let currCell =  1;
    cell.innerHTML = `${getDayOfWeek(fecha.getDay())} ${fecha.getDate()} de ${getMonthOfYear(fecha.getMonth())}`;
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
            cell.innerHTML = `${getDayOfWeek(currDate.getDay())} ${currDate.getDate()} de ${getMonthOfYear(currDate.getMonth())}`;
            cell.setAttribute('class','font-bold');
            currCell = 1;
            dia = currDay;
        }
        cell = row.insertCell(currCell);
        cell.addEventListener('click',function(){showModal(informacion[index])});
        cell.innerHTML = `<img class="m-auto hover:cursor-pointer"  src=" https://openweathermap.org/img/wn/${informacion[index].weather[0].icon}@2x.png" alt=""></img>`;
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
        value: `${e.pop}%`,
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

/**
 * Rellena la ventana modal de los valores a mostrar con sus respectivos valores e iconos
 *
 *
 * @param {array} data - array de objetos con estructura de: prop,value,icon
 * @param {string} cssClass - clase css del wrapper
 * @param {string} target - elemento DOM objetivo
 */
function loadContentInModal(data,cssClass,target){
const domTarget = document.querySelector(target);
domTarget.innerHTML = '';
data.forEach(element => {
    domTarget.innerHTML += `
    <li class="${cssClass}">
    <p>${element.icon} ${element.prop}</p>
    <p>${element.value}</p>
    </li>
    `;
});

}


//Mostrar error
function mostrarError(texto){

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
    }
    document.querySelector('#mensaje_error').innerHTML = texto
}
