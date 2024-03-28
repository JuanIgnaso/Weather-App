/**
 * Devuelve el punto de partida de la primera fila dependiendo de la hora del primer
 * objeto del array.
 *
 * @param {number} hour
 * @returns {number} index del punto de inicio
 */
export function getStartingPoint(hour){
    return [0,3,6,9,12,15,18,21].indexOf(hour);
}