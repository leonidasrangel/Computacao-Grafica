import './style.css'; 
import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

let scene, renderer, clock;
let perspectiveCamera, orthographicCamera; // duas câmeras: uma que simula a visão humana (perspectiva) e outra "plana", sem profundidade (ortográfica).
let activeCamera;
let flyControls, trackballControls;
let activeControls;
let currentProjection = 'perspective';
let currentControls = 'fly';
const infoElement = document.getElementById('info');

function init() {
    // Inicia o relógio, que será usado para calcular o tempo entre cada quadro da animação (delta).
    clock = new THREE.Clock();
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x22223B);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const aspect = window.innerWidth / window.innerHeight; // Calcula a proporção da tela (largura / altura) para evitar que a imagem fique distorcida.
    
    // Cria a câmera de perspectiva (padrão). Parâmetros: campo de visão (FOV), proporção, distância mínima e máxima de renderização.
    perspectiveCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 2000);
    perspectiveCamera.position.set(0, 40, 100); // Define a posição inicial da câmera no espaço 3D (x, y, z).

    const frustumSize = 100; 
    // Cria a câmera ortográfica. Os parâmetros definem os limites esquerdo, direito, superior e inferior da visão.
    orthographicCamera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2, frustumSize * aspect / 2,
        frustumSize / 2, frustumSize / -2,
        0.1, 2000
    );
    // Copia a posição da câmera perspectiva para a ortográfica, para que a transição entre elas seja suave.
    orthographicCamera.position.copy(perspectiveCamera.position);

    activeCamera = perspectiveCamera; // Define a câmera de perspectiva como a câmera ativa no início.

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    // Cria uma luz direcional, que simula a luz do sol, vindo de uma direção específica.
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(50, 80, 100);
    scene.add(dirLight);

    
    const gridHelper = new THREE.GridHelper(500, 50, 0x4A4E69, 0x9A8C98);
    scene.add(gridHelper);

    const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
    // Cria um loop que se repete 50 vezes para criar 50 cubos.
    for (let i = 0; i < 50; i++) {
        const material = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
        const mesh = new THREE.Mesh(boxGeometry, material);
        mesh.position.set(
            (Math.random() - 0.5) * 400, // Posição X aleatória
            (Math.random()) * 50,         // Posição Y aleatória (acima do chão)
            (Math.random() - 0.5) * 400  // Posição Z aleatória
        );
        scene.add(mesh);
    }
    
    // esfera amarela para servir como um ponto de referência visual para o centro da órbita do Trackball.
    const centralPoint = new THREE.Mesh(
        new THREE.SphereGeometry(2, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0xFFD700 }) 
    );
    scene.add(centralPoint);

    flyControls = new FlyControls(activeCamera, renderer.domElement);
    flyControls.movementSpeed = 50;
    flyControls.rollSpeed = 0.5;
    flyControls.autoForward = false; // true = a câmera se move para frente automaticamente, false = não.
    flyControls.dragToLook = true; // true = clicar para mudar a direção, false = mover o mouse para mudar a direção.

    trackballControls = new TrackballControls(activeCamera, renderer.domElement);
    trackballControls.rotateSpeed = 3.0;
    trackballControls.target = centralPoint.position;
    
    // Define o controle de voo como o controle ativo no início.
    activeControls = flyControls;
    // Desabilita o controle de trackball para que não haja conflito.
    trackballControls.enabled = false;

    // Quando a janela for redimensionada, muda o tamanho do renderizador e atualiza as câmeras.
    window.addEventListener('resize', onWindowResize);
    // Adiciona um evento de teclado para detectar quando uma tecla é pressionada.
    window.addEventListener('keydown', onKeyDown);
    updateInfo();
}

/** * Atualiza o texto na div 'info' com o estado atual da câmera e da projeção. 
 */
function updateInfo() {
    const cameraName = currentControls === 'fly' ? 'Voo (Fly)' : 'Trackball';
    const projectionName = currentProjection === 'perspective' ? 'Perspectiva' : 'Ortográfica';
    infoElement.innerHTML = `
        <strong>Câmera:</strong> ${cameraName} | <strong>Projeção:</strong> ${projectionName}<br>
        Pressione [C] para Trocar Câmera | [P] Perspectiva | [O] Ortográfica
    `;
}

/** * Alterna entre os controles de câmera (Fly e Trackball). 
 */
function switchControls() {
    // Verifica qual controle está ativo no momento.
    if (currentControls === 'fly') {
        currentControls = 'trackball';
        activeControls = trackballControls;
        flyControls.enabled = false;
        trackballControls.enabled = true;
    } else {
        currentControls = 'fly';
        activeControls = flyControls;
        trackballControls.enabled = false;
        flyControls.enabled = true;
    }
    activeControls.object = activeCamera; 
    updateInfo();
}

/** * Alterna entre as projeções de câmera (Perspectiva e Ortográfica). 
 */
function switchProjection(type) {
    // Se a projeção desejada já for a atual, não faz nada e sai da função.
    if (currentProjection === type) return;
    if (type === 'orthographic') {
        activeCamera = orthographicCamera;
        // Atualiza a variável de estado da projeção.
        currentProjection = 'orthographic';
    } else {
        activeCamera = perspectiveCamera;
        currentProjection = 'perspective';
    }
    
    // Atualiza a referência da câmera em AMBOS os controles, para que saibam qual câmera manipular.
    activeControls.object = activeCamera;
    updateInfo();
}

/** * Função que é executada sempre que uma tecla é pressionada.
 * @param {KeyboardEvent} event - O objeto do evento, contendo informações como qual tecla foi pressionada.
 */
function onKeyDown(event) {
    switch (event.key.toUpperCase()) {
        case 'C':
            switchControls();
            break;
        case 'O':
            switchProjection('orthographic');
            break;
        case 'P':
            switchProjection('perspective');
            break;
    }
}

/** * Função executada quando a janela do navegador muda de tamanho. 
 */
function onWindowResize() {
    // Cálculo da proporção da tela.
    const aspect = window.innerWidth / window.innerHeight;

    // Atualiza a proporção da câmera de perspectiva.
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();

    // Recalcula os limites da câmera ortográfica para manter a proporção e evitar distorção.
    const frustumSize = 100;
    orthographicCamera.left = frustumSize * aspect / -2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = frustumSize / -2;
    orthographicCamera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {

    requestAnimationFrame(animate);

    // Obtém o tempo que passou (em segundos) desde a última vez que o loop foi executado.
    const delta = clock.getDelta();
    // O 'delta' é passado para que o movimento seja suave e independente da taxa de quadros do computador.
    activeControls.update(delta);
    renderer.render(scene, activeCamera);
}
init();
animate();