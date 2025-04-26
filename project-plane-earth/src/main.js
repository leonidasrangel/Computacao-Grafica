import './style.css'
import * as THREE from 'three'

// Cena, câmera e renderizador
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('earth.jpg');
const sunTexture = textureLoader.load('sun.jpg');
const moonTexture = textureLoader.load('moon.jpg');
const starsTexture = textureLoader.load('stars.jpg');
scene.background = starsTexture;

// Disco da "Terra Plana"
const earthGeometry = new THREE.CircleGeometry(5.1, 64);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earthCircle = new THREE.Mesh(earthGeometry, earthMaterial);
earthCircle.rotation.x = -Math.PI / 2;
scene.add(earthCircle);

// Domo (meia esfera transparente)
const domeGeometry = new THREE.SphereGeometry(5.1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
const domeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1});
const dome = new THREE.Mesh(domeGeometry, domeMaterial);
dome.rotation.y = 2.6;
scene.add(dome);

// Orbit root
const orbit = new THREE.Object3D();
scene.add(orbit);

//Sol
const sunPivot = new THREE.Object3D();
const sunGeometry = new THREE.SphereGeometry(0.5, 16, 16); //Cria a geometria do Sol (uma esfera com raio 0.5 e detalhamento 16x16).
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture}); //map é a textura do sol
const sun = new THREE.Mesh(sunGeometry, sunMaterial); //junta a geometria e material
sun.position.set(3.5, 2.5, 0)
sunPivot.add(sun)
orbit.add(sunPivot)

// Lua
const moonPivot = new THREE.Object3D();
const moonGeometry = new THREE.SphereGeometry(0.4, 16, 16); 
const moonMaterial = new THREE.MeshBasicMaterial({ map: moonTexture}); 
const moon = new THREE.Mesh(moonGeometry, moonMaterial); 
moon.position.set(3.5, 2.5, 0);
moonPivot.add(moon);
orbit.add(moonPivot);

// Garante que a Lua comece do lado oposto ao Sol
moonPivot.rotation.y = Math.PI;

// Posição da câmera
camera.position.set(2, 4, 10);
camera.lookAt(0, 0, 0);

// Loop de animação
function animate() {
  requestAnimationFrame(animate);

  // Rotaciona os pivôs em torno do Y
  sunPivot.rotation.y += 0.005;
  moonPivot.rotation.y +=0.005;

  renderer.render(scene, camera);
}
animate()
