import './style.css'
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 4.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    // Luz ambiente branca
    const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(luzAmbiente);

    // Luz direcional amarela
    const luzDirecional = new THREE.DirectionalLight(0xffff00, 1);
    luzDirecional.position.set(1, 1, 1); // Posição da luz direcional x, y e z
    scene.add(luzDirecional);

    //const luzDirecionalHelper = new THREE.DirectionalLightHelper(luzDirecional, 0.5);
    //scene.add(luzDirecionalHelper);

    // Luzes coloridas que se movem e piscam
    const luzVermelha = new THREE.PointLight(0xff0000, 2, 10);
    const luzVerde = new THREE.PointLight(0x00ff00, 2, 10);
    const luzAzul = new THREE.PointLight(0x0000ff, 2, 10);
    scene.add(luzVermelha, luzVerde, luzAzul);

    scene.add(new THREE.PointLightHelper(luzVermelha, 0.07));
    scene.add(new THREE.PointLightHelper(luzVerde, 0.07));
    scene.add(new THREE.PointLightHelper(luzAzul, 0.07));

    // Objeto com LambertMaterial (iluminação difusa)
    const esfera = new THREE.Mesh(
      new THREE.SphereGeometry(1, 16, 16),
      new THREE.MeshLambertMaterial({ color: 0x4444ff, wireframe: false })
    );
    esfera.position.x = -2;
    scene.add(esfera);

    // Objeto com PhongMaterial (reflexão especular)
    const cubo = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 1.5, 1.5),
      new THREE.MeshPhongMaterial({ color: 0x287233, specular: 0xffffff, wireframe: false, shininess: 100 })
    );
    cubo.position.x = 2;
    scene.add(cubo);

    camera.position.z = 9;

    let tempo = 0;
    function animate() {
      requestAnimationFrame(animate);

      // Movimento circular simples
      tempo += 0.005;
      luzVermelha.position.set(Math.sin(tempo) * 3.5, 0.5, Math.cos(tempo) * 3);
      luzVerde.position.set(Math.sin(tempo + 2) * 3.5, 0.5, Math.cos(tempo + 2) * 3);
      luzAzul.position.set(Math.sin(tempo + 4) * 3.5, 0.5, Math.cos(tempo + 4) * 3);

      // Efeito de "piscar"
      luzVermelha.intensity = Math.abs(Math.sin(tempo * 20)) * 2;
      luzVerde.intensity = Math.abs(Math.sin(tempo * 20)) * 2;
      luzAzul.intensity = Math.abs(Math.sin(tempo * 20)) * 2;

      controls.update();

      renderer.render(scene, camera);
    }
    animate();