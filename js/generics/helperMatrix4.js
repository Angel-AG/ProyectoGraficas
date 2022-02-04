// Angel Guevara - https://github.com/Angel-AG/ProyectoGraficas

import * as THREE from '../three/three.js';

// Return a scale matrix
export function scaleMatrix(x, y, z) {
  let mat = new THREE.Matrix4();
  mat.makeScale(x, y, z);

  return mat;
}

// Return a translation matrix
export function translateMatrix(x, y, z) {
  let mat = new THREE.Matrix4();
  mat.makeTranslation(x, y, z);

  return mat;
}

// Return a reflection matrix
export function reflectMatrix(x, y, z) {
  let mat = new THREE.Matrix4();
  mat.elements[0] = x;
  mat.elements[5] = y;
  mat.elements[10] = z;

  return mat;
}
