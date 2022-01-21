import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import {
  SHOGI_BOARD_BOX_GEO,
  SHOGI_BOARD_LEG_GEO,
  SHOGI_BOARD_BOT_GEO,
} from './ShogiGeos.js';

let scene, camera, renderer, controls;
let shogiBoard;

// TODO: Create final materials
const material = new THREE.MeshBasicMaterial({ color: 0xfef9bc });
const material2 = new THREE.MeshBasicMaterial({ color: 0x724109 });
const material3 = new THREE.MeshBasicMaterial({ color: 0xfbe7d0 });

init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  createFloor();
  createShogiBoard();

  camera.position.set(0, 20, 150);

  //

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function translateMatrix(x, y, z) {
  let mat = new THREE.Matrix4();
  mat.makeTranslation(x, y, z);

  return mat;
}

function reflectMatrix(x, y, z) {
  let mat = new THREE.Matrix4();
  mat.elements[0] = x;
  mat.elements[5] = y;
  mat.elements[10] = z;

  return mat;
}

function createFloor() {
  const geometry = new THREE.PlaneGeometry(150, 150);
  const material = new THREE.MeshBasicMaterial({ color: 0xfffffff });
  const plane = new THREE.Mesh(geometry, material);

  plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

  scene.add(plane);
}

function createShogiBoard() {
  const shogiBoardBox = new THREE.Mesh(SHOGI_BOARD_BOX_GEO, material);
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

  const shogiBoardLegLeftBack = new THREE.Mesh(SHOGI_BOARD_LEG_GEO, material2);
  shogiBoardLegLeftBack.applyMatrix4(
    translateMatrix(
      SHOGI_BOARD_BOX_GEO.boundingBox.min.x +
        4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.x,
      SHOGI_BOARD_LEG_GEO.boundingBox.max.y +
        1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      SHOGI_BOARD_BOX_GEO.boundingBox.min.z +
        4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.z
    )
  );

  const shogiBoardLegRightBack = shogiBoardLegLeftBack.clone();
  shogiBoardLegRightBack.applyMatrix4(reflectMatrix(-1, 1, 1));

  const shogiBoardLegLeftFront = shogiBoardLegLeftBack.clone();
  shogiBoardLegLeftFront.applyMatrix4(reflectMatrix(1, 1, -1));

  const shogiBoardLegRightFront = shogiBoardLegLeftBack.clone();
  shogiBoardLegRightFront.applyMatrix4(reflectMatrix(-1, 1, -1));

  const shogiBoardBotLeftBack = new THREE.Mesh(SHOGI_BOARD_BOT_GEO, material3);
  shogiBoardBotLeftBack.applyMatrix4(
    translateMatrix(
      SHOGI_BOARD_BOX_GEO.boundingBox.min.x +
        4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.x,
      SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      SHOGI_BOARD_BOX_GEO.boundingBox.min.z +
        4 * SHOGI_BOARD_LEG_GEO.boundingBox.max.z
    )
  );

  const shogiBoardBotRightBack = shogiBoardBotLeftBack.clone();
  shogiBoardBotRightBack.applyMatrix4(reflectMatrix(-1, 1, 1));

  const shogiBoardBotLeftFront = shogiBoardBotLeftBack.clone();
  shogiBoardBotLeftFront.applyMatrix4(reflectMatrix(1, 1, -1));

  const shogiBoardBotRightFront = shogiBoardBotLeftBack.clone();
  shogiBoardBotRightFront.applyMatrix4(reflectMatrix(-1, 1, -1));

  shogiBoard = new THREE.Group();

  shogiBoard.add(shogiBoardBox);

  shogiBoard.add(shogiBoardLegLeftBack);
  shogiBoard.add(shogiBoardLegRightBack);
  shogiBoard.add(shogiBoardLegLeftFront);
  shogiBoard.add(shogiBoardLegRightFront);

  shogiBoard.add(shogiBoardBotLeftBack);
  shogiBoard.add(shogiBoardBotRightBack);
  shogiBoard.add(shogiBoardBotLeftFront);
  shogiBoard.add(shogiBoardBotRightFront);

  scene.add(shogiBoard);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
