import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("#earthScene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b14);
scene.fog = new THREE.FogExp2(0x050b14, 0.0018);

const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 1200);
camera.position.set(0, 72, 168);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableZoom = false;
controls.enablePan = false;
controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;
controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
controls.minDistance = 56;
controls.maxDistance = 230;
controls.target.set(0, 0, 0);

const ui = {
  app: document.querySelector(".flight-app"),
  loading: document.querySelector("#loadingState"),
  navToggle: document.querySelector("#navToggle"),
  cityList: document.querySelector("#cityList"),
  landmarkCount: document.querySelector("#landmarkCount"),
  speedRange: document.querySelector("#speedRange"),
  tourButton: document.querySelector("#tourButton"),
  homeButton: document.querySelector("#homeButton"),
  nightButton: document.querySelector("#nightButton")
};

const EARTH_RADIUS = 52;
const DRONE_ALTITUDE = 15;
const LABEL_DISTANCE = 42;
const textureUrls = {
  day: "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  bump: "https://threejs.org/examples/textures/planets/earth_bump_2048.jpg",
  specular: "https://threejs.org/examples/textures/planets/earth_specular_2048.jpg",
  night: "https://threejs.org/examples/textures/planets/earth_lights_2048.png",
  clouds: "https://threejs.org/examples/textures/planets/earth_clouds_1024.png"
};

const typeColors = {
  ancient: "#ffd76a",
  city: "#72b6ff",
  mountain: "#8ee88d",
  water: "#4fe0cf",
  desert: "#f0b56a",
  ice: "#d8f4ff",
  sacred: "#ff8fb0",
  nature: "#b7e46f"
};

