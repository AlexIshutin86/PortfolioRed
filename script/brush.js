import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

let camera, scene, renderer, marker, mixer;
let container;

function init() {
  // Get the container element
  container = document.getElementById('containerBrush');
  
  // Create camera with aspect ratio based on container
  camera = new THREE.PerspectiveCamera(
    10,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 23;

  // Create scene
  scene = new THREE.Scene();

  // Create renderer with proper sizing
  renderer = new THREE.WebGLRenderer({ 
    alpha: false,
    antialias: true 
  });
  
  // Set renderer size to match container
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Prevent performance issues
  
  // Clear existing canvas if any and append new one
  while(container.firstChild) {
    container.removeChild(container.firstChild);
  }
  container.appendChild(renderer.domElement);

  // Add lighting
  const topLight = new THREE.DirectionalLight(0xffffff, 2);
  topLight.position.set(500, 500, 500);
  scene.add(topLight);

  // Add ambient light for better visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    './models/MarkersGLB.glb',
    function (gltf) {
      marker = gltf.scene;
      marker.position.set(0, -0.2, 11);
      
      // Scale model if needed
      marker.scale.set(1, 1, 1);
      
      scene.add(marker);

      mixer = new THREE.AnimationMixer(marker);
      if (gltf.animations && gltf.animations.length > 0) {
        mixer.clipAction(gltf.animations[1]).play();
      }
      modelMove();
    },
    undefined,
    function (error) {
      console.error('Error loading model:', error);
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  
  if (mixer) {
    mixer.update(0.02);
  }
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!container) return;
  
  // Update camera aspect ratio
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer size
  renderer.setSize(container.clientWidth, container.clientHeight);
}

function modelMove() {
  // Add your model movement/animation logic here
  if (marker) {
    // Example: Add subtle rotation on scroll
    const scrollY = window.scrollY;
    marker.rotation.y = scrollY * 0.001;
  }
}

// Initialize and set up event listeners
window.addEventListener('load', () => {
  init();
  animate();
  
  // Update model position on scroll
  window.addEventListener('scroll', modelMove);
  
  // Handle window resize
  window.addEventListener('resize', onWindowResize);
  
  // Handle container resize (if using flexbox or grid)
  const resizeObserver = new ResizeObserver(onWindowResize);
  resizeObserver.observe(container);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (renderer) {
    renderer.dispose();
  }
});