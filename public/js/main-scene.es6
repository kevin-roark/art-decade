
let THREE = require('three');
let Physijs = require('./lib/physi.js');
let $ = require('jquery');
let buzz = require('./lib/buzz.js');
let kt = require('kutility');

import {SheenScene} from './sheen-scene.es6';
let SheenMesh = require('./sheen-mesh');

export class MainScene extends SheenScene {

  /// Init

  constructor(renderer, camera, scene, options) {
    super(renderer, camera, scene, options);

    this.name = "Art Decade";
  }

  /// Overrides

  enter() {
    super.enter();

    this.camera.position.set(0, 5, 0);

    this.ground = createGround();
    this.ground.addTo(this.scene);

    this.makeLights();
  }

  doTimedWork() {
    super.doTimedWork();

    $.getJSON('http://localhost:3000/instagram?locationID=212943401', (data) => {
      console.log(data);

      for (var i = 0; i < data.length; i++) {
        var media = data[i];
        var imageURL = media.thumbnail.url;
        var $el = $('<img></img>');
        $el.attr('src', imageURL);
        $el.css('position', 'absolute');
        $el.css('left', (Math.random() * window.innerWidth * 0.9) + 'px');
        $el.css('top', (Math.random() * window.innerHeight * 0.9) + 'px');
        this.domContainer.append($el);
      }
    });
  }

  exit() {
    super.exit();

    this.ground.removeFrom(this.scene);

    this.scene.remove(this.hemiLight);
    this.scene.remove(this.frontLight);
    this.scene.remove(this.backLight);
    this.scene.remove(this.leftLight);
    this.scene.remove(this.rightLight);
  }

  update() {
    super.update();
  }

  // Creation

  makeLights() {
    let scene = this.scene;
    let ground = this.ground;

    this.frontLight = makeDirectionalLight();
    this.frontLight.position.set(-40, 125, 200);
    setupShadow(this.frontLight);

    this.backLight = makeDirectionalLight();
    this.backLight.position.set(40, 125, -200);

    this.leftLight = makeDirectionalLight();
    this.leftLight.position.set(-200, 75, -45);

    this.rightLight = makeDirectionalLight();
    this.rightLight.position.set(200, 75, -45);
    setupShadow(this.rightLight);
    this.rightLight.shadowDarkness = 0.05;

    function makeDirectionalLight() {
      var light = new THREE.DirectionalLight( 0xffffff, 0.9);
      light.color.setHSL( 0.1, 1, 0.95 );
      light.target = ground.mesh;

      scene.add(light);
      return light;
    }

    function setupShadow(light) {
      light.castShadow = true;
      light.shadowCameraFar = 500;
      light.shadowDarkness = 0.6;
      light.shadowMapWidth = light.shadowMapHeight = 2048;
    }
  }

}

function createGround(length) {
  return new SheenMesh({
    meshCreator: (callback) => {
      let geometry = new THREE.PlaneGeometry(length, length);
      computeGeometryThings(geometry);

      let rawMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
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

    position: new THREE.Vector3(0, 0, 0),

    collisionHandler: () => {

    }
  });
}

function computeGeometryThings(geometry) {
  geometry.computeFaceNormals();
  geometry.computeVertexNormals();
}
