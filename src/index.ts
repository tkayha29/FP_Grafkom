import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Scene3D, PhysicsLoader, Project, ExtendedObject3D } from 'enable3d';
import * as THREE from 'three'
import { ThirdPersonControls } from 'enable3d';
import { TextureLoader } from 'three';

export class ThreePhysicsComponent extends Scene3D {

  constructor() {
    super()
  }

  async init() {
    this.renderer.setPixelRatio(1)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  async preload() {
  }

  async create() {
    // set up scene (light, ground, grid, sky, orbitControls)
    // ukuran ground diperluas 1000x1000
    this.warpSpeed('-ground')
    const ground = this.physics.add.ground({ width: 1000, height: 1000 })
    
    // position camera
    this.camera.position.set(0, 200, 25)

    // enable physics debug
    if (this.physics.debug) {
      this.physics.debug.enable()
    }

 
    // compound objects  --> CRANE SILINDRIS
    let crane = new THREE.Group()
    crane.position.set(0,0,0)
    let y = 0;
    let x = -5;
    let radiusTop = 7;
    let radiusBottom = 7;
    let radiusSegments = 64;
    let height = 10;
    let width = 5;
    let depth = 5;
    let crane_material = this.add.material(new TextureLoader().load('/assets/img/metal.jpg'));
    let c1;
    let c2;

    this.add.existing(crane)
    for(let iterate = 1; iterate < 30; iterate++){
      
      if(iterate < 25){
        c1 = this.add.cylinder({ radiusTop, radiusBottom, radiusSegments, height, x: x, y: y }) //berdiri
        crane.add(c1 as any)
        y+=5;
      }else{
        x -=5;
        c1 = this.add.box({ height, width, depth, x: x, y: y }) //berdiri
        crane.add(c1 as any)  
      }  
    }
    this.add.existing(crane as any)

  
    let mat1 = this.add.material({ lambert: { color: 'yellow', transparent: false } })
    let mat2 = this.add.material({ lambert: { color: 'blue', transparent: false } })
    let mat3 = this.add.material({ lambert: { color: 'green', transparent: false } })
    const hinge = x => {
      let box1 = this.add.cylinder({ radiusTop, radiusBottom, radiusSegments, height, x: -5, y: y }) //berdiri;
      crane.add(box1 as any)  
      this.physics.add.existing(box1)
      let box2 = this.physics.add.box({ width: 5, height: 5, depth: 5, y: 100, z: 1, x: x + 2.00 }, { custom: mat2 })
      let box3 = this.physics.add.box({ width: 5, height: 5, depth: 5, y: 100, z: 2, x: x + 2.00 }, { custom: mat3 })

      this.physics.add.constraints.hinge( box1.body, box2.body, {
        pivotA: { y: -3 },
        pivotB: { y: 3 },
        axisA: { x: 3 },
        axisB: { x: 3 }
      })
      this.physics.add.constraints.hinge(box2.body, box3.body, {
        pivotA: { y: -3 },
        pivotB: { y: 3 },
        axisA: { x: 3 },
        axisB: { x: 3 }
      })
    }

    hinge(50);
  }

  update() {

  }

}

// set your project configs
const config = { scenes: [ThreePhysicsComponent], antialias: true, gravity: { x: 0, y: -9.81, z: 0 } }
PhysicsLoader('/ammo', () => new Project(config))
