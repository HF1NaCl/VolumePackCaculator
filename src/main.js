import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import containerHTML from './html/containers.html?raw';
import customContainersHTML from './html/containers-custom.html?raw';
import errorHTML from './html/error.html?raw';
import {
  getVolumeTarget,
  formatNumber,
  calcOrientationBoxes,
  drawIsometric,
  initViewModeToggle,
  initCustomBoxes,
  resetCustomBoxes,
  boxFitsContainer,
} from './js';
import initDarkMode from './js/darkMode';
import './style.css';
//Contenidos
const contenido1 = document.getElementById('container-mode');

const radios = document.querySelectorAll('input[name="radioMode"]');
document.getElementById('getVolumeButton').addEventListener('click', calculateVolume);

radios.forEach((r) => r.addEventListener('change', updateRadio));
document.getElementById('year').textContent = new Date().getFullYear();

initDarkMode('darkToggle');

function calculateVolume() {
  const containerDimensions = getVolumeTarget(0);

  if (!containerDimensions) return;

  const [width, height, depth] = containerDimensions;
  const container = { width, height, depth };
  const volume = width * height * depth;

  //Generemos ahora el contenido del Volumen
  const div = document.getElementById('cubeSize');
  div.innerHTML = '';

  const radioValue = document.querySelector('input[name="radioMode"]:checked').value;
  let calculation;
  switch (Number(radioValue)) {
    case 0:
      // Crearemos un wrapper que generará un elemento Bootstrap
      const wrapper = document.createElement('div');
      wrapper.className = 'col-12 col-md-8 mx-auto border rounded shadow-sm';
      wrapper.style.cssText =
        'padding: 20px; background-color: rgba(220, 220, 220, 0.247); margin-top: 40px;';
      //El h3 se hace dentro del div
      calculation = document.createElement('h3');
      calculation.textContent = `El volumen es: ${Math.abs(volume)} m³`;
      calculation.className = 'text-center';

      //Finalmente, Colocaremos primero el Wrapper al final dentro del div
      //Luego colocaremos los cálculos luego del wrapper (Es orden inverso)
      wrapper.appendChild(calculation);
      div.appendChild(wrapper);
      break;
    case 1:
      const boxDimensions = getVolumeTarget(1);

      if (!boxDimensions) break;

      const [boxWidth, boxHeight, boxDepth] = boxDimensions;

      const box = {
        width: boxWidth,
        height: boxHeight,
        depth: boxDepth,
      };

      if (!boxFitsContainer(container, box)) {
        div.innerHTML = errorHTML;
        break;
      }

      div.innerHTML = containerHTML;
      calculateContainers(container, box);
      drawIsometric();
      initViewModeToggle();
      break;
    case 2:
      resetCustomBoxes();
      div.innerHTML = customContainersHTML;

      initCustomBoxes(container, (placedBoxes) => {
        drawIsometric(false, placedBoxes);
      });

      break;
  }
}

function updateRadio() {
  const radioValue = document.querySelector('input[name="radioMode"]:checked').value;
  switch (Number(radioValue)) {
    case 0:
      contenido1.classList.add('d-none');
      break;
    case 1:
      contenido1.classList.remove('d-none');
      break;
    case 2:
      contenido1.classList.add('d-none');
      break;
  }
}

function calculateContainers(container, box) {
  const volContainer = document.getElementById('volContenedor');
  const volCaja = document.getElementById('volCaja');
  const volEficiencia = document.getElementById('volEficiencia');
  const cajasQueCaben = document.getElementById('cajasQueCaben');
  const medicionCaja = document.getElementById('medicionCaja');

  const containerVolume = container.width * container.height * container.depth;

  const boxVolume = box.width * box.height * box.depth;

  const widthPerBox = Math.floor(container.width / box.width);
  const heightPerBox = Math.floor(container.height / box.height);
  const depthPerBox = Math.floor(container.depth / box.depth);

  const totalBoxes = widthPerBox * heightPerBox * depthPerBox;
  const efficiency = (totalBoxes * boxVolume * 100) / containerVolume;

  volContainer.textContent = containerVolume;
  volCaja.textContent = boxVolume;
  volEficiencia.textContent = formatNumber(efficiency);
  cajasQueCaben.textContent = totalBoxes;
  medicionCaja.textContent = `${depthPerBox} largo × ${widthPerBox} ancho × ${heightPerBox} alto`;

  calcOrientationBoxes(container, box);
}
