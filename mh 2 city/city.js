<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>mh2 city x</title>

<style>

body{
    margin:0;
    overflow:hidden;
    font-family:Arial;
    background:#000;
}

canvas{
    display:block;
}

#info{
    position:fixed;
    top:15px;
    left:15px;
    color:#ffffff;
    z-index:100;
    background:rgba(0,0,0,0.5);
    padding:10px 15px;
    border-radius:10px;
    backdrop-filter:blur(10px);
}

</style>
</head>

<body>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134/examples/js/loaders/GLTFLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134/examples/js/loaders/FontLoader.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.134/examples/js/geometries/TextGeometry.js"></script>

<script>

// ====================== SCENE ======================

const scene = new THREE.Scene();

// FULL BLACK BACKGROUND
scene.background = new THREE.Color(0x00ccff);

// BLACK FOG
scene.fog = new THREE.Fog(0x000000, 50, 400);


// ====================== CAMERA ======================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

camera.position.set(0,8,30);

// ====================== RENDERER ======================

const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

// ====================== LIGHT ======================

scene.add(new THREE.AmbientLight(0xffffff,0.7));

const sun = new THREE.DirectionalLight(0xffffff,1.5);

sun.position.set(100,150,100);

sun.castShadow = true;

scene.add(sun);

// ====================== SUN ======================

const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(12,32,32),
    new THREE.MeshBasicMaterial({
        color:0xffff66
    })
);

sunMesh.position.set(120,120,-100);

scene.add(sunMesh);
// ====================== GROUND ======================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(5000,5000),
    new THREE.MeshStandardMaterial({
        color:0x000000,
        roughness:1,
        metalness:0
    })
);

ground.rotation.x = -Math.PI / 2;

ground.position.y = -0.1;

ground.receiveShadow = true;

scene.add(ground);


// ====================== CONTROLS ======================

let yaw = 0;
let pitch = 0;

let dragging = false;

document.addEventListener("mousedown",()=>{
    dragging = true;
});

document.addEventListener("mouseup",()=>{
    dragging = false;
});

document.addEventListener("mousemove",(e)=>{

    if(!dragging) return;

    yaw -= e.movementX * 0.0025;
    pitch -= e.movementY * 0.0025;

    pitch = Math.max(-1.4,Math.min(1.4,pitch));

});






// ================= IMAGE FRAME =================

const frameGroup = new THREE.Group();


const frame = new THREE.Mesh(
    new THREE.BoxGeometry(12,12,3),
    new THREE.MeshStandardMaterial({
        color:0xf1f1f,
        metalness:1,
        roughness:0.2
    })
);

frameGroup.add(frame);

// ================= IMAGE =================
const textureLoader = new THREE.TextureLoader();

textureLoader.load(
'mm.jpg',
function(texture){

    const imagePlace = new THREE.Mesh(
        new THREE.PlaneGeometry(10,10),
        new THREE.MeshBasicMaterial({
            map:texture
        })
    );

    imagePlace.position.z = 1.7;

    frameGroup.add(imagePlace);

});

frameGroup.position.set(17,51,-1);

frameGroup.rotation.y = 0;
scene.add(frameGroup);









// ====================== KEYBOARD ======================

const keys = {};

window.addEventListener("keydown",(e)=>{
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener("keyup",(e)=>{
    keys[e.key.toLowerCase()] = false;
});

// ====================== SMOOTH MOVEMENT ======================

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// ====================== GLB LOADER ======================

const loader = new THREE.GLTFLoader();

// ====================== CAR ======================

loader.load(
    "bmw2.glb",
    function(gltf){

        const car = gltf.scene;

        car.scale.set(3,3,3);

        car.position.set(-25,5,-2);

        scene.add(car);

    }
);

loader.load(
    "bmw2.glb",
    function(gltf){

        const car = gltf.scene;

        car.scale.set(3,3,3);

        car.position.set(68,5,-6);

        scene.add(car);

    }
);

loader.load(
    "airkf.glb",
    function(gltf){

        const car = gltf.scene;

        car.scale.set(3,3,3);

        car.position.set(55,5,-6);

        scene.add(car);

    }
);



// ====================== FUTURE PLACE ======================

loader.load(
    "future.glb",
    function(gltf){

        const city = gltf.scene;

        city.scale.set(18,18,18);

        city.position.set(20,5,-50);

        scene.add(city);

    }
);


// ====================== FUTURE PLACE ======================

loader.load(
    "free.glb",
    function(gltf){

        const city = gltf.scene;

        city.scale.set(1,1,1);

        city.position.set(100,5,-150);

        scene.add(city);

    }
);






// ====================== 3D TEXT ======================

const fontLoader = new THREE.FontLoader();

fontLoader.load(
'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
function(font){

    const geo = new THREE.TextGeometry(
        "MH HRIDOY",
        {
            font:font,
            size:20,
            height:5,
            curveSegments:12,
            bevelEnabled:true,
            bevelThickness:0.3,
            bevelSize:0.2,
            bevelSegments:5
        }
    );

    geo.center();

    const mat = new THREE.MeshStandardMaterial({
        color:0x00ff88,
        emissive:0x00ff88,
        emissiveIntensity:0.5,
        metalness:0.7,
        roughness:0.2
    });

    const text = new THREE.Mesh(geo,mat);

    text.position.set(-10,10,25);

    text.castShadow = true;

    scene.add(text);

}
);

// ====================== STARS ======================

const starGeo = new THREE.BufferGeometry();

const starCount = 3000;

const positions = [];

for(let i=0;i<starCount;i++){

    positions.push(
        (Math.random()-0.5)*2000,
        Math.random()*1000,
        (Math.random()-0.5)*2000
    );

}

starGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions,3)
);

const starMat = new THREE.PointsMaterial({
    color:0xffffff,
    size:1
});

const stars = new THREE.Points(starGeo,starMat);

scene.add(stars);

// ====================== ANIMATE ======================

function animate(){

    requestAnimationFrame(animate);

    // ===== FORWARD & RIGHT =====

    const forward = new THREE.Vector3(
        Math.sin(yaw),
        0,
        Math.cos(yaw)
    );

    const right = new THREE.Vector3(
        Math.sin(yaw + Math.PI/2),
        0,
        Math.cos(yaw + Math.PI/2)
    );

    direction.set(0,0,0);

    if(keys["w"]) direction.sub(forward);
    if(keys["s"]) direction.add(forward);

    if(keys["a"]) direction.sub(right);
    if(keys["d"]) direction.add(right);

    if(keys["arrowup"]) direction.y += 1;
    if(keys["arrowdown"]) direction.y -= 1;

    // ===== SMOOTH =====

    if(direction.length() > 0){

        direction.normalize();

        velocity.lerp(direction.multiplyScalar(0.9),0.08);

    }else{

        velocity.lerp(new THREE.Vector3(0,0,0),0.08);

    }

    camera.position.add(velocity);

    // ===== CAMERA ROTATION =====

    if(keys["arrowleft"]) yaw += 0.025;
    if(keys["arrowright"]) yaw -= 0.025;

    camera.rotation.order = "YXZ";

    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    // ===== SUN ROTATE =====

    sunMesh.rotation.y += 0.002;

    renderer.render(scene,camera);

}

animate();

// ====================== RESIZE ======================

window.addEventListener("resize",()=>{

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);

});

</script>

</body>
</html>
