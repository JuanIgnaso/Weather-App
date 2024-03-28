/**
 * Habilita la clase CSS pasada como parámetro en el objeto si esta no se encuentra en él.
 * @param {object} element
 * @param {string} cssClass
 */
export function toggleClass(cssClass,element){!element.classList.contains(cssClass) && element != undefined ? element.classList.toggle(cssClass) : ''}


/**
 * Deshabilita la clase CSS pasada como parámetro en el objeto si esta se encuentra en él.
 *
 * @param {object} element
 * @param {string} cssClass
 */
export function dissableClass(cssClass,element){element.classList.contains(cssClass) && element != undefined ? element.classList.toggle(cssClass) : ''}