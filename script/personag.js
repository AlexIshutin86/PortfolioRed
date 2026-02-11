import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// 1. Initialize Three.js components
const scene = new THREE.Scene();
scene.background = null; // Ensure transparent background

// Get container dimensions
const container = document.getElementById('container3D');
const width = container.clientWidth;
const height = container.clientHeight;

// 2. Camera setup with proper aspect ratio
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  width / height, // Use container aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
);

// 3. Mouse position tracking
let mouseX = width / 2;
let mouseY = height / 2;



// 4. Model loading
let objToRender = 'punk';
let object = null;

const loader = new GLTFLoader();
loader.load(
  `models/${objToRender}.glb`,
  (glb) => {
    object = glb.scene;
    scene.add(object);
    
    // Center and scale model
    object.scale.set(3, 3, 3);
    object.position.set(1, -3, 0);
    
    // Optional: Adjust model position if needed
    // object.position.y = -1;
  },
  (xhr) => console.log(`${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`),
  (error) => console.error('Error loading model:', error)
);

// 5. Renderer setup with transparency
const renderer = new THREE.WebGLRenderer({
  alpha: true, // Enable transparency
  antialias: true, // Smooth edges
  powerPreference: "high-performance" // Optimize for GPU
});

// Critical transparency settings
renderer.setClearColor(0x000000, 0); // Transparent clear color
renderer.outputColorSpace = THREE.SRGBColorSpace; // Proper color handling
renderer.setPixelRatio(window.devicePixelRatio); // For high-DPI displays
renderer.setSize(width, height); // Set to container size

// Add canvas to DOM
container.appendChild(renderer.domElement);

// 6. Camera positioning
camera.position.z = objToRender === 'punk' ? 3 : 3;
camera.position.x = objToRender === 'punk' ? 3 : 3;
camera.position.y = objToRender === 'punk' ? 1 : 3;

// 7. Lighting setup
const topLight = new THREE.DirectionalLight(0xffffff, 5);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

// 8. OrbitControls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth camera movement
controls.dampingFactor = 0.05;

// 9. Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  // Rotate model with mouse (only when loaded and for punk model)
  if (object && objToRender === 'punk') {
    object.rotation.y = -1 + (mouseX / width) * 2;
    object.rotation.x = -0.6 + (mouseY / height) * 1.2;
  }
  
  renderer.render(scene, camera);
}
animate();

// 10. Responsive resize handler
window.addEventListener('resize', () => {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  
  // Update camera
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer
  renderer.setSize(newWidth, newHeight);
});

// 11. Handle container resize (for cases where container size changes without window resize)
function handleResize() {
  const newWidth = container.clientWidth;
  const newHeight = container.clientHeight;
  
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(newWidth, newHeight);
};

resizeObserver.observe(container);