import './style.css';
import * as THREE from 'three';
let scene, camera, renderer, cube;

const vertexShader = `
    uniform float u_time; //Variável uniforme para o tempo, para controlar a animação da rotação.

    void main() {
        float cx = cos(u_time), sx = sin(u_time); // Cosseno e seno para rotação em X.
        float cy = cos(u_time), sy = sin(u_time); // Cosseno e seno para rotação em Y.
        
        // Matriz 4x4 de rotação combinada (X seguida de Y).
        mat4 rotationMatrix = mat4(
            cy,     0.0,    sy,     0.0,
            sx*sy,  cx,     -sx*cy, 0.0,
            -cx*sy, sx,     cx*cy,  0.0,
            0.0,    0.0,    0.0,    1.0
        );

        vec4 rotatedPosition = rotationMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * rotatedPosition;
    }
`;

const fragmentShader = `
    uniform float u_time;

    void main() {
        // Calcula um fator de piscagem (blink_factor) baseado no tempo.
        // mod(u_time, 1.0) retorna o resto da divisão de u_time por 1.0, criando um ciclo entre 0.0 e 1.0.
        // step(0.5, ...) retorna 0.0 se o valor for menor que 0.5, e 1.0 se for maior ou igual, criando um efeito de "liga/desliga".
        float blink_factor = step(0.5, mod(u_time, 1.0));

        vec3 red = vec3(1.0, 0.0, 0.0);
        vec3 pink = vec3(1.0, 0.1, 0.8);

        // Interpola linearmente entre as cores vermelha e rosa com base no blink_factor.
        // Quando blink_factor é 0.0, usa a cor vermelha; quando é 1.0, usa a cor rosa.
        vec3 final_color = mix(red, pink, blink_factor);

        // Define a cor final do fragmento (pixel)
        gl_FragColor = vec4(final_color, 1.0);
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

    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    // Atualizar a uniform 'u_time' a cada quadro
    if (cube.material && cube.material.uniforms && cube.material.uniforms.u_time) {
        cube.material.uniforms.u_time.value = performance.now() * 0.001;
    }

    renderer.render(scene, camera);
}

init();