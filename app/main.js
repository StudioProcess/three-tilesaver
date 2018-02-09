const W = 1280;
const H = 720;

let RENDERING = true;

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
  } else if (e.key == 's') {
    saveTiled();
  }
});


function saveCanvasBlob(canvas, filename) {
  canvas.toBlob(blob => {
    let url = URL.createObjectURL(blob);
    let link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  });
}


let TILES = 2;
function saveTiled() {
  // assume rendering is halted
  
  let timestamp  = new Date().toISOString();
  let tileWidth  = renderer.domElement.width;
  let tileHeight = renderer.domElement.height;
  let fullWidth  = tileWidth  * TILES;
  let fullHeight = tileHeight * TILES;
  console.log(tileWidth, tileHeight, fullWidth, fullHeight);
  
  let targetCanvas = document.createElement("canvas");
  targetCanvas.width = fullWidth;
  targetCanvas.height = fullHeight;
  let targetContext = targetCanvas.getContext("2d");
  
  for (let ty=0; ty<TILES; ty++) {
    for (let tx=0; tx<TILES; tx++) {
      let offsetX = tx * tileWidth;
      let offsetY = ty * tileHeight;
      camera.setViewOffset( fullWidth, fullHeight, offsetX, offsetY, tileWidth, tileHeight );
      renderer.render( scene, camera );
      // save current tile
      targetContext.drawImage(renderer.domElement, offsetX, offsetY);
      // saveCanvas( `${timestamp}_${ty*TILES+tx}.png` );
    }
  }
  
  camera.clearViewOffset();
  saveCanvasBlob(targetCanvas, `${timestamp}_${fullWidth}x${fullHeight}.png`);
}
