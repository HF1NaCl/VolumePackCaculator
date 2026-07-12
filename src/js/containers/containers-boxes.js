import { getVolumeTarget } from '../calcs/math-calcs';
import { getResponsiveScale } from '../calcs/window-calcs';
import {
  createBox,
  createSegmentedBox,
  clearIsoContainer,
  getIsoLayout,
  createIsoCanvas,
  createSceneBase,
  fitIsoCanvasToContent,
} from './draw-isometric-view';
import { getBestPackedBox, getPackingOptions } from './box-packing';
import { IsometricText } from '@elchininet/isometric';

import { GRID_MARGIN, BOX_COLORS } from './settings';

let resizeHandler = null;

function removeIsoResize() {
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
    resizeHandler = null;
  }
}

function bindIsoResize(renderFn) {
  let resizeTimer = null;

  resizeHandler = () => {
    if (resizeTimer) clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      renderFn();
    }, 150);
  };

  window.addEventListener('resize', resizeHandler);
}

// Funciones
export function initViewModeToggle() {
  const radios = document.querySelectorAll('input[name="viewMode"]');

  radios.forEach((radio) => {
    radio.addEventListener('change', (event) => {
      if (event.target.value === '1c') {
        drawIsometric();
      } else {
        drawBoxes();
      }
    });
  });
}

export function drawIsometric(withBox = true, placedBoxes = []) {
  removeIsoResize();

  const containerDimensions = getVolumeTarget(0);

  if (!containerDimensions) return;

  const [widthContainer, heightContainer, depthContainer] = containerDimensions;

  const boxDimensions = withBox ? getVolumeTarget(1) : null;

  if (withBox && !boxDimensions) return;

  const [widthBox, heightBox, depthBox] = boxDimensions ?? [];

  const container = clearIsoContainer();
  const layout = getIsoLayout(container);
  const scale = getResponsiveScale(
    layout.viewportWidth,
    layout.height,
    withBox ? heightBox : heightContainer,
  );
  const canvas = createIsoCanvas(container, layout, scale);

  const scene = createSceneBase({
    widthContainer,
    depthContainer,
  });

  if (withBox) {
    const box = createBox({
      right: GRID_MARGIN,
      left: GRID_MARGIN,
      top: 0,
      width: widthBox,
      depth: depthBox,
      height: heightBox,
      colors: BOX_COLORS,
    });

    const label = new IsometricText({
      content: 'Caja',
      planeView: 'TOP',
      right: 6.8,
      left: 5.4,
      top: 2.2,
      fontSize: '14px',
      fillColor: '#0f172a',
    });

    scene.addChildren(box, label);
  } else {
    const boxesInDrawOrder = [...placedBoxes].sort(
      (a, b) => a.right + a.left + a.top - (b.right + b.left + b.top),
    );

    boxesInDrawOrder.forEach((box) => {
      scene.addChild(
        createBox({
          right: GRID_MARGIN + box.right,
          left: GRID_MARGIN + box.left,
          top: box.top,
          width: box.width,
          depth: box.depth,
          height: box.height,
          colors: BOX_COLORS,
        }),
      );
    });
  }

  canvas.addChild(scene);
  fitIsoCanvasToContent(container);
  bindIsoResize(() => drawIsometric(withBox, placedBoxes));
}

function drawBoxes() {
  removeIsoResize();

  const containerDimensions = getVolumeTarget(0);
  const boxDimensions = getVolumeTarget(1);

  if (!containerDimensions || !boxDimensions) return;

  const [width, height, depth] = containerDimensions;
  const [boxWidth, boxHeight, boxDepth] = boxDimensions;

  const containerSize = { width, height, depth };
  const boxSize = {
    width: boxWidth,
    height: boxHeight,
    depth: boxDepth,
  };

  const container = clearIsoContainer();
  const packed = getBestPackedBox(containerSize, boxSize);

  if (!packed || packed.total === 0) {
    container.innerHTML = '<p class="text-center text-muted">La caja no cabe en el contenedor.</p>';
    return;
  }

  const layout = getIsoLayout(container);
  const scale = getResponsiveScale(layout.viewportWidth, layout.height, packed.height);
  const canvas = createIsoCanvas(container, layout, scale);

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
  });

  const label = new IsometricText({
    content: `${packed.total} cajas`,
    planeView: 'TOP',
    right: GRID_MARGIN,
    left: GRID_MARGIN,
    top: packed.height + 1,
    fontSize: '14px',
    fillColor: '#0f172a',
  });

  const scene = createSceneBase({
    widthContainer: containerSize.width,
    depthContainer: containerSize.depth,
  });

  scene.addChildren(groupedBox, label);
  canvas.addChild(scene);
  bindIsoResize(drawBoxes);
}

export function calcOrientationBoxes(container, box) {
  const options = getPackingOptions(container, box);
  const highestTotal = Math.max(...options.map((option) => option.total));

  options.forEach((option, index) => {
    document.getElementById(`box${index}`).innerHTML =
      option.total === highestTotal ? `<strong>${option.total}</strong>` : option.total;
  });
}