const landmarks = [
  { region: "亞洲", place: "萬里長城", country: "中國", lat: 40.4319, lon: 116.5704, type: "ancient" },
  { region: "亞洲", place: "泰姬瑪哈陵", country: "印度", lat: 27.1751, lon: 78.0421, type: "sacred" },
  { region: "亞洲", place: "吳哥窟", country: "柬埔寨", lat: 13.4125, lon: 103.867, type: "ancient" },
  { region: "亞洲", place: "富士山", country: "日本", lat: 35.3606, lon: 138.7274, type: "mountain" },
  { region: "亞洲", place: "東京晴空塔", country: "日本", lat: 35.7101, lon: 139.8107, type: "city" },
  { region: "亞洲", place: "台北 101", country: "台灣", lat: 25.0339, lon: 121.5645, type: "city" },
  { region: "亞洲", place: "婆羅浮屠", country: "印尼", lat: -7.6079, lon: 110.2038, type: "sacred" },
  { region: "亞洲", place: "下龍灣", country: "越南", lat: 20.9101, lon: 107.1839, type: "water" },
  { region: "亞洲", place: "喜馬拉雅聖母峰", country: "尼泊爾/中國", lat: 27.9881, lon: 86.925, type: "mountain" },
  { region: "亞洲", place: "帕穆卡麗棉堡", country: "土耳其", lat: 37.9137, lon: 29.1187, type: "water" },
  { region: "亞洲", place: "佩特拉古城", country: "約旦", lat: 30.3285, lon: 35.4444, type: "ancient" },
  { region: "亞洲", place: "杜拜哈里發塔", country: "阿聯", lat: 25.1972, lon: 55.2744, type: "city" },
  { region: "歐洲", place: "艾菲爾鐵塔", country: "法國", lat: 48.8584, lon: 2.2945, type: "city" },
  { region: "歐洲", place: "羅馬競技場", country: "義大利", lat: 41.8902, lon: 12.4922, type: "ancient" },
  { region: "歐洲", place: "聖家堂", country: "西班牙", lat: 41.4036, lon: 2.1744, type: "sacred" },
  { region: "歐洲", place: "巨石陣", country: "英國", lat: 51.1789, lon: -1.8262, type: "ancient" },
  { region: "歐洲", place: "雅典衛城", country: "希臘", lat: 37.9715, lon: 23.7257, type: "ancient" },
  { region: "歐洲", place: "聖瓦西里主教座堂", country: "俄羅斯", lat: 55.7525, lon: 37.6231, type: "sacred" },
  { region: "歐洲", place: "冰島藍湖", country: "冰島", lat: 63.8804, lon: -22.4495, type: "water" },
  { region: "歐洲", place: "馬特洪峰", country: "瑞士/義大利", lat: 45.9763, lon: 7.6586, type: "mountain" },
  { region: "歐洲", place: "新天鵝堡", country: "德國", lat: 47.5576, lon: 10.7498, type: "ancient" },
  { region: "歐洲", place: "布拉格查理大橋", country: "捷克", lat: 50.0865, lon: 14.4114, type: "city" },
  { region: "非洲", place: "吉薩金字塔", country: "埃及", lat: 29.9792, lon: 31.1342, type: "ancient" },
  { region: "非洲", place: "撒哈拉沙漠", country: "北非", lat: 23.4162, lon: 25.6628, type: "desert" },
  { region: "非洲", place: "維多利亞瀑布", country: "尚比亞/辛巴威", lat: -17.9243, lon: 25.8572, type: "water" },
  { region: "非洲", place: "乞力馬扎羅山", country: "坦尚尼亞", lat: -3.0674, lon: 37.3556, type: "mountain" },
  { region: "非洲", place: "桌山", country: "南非", lat: -33.9628, lon: 18.4098, type: "mountain" },
  { region: "非洲", place: "塞倫蓋蒂草原", country: "坦尚尼亞", lat: -2.3333, lon: 34.8333, type: "nature" },
  { region: "非洲", place: "馬拉喀什傑馬夫納廣場", country: "摩洛哥", lat: 31.6258, lon: -7.9892, type: "city" },
  { region: "北美洲", place: "自由女神像", country: "美國", lat: 40.6892, lon: -74.0445, type: "city" },
  { region: "北美洲", place: "大峽谷", country: "美國", lat: 36.1069, lon: -112.1129, type: "desert" },
  { region: "北美洲", place: "黃石大稜鏡溫泉", country: "美國", lat: 44.5251, lon: -110.8382, type: "water" },
  { region: "北美洲", place: "優勝美地半圓頂", country: "美國", lat: 37.746, lon: -119.5329, type: "mountain" },
  { region: "北美洲", place: "金門大橋", country: "美國", lat: 37.8199, lon: -122.4783, type: "city" },
  { region: "北美洲", place: "尼加拉瀑布", country: "美國/加拿大", lat: 43.0962, lon: -79.0377, type: "water" },
  { region: "北美洲", place: "奇琴伊察", country: "墨西哥", lat: 20.6843, lon: -88.5678, type: "ancient" },
  { region: "北美洲", place: "哈瓦那舊城", country: "古巴", lat: 23.1367, lon: -82.3589, type: "city" },
  { region: "南美洲", place: "馬丘比丘", country: "秘魯", lat: -13.1631, lon: -72.545, type: "ancient" },
  { region: "南美洲", place: "基督救世主像", country: "巴西", lat: -22.9519, lon: -43.2105, type: "sacred" },
  { region: "南美洲", place: "伊瓜蘇瀑布", country: "巴西/阿根廷", lat: -25.6953, lon: -54.4367, type: "water" },
  { region: "南美洲", place: "烏尤尼鹽沼", country: "玻利維亞", lat: -20.1338, lon: -67.4891, type: "desert" },
  { region: "南美洲", place: "加拉巴哥群島", country: "厄瓜多", lat: -0.9538, lon: -90.9656, type: "nature" },
  { region: "南美洲", place: "巴塔哥尼亞菲茨羅伊峰", country: "阿根廷", lat: -49.2712, lon: -73.0433, type: "mountain" },
  { region: "大洋洲", place: "雪梨歌劇院", country: "澳洲", lat: -33.8568, lon: 151.2153, type: "city" },
  { region: "大洋洲", place: "烏魯魯", country: "澳洲", lat: -25.3444, lon: 131.0369, type: "desert" },
  { region: "大洋洲", place: "大堡礁", country: "澳洲", lat: -18.2871, lon: 147.6992, type: "water" },
  { region: "大洋洲", place: "米佛峽灣", country: "紐西蘭", lat: -44.6414, lon: 167.8974, type: "water" },
  { region: "大洋洲", place: "復活節島摩艾", country: "智利", lat: -27.1127, lon: -109.3497, type: "ancient" },
  { region: "極地", place: "南極冰原", country: "南極洲", lat: -75.2509, lon: 0.0714, type: "ice" },
  { region: "極地", place: "格陵蘭冰峽灣", country: "格陵蘭", lat: 69.2198, lon: -51.0986, type: "ice" }
];

