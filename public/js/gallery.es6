
let THREE = require('three');
let Physijs = require('./lib/physi.js');
let $ = require('jquery');
let kt = require('kutility');
let SheenMesh = require('./sheen-mesh');
let imageUtil = require('./image-util');
let geometryUtil = require('./geometry-util');

import {RandomLayout} from './gallery-layouts/random-layout.es6';
import {Hole} from './gallery-layouts/hole.es6';

/// layout ideas
/// 1) standard white walls *
///  a), b), c) versions
/// 2) the hole *
/// 3) all surfaces are images *
/// 4) extension of the random with images Flipped n Fucked
/// 5) spiral hallway
/// 6) big slideshow screen with an audience of male figures murmuring garbage
/// 7) jail slit division between two very long rooms
/// 8) extreme long hallway with moving airport style walkway
/// 9) empty big room and they fall from the damn sky *

/// sort of into the idea of visible first person hands

var galleryLayoutCreators = [
  (options) => { return new RandomLayout(options); },
  (options) => { return new Hole(options); }
];

export class Gallery {

  constructor(scene, controlObject, options) {
    this.scene = scene;
    this.controlObject = controlObject;
    this.name = options.name || 'David Zwirner Gallery';
    this.locationID = options.locationID || '212943401';
    this.yLevel = options.yLevel || 0;
    this.layoutCreator = options.layoutCreator || kt.choice(galleryLayoutCreators);

    this.meshContainer = new THREE.Object3D();

    //this.ground = createGround(500, this.yLevel);
    //this.ground.addTo(this.meshContainer);

    this.scene.add(this.meshContainer);
  }

  create(callback) {
    var endpoint = 'http://localhost:3000/instagram?locationID=' + this.locationID;
    $.getJSON(endpoint, (data) => {
      console.log(data);

      this.layout = this.layoutCreator({
        container: this.meshContainer,
        controlObject: this.controlObject,
        media: data,
        yLevel: this.yLevel
      });

      if (callback) {
        callback();
      }
    });
  }

  update() {
    if (this.layout) {
      this.layout.update();
    }
  }

  destroy() {
    this.scene.remove(this.meshContainer);
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
