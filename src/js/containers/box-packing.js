const EPSILON = 0.000001;

function getBoxOrientations({ width, height, depth }) {
  return [
    { unitWidth: width, unitDepth: depth, unitHeight: height },
    { unitWidth: depth, unitDepth: width, unitHeight: height },
    { unitWidth: depth, unitDepth: height, unitHeight: width },
    { unitWidth: height, unitDepth: depth, unitHeight: width },
    { unitWidth: height, unitDepth: width, unitHeight: depth },
    { unitWidth: width, unitDepth: height, unitHeight: depth },
  ];
}

export function boxFitsContainer(container, box) {
  return (
    box.width <= container.width && box.height <= container.height && box.depth <= container.depth
  );
}

export function getPackingOptions(container, box) {
  return getBoxOrientations(box).map((orientation) => {
    const countWidth = Math.floor(container.width / orientation.unitWidth);
    const countDepth = Math.floor(container.depth / orientation.unitDepth);
    const countHeight = Math.floor(container.height / orientation.unitHeight);

    return {
      ...orientation,
      countWidth,
      countDepth,
      countHeight,
      total: countWidth * countDepth * countHeight,
      width: countWidth * orientation.unitWidth,
      depth: countDepth * orientation.unitDepth,
      height: countHeight * orientation.unitHeight,
    };
  });
}

export function getBestPackedBox(container, box) {
  return getPackingOptions(container, box).sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;

    return getUnusedSpace(container, a) - getUnusedSpace(container, b);
  })[0];
}

function getUnusedSpace(container, packed) {
  return (
    container.width -
    packed.width +
    container.depth -
    packed.depth +
    container.height -
    packed.height
  );
}

export function placeBoxes(container, boxes) {
  const placedBoxes = [];

  for (const box of boxes) {
    const position = getCandidatePositions(placedBoxes).find(
      (candidate) =>
        fitsInsideContainer(container, box, candidate) &&
        hasSupport(box, candidate, placedBoxes) &&
        placedBoxes.every((placed) => !boxesOverlap(box, candidate, placed)),
    );

    if (!position) return null;

    placedBoxes.push({
      ...box,
      ...position,
    });
  }

  return placedBoxes;
}

function getCandidatePositions(placedBoxes) {
  const rights = new Set([0]);
  const lefts = new Set([0]);
  const tops = new Set([0]);

  placedBoxes.forEach((box) => {
    rights.add(box.right + box.width);
    lefts.add(box.left + box.depth);
    tops.add(box.top + box.height);
  });

  const candidates = [];

  for (const top of tops) {
    for (const left of lefts) {
      for (const right of rights) {
        candidates.push({ right, left, top });
      }
    }
  }

  return candidates.sort((a, b) => a.top - b.top || a.left - b.left || a.right - b.right);
}

function fitsInsideContainer(container, box, position) {
  return (
    position.right + box.width <= container.width + EPSILON &&
    position.left + box.depth <= container.depth + EPSILON &&
    position.top + box.height <= container.height + EPSILON
  );
}

function boxesOverlap(box, position, placed) {
  return (
    position.right < placed.right + placed.width - EPSILON &&
    position.right + box.width > placed.right + EPSILON &&
    position.left < placed.left + placed.depth - EPSILON &&
    position.left + box.depth > placed.left + EPSILON &&
    position.top < placed.top + placed.height - EPSILON &&
    position.top + box.height > placed.top + EPSILON
  );
}

function hasSupport(box, position, placedBoxes) {
  if (position.top === 0) return true;

  return placedBoxes.some(
    (placed) =>
      Math.abs(placed.top + placed.height - position.top) <= EPSILON &&
      position.right >= placed.right &&
      position.right + box.width <= placed.right + placed.width &&
      position.left >= placed.left &&
      position.left + box.depth <= placed.left + placed.depth,
  );
}
