import * as THREE from '../three/three.js';
import { translateMatrix } from '../generics/helperMatrix4.js';
import { DARK_WOOD_MAT, LIGHT_WOOD_MAT } from '../generics/materials.js';

// -------------------------
// Shogi Stand
// -------------------------

// Geometry
// -------------------------
const SHOGI_STAND_PLANE_GEO = new THREE.BoxGeometry(20, 2, 20);
SHOGI_STAND_PLANE_GEO.center();

const SHOGI_STAND_POLE_GEO = new THREE.BoxGeometry(5, 49, 5);
SHOGI_STAND_POLE_GEO.center();
// -------------------------

// Object3D
// -------------------------
function createStand() {
  let shogiStand = new THREE.Group();

  const shogiStandBot = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, DARK_WOOD_MAT);
  shogiStandBot.applyMatrix4(
    translateMatrix(0, SHOGI_STAND_PLANE_GEO.boundingBox.max.y, 0)
  );
  shogiStandBot.castShadow = true;
  shogiStandBot.receiveShadow = true;
  shogiStandBot.name = 'bottom';

  const shogiStandMid = new THREE.Mesh(SHOGI_STAND_POLE_GEO, LIGHT_WOOD_MAT);
  shogiStandMid.applyMatrix4(
    translateMatrix(
      0,
      2 * SHOGI_STAND_PLANE_GEO.boundingBox.max.y +
        SHOGI_STAND_POLE_GEO.boundingBox.max.y,
      0
    )
  );
  shogiStandMid.castShadow = true;
  shogiStandMid.receiveShadow = true;

  const shogiStandTop = new THREE.Mesh(SHOGI_STAND_PLANE_GEO, DARK_WOOD_MAT);
  shogiStandTop.applyMatrix4(
    translateMatrix(
      0,
      2 * SHOGI_STAND_PLANE_GEO.boundingBox.max.y +
        2 * SHOGI_STAND_POLE_GEO.boundingBox.max.y,
      0
    )
  );
  shogiStandTop.castShadow = true;
  shogiStandTop.receiveShadow = true;

  shogiStand.add(shogiStandBot);
  shogiStand.add(shogiStandMid);
  shogiStand.add(shogiStandTop);

  return shogiStand;
}
// -------------------------

export { createStand };
