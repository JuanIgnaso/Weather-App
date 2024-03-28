
let screen = document.querySelector('#weather-screen');

/**
 * Cambia el gradiante de la pantalla en función de si el icono contiene 'n'(night) o 'd'(day).
 * @param {string} icon
 */

export function changeScreenAppearance(icon){
    if(icon.indexOf('n') != -1){
        screen.classList.contains('day') && screen != undefined ? screen.classList.toggle('day') : '';
        !screen.classList.contains('night') && screen != undefined ? screen.classList.toggle('night') : '';
    }else{
        screen.classList.contains('night') && screen != undefined ? screen.classList.toggle('night') : '';
        !screen.classList.contains('day') && screen != undefined ? screen.classList.toggle('day') : '';
    }
}