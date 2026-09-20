import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";

const canvas = document.querySelector("#space");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 8);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.IcosahedronGeometry(1.8, 18);
const material = new THREE.MeshStandardMaterial({
  color: 0x2f7fd3,
  roughness: 0.42,
  metalness: 0.7,
  emissive: 0x65d8c2,
  emissiveIntensity: 0.18,
  wireframe: true,
});

const core = new THREE.Mesh(geometry, material);
group.add(core);

const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xf2c14e, transparent: true, opacity: 0.62 });
for (let i = 0; i < 3; i += 1) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.4 + i * 0.42, 0.008, 16, 140), ringMaterial);
  ring.rotation.x = Math.PI / (2.4 + i * 0.2);
  ring.rotation.y = i * 0.72;
  group.add(ring);
}

const particleGeometry = new THREE.BufferGeometry();
const particleCount = 720;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i += 1) {
  positions[i * 3] = (Math.random() - 0.5) * 18;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
}

particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const particles = new THREE.Points(
  particleGeometry,
  new THREE.PointsMaterial({ color: 0xe8f2ff, size: 0.018, transparent: true, opacity: 0.86 })
);
scene.add(particles);

const keyLight = new THREE.PointLight(0x4cc9a6, 6, 18);
keyLight.position.set(-3, 3, 5);
scene.add(keyLight);

const warmLight = new THREE.PointLight(0xf2c14e, 4, 16);
warmLight.position.set(4, -2, 4);
scene.add(warmLight);

let pointerX = 0;
let pointerY = 0;

window.addEventListener("pointermove", (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(time) {
  const t = time * 0.001;
  group.rotation.y = t * 0.18 + pointerX * 0.18;
  group.rotation.x = Math.sin(t * 0.34) * 0.12 + pointerY * 0.12;
  particles.rotation.y = t * 0.035;
  particles.rotation.x = t * 0.012;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate(0);

