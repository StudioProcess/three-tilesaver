import * as tilesaver from './tilesaver.js';

const W = 1280;
const H = 720;

let RENDERING = true;
let TILES = 2;

let renderer, scene, camera;
let controls; // eslint-disable-line no-unused-vars

main();


function main() {
  
  setup(); // set up scene
  
  loop(); // start game loop
    
}


function setup() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true
  });
  renderer.setSize( W, H );
  renderer.setPixelRatio( window.devicePixelRatio );
  document.body.appendChild( renderer.domElement );

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 75, W / H, 0.1, 1000 );
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  camera.position.z = 2;
  
  let geo = new THREE.BoxGeometry( 1, 1, 1 );
  let mat = new THREE.MeshBasicMaterial({ color: 0x1e90ff, wireframe: true });
  let cube = new THREE.Mesh( geo, mat );
  scene.add( cube );
  
  tilesaver.init(renderer, scene, camera, TILES);
}


function loop(time) { // eslint-disable-line no-unused-vars
  // console.log('looping:' + time);
  
  requestAnimationFrame( loop );
  if (RENDERING) renderer.render( scene, camera );
}


document.addEventListener('keydown', e => {
  if (e.key == ' ') {
    console.log('space');
    RENDERING = !RENDERING;
  } else if (e.key == 'e') {
    tilesaver.save().then(f => console.log(`Saved to: ${f}`));
  }
});
