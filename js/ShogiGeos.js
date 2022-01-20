import * as THREE from './three.js';

// -------------------------
// Shogi Piece
// -------------------------
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

// -------------------------
// Shogi Board
// -------------------------
const SHOGI_BOARD_BOX_GEO = new THREE.BoxGeometry(65, 35, 65);
SHOGI_BOARD_BOX_GEO.computeBoundingBox();
SHOGI_BOARD_BOX_GEO.center();

const SHOGI_BOARD_LEG_GEO = new THREE.BoxGeometry(5, 7, 5);
SHOGI_BOARD_LEG_GEO.computeBoundingBox();
SHOGI_BOARD_LEG_GEO.center();

// prettier-ignore
const verticesOfCube = [
  -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
  -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
];
// prettier-ignore
const indicesOfFaces = [
  2, 1, 0,    0, 3, 2,
  0, 4, 7,    7, 3, 0,
  0, 1, 5,    5, 4, 0,
  1, 2, 6,    6, 5, 1,
  2, 3, 7,    7, 6, 2,
  4, 5, 6,    6, 7, 4,
];

const SHOGI_BOARD_BOT_GEO = new THREE.PolyhedronGeometry(
  verticesOfCube,
  indicesOfFaces,
  8,
  2
);

SHOGI_BOARD_BOT_GEO.computeBoundingBox();
SHOGI_BOARD_BOT_GEO.center();

export {
  SHOGI_PIECE_GEO,
  SHOGI_BOARD_BOX_GEO,
  SHOGI_BOARD_LEG_GEO,
  SHOGI_BOARD_BOT_GEO,
};
