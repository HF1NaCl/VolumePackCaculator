import { boxFitsContainer, placeBoxes } from './box-packing';

const MAX_CUSTOM_BOXES = 25;
const customBoxes = [];

export function initCustomBoxes(containerSize, renderScene) {
  document
    .getElementById('addCustomBox')
    .addEventListener('click', () => addCustomBox(containerSize, renderScene));

  document
    .getElementById('customBoxes')
    .addEventListener('click', (event) => removeCustomBox(event, containerSize, renderScene));

  renderCustomBoxes(containerSize, renderScene);
}

export function resetCustomBoxes() {
  customBoxes.length = 0;
}

function addCustomBox(containerSize, renderScene) {
  if (customBoxes.length >= MAX_CUSTOM_BOXES) {
    alert(`El límite es de ${MAX_CUSTOM_BOXES} cajas.`);
    return;
  }

  const box = readCustomBox();

  if (!Object.values(box).every((value) => Number.isFinite(value) && value > 0)) {
    alert('Ingresa medidas válidas para la caja.');
    return;
  }

  if (!boxFitsContainer(containerSize, box)) {
    alert('La caja supera las dimensiones del contenedor.');
    return;
  }

  const availableVolume = getVolume(containerSize) - getCustomBoxesVolume();

  if (getVolume(box) > availableVolume) {
    alert('La caja supera el volumen disponible del contenedor.');
    return;
  }

  const nextBoxes = [...customBoxes, box];
  const placedBoxes = placeBoxes(containerSize, nextBoxes);

  if (!placedBoxes) {
    alert('No existe espacio físico para colocar esta caja.');
    return;
  }

  customBoxes.push(box);
  renderCustomBoxes(containerSize, renderScene);
}

function readCustomBox() {
  return {
    width: Number(document.getElementById('widthInputCustomBox').value),
    height: Number(document.getElementById('heightInputCustomBox').value),
    depth: Number(document.getElementById('depthInputCustomBox').value),
  };
}

function removeCustomBox(event, containerSize, renderScene) {
  const button = event.target.closest('[data-box-index]');

  if (!button) return;

  customBoxes.splice(Number(button.dataset.boxIndex), 1);
  renderCustomBoxes(containerSize, renderScene);
}

function renderCustomBoxes(
  containerSize,
  renderScene,
  placedBoxes = placeBoxes(containerSize, customBoxes) ?? [],
) {
  const boxesContainer = document.getElementById('customBoxes');

  boxesContainer.innerHTML = customBoxes
    .map(
      (box, index) => `
        <span class="box-badge">
          <span>${box.width} × ${box.height} × ${box.depth}</span>
          <button
            type="button"
            class="box-badge-remove"
            data-box-index="${index}"
            aria-label="Eliminar caja ${index + 1}"
          >
            ×
          </button>
        </span>
      `,
    )
    .join('');

  document.getElementById('customBoxCount').textContent = customBoxes.length;

  document.getElementById('customBoxLimit').textContent = MAX_CUSTOM_BOXES;

  document.getElementById('addCustomBox').disabled = customBoxes.length >= MAX_CUSTOM_BOXES;

  renderAvailableCustomVolume(containerSize);
  renderScene(placedBoxes);
}

function renderAvailableCustomVolume(containerSize) {
  const availableVolume = getVolume(containerSize) - getCustomBoxesVolume();

  document.getElementById('customAvailableVolume').textContent = Number.isInteger(availableVolume)
    ? availableVolume
    : availableVolume.toFixed(2);
}

function getCustomBoxesVolume() {
  return customBoxes.reduce((total, box) => total + getVolume(box), 0);
}

function getVolume({ width, height, depth }) {
  return width * height * depth;
}

console.assert(
  placeBoxes({ width: 10, height: 10, depth: 10 }, [
    { width: 5, height: 10, depth: 10 },
    { width: 5, height: 10, depth: 10 },
  ])?.length === 2,
);
