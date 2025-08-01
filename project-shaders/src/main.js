import './style.css';
import * as THREE from 'three';
let scene, camera, renderer, cube;

// 1. Definir os Shaders em GLSL
const vertexShader = `
    void main() {
        // gl_Position é a posição final do vértice na tela
        // projectionMatrix * modelViewMatrix * vec4(position, 1.0)
        // faz as transformações de câmera e modelo no vértice
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float u_time; // Uma variável "uniform" para passar o tempo do JavaScript para o shader

    void main() {
        // Calcular as componentes RGB baseadas no tempo
        float r = sin(u_time * 0.5) * 0.5 + 0.5;
        float g = sin(u_time * 0.7) * 0.5 + 0.5;
        float b = sin(u_time * 0.9) * 0.5 + 0.5;

        // gl_FragColor é a cor final do pixel
        gl_FragColor = vec4(r, g, b, 1.0); // RGBA (1.0 para opacidade total)
    }
`;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Definir as uniforms (variáveis que passamos do JS para o shader)
    const uniforms = {
        u_time: { value: 0.0 } // Inicializa o tempo em 0
    };

    const material = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: uniforms // Passa as uniforms para o material
    });

    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Atualizar a uniform 'u_time' a cada quadro
    if (cube.material && cube.material.uniforms && cube.material.uniforms.u_time) {
        cube.material.uniforms.u_time.value = performance.now() * 0.001;
    }

    renderer.render(scene, camera);
}

init();