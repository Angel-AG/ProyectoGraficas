import * as THREE from './three/three.js';
import { OrbitControls } from './three/OrbitControls.js';
import { createBoard, BOARD_COORDS } from './objects/board.js';
import {
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
} from './objects/piece.js';
import { createStand } from './objects/stand.js';
import { SKY_MAT, GRASS_MAT } from './generics/materials.js';
import { translateMatrix, reflectMatrix } from './generics/helperMatrix4.js';

let scene, camera, renderer, controls, mixer, clock;
let sky;
let shogiBoard, shogiStandSente, shogiStandGote;
let ambientLight, pointLight;
let raycaster, pointer;

const PIECES = [];

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
  );

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.antialias = true;
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  // TODO: Remove helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Lights
  ambientLight = new THREE.AmbientLight(0x909090);
  pointLight = new THREE.PointLight(0xf0f0f0, 1, 350, 2);
  pointLight.position.set(0, 150, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 1536;
  pointLight.shadow.mapSize.height = 1536;
  pointLight.shadow.camera.far = 150;
  scene.add(ambientLight);
  scene.add(pointLight);

  // TODO: Remove helper
  const sphereSize = 1;
  const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
  scene.add(pointLightHelper);
  const helper = new THREE.CameraHelper(pointLight.shadow.camera);
  scene.add(helper);

  addFloor();
  addSky();
  shogiBoard = createBoard();
  scene.add(shogiBoard);
  addShogiStands();
  addShogiPieces();

  camera.position.set(-60, 90, 80);

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', onClick);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(PIECES, false);
  if (intersects.length > 0) {
    console.log(intersects[0].object.name);
  }
}

function addFloor() {
  const geometry = new THREE.CircleGeometry(500, 32);
  const plane = new THREE.Mesh(geometry, GRASS_MAT);

  plane.rotateX(-Math.PI / 2);
  plane.receiveShadow = true;

  scene.add(plane);
}

function addSky() {
  const geometry = new THREE.SphereGeometry(
    500, // radius
    32, // widthSegments
    32, // heightSegments
    0, // phiStart
    Math.PI * 2, // phiLength
    0, // thetaStart
    Math.PI / 2 // thetaLength
  );

  sky = new THREE.Mesh(geometry, SKY_MAT);

  scene.add(sky);
}

function addShogiPieces() {
  const board = shogiBoard.getObjectByName('top');
  const boardTop = board.position.y + board.geometry.boundingBox.max.y;

  // Pawns
  for (let i = 0; i < 9; ++i) {
    const shogiPiece = createPiece(PAWN);
    shogiPiece.position.set(
      BOARD_COORDS[2][i].x,
      boardTop + shogiPiece.geometry.boundingBox.max.y,
      BOARD_COORDS[2][i].z
    );

    const shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Rook
  let shogiPiece = createPiece(ROOK);
  shogiPiece.position.set(
    BOARD_COORDS[1][7].x,
    boardTop + shogiPiece.geometry.boundingBox.max.y,
    BOARD_COORDS[1][7].z
  );

  let shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  PIECES.push(shogiPiece, shogiPieceOpp);
  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Bishop
  shogiPiece = createPiece(BISHOP);
  shogiPiece.position.set(
    BOARD_COORDS[1][1].x,
    boardTop + shogiPiece.geometry.boundingBox.max.y,
    BOARD_COORDS[1][1].z
  );

  shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  PIECES.push(shogiPiece, shogiPieceOpp);
  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Lances
  for (let i = 0; i < 2; i++) {
    shogiPiece = createPiece(LANCE);
    shogiPiece.position.set(
      BOARD_COORDS[0][0 + i * 8].x,
      boardTop + shogiPiece.geometry.boundingBox.max.y,
      BOARD_COORDS[0][0 + i * 8].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Knights
  for (let i = 0; i < 2; i++) {
    shogiPiece = createPiece(KNIGHT);
    shogiPiece.position.set(
      BOARD_COORDS[0][1 + i * 6].x,
      boardTop + shogiPiece.geometry.boundingBox.max.y,
      BOARD_COORDS[0][1 + i * 6].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Silver
  for (let i = 0; i < 2; i++) {
    shogiPiece = createPiece(SILVER);
    shogiPiece.position.set(
      BOARD_COORDS[0][2 + i * 4].x,
      boardTop + shogiPiece.geometry.boundingBox.max.y,
      BOARD_COORDS[0][2 + i * 4].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Gold
  for (let i = 0; i < 2; i++) {
    shogiPiece = createPiece(GOLD);
    shogiPiece.position.set(
      BOARD_COORDS[0][3 + i * 2].x,
      boardTop + shogiPiece.geometry.boundingBox.max.y,
      BOARD_COORDS[0][3 + i * 2].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Kings
  shogiPiece = createPiece(KING_O);
  shogiPiece.position.set(
    BOARD_COORDS[0][4].x,
    boardTop + shogiPiece.geometry.boundingBox.max.y,
    BOARD_COORDS[0][4].z
  );

  shogiPieceOpp = createPiece(KING_J);
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));
  shogiPieceOpp.position.set(
    BOARD_COORDS[8][4].x,
    boardTop + shogiPieceOpp.geometry.boundingBox.max.y,
    BOARD_COORDS[8][4].z
  );

  PIECES.push(shogiPiece, shogiPieceOpp);
  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);
}

function addShogiStands() {
  shogiStandSente = createStand();
  shogiStandGote = createStand();

  const bottom = shogiStandSente.getObjectByName('bottom');
  const board = shogiBoard.getObjectByName('top');

  shogiStandSente.applyMatrix4(
    translateMatrix(
      bottom.geometry.boundingBox.max.x +
        1.1 * board.geometry.boundingBox.max.x,
      0,
      bottom.geometry.boundingBox.min.z + board.geometry.boundingBox.max.z
    )
  );

  shogiStandGote.applyMatrix4(
    translateMatrix(
      bottom.geometry.boundingBox.min.x +
        1.1 * board.geometry.boundingBox.min.x,
      0,
      bottom.geometry.boundingBox.max.z + board.geometry.boundingBox.min.z
    )
  );

  scene.add(shogiStandSente);
  scene.add(shogiStandGote);
}

function animate() {
  requestAnimationFrame(animate);

  sky.rotation.y += 0.0015;

  controls.update();

  renderer.render(scene, camera);
}