const earthGroup = new THREE.Group();
const markerGroup = new THREE.Group();
const routeGroup = new THREE.Group();
const labelSprites = [];
const landmarkObjects = new Map();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const keyState = new Set();
const clock = new THREE.Clock();
let earthMesh;
let nightMesh;
let cloudMesh;
let drone;
let selected = null;
let autoTour = false;
let tourIndex = 0;
let tourClock = 0;
let isNight = false;
let speedMultiplier = 1;
let pointerStart = null;
let isPointerInteracting = false;

const cameraGoal = {
  position: camera.position.clone(),
  target: controls.target.clone()
};

scene.add(earthGroup, markerGroup, routeGroup);

const sun = new THREE.DirectionalLight(0xffffff, 3.4);
sun.position.set(-90, 58, 96);
sun.castShadow = true;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xcfe9ff, 0x172231, 1.8));

function latLonToVector3(lat, lon, radius = EARTH_RADIUS) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function loadTexture(url, fallbackTexture) {
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  return new Promise((resolve) => {
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        resolve(texture);
      },
      undefined,
      () => resolve(fallbackTexture)
    );
  });
}

function makeFallbackEarthTexture(kind = "day") {
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext("2d");
  const ocean = ctx.createLinearGradient(0, 0, 0, 512);
  ocean.addColorStop(0, kind === "night" ? "#07121f" : "#0f4f8a");
  ocean.addColorStop(1, kind === "night" ? "#020710" : "#0c6aa1");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, 1024, 512);

  const continents = [
    [500, 180, 170, 70], [575, 285, 100, 135], [455, 305, 72, 118],
    [680, 190, 150, 75], [760, 255, 120, 86], [845, 350, 72, 58],
    [245, 175, 130, 85], [300, 275, 90, 140], [150, 170, 90, 52]
  ];
  continents.forEach(([x, y, w, h], i) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((i % 3 - 1) * 0.28);
    ctx.fillStyle = kind === "night" ? "rgba(255, 210, 120, 0.35)" : i % 3 === 0 ? "#4c8f57" : "#b6a46a";
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

async function buildEarth() {
  const fallbackDay = makeFallbackEarthTexture("day");
  const fallbackNight = makeFallbackEarthTexture("night");
  const [dayMap, bumpMap, specularMap, nightMap, cloudMap] = await Promise.all([
    loadTexture(textureUrls.day, fallbackDay),
    loadTexture(textureUrls.bump, null),
    loadTexture(textureUrls.specular, null),
    loadTexture(textureUrls.night, fallbackNight),
    loadTexture(textureUrls.clouds, null)
  ]);

  const geometry = new THREE.SphereGeometry(EARTH_RADIUS, 128, 96);
  const material = new THREE.MeshPhongMaterial({
    map: dayMap,
    bumpMap,
    bumpScale: 1.55,
    specularMap,
    specular: new THREE.Color(0x466d88),
    shininess: 18
  });
  earthMesh = new THREE.Mesh(geometry, material);
  earthMesh.receiveShadow = true;
  earthGroup.add(earthMesh);

  nightMesh = new THREE.Mesh(
    geometry.clone(),
    new THREE.MeshBasicMaterial({ map: nightMap, blending: THREE.AdditiveBlending, transparent: true, opacity: 0 })
  );
  nightMesh.scale.setScalar(1.003);
  earthGroup.add(nightMesh);

  if (cloudMap) {
    cloudMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.014, 96, 72),
      new THREE.MeshLambertMaterial({ map: cloudMap, transparent: true, opacity: 0.42, depthWrite: false })
    );
    earthGroup.add(cloudMesh);
  }

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS * 1.035, 96, 72),
    new THREE.MeshBasicMaterial({ color: 0x79c8ff, transparent: true, opacity: 0.13, side: THREE.BackSide })
  );
  earthGroup.add(atmosphere);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  for (let i = 0; i < 1200; i += 1) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(420 + Math.random() * 280);
    starPositions.push(v.x, v.y, v.z);
  }
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.85, sizeAttenuation: true })));
}

