import * as THREE from 'three';
import './style.css'

// Exemplo básico de criação de uma cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criar parede da esquerda
const wallGeometry = new THREE.BoxGeometry(0.5, 5, 4);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
leftWall.position.set(-5, 1, 0);
scene.add(leftWall);

// Criar parede da direita
const rightWall = new THREE.Mesh(wallGeometry, wallMaterial.clone());
rightWall.position.set(5, 1, 0);
scene.add(rightWall);

// Criar esfera
const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const ball = new THREE.Mesh(ballGeometry, ballMaterial);
ball.position.set(0, 1, 0);
scene.add(ball);

let speedX = 0.1;


camera.position.z = 12;

function animate() {
  requestAnimationFrame(animate);

  // mover esfera
  ball.position.x += speedX;

  // colisão com as paredes
  if (ball.position.x >= rightWall.position.x - 0.4 || ball.position.x <= leftWall.position.x + 0.4) {
    speedX *= -1; // inverte a direção
  }

  renderer.render(scene, camera);
}

animate();
