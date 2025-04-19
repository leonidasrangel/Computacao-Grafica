import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true}); //"antialias melhora a suavidade dos objetos renderizados"
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 20, 30);  // vista de cima e afastada
camera.lookAt(0, 0, 0);          // olhando para o centro

//carregando as texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/earth.jpg'); // caminho a partir da pasta public
const sunTexture = textureLoader.load('/sun.jpg');

// Sol (parado no centro)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, emissive: 0xffff00, emissiveIntensity: 1 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Terra (orbita ao redor do Sol)
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// Um objeto "órbita" para girar a Terra ao redor do Sol
const orbit = new THREE.Object3D();
orbit.add(earth);
scene.add(orbit);

// Distância da Terra ao Sol
earth.position.set(10, 0, 0);

// Controle de tempo para movimento
let angle = 0;

function animate() {
    requestAnimationFrame(animate);

    // Movimento de translação (orbita em torno do Sol)
    angle += 0.01;
    orbit.rotation.y = angle;

    // Rotação da própria Terra
    earth.rotation.y += 0.01;

    renderer.render(scene, camera);
    }

    animate();