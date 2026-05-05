
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth/innerHeight,
    0.1,
    1000
);

camera.position.set(0,2,10);


const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);


scene.add(new THREE.AmbientLight(0xffffff,0.4));

const light = new THREE.PointLight(0xffffff,1);
light.position.set(10,20,10);
scene.add(light);

// ================= GROUND =================
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200,200),
    new THREE.MeshStandardMaterial({color:0x000CAD})
);

ground.rotation.x = -Math.PI/2;
ground.position.y = -2;
scene.add(ground);

// ================= STARS =================
const starGeo = new THREE.BufferGeometry();
const starCount = 3000;
const starPos = [];

for(let i=0;i<starCount;i++){
    starPos.push(
        (Math.random()-0.5)*200,
        (Math.random()-0.5)*200,
        (Math.random()-0.5)*200
    );
}

starGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPos,3)
);

const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({color:0xffffff,size:0.2})
);

scene.add(stars);

// ================= TEXT  =================
const fontLoader = new THREE.FontLoader();

fontLoader.load(
    'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
    function(font){

        const geo = new THREE.TextGeometry("MH HRIDOY",{
            font:font,
            size:8,
            height:3
        });

        const mat = new THREE.MeshStandardMaterial({
            color:0x00f600,
            metalness:0.0,
            roughness:1.0
        });

        const textMesh = new THREE.Mesh(geo,mat);
        textMesh.position.set(-4,0,0);

        scene.add(textMesh);
    }
);

// ================= 3D MODEL =================
let model;



let yaw = 0;
let pitch = 0;
let dragging = false;

document.addEventListener("mousedown", ()=> dragging = true);
document.addEventListener("mouseup", ()=> dragging = false);

document.addEventListener("mousemove",(e)=>{
    if(!dragging) return;

    yaw -= e.movementX * 0.002;
    pitch -= e.movementY * 0.002;

    pitch = Math.max(-1.5, Math.min(1.5, pitch));
});

// ================= KEYBOARD =================
const keys = {};

window.addEventListener("keydown",(e)=> keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup",(e)=> keys[e.key.toLowerCase()] = false);

// ================= MOVEMENT =================
function animate(){
    requestAnimationFrame(animate);

    const speed = 0.25;

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

    let move = new THREE.Vector3();

    if(keys["s"]) move.add(forward);
    if(keys["w"]) move.sub(forward);
    if(keys["a"]) move.sub(right);
    if(keys["d"]) move.add(right);

if(keys["arrowup"]) move.y += 1;     
if(keys["arrowdown"]) move.y -= 1;   




    move.normalize();

    camera.position.addScaledVector(move, speed);

const rotSpeed = 0.03;


if(keys["arrowleft"]) yaw += rotSpeed;
if(keys["arrowright"]) yaw -= rotSpeed;


if(keys["4"]) pitch += rotSpeed;
if(keys["1"]) pitch -= rotSpeed; 
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    renderer.render(scene,camera);
}
animate();





// ================= RESIZE =================
window.addEventListener("resize",()=>{
    camera.aspect = innerWidth/innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

