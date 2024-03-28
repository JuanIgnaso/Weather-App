/**
 * Rellena la ventana modal de los valores a mostrar con sus respectivos valores e iconos
 *
 *
 * @param {array} data - array de objetos con estructura de: prop,value,icon
 * @param {string} cssClass - clase css del wrapper
 * @param {string} target - elemento DOM objetivo
 */
export function loadContentInModal(data,cssClass,target){
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