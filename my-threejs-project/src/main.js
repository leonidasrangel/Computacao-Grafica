import * as THREE from 'three';

// Exemplo básico de criação de uma cena

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const axesHelper = new THREE.AxesHelper(7); //adicionando eixos na aplicaçao
scene.add(axesHelper); //comando para adicionar a cena dos eixos

// Crie um cubo simples
const geometry = new THREE.BoxGeometry(2, 2, 2,);
const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(-3, 2, 1);
scene.add(cube);

//criando esfera
const geometry1 = new THREE.SphereGeometry( 1, 32, 16 ); 
const material1 = new THREE.MeshBasicMaterial( { color: 0xff00ff } ); 
const sphere = new THREE.Mesh( geometry1, material1 ); 
//sphere.position.set(3, 2, 2);
scene.add( sphere );

//criando plane geometry

const geometry2 = new THREE.PlaneGeometry(3, 3);
const material2 = new THREE.MeshBasicMaterial({color: 0x00ff00});
const plane = new THREE.Mesh (geometry2, material2);
plane.position.set(3.5, 3, 1);
scene.add(plane);

camera.position.set(8, 6, 10);
camera.lookAt(0, 0, 0);

//camera.position.z = 10;
//camera.position.y = 1;
//camera.position.x = 1;


function animate() {
  requestAnimationFrame(animate);
  cube.rotation.z += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();