function box(w, h, d, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.08 })
  );
  mesh.castShadow = true;
  return mesh;
}

function cylinder(radius, height, color, segments = 28) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, height, segments),
    new THREE.MeshStandardMaterial({ color, roughness: 0.56, metalness: 0.04 })
  );
  mesh.castShadow = true;
  return mesh;
}

function cone(radius, height, color, segments = 5) {
  const mesh = new THREE.Mesh(
    new THREE.ConeGeometry(radius, height, segments),
    new THREE.MeshStandardMaterial({ color, roughness: 0.7 })
  );
  mesh.castShadow = true;
  return mesh;
}

function orientToSurface(group, normal) {
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal.clone().normalize());
}

function makeLandmarkModel(item) {
  const group = new THREE.Group();
  const surface = latLonToVector3(item.lat, item.lon, EARTH_RADIUS + 0.55);
  const normal = surface.clone().normalize();
  group.position.copy(surface);
  orientToSurface(group, normal);
  group.userData = item;
  const color = new THREE.Color(typeColors[item.type] || typeColors.nature);

  const marker = new THREE.Mesh(
    new THREE.TorusGeometry(1.18, 0.055, 8, 40),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.84 })
  );
  marker.rotation.x = Math.PI / 2;
  group.add(marker);

  if (item.type === "city") {
    group.add(box(0.8, 2.3, 0.8, 0x9fc7de), box(1.25, 1.25, 1, 0x7fb4d6));
    group.children[2].position.set(1.05, 0.62, 0);
    const spire = cone(0.28, 1.2, 0xffd76a, 4);
    spire.position.y = 2.95;
    group.add(spire);
  } else if (item.type === "ancient") {
    const base = box(2.15, 0.42, 1.55, 0xd1b37d);
    const cap = cone(1.1, 1.65, 0xc08f53, 4);
    cap.position.y = 1.0;
    group.add(base, cap);
  } else if (item.type === "mountain") {
    const peak = cone(1.35, 2.7, 0x6f8d6a, 5);
    const snow = cone(0.55, 0.7, 0xf5fbff, 5);
    snow.position.y = 2.08;
    group.add(peak, snow);
  } else if (item.type === "water") {
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(1.38, 40),
      new THREE.MeshStandardMaterial({ color: 0x39c7dc, roughness: 0.32, metalness: 0.08 })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.08;
    const spray = cylinder(0.06, 1.5, 0xd8f4ff, 10);
    spray.position.y = 0.85;
    group.add(pool, spray);
  } else if (item.type === "desert") {
    const dune = new THREE.Mesh(
      new THREE.SphereGeometry(1.35, 28, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: 0xd7a35c, roughness: 0.92 })
    );
    dune.scale.set(1.35, 0.45, 0.82);
    dune.position.y = 0.12;
    group.add(dune);
  } else if (item.type === "ice") {
    const ice = cone(1.2, 1.8, 0xd8f4ff, 6);
    ice.position.y = 0.8;
    group.add(ice);
  } else if (item.type === "sacred") {
    const body = cylinder(0.72, 1.65, 0xe5dfd2, 24);
    body.position.y = 0.82;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.78, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.52), body.material);
    dome.position.y = 1.7;
    group.add(body, dome);
  } else {
    const tree = cone(0.9, 1.9, 0x76bb63, 8);
    tree.position.y = 0.82;
    group.add(tree);
  }

  const beam = cylinder(0.024, 4.2, color.getHex(), 8);
  beam.material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.56 });
  beam.position.y = 2.1;
  group.add(beam);
  group.add(makeLandmarkLabel(item, color));

  markerGroup.add(group);
  landmarkObjects.set(item.place, group);
}

