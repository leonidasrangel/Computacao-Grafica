import * as THREE from 'three'; //Importa tudo da biblioteca Three.js para usar recursos, como cena, câmera, geometria, materiais, etc
import './style.css'

const scene = new THREE.Scene(); //Criando cena 3D 
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); //criando a câmera que simula a visão humana
const renderer = new THREE.WebGLRenderer({antialias: true}); //"antialias melhora a suavidade dos objetos renderizados"
renderer.setSize(window.innerWidth, window.innerHeight); //definindo o canvas(área do desenho) para ocupar a tela do navegador
document.body.appendChild(renderer.domElement); //onde tudo é desenhado no corpo do HTML

camera.position.set(0, 10, 70);  // vista de cima e afastada (x:0, y:20, z:30)
camera.lookAt(0, 0, 0);          // olhando para o centro onde está o sol

//carregando as texturas
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('/earth.jpg'); // caminho a partir da pasta public
const sunTexture = textureLoader.load('/sun.jpg');
const starsTexture = textureLoader.load('/stars.jpg');
const venusTexture = textureLoader.load('/venus.jpg')
const mercuryTexture = textureLoader.load('/mercury.jpg');
const marsTexture = textureLoader.load('/mars.jpg');
const jupiterTexture = textureLoader.load('/jupiter.jpg');
const saturnTexture = textureLoader.load('/saturn.jpg');
const uranusTexture = textureLoader.load('/uranus.jpg');
const neptuneTexture = textureLoader.load('/neptune.jpg');
scene.background = starsTexture;

// Sol (parado no centro)
const sunGeometry = new THREE.SphereGeometry(8, 32, 32); //Cria a geometria do Sol (uma esfera com raio 2 e detalhamento 32x32).
const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture}); //map é a textura do sol
const sun = new THREE.Mesh(sunGeometry, sunMaterial); //junta a geometria e material
scene.add(sun); // cria a cena 

// Terra (orbita ao redor do Sol)
const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);

//Vênus
const venusGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const venusMaterial = new THREE.MeshBasicMaterial({ map: venusTexture });
const venus = new THREE.Mesh(venusGeometry, venusMaterial);

//Mercúrio
const mercuryGeometry = new THREE.SphereGeometry(1, 32, 32);
const mercuryMaterial = new THREE.MeshBasicMaterial({ map: mercuryTexture});
const mercury = new THREE.Mesh(mercuryGeometry, mercuryMaterial);

//Marte
const marsGeometry = new THREE.SphereGeometry(0.9, 32, 32);
const marsMaterial = new THREE.MeshBasicMaterial({ map: marsTexture });
const mars = new THREE.Mesh(marsGeometry, marsMaterial);

//Jupiter
const jupiterGeometry = new THREE.SphereGeometry(3, 32, 32);
const jupiterMaterial = new THREE.MeshBasicMaterial({ map: jupiterTexture });
const jupiter = new THREE.Mesh(jupiterGeometry, jupiterMaterial);

//Saturno
const saturnGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const saturnMaterial = new THREE.MeshBasicMaterial({ map: saturnTexture });
const saturn = new THREE.Mesh(saturnGeometry, saturnMaterial);

//Anel Saturno
const ringTexture = textureLoader.load('/saturn_ring.png');
const ringGeometry = new THREE.RingGeometry(3.5, 6, 64);
const ringMaterial = new THREE.MeshBasicMaterial({map: ringTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.7});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.rotation.x = Math.PI / 2;
saturn.add(ring);

//Urano
const uranusGeometry = new THREE.SphereGeometry(2.2, 32, 32);
const uranusMaterial = new THREE.MeshBasicMaterial({ map: uranusTexture });
const uranus = new THREE.Mesh(uranusGeometry, uranusMaterial);

//Netuno
const neptuneGeometry = new THREE.SphereGeometry(2.3, 32, 32);
const neptuneMaterial = new THREE.MeshBasicMaterial({ map: neptuneTexture });
const neptune = new THREE.Mesh(neptuneGeometry, neptuneMaterial);

