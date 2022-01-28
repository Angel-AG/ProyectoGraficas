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

// Blue sky and clouds
const clouds = loader.load('./textures/clouds.png');
clouds.wrapS = THREE.RepeatWrapping;
clouds.wrapT = THREE.RepeatWrapping;
clouds.repeat.set(3, 1);

const SKY_MAT = new THREE.MeshBasicMaterial({
  color: 0xf2f4f8,
  side: THREE.BackSide,
  map: clouds,
});

// Grass
const grass = loader.load('./textures/grass.png');
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;
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
};
