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
import { WOOD_MAT, DARK_WOOD_MAT, LIGHT_WOOD_MAT } from './ShogiMaterials.js';
import {
  translateMatrix,
  scaleMatrix,
  reflectMatrix,
} from './helperMatrix4.js';

const SCALE_FACTOR = 0.25;
const PIECE_SCALE_M = 1 + SCALE_FACTOR / 3;
const PIECE_SCALE_L = 1 + (2 * SCALE_FACTOR) / 3;
const PIECE_SCALE_XL = 1 + SCALE_FACTOR;

let scene, camera, renderer, controls;
let shogiBoard, shogiStandSente, shogiStandGote;

// X and Z coordinates for each square of the board
const BOARD_XZ = [];
for (let i = 0, startZ = 28; i < 9; ++i, startZ -= 7) {
  BOARD_XZ.push([]);
  for (let j = 0, startX = -28; j < 9; ++j, startX += 7) {
    BOARD_XZ[i].push({ x: startX, z: startZ });
  }
}

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

  // TODO: Remove helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  addFloor();
  addShogiBoard();
  addShogiStands();
  addShogiPieces();

  camera.position.set(0, 20, 150);

  //

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function addFloor() {
  const geometry = new THREE.PlaneGeometry(150, 150);
  const material = new THREE.MeshBasicMaterial({ color: 0xfffffff });
  const plane = new THREE.Mesh(geometry, material);

  plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);

  scene.add(plane);
}

function addShogiBoard() {
  shogiBoard = new THREE.Group();

  // Upper part of the board
  const shogiBoardBox = new THREE.Mesh(SHOGI_BOARD_BOX_GEO, WOOD_MAT);
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

    shogiBoard.add(shogiBoardLeg);
    shogiBoard.add(shogiBoardBot);
  }

  scene.add(shogiBoard);
}

function createShogiPiece() {
  const shogiPiece = new THREE.Mesh(SHOGI_PIECE_GEO, LIGHT_WOOD_MAT);
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

// TODO: Clean
function addShogiPieces() {
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
  shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_XL, 1, PIECE_SCALE_XL));
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
  shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_XL, 1, PIECE_SCALE_XL));
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
    shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_M, 1, PIECE_SCALE_M));
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
    shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_M, 1, PIECE_SCALE_M));
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
    shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_L, 1, PIECE_SCALE_L));
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
    shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_L, 1, PIECE_SCALE_L));
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
  shogiPiece.applyMatrix4(scaleMatrix(PIECE_SCALE_XL, 1, PIECE_SCALE_XL));
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

function addShogiStands() {
  const shogiStandTop = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, DARK_WOOD_MAT);
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

  const shogiStandMid = new THREE.Mesh(SHOGI_STAND_POLE_GEO, LIGHT_WOOD_MAT);
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

  const shogiStandBot = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, DARK_WOOD_MAT);
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
