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

function timer() {
    var seconds = 60;
    var getPoints = document.getElementById("points")
    var workingTimer = document.getElementById("timer");

    var intervalId = setInterval(function () {
        if (seconds <= 0) {
            clearInterval(intervalId);
            workingTimer.textContent = "Timer: 0";

            var points = parseInt(getPoints.textContent.split(":")[1].trim());
            
            if (points > 10) {
                gameStates("win");
            } else {
                gameStates("lost");
            }
            return;
        }
        workingTimer.textContent = "Timer: " + seconds;
        seconds--;
    }, 1000);
}