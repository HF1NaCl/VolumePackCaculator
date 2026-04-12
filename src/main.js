import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import containerHTML from './assets/containers.html?raw';
import { getVolumeTarget, formatNumber, calcOrientationBoxes } from './assets/js';
//Contenidos
const contenido1 = document.getElementById('container-mode');

const radios = document.querySelectorAll('input[name="radioMode"]');
document.getElementById("getVolumeButton").addEventListener("click", calculateVolume);

radios.forEach(r => r.addEventListener("change", updateRadio));

function calculateVolume(){
    let [width, height, depth] = getVolumeTarget(0);
    //console.log(`Anchura: ${width} - Altura: - ${height} Profundidad: ${depth}`);
    let volume = width*height*depth;
    //console.log(volume);

    //Generemos ahora el contenido del Volumen
    const div = document.getElementById("cubeSize");
    div.innerHTML = '';

    const radioValue = document.querySelector('input[name="radioMode"]:checked').value;
    let calculation;
    switch(Number(radioValue)){
        case 0:
            calculation = document.createElement('h3');
            calculation.textContent = `El volumen es: ${Math.abs(volume)} m³`;
            calculation.className = 'text-center';
            div.appendChild(calculation);
            break;
        case 1:
            div.innerHTML = containerHTML;
            calculateContainers(volume, width, height, depth);
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