import { getVolumeTarget } from "../calcs/math-calcs";
import { getResponsiveScale } from "../calcs/window-calcs";
import { createBox, createSegmentedBox, clearIsoContainer, getIsoLayout, createIsoCanvas, createSceneBase } from "./draw-isometric-view";
import { IsometricText } from '@elchininet/isometric'

import { GRID_MARGIN, BOX_COLORS } from "./settings";

let widthContainer, heightContainer, depthContainer, widthBox, heightBox, depthBox;
let resizeHandler = null;
let currentViewMode = '1c';

function removeIsoResize() {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
    resizeHandler = null
  }
}

function bindIsoResize(renderFn) {
  let resizeTimer = null

  resizeHandler = () => {
    if (resizeTimer) clearTimeout(resizeTimer)

    resizeTimer = setTimeout(() => {
      renderFn()
    }, 150)
  }

  window.addEventListener('resize', resizeHandler)
}

// Helpers
function getBoxOrientations() {
  return [
    { unitWidth: widthBox, unitDepth: depthBox, unitHeight: heightBox },
    { unitWidth: depthBox, unitDepth: widthBox, unitHeight: heightBox },
    { unitWidth: widthBox, unitDepth: heightBox, unitHeight: depthBox },
    { unitWidth: heightBox, unitDepth: widthBox, unitHeight: depthBox },
    { unitWidth: depthBox, unitDepth: heightBox, unitHeight: widthBox },
    { unitWidth: heightBox, unitDepth: depthBox, unitHeight: widthBox },
  ]
}

function getBestPackedBox() {
  return getBoxOrientations()
    .map((orientation) => {
      const countWidth = Math.floor(widthContainer / orientation.unitWidth)
      const countDepth = Math.floor(depthContainer / orientation.unitDepth)
      const countHeight = Math.floor(heightContainer / orientation.unitHeight)
      const total = countWidth * countDepth * countHeight

      return {
        ...orientation,
        countWidth,
        countDepth,
        countHeight,
        total,
        width: countWidth * orientation.unitWidth,
        depth: countDepth * orientation.unitDepth,
        height: countHeight * orientation.unitHeight,
      }
    })
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total

      const wasteA =
        widthContainer - a.width +
        depthContainer - a.depth +
        heightContainer - a.height

      const wasteB =
        widthContainer - b.width +
        depthContainer - b.depth +
        heightContainer - b.height

      return wasteA - wasteB
    })[0]
}

// Funciones
export function initViewModeToggle() {
    const radios = document.querySelectorAll('input[name="viewMode"]')
    radios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentViewMode = e.target.value;
            if(currentViewMode === '1c') {
                drawIsometric();
            } else {
                drawBoxes();
            }
        })
    })
}

export function drawIsometric() {
  removeIsoResize()

  const container = clearIsoContainer()
  const layout = getIsoLayout(container)
  const scale = getResponsiveScale(layout.viewportWidth, layout.height, heightBox)
  const canvas = createIsoCanvas(container, layout, scale)

  const box = createBox({
    right: GRID_MARGIN,
    left: GRID_MARGIN,
    top: 0,
    width: widthBox,
    depth: depthBox,
    height: heightBox,
    colors: BOX_COLORS,
  })

  const label = new IsometricText({
    content: 'Caja',
    planeView: 'TOP',
    right: 6.8,
    left: 5.4,
    top: 2.2,
    fontSize: '14px',
    fillColor: '#0f172a',
  })

  const scene = createSceneBase({
    widthContainer,
    depthContainer,
  })

  scene.addChildren(box, label)

  canvas.addChild(scene)
  bindIsoResize(drawIsometric)
}

function drawBoxes() {
  removeIsoResize()

  const container = clearIsoContainer()
  const packed = getBestPackedBox()

  if (!packed || packed.total === 0) {
    container.innerHTML = '<p class="text-center text-muted">La caja no cabe en el contenedor.</p>'
    return
  }

  const layout = getIsoLayout(container)
  const scale = getResponsiveScale(layout.viewportWidth, layout.height, packed.height)
  const canvas = createIsoCanvas(container, layout, scale)

  const groupedBox = createSegmentedBox({
    right: GRID_MARGIN,
    left: GRID_MARGIN,
    top: 0,
    width: packed.width,
    depth: packed.depth,
    height: packed.height,
    segmentWidth: packed.unitWidth,
    segmentDepth: packed.unitDepth,
    segmentHeight: packed.unitHeight,
    colors: BOX_COLORS,
  })

  const label = new IsometricText({
    content: `${packed.total} cajas`,
    planeView: 'TOP',
    right: GRID_MARGIN,
    left: GRID_MARGIN,
    top: packed.height + 1,
    fontSize: '14px',
    fillColor: '#0f172a',
  })

  const scene = createSceneBase({
    widthContainer,
    depthContainer,
  })

  scene.addChildren(groupedBox, label)

  canvas.addChild(scene)
  bindIsoResize(drawBoxes)
}

export function calcOrientationBoxes(){
    [widthContainer, heightContainer, depthContainer] = getVolumeTarget(0);
    [widthBox, heightBox, depthBox] = getVolumeTarget(1);

    const totales = Array.from({ length: 6 }, (_, i) => calcRotation(i));
    const mayor = Math.max(...totales);

    totales.forEach((total, i) => {
        document.getElementById(`box${i}`).innerHTML =
            total === mayor
                ? `<strong>${total}</strong>`
                : total;
    });
}

function calcRotation(rotation){
    let x, y, z;
    switch(Number(rotation)){
        case 0: x = depthBox; y = widthBox; z = heightBox; break;
        case 1: x = widthBox; y = depthBox; z = heightBox; break;
        case 2: x = heightBox; y = depthBox; z = widthBox; break;
        case 3: x = depthBox; y = heightBox; z = widthBox; break;
        case 4: x = widthBox; y = heightBox; z = depthBox; break;
        case 5: x = heightBox; y = widthBox; z = depthBox; break;
    }
    let n_depth = Math.floor(depthContainer/x);
    let n_width = Math.floor(widthContainer/y);
    let n_height = Math.floor(heightContainer/z);

    let total = n_depth*n_width*n_height;
    return total;
}
