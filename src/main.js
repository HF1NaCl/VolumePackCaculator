import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import containerHTML from './assets/html/containers.html?raw';
import errorHTML from './assets/html/error.html?raw';
import { getVolumeTarget, formatNumber, calcOrientationBoxes, drawIsometric, initViewModeToggle } from './assets/js';
import initDarkMode from './assets/js/darkMode'
import './style.css';
//Contenidos
const contenido1 = document.getElementById('container-mode');

const radios = document.querySelectorAll('input[name="radioMode"]');
document.getElementById("getVolumeButton").addEventListener("click", calculateVolume);

radios.forEach(r => r.addEventListener("change", updateRadio));
document.getElementById("year").textContent = new Date().getFullYear();

initDarkMode('darkToggle');

function calculateVolume(){
    let [width, height, depth] = getVolumeTarget(0);
    let volume = width*height*depth;

    //Generemos ahora el contenido del Volumen
    const div = document.getElementById("cubeSize");
    div.innerHTML = '';

    const radioValue = document.querySelector('input[name="radioMode"]:checked').value;
    let calculation;
    switch(Number(radioValue)){
        case 0:
            // Crearemos un wrapper que generará un elemento Bootstrap
            const wrapper = document.createElement('div');
            wrapper.className = 'col-12 col-md-8 mx-auto border rounded shadow-sm';
            wrapper.style.cssText = 'padding: 20px; background-color: rgba(220, 220, 220, 0.247); margin-top: 40px;';
            //El h3 se hace dentro del div
            calculation = document.createElement('h3');
            calculation.textContent = `El volumen es: ${Math.abs(volume)} m³`;
            calculation.className = 'text-center';

            //Finalmente, Colocaremos primero el Wrapper al final dentro del div
            //Luego colocaremos los cálculos luego del wrapper (Es orden inverso)
            wrapper.appendChild(calculation)
            div.appendChild(wrapper);
            break;
        case 1:
            const validCalculate = isValidCalculation(width, height, depth);
            if(!validCalculate){
                div.innerHTML = errorHTML;
                break
            };
            div.innerHTML = containerHTML;
            calculateContainers(volume, width, height, depth);
            drawIsometric();
            initViewModeToggle();
            break;
    }
}

function updateRadio(){
    const radioValue = document.querySelector('input[name="radioMode"]:checked').value;
    switch(Number(radioValue)){
        case 0:
            contenido1.classList.add("d-none");
            break;
        case 1:
            contenido1.classList.remove("d-none");
            break;
    }
}

function isValidCalculation(width, height, depth){
    let [widthBox, heightBox, depthBox] = getVolumeTarget(1);

    if((widthBox>width)||(heightBox>height)||(depthBox>depth)){
        alert("La caja supera el tamaño del contenedor.")
        return false;
    }
    return true;
}

function calculateContainers(volume, width, height, depth){
    const volContainer = document.getElementById("volContenedor");
    const volCaja = document.getElementById("volCaja");
    const volEficiencia = document.getElementById("volEficiencia");
    const cajasQueCaben = document.getElementById("cajasQueCaben");
    const medicionCaja = document.getElementById("medicionCaja");

    let [widthBox, heightBox, depthBox] = getVolumeTarget(1);

    //Volumen del Contenedor
    volContainer.innerHTML = volume;
    //Volumen de la caja
    const volumeBox = widthBox * heightBox * depthBox;
    volCaja.innerHTML = Math.abs(volumeBox);
    //Cajas que caben
    const widthPerBox = Math.floor(width / widthBox);
    const heightPerBox = Math.floor(height / heightBox);
    const depthPerBox = Math.floor(depth / depthBox);
    medicionCaja.innerHTML = `${depthPerBox} largo * ${widthPerBox} ancho * ${heightPerBox} alto`;

    const totalBoxes = widthPerBox*heightPerBox*depthPerBox;

    cajasQueCaben.innerHTML = totalBoxes;
    //Eficiencia Volumétrica
    const eficiencia = (totalBoxes*volumeBox)/volume*100;
    volEficiencia.innerHTML = `${formatNumber(eficiencia)}`;

    calcOrientationBoxes();
}