function makeLandmarkLabel(item, color) {
  const labelCanvas = document.createElement("canvas");
  const ctx = labelCanvas.getContext("2d");
  labelCanvas.width = 640;
  labelCanvas.height = 224;
  ctx.fillStyle = "rgba(5, 13, 23, 0.88)";
  roundRect(ctx, 22, 24, 596, 176, 26);
  ctx.fill();
  ctx.strokeStyle = `#${color.getHexString()}`;
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = "#f4f9ff";
  ctx.font = '700 48px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.place, 320, 82, 540);
  ctx.fillStyle = `#${color.getHexString()}`;
  ctx.font = '700 28px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.fillText(`${item.country}・${item.region}`, 320, 136, 540);

  const texture = new THREE.CanvasTexture(labelCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest: false }));
  sprite.position.y = 7.8;
  sprite.scale.set(12, 4.2, 1);
  sprite.renderOrder = 30;
  sprite.userData = { isLandmarkLabel: true, place: item.place, floatBase: 7.8, floatPhase: Math.random() * Math.PI * 2 };
  labelSprites.push(sprite);
  return sprite;
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function buildRoute() {
  const byRegion = ["亞洲", "歐洲", "非洲", "北美洲", "南美洲", "大洋洲", "極地"];
  const ordered = [...landmarks].sort((a, b) => byRegion.indexOf(a.region) - byRegion.indexOf(b.region));
  const points = ordered.map((item) => latLonToVector3(item.lat, item.lon, EARTH_RADIUS + 3.4));
  const curve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.22);
  const route = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 600, 0.075, 8, true),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.24 })
  );
  routeGroup.add(route);
}

function buildDrone() {
  drone = new THREE.Group();
  const body = box(1.6, 0.36, 1.0, 0xd8f4ff);
  const armX = box(3.4, 0.12, 0.12, 0x344b5e);
  const armZ = box(0.12, 0.12, 3.4, 0x344b5e);
  drone.add(body, armX, armZ);
  [[-1.8, 0, -1.8], [1.8, 0, -1.8], [-1.8, 0, 1.8], [1.8, 0, 1.8]].forEach(([x, y, z]) => {
    const rotor = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.035, 8, 32), new THREE.MeshBasicMaterial({ color: 0x4fe0cf, transparent: true, opacity: 0.72 }));
    rotor.position.set(x, y, z);
    rotor.rotation.x = Math.PI / 2;
    rotor.userData.isRotor = true;
    drone.add(rotor);
  });
  scene.add(drone);
  updateDrone();
}

function renderCityList() {
  ui.landmarkCount.textContent = `(${landmarks.length})`;
  ui.cityList.innerHTML = "";
  landmarks.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "city-button";
    button.dataset.place = item.place;
    button.innerHTML = `<span class="county-chip">${item.region}</span><span class="place-name">${item.place}</span>`;
    button.addEventListener("click", () => focusLandmark(item));
    ui.cityList.append(button);
  });
  updateActiveCity();
}

function updateActiveCity() {
  document.querySelectorAll(".city-button").forEach((button) => {
    button.classList.toggle("active", selected?.place === button.dataset.place);
  });
}

function focusLandmark(item) {
  selected = item;
  autoTour = false;
  ui.tourButton.classList.remove("active");
  const surface = latLonToVector3(item.lat, item.lon, EARTH_RADIUS);
  const normal = surface.clone().normalize();
  const tangentEast = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), normal);
  if (tangentEast.lengthSq() < 0.0001) tangentEast.set(1, 0, 0);
  tangentEast.normalize();
  const tangentNorth = new THREE.Vector3().crossVectors(normal, tangentEast).normalize();
  cameraGoal.target.copy(surface.clone().addScaledVector(normal, 2.5));
  cameraGoal.position.copy(surface)
    .addScaledVector(normal, DRONE_ALTITUDE + 9)
    .addScaledVector(tangentEast, 10)
    .addScaledVector(tangentNorth, 8);
  updateActiveCity();
}

