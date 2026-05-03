import {
  IsometricCanvas,
  IsometricGroup,
  IsometricPath,
  IsometricRectangle,
  IsometricText,
} from '@elchininet/isometric'

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
          width: 1,
          height: 1,
          fillColor: colors.top,
          strokeColor: colors.stroke,
      })

      const frontFace = new IsometricRectangle({
          planeView: 'FRONT',
          width: 1,
          height: 1,
          fillColor: colors.front,
          strokeColor: colors.stroke,
      })

      const sideFace = new IsometricRectangle({
          planeView: 'SIDE',
          width: 1,
          height: 1,
          fillColor: colors.side,
          strokeColor: colors.stroke,
      })

      //Con esto se levanta y mueve para hacer un cubo exterior. Sin este solo es un cubo Interior
      topFace.top = 1;
      frontFace.right = 1;
      sideFace.left = 1;

  box.addChildren(topFace, frontFace, sideFace)
  return box
}