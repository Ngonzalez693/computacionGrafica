/* 
Based on Youtube video Aprende Three JS 🕋 3D en la web con JavaScript #1
And class
https://www.youtube.com/watch?v=BdORf7fP9aQ

Created by Nicolás on 30/08/23
Updated on 31/08/23

*/

// Initialize vars

let scene = null,
    camera = null,
    renderer = null,
    cube = null,
    controls = null,
    light = null;

function createThreeJs() {

    //Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);

    // Create camera view
    camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    camera.position.set(20, 5, 0);

    // Create render in objects.html "app"
    renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("app") });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    // Create grid
    const size = 60;
    const divisions = 60;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    createLights("AmbientLight");
    createLights("PointLight");

    //loadObjMtl("../models/OBJ_MTL/personaje/", "FunkoTOTORO-0.mtl", "FunkoTOTORO-0.obj");

    // Call animate() function
    animate();

    createCollectibles(10);
    gameStates("")
}

function loadObjMtl(path, nameMTL, nameOBJ) {
    //1. Load MTL (texture)
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setResourcePath(path); // Ruta de la carpeta de los modelos
    mtlLoader.setPath(path);
    mtlLoader.load(nameMTL, function (materials) {
        materials.preload();

        //2. Load OBJ (mesh)
        var objLoader = new THREE.OBJLoader();
        objLoader.setPath(path);
        objLoader.setMaterials(materials);
        objLoader.load(nameOBJ, function (object) {
            scene.add(object);
        });
    });
}

loadGLTF();

function loadGLTF() {
    // Instantiate a loader
    const loader = new THREE.GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('../models/GLTF/');
    loader.setDRACOLoader(dracoLoader);

    // Load a glTF resource
    loader.load(
        // resource URL
        '../models/GLTF/Duck.gltf',
        // called when the resource is loaded
        function (gltf) {

            scene.add(gltf.scene);

            gltf.animations; // Array<THREE.AnimationClip>
            gltf.scene; // THREE.Group
            gltf.scenes; // Array<THREE.Group>
            gltf.cameras; // Array<THREE.Camera>
            gltf.asset; // Object

        },
        // called while loading is progressing
        function (xhr) {

            console.log((xhr.loaded / xhr.total * 100) + '% loaded');

        },
        // called when loading has errors
        function (error) {

            console.log('An error happened');

        }
    );
}

function createCollectibles(quantity) {

    var min = -8
    var max = 8

    for (var i = 0; i < quantity; i++) {
        var texture = new THREE.TextureLoader().load("../img/collectible.jpg")

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: texture
        });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.set(Math.floor(Math.random() * (max - min + 1) + min), 0.5, Math.floor(Math.random() * (max - min + 1) + min));
    }
}

function gameStates(caseSituation) {
    //game, win, lose
    switch (caseSituation) {
        case "win":
            document.getElementById("winnerScreen").style.display = "block";
            break;

        case "lost":
            document.getElementById("loserScreen").style.display = "block";
            break;

        default:
            document.getElementById("winnerScreen").style.display = "none";
            document.getElementById("loserScreen").style.display = "none";
    }
}

/*function createGeometry() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: (73, 132, 221) });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
}*/

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

}

window.addEventListener('resize', onWindowResize, false);

// To make the gridHelper size as the window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = createThreeJs;

// Array to make the tower
let towers = [];
const towerSpacingX = 2;
const cubeSize = 1;


function createCubes() {
    // Get the number in cube-count
    const cubeCount = parseInt(document.getElementById("count").value);

    const towerGroup = new THREE.Group();


    for (let i = 0; i < cubeCount; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        //const material = new THREE.MeshBasicMaterial({ color: (73, 132, 221),
        //                                                opacity : 0.5,
        //                                                transparent: true,
        //                                                wireframe: false });

        //const material = new THREE.MeshlambertMaterial({ color: (73, 132, 221),
        //                                                    emissive: 0xff0000,
        //                                                    emissiveIntensity: 0.5})

        const material = new THREE.MeshStandardMaterial({
            color: (255, 255, 255),
            roughness: 0.5,
            metalness: 0.2
        })

        const cubeClone = new THREE.Mesh(geometry, material);
        cubeClone.position.set(0, i * cubeSize, 0);

        towerGroup.add(cubeClone);
    }

    towers.push(towerGroup);
    scene.add(towerGroup);

    for (let i = 0; i < towers.length; i++) {
        towers[i].position.x = i * towerSpacingX;
    }

    document.getElementById("count").value = "";

    renderer.render(scene, camera);
}

function createLights(typeLight) {
    // PointLight, AmbientLight, SpotLight
    switch (typeLight) {
        case "PointLight":
            light = new THREE.PointLight(0xFFFFFF, 1, 100);
            light.position.set(0, 10, 0);
            scene.add(light);

            const sphereSize = 1;
            const pointLightHelper = new THREE.PointLightHelper(light, sphereSize);
            //scene.add(pointLightHelper);
            break;

        case "AmbientLight":
            light = new THREE.AmbientLight(0x404040); // soft white light
            scene.add(light);
            break;

        case "SpotLight":
            light = new THREE.SpotLight(0xffffff);
            light.position.set(100, 100, 100);
            scene.add(light)

        /*const spotLightHelper = new THREE.SpotLightHelper(light);
        scene.add(spotLightHelper);
        break;*/
    }
}