function goHome() {
  selected = null;
  autoTour = false;
  ui.tourButton.classList.remove("active");
  if (window.innerWidth < 700) {
    cameraGoal.position.set(0, 118, 72);
  } else {
    cameraGoal.position.set(0, 72, 168);
  }
  cameraGoal.target.set(0, 0, 0);
  camera.position.copy(cameraGoal.position);
  controls.target.copy(cameraGoal.target);
  updateActiveCity();
}

function toggleNight() {
  isNight = !isNight;
  scene.background.set(isNight ? 0x030711 : 0x050b14);
  scene.fog.color.set(isNight ? 0x030711 : 0x050b14);
  sun.intensity = isNight ? 0.62 : 3.4;
  if (nightMesh) nightMesh.material.opacity = isNight ? 0.88 : 0;
  ui.nightButton.classList.toggle("active", isNight);
}

function handleKeyboard(delta) {
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward).normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = camera.position.clone().normalize();
  const amount = 28 * delta * speedMultiplier;
  const movement = new THREE.Vector3();
  if (keyState.has("ArrowUp") || keyState.has("KeyW")) movement.add(forward);
  if (keyState.has("ArrowDown") || keyState.has("KeyS")) movement.sub(forward);
  if (keyState.has("ArrowRight") || keyState.has("KeyD")) movement.add(right);
  if (keyState.has("ArrowLeft") || keyState.has("KeyA")) movement.sub(right);
  if (keyState.has("KeyE")) movement.add(up);
  if (keyState.has("KeyQ")) movement.sub(up);
  if (movement.lengthSq() > 0) {
    autoTour = false;
    ui.tourButton.classList.remove("active");
    movement.normalize().multiplyScalar(amount);
    cameraGoal.position.add(movement);
    cameraGoal.target.add(movement);
    constrainCameraGoal();
  }
}

function constrainCameraGoal() {
  const minRadius = EARTH_RADIUS + 8;
  const maxRadius = 238;
  const length = cameraGoal.position.length();
  if (length < minRadius) cameraGoal.position.setLength(minRadius);
  if (length > maxRadius) cameraGoal.position.setLength(maxRadius);
}

function syncCameraGoal() {
  cameraGoal.position.copy(camera.position);
  cameraGoal.target.copy(controls.target);
}

function handleWheel(event) {
  event.preventDefault();
  autoTour = false;
  ui.tourButton.classList.remove("active");
  syncCameraGoal();
  const direction = new THREE.Vector3();
  camera.getWorldDirection(direction);
  const distance = cameraGoal.position.distanceTo(cameraGoal.target);
  const wheelScale = -Math.min(2.8, Math.max(-2.8, event.deltaY / 120));
  const step = Math.max(2.2, distance * 0.08) * wheelScale * speedMultiplier;
  cameraGoal.position.addScaledVector(direction, step);
  constrainCameraGoal();
}

function handleRightDrag(event) {
  if (!pointerStart || event.buttons !== 2) return;
  const dx = event.clientX - pointerStart.x;
  const dy = event.clientY - pointerStart.y;
  pointerStart = { x: event.clientX, y: event.clientY, button: 2 };
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward).normalize();
  const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
  const up = camera.position.clone().normalize();
  const scale = 0.13 * speedMultiplier;
  const movement = right.multiplyScalar(-dx * scale).add(up.multiplyScalar(dy * scale));
  cameraGoal.position.add(movement);
  cameraGoal.target.add(movement);
  constrainCameraGoal();
}

function updateTour(delta) {
  if (!autoTour) return;
  tourClock += delta * speedMultiplier;
  if (tourClock > 4.8) {
    tourClock = 0;
    tourIndex = (tourIndex + 1) % landmarks.length;
    const item = landmarks[tourIndex];
    focusLandmark(item);
    autoTour = true;
    ui.tourButton.classList.add("active");
  }
}

function updateLabels() {
  labelSprites.forEach((label) => {
    const parent = label.parent;
    const worldPosition = new THREE.Vector3();
    parent.getWorldPosition(worldPosition);
    const near = camera.position.distanceTo(worldPosition) < LABEL_DISTANCE || selected?.place === label.userData.place;
    label.material.opacity = THREE.MathUtils.lerp(label.material.opacity, near ? 1 : 0, 0.12);
    label.position.y = label.userData.floatBase + Math.sin(clock.elapsedTime * 1.8 + label.userData.floatPhase) * 0.22;
  });
}

