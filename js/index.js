// Angel Guevara - https://github.com/Angel-AG/ProyectoGraficas

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

// Array to store all the pieces on the board
const PIECES = [];
const introText = 'Click on a piece to learn its basic moves';

init();
animate();

function init() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
  );
  camera.position.set(-60, 90, 80);

  // Raycast to detect the click
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.antialias = true;

  // Add stuff to the doc
  document.body.appendChild(renderer.domElement);
  document.getElementById('info').textContent = introText;

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

  // Add objects to scene
  addFloor();
  addSky();
  shogiBoard = createBoard();
  scene.add(shogiBoard);
  addShogiStands();
  addShogiPieces();

  controls = new OrbitControls(camera, renderer.domElement);
  clock = new THREE.Clock();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('click', onClick);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Display the moveset of the piece clicked
function onClick(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(PIECES, false);
  if (intersects.length > 0) {
    // Hide all pieces, but the one selected
    PIECES.forEach((element) => {
      if (element != intersects[0].object) {
        element.layers.set(1);
      }
    });

    // Is the piece selected from the opposite side of the board?
    let oppPiece = 1;
    if (intersects[0].object.rotation.x < 0) {
      oppPiece = -1;
    }

    const initYPos = intersects[0].object.position.y;
    let moves, clip, clipAction;
    // Set animations according to the piece selected
    switch (intersects[0].object.name) {
      case PAWN.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 1.5, 2, 3],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 3.5, [moves]);
        break;
      case LANCE.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 1.5, 2, 3],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 4][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 4][4].z,
            BOARD_COORDS[4 + oppPiece * 4][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 4][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 3.5, [moves]);
        break;
      case KNIGHT.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 1.5, 2.5, 3, 3.5, 4, 5, 6, 6.5, 7],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4].x + oppPiece * 2.5,
            initYPos + 10,
            BOARD_COORDS[4][4].z - oppPiece * 5,
            BOARD_COORDS[4 + oppPiece * 2][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 2][4 + oppPiece * 1].z,
            BOARD_COORDS[4 + oppPiece * 2][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 2][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4].x - oppPiece * 2.5,
            initYPos + 10,
            BOARD_COORDS[4][4].z - oppPiece * 5,
            BOARD_COORDS[4 + oppPiece * 2][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 2][4 - oppPiece * 1].z,
            BOARD_COORDS[4 + oppPiece * 2][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 2][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 7.5, [moves]);
        break;
      case SILVER.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 1.5, 2, 3, 3.5, 4.5, 5, 6, 6.5, 7.5, 8],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 8.5, [moves]);
        break;
      case GOLD.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 1.5, 2, 3, 3.5, 4.5, 5, 6, 6.5, 7.5, 8, 9, 9.5],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 10, [moves]);
        break;
      case BISHOP.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 2, 3, 4.5, 5.5, 7, 8, 9.5, 10.5],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 4][4 - oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 4][4 - oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 4][4 + oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 4][4 + oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 4][4 - oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 4][4 - oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 4][4 + oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 4][4 + oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 11, [moves]);
        break;
      case ROOK.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [0.5, 2, 3, 4.5, 5.5, 7, 8, 9.5, 10.5],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 4][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 4][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 + oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4][4 + oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 4][4].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 4][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 - oppPiece * 4].x,
            initYPos,
            BOARD_COORDS[4][4 - oppPiece * 4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 11, [moves]);
        break;
      case KING_O.name:
        moves = new THREE.VectorKeyframeTrack(
          '.position',
          [
            0.5, 1.5, 2, 3, 3.5, 4.5, 5, 6, 6.5, 7.5, 8, 9, 9.5, 10.5, 11, 12,
            12.5,
          ],
          [
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 + oppPiece * 1][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4 - oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4 - oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
            BOARD_COORDS[4 - oppPiece * 1][4 + oppPiece * 1].x,
            initYPos,
            BOARD_COORDS[4 - oppPiece * 1][4 + oppPiece * 1].z,
            BOARD_COORDS[4][4].x,
            initYPos,
            BOARD_COORDS[4][4].z,
          ]
        );

        clip = new THREE.AnimationClip('Action', 13, [moves]);
        break;
      default:
        break;
    }

    if (clip) {
      document.getElementById('info').textContent = intersects[0].object.name;

      mixer = new THREE.AnimationMixer(intersects[0].object);
      // Unhide all pieces
      mixer.addEventListener('finished', function (e) {
        PIECES.forEach((element) => {
          element.layers.set(0);
          document.getElementById('info').textContent = introText;
        });
      });

      clipAction = mixer.clipAction(clip);
      clipAction.setLoop(THREE.LoopOnce);
      clipAction.play();
    }
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

// Add pieces in their initial positions
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

// Add stands next to the board
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

  // Update animation
  const delta = clock.getDelta();
  if (mixer) {
    mixer.update(delta);
  }

  controls.update();

  renderer.render(scene, camera);
}
