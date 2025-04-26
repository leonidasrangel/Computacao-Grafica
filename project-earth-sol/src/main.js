import * as THREE from 'three'; //Importa tudo da biblioteca Three.js para usar recursos, como cena, câmera, geometria, materiais, etc
import './style.css'

const scene = new THREE.Scene(); //Criando cena 3D 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //criando a câmera que simula a visão humana
const renderer = new THREE.WebGLRenderer({antialias: true}); //"antialias melhora a suavidade dos objetos renderizados"
renderer.setSize(window.innerWidth, window.innerHeight); //definindo o canvas(área do desenho) para ocupar a tela do navegador
document.body.appendChild(renderer.domElement); //onde tudo é desenhado no corpo do HTML

camera.position.set(0, 20, 30);  // vista de cima e afastada (x:0, y:20, z:30)
camera.lookAt(0, 0, 0);          // olhando para o centro onde está o sol

//carregando as texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/earth.jpg'); // caminho a partir da pasta public
const sunTexture = textureLoader.load('/sun.jpg');
const starsTexture = textureLoader.load('/stars.jpg');
scene.background = starsTexture;

// Sol (parado no centro)
const sunGeometry = new THREE.SphereGeometry(2, 32, 32); //Cria a geometria do Sol (uma esfera com raio 2 e detalhamento 32x32).
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture}); //map é a textura do sol
const sun = new THREE.Mesh(sunGeometry, sunMaterial); //junta a geometria e material
scene.add(sun); // cria a cena 

// Terra (orbita ao redor do Sol)
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

// Um objeto "órbita" para girar a Terra ao redor do Sol
const orbit = new THREE.Object3D(); //Cria um objeto "órbita" invisível. Ao girá-lo, ele faz a Terra orbitar o Sol.
orbit.add(earth);   //A Terra é filha do objeto orbit, então ela se move junto com a rotação dele.
scene.add(orbit);

// Distância da Terra ao Sol
earth.position.set(10, 0, 0);

// vairável para controle de tempo para movimento
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