/**
 * Estructura o contenido de la modal con sus iconos, esto se usa en showModal() en 'index.js'
 * @param {object} e
 * @returns
 */
export const modalData = (e) =>{ return [
    {prop: "Temperatura",value:`${e.main.temp}ºC`,icon: '<span class="material-icons-outlined"> thermostat </span>'},
    {prop: "Humedad",value: `${e.main.humidity}%`,icon: '<span class="material-symbols-outlined">humidity_percentage</span>'},
    {prop: "Sensación termica",value: `${e.main.feels_like}ºC`,icon: '<span class="material-symbols-outlined">thermostat</span>'},
    {prop: "Nubes",value: `${e.clouds.all}%`,icon: '<span class="material-symbols-outlined">cloud</span>'},
    {prop: "Velocidad viento",value: `${e.wind.gust}m/s`,icon: '<span class="material-symbols-outlined">airwave</span>'},
    {prop: "Orientación Viento",value: `${e.wind.deg}deg`,icon: '<span class="material-symbols-outlined"> trending_flat </span>'},
    {prop: "Prov Lluvia",value: `${Math.round(e.pop * 100)}%`,icon: '<span class="material-symbols-outlined"> umbrella </span>'},
    {prop: "Lluvia acumulada",value: `${e.rain == undefined ? '0.0' : e.rain['3h']}mm`,icon: '<span class="material-symbols-outlined"> rainy_light </span>'},
]};