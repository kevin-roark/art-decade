
let THREE = require('three');
import {GalleryLayout} from './gallery-layout.es6';

export class RandomLayout extends GalleryLayout {

  layoutMedia(index, media) {
    var width = Math.random() * 12 + 2.5;
    var height = (media.thumbnail.width / media.thumbnail.height) * width;
    var mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.2),
      new THREE.MeshBasicMaterial({map: this.createTexture(media), side: THREE.DoubleSide})
    );

    mesh.castShadow = true;

    mesh.position.set(-50 + Math.random() * 100, Math.random() * 10 + height/2 + 1.25 + this.yLevel, -Math.random() * 75);

    this.container.add(mesh);
  }

}
