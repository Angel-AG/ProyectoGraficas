import * as THREE from './three.js';
import { OrbitControls } from './OrbitControls.js';
import {
  SHOGI_PIECE_GEO,
  SHOGI_BOARD_BOX_GEO,
  SHOGI_BOARD_LEG_GEO,
  SHOGI_BOARD_BOT_GEO,
  SHOGI_STAND_PLANE_GEO,
  SHOGI_STAND_POLE_GEO,
} from './ShogiGeos.js';

let scene, camera, renderer, controls;
let shogiBoard, shogiStandSente, shogiStandGote;

const BOARD_XZ = [];
for (let i = 0, startZ = 28; i < 9; ++i, startZ -= 7) {
  BOARD_XZ.push([]);
  for (let j = 0, startX = -28; j < 9; ++j, startX += 7) {
    BOARD_XZ[i].push({ x: startX, z: startZ });
  }
}

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
  createShogiStands();
  movePiecesToInitialPos();

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

function createShogiPiece() {
  const shogiPiece = new THREE.Mesh(SHOGI_PIECE_GEO, material3);
  shogiPiece.applyMatrix4(
    translateMatrix(
      0,
      SHOGI_PIECE_GEO.boundingBox.max.z +
        SHOGI_BOARD_BOX_GEO.boundingBox.max.y -
        SHOGI_BOARD_BOX_GEO.boundingBox.min.y +
        SHOGI_BOARD_LEG_GEO.boundingBox.max.y -
        SHOGI_BOARD_LEG_GEO.boundingBox.min.y +
        1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      0
    )
  );
  shogiPiece.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

  return shogiPiece;
}

// TODO: Clean and add different scale for each type of piece
function movePiecesToInitialPos() {
  // Pawns
  for (let i = 0; i < 9; ++i) {
    const shogiPiece = createShogiPiece();
    shogiPiece.position.set(
      BOARD_XZ[2][i].x,
      shogiPiece.position.y,
      BOARD_XZ[2][i].z
    );

    const shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Rook
  let shogiPiece = createShogiPiece();
  shogiPiece.position.set(
    BOARD_XZ[1][1].x,
    shogiPiece.position.y,
    BOARD_XZ[1][1].z
  );

  let shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Bishop
  shogiPiece = createShogiPiece();
  shogiPiece.position.set(
    BOARD_XZ[1][7].x,
    shogiPiece.position.y,
    BOARD_XZ[1][7].z
  );

  shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Lances
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece();
    shogiPiece.position.set(
      BOARD_XZ[0][0 + i * 8].x,
      shogiPiece.position.y,
      BOARD_XZ[0][0 + i * 8].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Knights
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece();
    shogiPiece.position.set(
      BOARD_XZ[0][1 + i * 6].x,
      shogiPiece.position.y,
      BOARD_XZ[0][1 + i * 6].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Silver
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece();
    shogiPiece.position.set(
      BOARD_XZ[0][2 + i * 4].x,
      shogiPiece.position.y,
      BOARD_XZ[0][2 + i * 4].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Gold
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece();
    shogiPiece.position.set(
      BOARD_XZ[0][3 + i * 2].x,
      shogiPiece.position.y,
      BOARD_XZ[0][3 + i * 2].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Kings
  shogiPiece = createShogiPiece();
  shogiPiece.position.set(
    BOARD_XZ[0][4].x,
    shogiPiece.position.y,
    BOARD_XZ[0][4].z
  );

  shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);
}

function createShogiStands() {
  const shogiStandTop = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, material2);
  shogiStandTop.applyMatrix4(
    translateMatrix(
      0,
      2 * SHOGI_STAND_PLANE_GEO.boundingBox.min.y +
        SHOGI_BOARD_BOX_GEO.boundingBox.max.y -
        SHOGI_BOARD_BOX_GEO.boundingBox.min.y +
        SHOGI_BOARD_LEG_GEO.boundingBox.max.y -
        SHOGI_BOARD_LEG_GEO.boundingBox.min.y +
        1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      0
    )
  );

  const shogiStandMid = new THREE.Mesh(SHOGI_STAND_POLE_GEO, material3);
  shogiStandMid.applyMatrix4(
    translateMatrix(
      0,
      SHOGI_STAND_POLE_GEO.boundingBox.min.y +
        2 * SHOGI_STAND_PLANE_GEO.boundingBox.min.y +
        SHOGI_BOARD_BOX_GEO.boundingBox.max.y -
        SHOGI_BOARD_BOX_GEO.boundingBox.min.y +
        SHOGI_BOARD_LEG_GEO.boundingBox.max.y -
        SHOGI_BOARD_LEG_GEO.boundingBox.min.y +
        1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
      0
    )
  );

  const shogiStandBot = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, material2);
  shogiStandBot.applyMatrix4(
    translateMatrix(0, SHOGI_STAND_PLANE_GEO.boundingBox.max.y, 0)
  );

  shogiStandSente = new THREE.Group();

  shogiStandSente.add(shogiStandTop);
  shogiStandSente.add(shogiStandMid);
  shogiStandSente.add(shogiStandBot);

  shogiStandSente.applyMatrix4(
    translateMatrix(
      SHOGI_STAND_PLANE_GEO.boundingBox.max.x +
        1.05 * SHOGI_BOARD_BOX_GEO.boundingBox.max.x,
      0,
      SHOGI_STAND_PLANE_GEO.boundingBox.min.z +
        SHOGI_BOARD_BOX_GEO.boundingBox.max.z
    )
  );

  shogiStandGote = shogiStandSente.clone();
  shogiStandGote.applyMatrix4(reflectMatrix(-1, 1, -1));

  scene.add(shogiStandSente);
  scene.add(shogiStandGote);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
