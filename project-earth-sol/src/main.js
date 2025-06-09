import * as THREE from 'three';
import './style.css'; 
import { TrackballControls } from 'three/addons/controls/TrackballControls.js'; //Importa a classe TrackballControls, que permite orbitar a câmera ao redor de um ponto central.
import { FlyControls } from 'three/addons/controls/FlyControls.js'; //Importa a classe FlyControls, que permite controlar a câmera como se fosse um voo livre.

let scene, renderer, clock;
// Nossas duas câmeras: uma que simula a visão humana (perspectiva) e outra "plana", sem profundidade (ortográfica).
let perspectiveCamera, orthographicCamera;
let activeCamera;
let flyControls, trackballControls; // dois tipos de controle de câmera.
let activeControls;
let sun, earth, orbit;

// Guardam qual projeção ('perspective' ou 'orthographic') e qual controle ('fly' ou 'trackball') estão ativos.
let currentProjection = 'perspective';
let currentControls = 'fly';
const infoElement = document.getElementById('info');

function init() {
    // Inicia o relógio, que será usado para calcular o tempo entre cada quadro da animação (delta).
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('/earth.jpg');
    const sunTexture = textureLoader.load('/sun.jpg');
    const starsTexture = textureLoader.load('/stars.jpg');
    scene.background = starsTexture;

    const sunGeometry = new THREE.SphereGeometry(4, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const gridHelper = new THREE.GridHelper(60, 20, 0x888888, 0x444444);
    gridHelper.position.y = -4.5; 
    scene.add(gridHelper);

    const earthGeometry = new THREE.SphereGeometry(2, 32, 32);
    const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    
    orbit = new THREE.Object3D();
    orbit.add(earth);
    scene.add(orbit);
    earth.position.set(15, 0, 0); 
    
    // Calcula a proporção da tela (largura / altura) para evitar que a imagem fique distorcida.
    const aspect = window.innerWidth / window.innerHeight;
    
    // Cria a câmera de perspectiva (padrão). Parâmetros: campo de visão, proporção, distância mínima e máxima de renderização.
    perspectiveCamera = new THREE.PerspectiveCamera(75, aspect, 0.1, 2000);
    perspectiveCamera.position.set(0, 20, 35);

    // Define o tamanho da "caixa" de visão da câmera ortográfica.
    const frustumSize = 50;
    // Cria a câmera ortográfica. Os parâmetros definem os limites esquerdo, direito, superior e inferior da visão.
    orthographicCamera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2, 0.1, 2000
    );
    // Copia a posição da câmera perspectiva para a ortográfica, para que a transição seja suave.
    orthographicCamera.position.copy(perspectiveCamera.position);

    // Define a câmera de perspectiva como a câmera ativa no início.
    activeCamera = perspectiveCamera;

    flyControls = new FlyControls(activeCamera, renderer.domElement);
    flyControls.movementSpeed = 30;
    flyControls.rollSpeed = 0.5;
    // Exige que o usuário clique e arraste o mouse para mudar a direção da câmera, em vez de mover com o mouse livre.
    flyControls.dragToLook = true;

    trackballControls = new TrackballControls(activeCamera, renderer.domElement);
    trackballControls.rotateSpeed = 5.0;
    // Define o ponto central que a câmera irá orbitar. Neste caso, a posição do Sol.
    trackballControls.target = sun.position;

    // Define o controle de voo como o controle ativo no início.
    activeControls = flyControls;
    // Desabilita o controle de trackball para que não haja conflito.
    trackballControls.enabled = false;

  
    window.addEventListener('resize', onWindowResize); //Função executada quando a janela é redimensionada.
    window.addEventListener('keydown', onKeyDown); //Função executada quando uma tecla é pressionada.
    updateInfo();
}

/**
 * Atualiza o texto na div 'info' com o estado atual da câmera e da projeção.
 */
function updateInfo() {
    const cameraName = currentControls === 'fly' ? 'Voo (Fly)' : 'Trackball';
    const projectionName = currentProjection === 'perspective' ? 'Perspectiva' : 'Ortográfica';
    // Monta a string HTML e a insere no elemento 'infoElement'.
    infoElement.innerHTML = `
        <strong>Câmera:</strong> ${cameraName} | <strong>Projeção:</strong> ${projectionName}<br>
        [C] Trocar Câmera | [P] Perspectiva | [O] Ortográfica
    `;
}

/**
 * Alterna entre os controles de câmera (Fly e Trackball).
 */
function switchControls() {
    if (currentControls === 'fly') {
        currentControls = 'trackball';
        activeControls = trackballControls;
        // Desabilita um e habilita o outro.
        flyControls.enabled = false;
        trackballControls.enabled = true;
    } else {
        // Se era 'trackball', muda o estado para 'fly'.
        currentControls = 'fly';
        activeControls = flyControls;
        trackballControls.enabled = false;
        flyControls.enabled = true;
    }
    // Garante que o novo controle ativo esteja apontando para a câmera ativa no momento.
    activeControls.object = activeCamera;
    updateInfo();
}

/**
 * Alterna entre as projeções de câmera (Perspectiva e Ortográfica).
 */
function switchProjection(type) {
    // Se a projeção desejada já for a atual, não faz nada e sai da função.
    if (currentProjection === type) return;

    // Guarda uma referência da câmera que estava ativa antes da troca.
    const oldCamera = activeCamera;
    // Se a projeção for 'perspective', ativa a câmera de perspectiva; caso contrário, ativa a ortográfica.
    activeCamera = (type === 'orthographic') ? orthographicCamera : perspectiveCamera;
    currentProjection = type;
    
    activeCamera.position.copy(oldCamera.position);
    activeCamera.quaternion.copy(oldCamera.quaternion);

    // Atualiza os controles ativos para apontar para a nova câmera.
    flyControls.object = activeCamera;
    trackballControls.object = activeCamera;

    updateInfo();
}


/**
 * Função que é executada sempre que uma tecla é pressionada.
 * @param {KeyboardEvent} event - 
 */
function onKeyDown(event) {
    // O 'switch' verifica a tecla pressionada (convertida para maiúscula para não diferenciar 'c' de 'C').
    switch (event.key.toUpperCase()) {
        case 'C': switchControls(); break;
        case 'O': switchProjection('orthographic'); break;
        case 'P': switchProjection('perspective'); break;
    }
}

/**
 * Função executada quando a janela do navegador muda de tamanho.
 */
function onWindowResize() {
    
    const aspect = window.innerWidth / window.innerHeight; // Recalcula a proporção da tela.
    renderer.setSize(window.innerWidth, window.innerHeight); // Atualiza o tamanho do renderizador.

    // Atualiza a proporção da câmera de perspectiva para que a imagem não fique distorcida.
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    // Recalcula os limites da câmera ortográfica para manter a proporção e evitar distorção.
    const frustumSize = 50;
    orthographicCamera.left = frustumSize * aspect / -2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = frustumSize / -2;
    // Aplica a mudança na câmera ortográfica.
    orthographicCamera.updateProjectionMatrix();
}


function animate() {
    // Solicita que o navegador execute a função 'animate' novamente no próximo quadro.
    requestAnimationFrame(animate);
    // Obtém o tempo que passou (em segundos) desde a última vez que o loop foi executado.
    const delta = clock.getDelta();


    orbit.rotation.y += 0.005;
    earth.rotation.y += 0.01;

    activeControls.update(delta);

    renderer.render(scene, activeCamera);
}

init();
animate();