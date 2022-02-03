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
import {
  SHOGI_BOARD_MATS,
  SKY_MAT,
  GRASS_MAT,
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
} from './ShogiMaterials.js';
import {
  translateMatrix,
  scaleMatrix,
  reflectMatrix,
} from './helperMatrix4.js';

const SCALE_FACTOR = 0.25;
const PIECE_SCALE_S = 1;
const PIECE_SCALE_M = 1 + SCALE_FACTOR / 3;
const PIECE_SCALE_L = 1 + (2 * SCALE_FACTOR) / 3;
const PIECE_SCALE_XL = 1 + SCALE_FACTOR;

const PAWN = 'pawn';
const LANCE = 'lance';
const KNIGHT = 'knight';
const SILVER = 'silver';
const GOLD = 'gold';
const BISHOP = 'bishop';
const ROOK = 'rook';
const KING = 'king';

let scene, camera, renderer, controls;
let sky;
let shogiBoard, shogiStandSente, shogiStandGote;
let ambientLight, pointLight;
let raycaster;
let pointer;

const PIECES = [];

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
  addShogiBoard();
  addShogiStands();
  addShogiPieces();

  camera.position.set(-60, 90, 80);

  //

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

  plane.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
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

function addShogiBoard() {
  shogiBoard = new THREE.Group();

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

  scene.add(shogiBoard);
}

function createShogiPiece(typeName, typeMat, pieceSize) {
  const shogiPiece = new THREE.Mesh(SHOGI_PIECE_GEO, [typeMat, LIGHT_WOOD_MAT]);
  shogiPiece.applyMatrix4(
    new THREE.Matrix4().multiplyMatrices(
      translateMatrix(
        0,
        SHOGI_PIECE_GEO.boundingBox.max.z +
          SHOGI_BOARD_BOX_GEO.boundingBox.max.y -
          SHOGI_BOARD_BOX_GEO.boundingBox.min.y +
          SHOGI_BOARD_LEG_GEO.boundingBox.max.y -
          SHOGI_BOARD_LEG_GEO.boundingBox.min.y +
          1.5 * SHOGI_BOARD_BOT_GEO.boundingBox.max.y,
        0
      ),
      scaleMatrix(pieceSize, 1, pieceSize)
    )
  );
  shogiPiece.setRotationFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
  shogiPiece.castShadow = true;
  shogiPiece.receiveShadow = true;
  shogiPiece.name = typeName;

  return shogiPiece;
}

// TODO: Clean
function addShogiPieces() {
  // Pawns
  for (let i = 0; i < 9; ++i) {
    const shogiPiece = createShogiPiece(PAWN, PAWN_MAT, PIECE_SCALE_S);
    shogiPiece.position.set(
      BOARD_XZ[2][i].x,
      shogiPiece.position.y,
      BOARD_XZ[2][i].z
    );

    const shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Rook
  let shogiPiece = createShogiPiece(ROOK, ROOK_MAT, PIECE_SCALE_XL);
  shogiPiece.position.set(
    BOARD_XZ[1][7].x,
    shogiPiece.position.y,
    BOARD_XZ[1][7].z
  );

  let shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  PIECES.push(shogiPiece, shogiPieceOpp);
  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Bishop
  shogiPiece = createShogiPiece(BISHOP, BISHOP_MAT, PIECE_SCALE_XL);
  shogiPiece.position.set(
    BOARD_XZ[1][1].x,
    shogiPiece.position.y,
    BOARD_XZ[1][1].z
  );

  shogiPieceOpp = shogiPiece.clone();
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

  PIECES.push(shogiPiece, shogiPieceOpp);
  scene.add(shogiPiece);
  scene.add(shogiPieceOpp);

  // Lances
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece(LANCE, LANCE_MAT, PIECE_SCALE_M);
    shogiPiece.position.set(
      BOARD_XZ[0][0 + i * 8].x,
      shogiPiece.position.y,
      BOARD_XZ[0][0 + i * 8].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Knights
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece(KNIGHT, KNIGHT_MAT, PIECE_SCALE_M);
    shogiPiece.position.set(
      BOARD_XZ[0][1 + i * 6].x,
      shogiPiece.position.y,
      BOARD_XZ[0][1 + i * 6].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Silver
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece(SILVER, SILVER_MAT, PIECE_SCALE_L);
    shogiPiece.position.set(
      BOARD_XZ[0][2 + i * 4].x,
      shogiPiece.position.y,
      BOARD_XZ[0][2 + i * 4].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Gold
  for (let i = 0; i < 2; i++) {
    shogiPiece = createShogiPiece(GOLD, GOLD_MAT, PIECE_SCALE_L);
    shogiPiece.position.set(
      BOARD_XZ[0][3 + i * 2].x,
      shogiPiece.position.y,
      BOARD_XZ[0][3 + i * 2].z
    );

    shogiPieceOpp = shogiPiece.clone();
    shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));

    PIECES.push(shogiPiece, shogiPieceOpp);
    scene.add(shogiPiece);
    scene.add(shogiPieceOpp);
  }

  // Kings
  shogiPiece = createShogiPiece(KING, KING_O_MAT, PIECE_SCALE_XL);
  shogiPiece.position.set(
    BOARD_XZ[0][4].x,
    shogiPiece.position.y,
    BOARD_XZ[0][4].z
  );

  shogiPieceOpp = createShogiPiece(KING, KING_J_MAT, PIECE_SCALE_XL);
  shogiPieceOpp.applyMatrix4(reflectMatrix(-1, 1, -1));
  shogiPieceOpp.position.set(
    BOARD_XZ[8][4].x,
    shogiPieceOpp.position.y,
    BOARD_XZ[8][4].z
  );

  PIECES.push(shogiPiece, shogiPieceOpp);
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
  shogiStandTop.castShadow = true;
  shogiStandTop.receiveShadow = true;

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
  shogiStandMid.castShadow = true;
  shogiStandMid.receiveShadow = true;

  const shogiStandBot = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, DARK_WOOD_MAT);
  shogiStandBot.applyMatrix4(
    translateMatrix(0, SHOGI_STAND_PLANE_GEO.boundingBox.max.y, 0)
  );
  shogiStandBot.castShadow = true;
  shogiStandBot.receiveShadow = true;

  shogiStandSente = new THREE.Group();

  shogiStandSente.add(shogiStandTop);
  shogiStandSente.add(shogiStandMid);
  shogiStandSente.add(shogiStandBot);

  shogiStandSente.applyMatrix4(
    translateMatrix(
      SHOGI_STAND_PLANE_GEO.boundingBox.max.x +
        1.1 * SHOGI_BOARD_BOX_GEO.boundingBox.max.x,
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

  sky.rotation.y += 0.0015;

  controls.update();

  renderer.render(scene, camera);
}
