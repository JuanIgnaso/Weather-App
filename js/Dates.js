/**
 * Devuelve el nombre del día de la semana
 * @param {*} day
 * @returns string
 */
export function getDayOfWeek(day){
    return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'].at(day);
}

/**
 * Devuelve el nombre del mes
 * @param {*} month
 * @returns string
 */
export function getMonthOfYear(month){
    return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'].at(month);
}