function updateDrone() {
  if (!drone) return;
  const normal = camera.position.clone().normalize();
  const dronePosition = camera.position.clone().lerp(controls.target, 0.34);
  if (dronePosition.length() < EARTH_RADIUS + 6) dronePosition.setLength(EARTH_RADIUS + 6);
  drone.position.copy(dronePosition);
  drone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
  drone.scale.setScalar(Math.max(0.42, Math.min(0.82, camera.position.length() / 220)));
  drone.children.forEach((child) => {
    if (child.userData.isRotor) child.rotation.z += 0.55;
  });
}

function resize() {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

function findLandmarkFromObject(object) {
  let current = object;
  while (current) {
    if (current.userData?.place) return current.userData;
    current = current.parent;
  }
  return null;
}

function pickLandmark(event) {
  if (!pointerStart || pointerStart.button === 2) return false;
  const moved = Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y);
  pointerStart = null;
  if (moved > 6) return false;
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects([...landmarkObjects.values()], true);
  const item = hits.map((hit) => findLandmarkFromObject(hit.object)).find(Boolean);
  if (item) {
    focusLandmark(item);
    return true;
  }
  return false;
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(0.05, clock.getDelta());
  if (!isPointerInteracting) {
    handleKeyboard(delta);
    updateTour(delta);
    camera.position.lerp(cameraGoal.position, 0.055);
    controls.target.lerp(cameraGoal.target, 0.065);
  }
  if (cloudMesh) cloudMesh.rotation.y += delta * 0.015;
  markerGroup.children.forEach((object) => {
    if (object.userData?.place) object.rotation.y += delta * 0.22;
  });
  controls.update();
  if (isPointerInteracting && pointerStart?.button !== 2) syncCameraGoal();
  updateLabels();
  updateDrone();
  renderer.render(scene, camera);
}

async function init() {
  await buildEarth();
  landmarks.forEach(makeLandmarkModel);
  buildRoute();
  buildDrone();
  renderCityList();
  goHome();
  resize();
  setTimeout(resize, 120);
  ui.loading.classList.add("hidden");
  animate();
}

ui.homeButton.addEventListener("click", goHome);
ui.navToggle.addEventListener("click", () => {
  const collapsed = ui.app.classList.toggle("nav-collapsed");
  ui.navToggle.setAttribute("aria-expanded", String(!collapsed));
  ui.navToggle.title = collapsed ? "展開地景清單" : "收合地景清單";
});
ui.nightButton.addEventListener("click", toggleNight);
ui.tourButton.addEventListener("click", () => {
  autoTour = !autoTour;
  ui.tourButton.classList.toggle("active", autoTour);
  if (autoTour) tourClock = 9;
});
ui.speedRange.addEventListener("input", () => {
  speedMultiplier = Number(ui.speedRange.value);
});

window.addEventListener("keydown", (event) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE"].includes(event.code)) {
    event.preventDefault();
  }
  keyState.add(event.code);
});
window.addEventListener("keyup", (event) => keyState.delete(event.code));
window.addEventListener("resize", resize);
new ResizeObserver(resize).observe(canvas);
renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerStart = { x: event.clientX, y: event.clientY, button: event.button };
  isPointerInteracting = true;
  autoTour = false;
  ui.tourButton.classList.remove("active");
  syncCameraGoal();
});
renderer.domElement.addEventListener("pointermove", handleRightDrag);
renderer.domElement.addEventListener("pointerup", (event) => {
  const picked = pickLandmark(event);
  isPointerInteracting = false;
  if (!picked) syncCameraGoal();
});
renderer.domElement.addEventListener("pointercancel", () => {
  pointerStart = null;
  isPointerInteracting = false;
  syncCameraGoal();
});
renderer.domElement.addEventListener("pointerleave", () => {
  if (!isPointerInteracting) return;
  pointerStart = null;
  isPointerInteracting = false;
  syncCameraGoal();
});
renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

init();
