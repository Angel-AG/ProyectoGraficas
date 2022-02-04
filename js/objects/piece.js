// Angel Guevara - https://github.com/Angel-AG/ProyectoGraficas

import * as THREE from '../three/three.js';
import { scaleMatrix } from '../generics/helperMatrix4.js';
import { LIGHT_WOOD_MAT } from '../generics/materials.js';

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

SHOGI_PIECE_GEO.center();
SHOGI_PIECE_GEO.rotateX(-Math.PI / 2);

// Material
// -------------------------
const loader = new THREE.TextureLoader();

// Pawn
const pawn = loader.load('./textures/pawn.png');
pawn.wrapS = pawn.wrapT = THREE.RepeatWrapping;
pawn.repeat.set(0.25, 0.2);
const PAWN_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: pawn,
});

// Rook
const rook = loader.load('./textures/rook.png');
rook.wrapS = rook.wrapT = THREE.RepeatWrapping;
rook.repeat.set(0.25, 0.2);
const ROOK_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: rook,
});

// Bishop
const bishop = loader.load('./textures/bishop.png');
bishop.wrapS = bishop.wrapT = THREE.RepeatWrapping;
bishop.repeat.set(0.25, 0.2);
const BISHOP_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: bishop,
});

// Lance
const lance = loader.load('./textures/lance.png');
lance.wrapS = lance.wrapT = THREE.RepeatWrapping;
lance.repeat.set(0.25, 0.2);
const LANCE_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: lance,
});

// Knight
const knight = loader.load('./textures/knight.png');
knight.wrapS = knight.wrapT = THREE.RepeatWrapping;
knight.repeat.set(0.25, 0.2);
const KNIGHT_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: knight,
});

// Silver General
const silver = loader.load('./textures/silver.png');
silver.wrapS = silver.wrapT = THREE.RepeatWrapping;
silver.repeat.set(0.25, 0.2);
const SILVER_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: silver,
});

// Gold General
const gold = loader.load('./textures/gold.png');
gold.wrapS = gold.wrapT = THREE.RepeatWrapping;
gold.repeat.set(0.25, 0.2);
const GOLD_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: gold,
});

// King ōshō
const kingO = loader.load('./textures/kingO.png');
kingO.wrapS = kingO.wrapT = THREE.RepeatWrapping;
kingO.repeat.set(0.25, 0.2);
const KING_O_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: kingO,
});

// King gyokushō
const kingJ = loader.load('./textures/kingJ.png');
kingJ.wrapS = kingJ.wrapT = THREE.RepeatWrapping;
kingJ.repeat.set(0.25, 0.2);
const KING_J_MAT = new THREE.MeshStandardMaterial({
  color: 0xfdeac1,
  map: kingJ,
});
// -------------------------

// Object3D
// -------------------------
function createPiece(PIECE) {
  let shogiPiece = new THREE.Mesh(SHOGI_PIECE_GEO, [
    PIECE.material,
    LIGHT_WOOD_MAT,
  ]);
  shogiPiece.applyMatrix4(scaleMatrix(PIECE.size, 1, PIECE.size));
  shogiPiece.castShadow = true;
  shogiPiece.receiveShadow = true;
  shogiPiece.name = PIECE.name;

  return shogiPiece;
}
// -------------------------

// Piece Size
// -------------------------
const SCALE_FACTOR = 0.25;
const PIECE_SCALE_S = 1;
const PIECE_SCALE_M = 1 + SCALE_FACTOR / 3;
const PIECE_SCALE_L = 1 + (2 * SCALE_FACTOR) / 3;
const PIECE_SCALE_XL = 1 + SCALE_FACTOR;
// -------------------------

// Constants
// -------------------------
const PAWN = { name: 'pawn', size: PIECE_SCALE_S, material: PAWN_MAT };
const LANCE = { name: 'lance', size: PIECE_SCALE_M, material: LANCE_MAT };
const KNIGHT = { name: 'knight', size: PIECE_SCALE_M, material: KNIGHT_MAT };
const SILVER = { name: 'silver', size: PIECE_SCALE_L, material: SILVER_MAT };
const GOLD = { name: 'gold', size: PIECE_SCALE_L, material: GOLD_MAT };
const BISHOP = { name: 'bishop', size: PIECE_SCALE_XL, material: BISHOP_MAT };
const ROOK = { name: 'rook', size: PIECE_SCALE_XL, material: ROOK_MAT };
const KING_O = {
  name: 'king',
  size: PIECE_SCALE_XL,
  material: KING_O_MAT,
};
const KING_J = {
  name: 'king',
  size: PIECE_SCALE_XL,
  material: KING_J_MAT,
};
// -------------------------

export {
  createPiece,
  PAWN,
  LANCE,
  KNIGHT,
  SILVER,
  GOLD,
  BISHOP,
  ROOK,
  KING_O,
  KING_J,
};
