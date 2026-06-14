import {
  IsometricCanvas,
  IsometricGroup,
  IsometricPath,
  IsometricRectangle,
} from '@elchininet/isometric'

import {
  ISO_CONTAINER_ID,
  GRID_MARGIN,
  FLOOR_COLORS,
} from './settings'

// Preparación para dibujar propiedades
export function createGrid({ width, depth }) {
  const gridPath = new IsometricPath({
    strokeColor: '#cbd5e1',
    strokeWidth: 0.7,
    fillColor: 'none',
  })

  for (let index = 0; index <= width; index += 1) {
    gridPath.moveTo(index, 0, 0).lineTo(index, depth, 0)
  }

  for (let index = 0; index <= depth; index += 1) {
    gridPath.moveTo(0, index, 0).lineTo(width, index, 0)
  }

  return gridPath
}

export function createBox({
      right,
      left,
      top,
      width,
      depth,
      height,
      colors,
  }) {
      const box = new IsometricGroup({ right, left, top })

      const topFace = new IsometricRectangle({
          planeView: 'TOP',
          width: width,
          height: depth,
          fillColor: colors.top,
          strokeColor: colors.stroke,
      })

      const frontFace = new IsometricRectangle({
          planeView: 'FRONT',
          width: depth,
          height: height,
          fillColor: colors.front,
          strokeColor: colors.stroke,
      })

      const sideFace = new IsometricRectangle({
          planeView: 'SIDE',
          width: width,
          height: height,
          fillColor: colors.side,
          strokeColor: colors.stroke,
      })

      //Con esto se levanta y mueve para hacer un cubo exterior. Sin este solo es un cubo Interior
      topFace.top = height;
      frontFace.right = width;
      sideFace.left = depth;

  box.addChildren(topFace, frontFace, sideFace)
  return box
}

export function createSegmentedBox({
  right,
  left,
  top,
  width,
  depth,
  height,
  segmentWidth,
  segmentDepth,
  segmentHeight,
  colors,
}) {
  const box = createBox({
    right,
    left,
    top,
    width,
    depth,
    height,
    colors,
  })

  const cuts = new IsometricPath({
    strokeColor: colors.stroke,
    strokeWidth: 0.45,
    fillColor: 'none',
  })

  const eps = 0.0001

  for (let x = segmentWidth; x < width - eps; x += segmentWidth) {
    cuts.moveTo(x, 0, height).lineTo(x, depth, height)
    cuts.moveTo(x, depth, 0).lineTo(x, depth, height)
  }

  for (let y = segmentDepth; y < depth - eps; y += segmentDepth) {
    cuts.moveTo(0, y, height).lineTo(width, y, height)
    cuts.moveTo(width, y, 0).lineTo(width, y, height)
  }

  for (let z = segmentHeight; z < height - eps; z += segmentHeight) {
    cuts.moveTo(width, 0, z).lineTo(width, depth, z)
    cuts.moveTo(0, depth, z).lineTo(width, depth, z)
  }

  box.addChild(cuts)

  return box
}

//Funciones para dibujar

export function clearIsoContainer() {
  const container = document.getElementById(ISO_CONTAINER_ID)
  container.innerHTML = ''

  return container
}

export function getIsoLayout(container) {
  const cardEl = container.closest('.card')
  const cardBody = container.closest('.card-body') ?? container
  const measureEl = cardEl ?? container

  const width = measureEl.clientWidth || 720
  const height = cardBody.clientHeight || Math.round(width * (460 / 720))
  const viewportWidth = window.innerWidth

  return {
    cardBody,
    measureEl,
    width,
    height,
    viewportWidth,
  }
}

export function createIsoCanvas(container, layout, scale) {
  return new IsometricCanvas({
    container,
    width: layout.width,
    height: layout.height,
    backgroundColor: '#f8fafc',
    scale,
  })
}

export function createSceneBase({ widthContainer, depthContainer }) {
  const grid = createGrid({
    width: widthContainer + GRID_MARGIN * 2,
    depth: depthContainer + GRID_MARGIN * 2,
  })

  const floor = new IsometricRectangle({
    planeView: 'TOP',
    width: widthContainer,
    height: depthContainer,
    right: GRID_MARGIN,
    left: GRID_MARGIN,
    fillColor: FLOOR_COLORS.fill,
    strokeColor: FLOOR_COLORS.stroke,
  })

  const scene = new IsometricGroup({
    top: 4,
  })

  scene.addChildren(grid, floor);

  return scene;
}
