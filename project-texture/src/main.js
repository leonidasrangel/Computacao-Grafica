import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 12);
camera.lookAt(0, 0, 0);
const renderer = new THREE.WebGLRenderer();
document.getElementById('app').appendChild(renderer.domElement);
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enableRotate = true;
controls.enablePan = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Cria um carregador de texturas para carregar imagens como texturas
const textureLoader = new THREE.TextureLoader();

// texturas baixadas do site (ambientcg.com) 
const colorTexture = textureLoader.load('/src/texturas/BumpColor.png'); // Textura de cor/base
const displacementTexture = textureLoader.load('/src/texturas/Displacement_2.png'); // Textura de deslocamento
const normalGLTexture = textureLoader.load('/src/texturas/Normal_2.png'); // Textura de mapa normal

// Cria uma luz ambiente branca com intensidade baixa (0.2) para iluminar a cena uniformemente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 10, 100);
pointLight.position.set(3, 3, 0);
scene.add(pointLight);
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// Define um objeto com diferentes materiais para a esfera
const materials = {
  // Material padrão com cor cinza
  defaultColor: new THREE.MeshPhongMaterial({
    color: 0xD5C18C 
  }),
  // Material com mapa de relevo (bump map)
  bump: new THREE.MeshPhongMaterial({
    map: colorTexture, // Usa a textura de cor
    bumpMap: displacementTexture, // Usa a textura de deslocamento como mapa de relevo
  }),
  // Material com mapa normal
  normal: new THREE.MeshPhongMaterial({
    map: colorTexture, // Usa a textura de cor
    normalMap: normalGLTexture, // Usa a textura de mapa normal
  }),
  // Material com deslocamento e mapa normal
  displacement: new THREE.MeshPhongMaterial({
    map: colorTexture, // Usa a textura de cor
    displacementMap: displacementTexture, // Usa a textura de deslocamento
    displacementScale: 0.5, // Define a intensidade do deslocamento
    normalMap: normalGLTexture, // Usa a textura de mapa normal
  })
};

const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const sphere = new THREE.Mesh(sphereGeometry, materials.defaultColor);
sphere.position.set(0, 1, 0);
scene.add(sphere);

// Obtém o elemento <select> com ID 'mappingSelect' do HTML
const mappingSelect = document.getElementById('mappingSelect');
// Define o valor padrão do <select> como 'defaultColor'
mappingSelect.value = 'defaultColor';

// Adiciona um ouvinte de eventos para quando o valor do <select> mudar
mappingSelect.addEventListener('change', (event) => {
  // Obtém o valor selecionado no <select>
  const selectedMapping = event.target.value;
  // Atualiza o material da esfera para o material correspondente ao valor selecionado
  sphere.material = materials[selectedMapping];
  // Sinaliza que o material da esfera precisa ser atualizado para refletir as mudanças
  sphere.material.needsUpdate = true;
});

function animate() {
  requestAnimationFrame(animate);
  const time = Date.now() * 0.001; 

  pointLight.position.x = Math.cos(time) * 3; // Movimento circular em X
  pointLight.position.z = Math.sin(time) * 3; // Movimento circular em Z
  pointLight.position.y = 3; // Mantém Y fixo

  // Modula a intensidade da luz pontual com uma variação senoidal
  pointLight.intensity = 8 + Math.sin(time * 3) * 3;

  //sphere.rotation.y = time * 0.4;
  //sphere.rotation.x = time * 0.2;

  pointLightHelper.update();

  controls.update();

  renderer.render(scene, camera);

}

animate();