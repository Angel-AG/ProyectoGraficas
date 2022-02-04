// Angel Guevara - https://github.com/Angel-AG/ProyectoGraficas

import * as THREE from '../three/three.js';
import { translateMatrix } from '../generics/helperMatrix4.js';
import {
  WOOD_MAT,
  DARK_WOOD_MAT,
  LIGHT_WOOD_MAT,
} from '../generics/materials.js';

// -------------------------
// Shogi Board
// -------------------------

// Geometry
// -------------------------
const SHOGI_BOARD_BOX_GEO = new THREE.BoxGeometry(65, 35, 65);
SHOGI_BOARD_BOX_GEO.center();

const SHOGI_BOARD_LEG_GEO = new THREE.BoxGeometry(5, 7, 5);
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

SHOGI_BOARD_BOT_GEO.center();
// -------------------------

// Material
// -------------------------
const loader = new THREE.TextureLoader();

// 9 x 9 Board
const board = new THREE.MeshStandardMaterial({
  color: 0xbf855f,
  map: loader.load('./textures/board.png'),
});

const SHOGI_BOARD_MATS = Array(6);
SHOGI_BOARD_MATS.fill(WOOD_MAT);
SHOGI_BOARD_MATS[2] = board;
// -------------------------

// Object3D
// -------------------------
function createBoard() {
  let shogiBoard = new THREE.Group();

  // Upper part of the board
  const shogiBoardBox = new THREE.Mesh(SHOGI_BOARD_BOX_GEO, SHOGI_BOARD_MATS);
  shogiBoardBox.applyMatrix4(
    translateMatrix(
      0,
      SHOGI_BOARD_BOX_GEO.boundingBox.max.y +
        SHOGI_BOARD_LEG_GEO.boundingBox.max.y -
        SHOGI_BOARD_LEG_GEO.boundingBox.min.y +
        1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      0
    )
  );
  shogiBoardBox.name = 'top';
  shogiBoardBox.castShadow = true;
  shogiBoardBox.receiveShadow = true;
  shogiBoard.add(shogiBoardBox);

  const XZ_QUADRANTS = [1, 1, -1, -1];
  // Lower part of the board (four legs)
  for (let x = 0; x < 4; ++x) {
    const shogiBoardLeg = new THREE.Mesh(SHOGI_BOARD_LEG_GEO, LIGHT_WOOD_MAT);
    shogiBoardLeg.applyMatrix4(
      translateMatrix(
        // X coord
        XZ_QUADRANTS[x] *
          (SHOGI_BOARD_BOX_GEO.boundingBox.min.x +
            4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.x),
        // Y coord
        SHOGI_BOARD_LEG_GEO.boundingBox.max.y +
          1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
        // Z coord
        XZ_QUADRANTS[(x + 1) % 4] *
          (SHOGI_BOARD_BOX_GEO.boundingBox.min.z +
            4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.z)
      )
    );

    const shogiBoardBot = new THREE.Mesh(SHOGI_BOARD_BOT_GEO, DARK_WOOD_MAT);
    shogiBoardBot.applyMatrix4(
      translateMatrix(
        // X coord
        XZ_QUADRANTS[x] *
          (SHOGI_BOARD_BOX_GEO.boundingBox.min.x +
            4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.x),
        // Y coord
        SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
        // Z coord
        XZ_QUADRANTS[(x + 1) % 4] *
          (SHOGI_BOARD_BOX_GEO.boundingBox.min.z +
            4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.z)
      )
    );

    shogiBoardLeg.castShadow = true;
    shogiBoardLeg.receiveShadow = true;
    shogiBoard.add(shogiBoardLeg);

    shogiBoardBot.castShadow = true;
    shogiBoardBot.receiveShadow = true;
    shogiBoard.add(shogiBoardBot);
  }

  return shogiBoard;
}
// -------------------------

// X and Z coordinates for each square of the board
// -------------------------
const BOARD_COORDS = [];
for (let i = 0, startZ = 28; i < 9; ++i, startZ -= 7) {
  BOARD_COORDS.push([]);
  for (let j = 0, startX = -28; j < 9; ++j, startX += 7) {
    BOARD_COORDS[i].push({ x: startX, z: startZ });
  }
}
// -------------------------

export { createBoard, BOARD_COORDS };
