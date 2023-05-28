import * as THREE from "three";

export class Box extends THREE.Mesh {
  constructor() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({
      color: 0xf10000,
    });

    super(geometry, material);
  }
}