// Um objeto "órbita" para girar a Terra ao redor do Sol
const orbit = new THREE.Object3D(); //Cria um objeto "órbita" invisível. Ao girá-lo, ele faz a Terra orbitar o Sol.
orbit.add(earth); //A Terra é filha do objeto orbit, então ela se move junto com a rotação dele.
scene.add(orbit);

const orbit2 = new THREE.Object3D();
orbit2.add(venus);
scene.add(orbit2);

const orbit3 = new THREE.Object3D();
orbit3.add(mercury);
scene.add(orbit3); 

const orbit4 = new THREE.Object3D();
orbit4.add(mars);
scene.add(orbit4); 

const orbit5 = new THREE.Object3D();
orbit5.add(jupiter);
scene.add(orbit5); 

const orbit6 = new THREE.Object3D();
orbit6.add(saturn);
scene.add(orbit6); 

const orbit7 = new THREE.Object3D();
orbit7.add(uranus);
scene.add(orbit7); 

const orbit8 = new THREE.Object3D();
orbit8.add(neptune);
scene.add(orbit8);

// Distância da Terra ao Sol
mercury.position.set(10, 0, 0);
venus.position.set(15, 0, 0);
earth.position.set(20, 0, 0);
mars.position.set(25, 0, 0);
jupiter.position.set(30, 0, 0);
saturn.position.set(45, 0, 0);
uranus.position.set(50, 0, 0);
neptune.position.set(55, 0, 0);

// vairável para controle de tempo para movimento
let angleEarth = 0;
let angleVenus = 0;
let angleMercury = 0;
let angleMars = 0;
let angleJupiter = 0;
let angleSaturn = 0;
let angleUranus = 0;
let angleNeptune = 0;

function animate() {
    requestAnimationFrame(animate);

    // Movimento de translação (orbita em torno do Sol)
    angleMercury += 0.002 * (365 / 88);     // ~4.15x mais rápido que a Terra
    angleVenus   += 0.002 * (365 / 225);    // ~1.62x mais rápido que a Terra
    angleEarth   += 0.002;                  // 1x
    angleMars    += 0.002 * (365 / 687);    // ~0.53x mais lento que a Terra
    angleJupiter += 0.02 * (365 / 4333);   // ~0.084x mais lento que a Terra
    angleSaturn  += 0.02 * (365 / 10759);  // ~0.0339x mais lento que a Terra
    angleUranus  += 0.02 * (365 / 30687);  // ~0.0118x mais lento que a Terra
    angleNeptune += 0.02 * (365 / 60190);  // ~0.0061x mais lento que a Terra
    
    orbit.rotation.y = angleEarth;
    orbit2.rotation.y = angleVenus;
    orbit3.rotation.y = angleMercury;
    orbit4.rotation.y = angleMars;
    orbit5.rotation.y = angleJupiter;
    orbit6.rotation.y = angleSaturn;
    orbit7.rotation.y = angleUranus;
    orbit8.rotation.y = angleNeptune;

    // Rotação da própria Terra
    earth.rotation.y += 0.002;
    venus.rotation.y += 0.004;
    mercury.rotation.y += 0.006;
    mars.rotation.y += 0.008;
    jupiter.rotation.y = 0.010;
    saturn.rotation.y = 0.012;
    uranus.rotation.y = 0.014;
    neptune.rotation.y = 0.016;

    renderer.render(scene, camera);
    
}
function createOrbitLine(radius) {
    const points = [];
    const segments = 100;
    for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(
            Math.cos(theta) * radius,
            0,
            Math.sin(theta) * radius
        ));
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const orbitMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent : true, opacity: 0.1 });
    const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
    scene.add(orbitLine);
}
// Criando as linhas de órbita para cada planeta
createOrbitLine(10); // Mercúrio
createOrbitLine(15); // Vênus
createOrbitLine(20); // Terra
createOrbitLine(25); // Marte
createOrbitLine(30); // Júpiter
createOrbitLine(45); // Saturno
createOrbitLine(50); // Urano
createOrbitLine(55); // Netuno

animate();