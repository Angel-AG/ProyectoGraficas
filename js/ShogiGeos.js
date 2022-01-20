import * as THREE from './three.js';

// Shogi Piece

const SHOGI_PIECE_SHAPE = new THREE.Shape([
  new THREE.Vector2(0, 0),
  new THREE.Vector2(4, 0),
  new THREE.Vector2(3.5, 4),
  new THREE.Vector2(2, 5),
  new THREE.Vector2(0.5, 4),
]);

const SHOGI_PIECE_EXT_SET = {
  steps: 2,
  depth: 1,
  bevelEnabled: false,
};

const SHOGI_PIECE_GEO = new THREE.ExtrudeGeometry(
  SHOGI_PIECE_SHAPE,
  SHOGI_PIECE_EXT_SET
);

SHOGI_PIECE_GEO.computeBoundingBox();
SHOGI_PIECE_GEO.center();

export { SHOGI_PIECE_GEO };
