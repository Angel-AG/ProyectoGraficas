import * as THREE from './three.js';

const loader = new THREE.TextureLoader();

// TODO: Create final materials
const WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0xbf855f });
const DARK_WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0x432d25 });
const LIGHT_WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0xfdeac1 });

// 9 x 9 Board
const board = new THREE.MeshStandardMaterial({
  color: 0xbf855f,
  map: loader.load('./textures/board.png'),
});

const SHOGI_BOARD_MATS = Array(6);
SHOGI_BOARD_MATS.fill(WOOD_MAT);
SHOGI_BOARD_MATS[2] = board;

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

// Blue sky and clouds
const clouds = loader.load('./textures/clouds.png');
clouds.wrapS = clouds.wrapT = THREE.RepeatWrapping;
clouds.repeat.set(3, 1);

const SKY_MAT = new THREE.MeshBasicMaterial({
  color: 0xf2f4f8,
  side: THREE.BackSide,
  map: clouds,
});

// Grass
const grass = loader.load('./textures/grass.png');
grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set(17, 19);

const GRASS_MAT = new THREE.MeshStandardMaterial({
  color: 0xaaff00,
  map: grass,
});

export {
  SHOGI_BOARD_MATS,
  SKY_MAT,
  GRASS_MAT,
  WOOD_MAT,
  DARK_WOOD_MAT,
  LIGHT_WOOD_MAT,
  PAWN_MAT,
  ROOK_MAT,
  BISHOP_MAT,
  LANCE_MAT,
  KNIGHT_MAT,
  SILVER_MAT,
  GOLD_MAT,
  KING_O_MAT,
  KING_J_MAT,
};
