
let THREE = require('three');
let Physijs = require('./lib/physi.js');
let $ = require('jquery');
let kt = require('kutility');
let SheenMesh = require('./sheen-mesh');
let imageUtil = require('./image-util');
let geometryUtil = require('./geometry-util');

export class Gallery {

  constructor(scene, options) {
    this.scene = scene;
    this.name = options.name || 'David Zwirner Gallery';
    this.locationID = options.locationID || '212943401';
    this.yLevel = options.yLevel || 0;

    this.photoMeshes = [];
    this.meshContainer = new THREE.Object3D();

    this.ground = createGround(500, this.yLevel);
    this.ground.addTo(this.meshContainer);

    this.scene.add(this.meshContainer);
  }

  create(callback) {
    var endpoint = 'http://localhost:3000/instagram?locationID=' + this.locationID;
    $.getJSON(endpoint, (data) => {
      console.log(data);

      for (var i = 0; i < data.length; i++) {
        var media = data[i];
        this.makePhotoMesh(media);
      }

      if (callback) {
        callback();
      }
    });
  }

  destroy() {
    this.scene.remove(this.meshContainer);
  }

  makePhotoMesh(media) {
    var imageURL = media.thumbnail.url;
    var texture = imageUtil.loadTexture(imageURL, false);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.NearestFilter;

    var width = Math.random() * 12 + 2.5;
    var height = (media.thumbnail.width / media.thumbnail.height) * width;
    var mesh = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.2),
      new THREE.MeshBasicMaterial({map: texture, side: THREE.DoubleSide})
    );

    mesh.position.set(-50 + Math.random() * 100, Math.random() * 10 + height/2 + 1.25 + this.yLevel, -Math.random() * 75);
    mesh.castShadow = true;

    this.photoMeshes.push(mesh);
    this.meshContainer.add(mesh);
  }

}

function createGround(length, y) {
  return new SheenMesh({
    meshCreator: (callback) => {
      let geometry = new THREE.PlaneBufferGeometry(length, length);
      geometryUtil.computeShit(geometry);

      let rawMaterial = new THREE.MeshBasicMaterial({
        color: 0xeeeeee,
        side: THREE.DoubleSide
      });

      // lets go high friction, low restitution
      let material = Physijs.createMaterial(rawMaterial, 0.8, 0.4);

      let mesh = new Physijs.BoxMesh(geometry, material, 0);
      mesh.rotation.x = -Math.PI / 2;
      mesh.__dirtyRotation = true;

      mesh.receiveShadow = true;

      callback(geometry, material, mesh);
    },

    position: new THREE.Vector3(0, y, 0),

    collisionHandler: () => {

    }
  });
}
