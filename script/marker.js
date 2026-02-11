import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";
const camera = new THREE.PerspectiveCamera(
    10,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position. z = 23;

const scene = new THREE.Scene()
    let marker;
    let mixer;
    const loader = new GLTFLoader();
    loader.load('./models/MarkersGLB.glb',
        function (gltf) {
            marker = gltf.scene;
            scene.add(marker);

            mixer = new THREE.AnimationMixer(marker);
            mixer.clipAction(gltf.animations[1]).play();
            modelMove();
        },
        function (xhr) {},
        function (error) {}
    );
const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('containerMarker').appendChild(renderer.domElement);


const topLight = new THREE.DirectionalLight(0xffffff,2);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
    requestAnimationFrame(reRender3D);
    renderer.render(scene,camera);
    if(mixer) mixer.update(0.02);
};
reRender3D()

let arrPositionModel = [
    {
        id: 'about',
        position: {x: -0.8, y: 0, z: 1},
        rotation: {x: 0, y: 5.5, z: 1},
    },

    {
        id: 'experience',
        position: {x: 0, y: -1.4, z: 0},
        rotation: {x: 0, y: 9.5, z: 0},
    },

{
        id: 'project',
        position: {x: -0.8, y: 1, z: 1},
        rotation: {x: 0, y: 5.5, z: 1},
    },

];
const modelMove = () => {
    const sections = document.querySelectorAll('section');
    let currentSection;
    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 3) {
            currentSection = section.id;
        }
    });
let position_active = arrPositionModel.findIndex(
    (vol) => vol.id == currentSection
);
if (position_active >= 0) {
    let new_coordinates = arrPositionModel[position_active];
    
    gsap.to(marker.position, {
        x: new_coordinates.position.x,
        y: new_coordinates.position.y,
        z: new_coordinates.position.z,
        duration: 3,
        ease: "power1.out"
    });

    gsap.to(marker, {
        x: new_coordinates.rotation.x,
        y: new_coordinates.rotation.y,
        z: new_coordinates.rotation.z,
        duration: 3,
        ease: "power1.out"
    })
}

}

window.addEventListener('scroll', () => {
    if (marker) {
        modelMove();
    }
})


window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}
)