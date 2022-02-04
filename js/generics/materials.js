// Angel Guevara - https://github.com/Angel-AG/ProyectoGraficas

import * as THREE from '../three/three.js';

const loader = new THREE.TextureLoader();

const WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0xbf855f });
const DARK_WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0x432d25 });
const LIGHT_WOOD_MAT = new THREE.MeshStandardMaterial({ color: 0xfdeac1 });

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

export { SKY_MAT, GRASS_MAT, WOOD_MAT, DARK_WOOD_MAT, LIGHT_WOOD_MAT };
