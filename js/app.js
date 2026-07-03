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
scene.fog = new THREE.FogExp2(0x050b14, 0.0009);

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
controls.minDistance = 3;
controls.maxDistance = 260;
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
const LABEL_SURFACE_DISTANCE = 7.5;
const PHOTO_SURFACE_DISTANCE = 4.8;
const MIN_CAMERA_RADIUS = EARTH_RADIUS + 2.15;
const MAX_CAMERA_RADIUS = 270;
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

const wikiTitleByPlace = {
  "萬里長城": "Great Wall of China",
  "泰姬瑪哈陵": "Taj Mahal",
  "吳哥窟": "Angkor Wat",
  "富士山": "Mount Fuji",
  "東京晴空塔": "Tokyo Skytree",
  "台北 101": "Taipei 101",
  "婆羅浮屠": "Borobudur",
  "下龍灣": "Hạ Long Bay",
  "喜馬拉雅聖母峰": "Mount Everest",
  "帕穆卡麗棉堡": "Pamukkale",
  "佩特拉古城": "Petra",
  "杜拜哈里發塔": "Burj Khalifa",
  "艾菲爾鐵塔": "Eiffel Tower",
  "羅馬競技場": "Colosseum",
  "聖家堂": "Sagrada Família",
  "巨石陣": "Stonehenge",
  "雅典衛城": "Acropolis of Athens",
  "聖瓦西里主教座堂": "Saint Basil's Cathedral",
  "冰島藍湖": "Blue Lagoon (geothermal spa)",
  "馬特洪峰": "Matterhorn",
  "新天鵝堡": "Neuschwanstein Castle",
  "布拉格查理大橋": "Charles Bridge",
  "吉薩金字塔": "Giza pyramid complex",
  "撒哈拉沙漠": "Sahara",
  "維多利亞瀑布": "Victoria Falls",
  "乞力馬扎羅山": "Mount Kilimanjaro",
  "桌山": "Table Mountain",
  "塞倫蓋蒂草原": "Serengeti",
  "馬拉喀什傑馬夫納廣場": "Jemaa el-Fnaa",
  "自由女神像": "Statue of Liberty",
  "大峽谷": "Grand Canyon",
  "黃石大稜鏡溫泉": "Grand Prismatic Spring",
  "優勝美地半圓頂": "Half Dome",
  "金門大橋": "Golden Gate Bridge",
  "尼加拉瀑布": "Niagara Falls",
  "奇琴伊察": "Chichen Itza",
  "哈瓦那舊城": "Old Havana",
  "馬丘比丘": "Machu Picchu",
  "基督救世主像": "Christ the Redeemer (statue)",
  "伊瓜蘇瀑布": "Iguazu Falls",
  "烏尤尼鹽沼": "Salar de Uyuni",
  "加拉巴哥群島": "Galápagos Islands",
  "巴塔哥尼亞菲茨羅伊峰": "Monte Fitz Roy",
  "雪梨歌劇院": "Sydney Opera House",
  "烏魯魯": "Uluru",
  "大堡礁": "Great Barrier Reef",
  "米佛峽灣": "Milford Sound",
  "復活節島摩艾": "Moai",
  "南極冰原": "Antarctic ice sheet",
  "格陵蘭冰峽灣": "Ilulissat Icefjord"
};

landmarks.forEach((item) => {
  item.wikiTitle = wikiTitleByPlace[item.place] || item.place;
});

const earthGroup = new THREE.Group();
const markerGroup = new THREE.Group();
const routeGroup = new THREE.Group();
const labelSprites = [];
const photoSprites = [];
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

  const space = new THREE.Mesh(
    new THREE.SphereGeometry(690, 64, 48),
    new THREE.MeshBasicMaterial({ map: makeSpaceTexture(), side: THREE.BackSide, depthWrite: false })
  );
  scene.add(space);

  const starGeometry = new THREE.BufferGeometry();
  const starPositions = [];
  const starColors = [];
  for (let i = 0; i < 2600; i += 1) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(250 + Math.random() * 430);
    starPositions.push(v.x, v.y, v.z);
    const warmth = Math.random();
    const color = new THREE.Color().setHSL(0.58 + warmth * 0.08, 0.22, 0.72 + Math.random() * 0.26);
    starColors.push(color.r, color.g, color.b);
  }
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  starGeometry.setAttribute("color", new THREE.Float32BufferAttribute(starColors, 3));
  scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({
    size: 0.92,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9
  })));
}

function makeSpaceTexture() {
  const spaceCanvas = document.createElement("canvas");
  spaceCanvas.width = 1536;
  spaceCanvas.height = 768;
  const ctx = spaceCanvas.getContext("2d");
  const bg = ctx.createRadialGradient(768, 380, 80, 768, 380, 760);
  bg.addColorStop(0, "#10213b");
  bg.addColorStop(0.42, "#071120");
  bg.addColorStop(1, "#02050d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, spaceCanvas.width, spaceCanvas.height);

  ctx.save();
  ctx.translate(768, 384);
  ctx.rotate(-0.18);
  const band = ctx.createLinearGradient(0, -170, 0, 170);
  band.addColorStop(0, "rgba(92, 144, 214, 0)");
  band.addColorStop(0.34, "rgba(116, 154, 214, 0.08)");
  band.addColorStop(0.5, "rgba(218, 231, 255, 0.18)");
  band.addColorStop(0.66, "rgba(116, 154, 214, 0.08)");
  band.addColorStop(1, "rgba(92, 144, 214, 0)");
  ctx.fillStyle = band;
  ctx.fillRect(-900, -170, 1800, 340);

  for (let i = 0; i < 360; i += 1) {
    const x = -760 + Math.random() * 1520;
    const y = -150 + (Math.random() - 0.5) * 280;
    const radius = 0.5 + Math.random() * 1.8;
    ctx.fillStyle = `rgba(210, 226, 255, ${0.08 + Math.random() * 0.22})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * spaceCanvas.width;
    const y = Math.random() * spaceCanvas.height;
    const radius = Math.random() < 0.92 ? 0.7 : 1.35;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.18 + Math.random() * 0.62})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(spaceCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
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

  buildLandmarkSilhouette(group, item);

  const beam = cylinder(0.024, 4.2, color.getHex(), 8);
  beam.material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.56 });
  beam.position.y = 2.1;
  group.add(beam);
  group.add(makeLandmarkLabel(item, color));
  group.add(makePhotoCard(item, color));

  markerGroup.add(group);
  landmarkObjects.set(item.place, group);
}

function buildLandmarkSilhouette(group, item) {
  const p = item.place;
  if (p.includes("長城")) return addGreatWall(group);
  if (p.includes("泰姬")) return addTajMahal(group);
  if (p.includes("吳哥") || p.includes("婆羅浮屠") || p.includes("奇琴")) return addSteppedTemple(group, p.includes("奇琴"));
  if (p.includes("富士") || p.includes("聖母峰") || p.includes("乞力馬扎羅") || p.includes("馬特洪") || p.includes("菲茨羅伊")) return addMountain(group, p);
  if (p.includes("晴空塔")) return addNeedleTower(group, 4.8, 0x9fd8f5);
  if (p.includes("台北 101")) return addTaipei101(group);
  if (p.includes("下龍灣") || p.includes("大堡礁") || p.includes("加拉巴哥")) return addIslandScene(group);
  if (p.includes("棉堡") || p.includes("藍湖") || p.includes("大稜鏡")) return addThermalPool(group, p.includes("大稜鏡"));
  if (p.includes("佩特拉")) return addPetraFacade(group);
  if (p.includes("哈里發")) return addNeedleTower(group, 6.1, 0xb9d7e8);
  if (p.includes("艾菲爾")) return addEiffelTower(group);
  if (p.includes("競技場")) return addColosseum(group);
  if (p.includes("聖家堂") || p.includes("聖瓦西里")) return addCathedral(group, p.includes("瓦西里"));
  if (p.includes("巨石陣")) return addStonehenge(group);
  if (p.includes("衛城")) return addAcropolis(group);
  if (p.includes("城堡")) return addCastle(group);
  if (p.includes("查理大橋") || p.includes("金門大橋")) return addBridge(group, p.includes("金門"));
  if (p.includes("金字塔")) return addPyramids(group);
  if (p.includes("撒哈拉") || p.includes("烏尤尼")) return addDesertOrSalt(group, p.includes("烏尤尼"));
  if (p.includes("瀑布")) return addWaterfall(group);
  if (p.includes("桌山") || p.includes("烏魯魯") || p.includes("大峽谷")) return addMesa(group, p);
  if (p.includes("草原")) return addSavanna(group);
  if (p.includes("自由女神")) return addLiberty(group);
  if (p.includes("半圓頂")) return addHalfDome(group);
  if (p.includes("哈瓦那") || p.includes("馬拉喀什")) return addOldTown(group);
  if (p.includes("馬丘比丘")) return addMachuPicchu(group);
  if (p.includes("基督救世主")) return addChristStatue(group);
  if (p.includes("歌劇院")) return addSydneyOpera(group);
  if (p.includes("米佛峽灣")) return addFjord(group);
  if (p.includes("摩艾")) return addMoai(group);
  if (p.includes("冰原") || p.includes("冰峽灣")) return addIce(group, p.includes("峽灣"));
  return addGenericByType(group, item);
}

function addGreatWall(group) {
  for (let i = -2; i <= 2; i += 1) {
    const wall = box(1.25, 0.34, 0.36, 0xb99366);
    wall.position.set(i * 0.78, 0.34 + Math.abs(i) * 0.05, Math.sin(i) * 0.5);
    wall.rotation.y = i * 0.24;
    group.add(wall);
  }
  [-2.1, 0, 2.1].forEach((x) => {
    const tower = box(0.52, 0.85, 0.52, 0xc4a06e);
    tower.position.set(x, 0.72, Math.sin(x) * 0.28);
    group.add(tower);
  });
}

function addTajMahal(group) {
  const base = box(2.7, 0.34, 1.75, 0xece5d8);
  base.position.y = 0.18;
  group.add(base);
  const body = box(1.35, 1.05, 1.05, 0xf4efe4);
  body.position.y = 0.88;
  group.add(body);
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.66, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), body.material);
  dome.position.y = 1.45;
  group.add(dome);
  [-1.18, 1.18].forEach((x) => {
    const minaret = cylinder(0.12, 1.7, 0xf3eadf, 18);
    minaret.position.set(x, 0.9, 0.64);
    group.add(minaret);
  });
}

function addSteppedTemple(group, tall = false) {
  const levels = tall ? 4 : 3;
  for (let i = 0; i < levels; i += 1) {
    const tier = box(2.5 - i * 0.42, 0.36, 1.8 - i * 0.32, 0xb8935b);
    tier.position.y = 0.18 + i * 0.34;
    group.add(tier);
  }
  const spire = cone(tall ? 0.55 : 0.34, tall ? 0.9 : 1.2, tall ? 0xcaa36a : 0x6e6f5b, tall ? 4 : 6);
  spire.position.y = levels * 0.35 + 0.48;
  group.add(spire);
}

function addMountain(group, place) {
  const baseColor = place.includes("富士") ? 0x58785d : 0x687466;
  const peak = cone(place.includes("馬特洪") || place.includes("菲茨") ? 1.05 : 1.42, place.includes("富士") ? 2.35 : 3.0, baseColor, place.includes("富士") ? 32 : 5);
  peak.position.y = place.includes("富士") ? 1.1 : 1.35;
  group.add(peak);
  const snow = cone(0.48, 0.74, 0xf4fbff, place.includes("富士") ? 32 : 5);
  snow.position.y = place.includes("富士") ? 2.18 : 2.65;
  group.add(snow);
}

function addNeedleTower(group, height, color) {
  const shaft = cylinder(0.18, height, color, 22);
  shaft.position.y = height / 2;
  group.add(shaft);
  const deck = cylinder(0.55, 0.18, 0xd8edf7, 24);
  deck.position.y = height * 0.72;
  group.add(deck);
  const spire = cone(0.16, 0.9, 0xffd76a, 18);
  spire.position.y = height + 0.45;
  group.add(spire);
}

function addTaipei101(group) {
  for (let i = 0; i < 8; i += 1) {
    const tier = box(0.94 - i * 0.045, 0.48, 0.94 - i * 0.045, 0x89b8c9);
    tier.position.y = 0.28 + i * 0.43;
    group.add(tier);
  }
  const spire = cone(0.22, 1.0, 0xffd76a, 4);
  spire.position.y = 4.08;
  group.add(spire);
}

function addIslandScene(group) {
  const water = new THREE.Mesh(new THREE.CircleGeometry(1.55, 44), new THREE.MeshStandardMaterial({ color: 0x2bb8c8, roughness: 0.28 }));
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.04;
  group.add(water);
  [-0.75, 0.1, 0.85].forEach((x, i) => {
    const island = cone(0.34 + i * 0.05, 0.95 + i * 0.22, 0x6c8b61, 7);
    island.position.set(x, 0.42 + i * 0.08, Math.sin(i) * 0.45);
    group.add(island);
  });
}

function addThermalPool(group, rainbow = false) {
  const colors = rainbow ? [0x1e88e5, 0x4fe0cf, 0xffd76a, 0xf07167] : [0x54d4ce, 0xc9f5ef, 0x85d7ff];
  colors.forEach((c, i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42 + i * 0.24, 0.055, 8, 48), new THREE.MeshStandardMaterial({ color: c, roughness: 0.2 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.08 + i * 0.015;
    group.add(ring);
  });
  const steam = cylinder(0.045, 1.15, 0xd8f4ff, 10);
  steam.position.y = 0.7;
  group.add(steam);
}

function addPetraFacade(group) {
  const cliff = box(2.45, 1.9, 0.35, 0xbb7657);
  cliff.position.y = 0.95;
  group.add(cliff);
  const door = box(0.42, 0.9, 0.08, 0x3a2630);
  door.position.set(0, 0.55, 0.2);
  group.add(door);
  [-0.62, -0.22, 0.22, 0.62].forEach((x) => {
    const column = cylinder(0.055, 1.05, 0xe2b48a, 10);
    column.position.set(x, 0.72, 0.23);
    group.add(column);
  });
  const pediment = cone(0.78, 0.58, 0xd39a72, 3);
  pediment.position.set(0, 1.48, 0.23);
  pediment.rotation.y = Math.PI / 2;
  group.add(pediment);
}

function addEiffelTower(group) {
  [-0.55, 0.55].forEach((x) => {
    [-0.38, 0.38].forEach((z) => {
      const leg = box(0.12, 2.2, 0.12, 0x8f7b61);
      leg.position.set(x * 0.58, 1.02, z * 0.58);
      leg.rotation.z = -x * 0.16;
      group.add(leg);
    });
  });
  [0.9, 1.65, 2.42].forEach((y, i) => {
    const deck = box(1.25 - i * 0.28, 0.12, 0.9 - i * 0.2, 0xb39a78);
    deck.position.y = y;
    group.add(deck);
  });
  const spire = cone(0.18, 1.1, 0xffd76a, 4);
  spire.position.y = 3.08;
  group.add(spire);
}

function addColosseum(group) {
  const outer = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.22, 12, 54), new THREE.MeshStandardMaterial({ color: 0xcaa983, roughness: 0.8 }));
  outer.scale.z = 0.62;
  outer.rotation.x = Math.PI / 2;
  outer.position.y = 0.44;
  group.add(outer);
  for (let i = 0; i < 12; i += 1) {
    const arch = box(0.07, 0.62, 0.12, 0xe0c39a);
    const a = (i / 12) * Math.PI * 2;
    arch.position.set(Math.cos(a) * 1.08, 0.64, Math.sin(a) * 0.68);
    arch.rotation.y = -a;
    group.add(arch);
  }
}

function addCathedral(group, onion = false) {
  const base = box(1.55, 0.72, 1.05, onion ? 0xc25145 : 0xd6c8b7);
  base.position.y = 0.36;
  group.add(base);
  [-0.52, 0, 0.52].forEach((x, i) => {
    const tower = cylinder(0.18, 1.35 + i * 0.3, onion ? 0xf2d4a5 : 0xdcd4c7, 10);
    tower.position.set(x, 0.95 + i * 0.14, 0);
    group.add(tower);
    const top = onion ? new THREE.Mesh(new THREE.SphereGeometry(0.25, 18, 12), new THREE.MeshStandardMaterial({ color: [0x61b4d9, 0xffd76a, 0x78c46f][i] })) : cone(0.18, 0.65, 0x8d9aae, 8);
    top.position.set(x, 1.72 + i * 0.28, 0);
    group.add(top);
  });
}

function addStonehenge(group) {
  for (let i = 0; i < 8; i += 1) {
    const a = (i / 8) * Math.PI * 2;
    const stone = box(0.22, 0.95, 0.28, 0x9b9888);
    stone.position.set(Math.cos(a) * 0.92, 0.48, Math.sin(a) * 0.7);
    stone.rotation.y = -a;
    group.add(stone);
    if (i % 2 === 0) {
      const lintel = box(0.62, 0.18, 0.24, 0xaaa694);
      lintel.position.set(Math.cos(a) * 0.92, 1.02, Math.sin(a) * 0.7);
      lintel.rotation.y = -a;
      group.add(lintel);
    }
  }
}

function addAcropolis(group) {
  const platform = box(2.2, 0.25, 1.35, 0xc8b28a);
  platform.position.y = 0.14;
  group.add(platform);
  for (let i = -3; i <= 3; i += 1) {
    const col = cylinder(0.06, 0.92, 0xe2d2b5, 10);
    col.position.set(i * 0.28, 0.7, 0.46);
    group.add(col);
  }
  const roof = box(2.0, 0.18, 1.0, 0xd4bc8c);
  roof.position.y = 1.2;
  group.add(roof);
}

function addCastle(group) {
  const body = box(1.6, 0.9, 1.1, 0xd8d2bd);
  body.position.y = 0.48;
  group.add(body);
  [-0.72, 0.72].forEach((x) => {
    const tower = cylinder(0.22, 1.55, 0xc6c0ae, 16);
    tower.position.set(x, 0.86, 0.28);
    group.add(tower);
    const roof = cone(0.26, 0.55, 0x6e7f9f, 12);
    roof.position.set(x, 1.9, 0.28);
    group.add(roof);
  });
}

function addBridge(group, suspension = false) {
  const deck = box(3.2, 0.16, 0.22, suspension ? 0xe76f51 : 0xb99a7b);
  deck.position.y = 0.54;
  group.add(deck);
  [-1.1, 1.1].forEach((x) => {
    const tower = box(0.18, suspension ? 1.75 : 0.85, 0.18, suspension ? 0xe76f51 : 0xb99a7b);
    tower.position.set(x, suspension ? 1.14 : 0.9, 0);
    group.add(tower);
  });
  if (suspension) {
    const cable = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.025, 6, 48, Math.PI), new THREE.MeshBasicMaterial({ color: 0xffb19d }));
    cable.position.y = 1.62;
    cable.rotation.z = Math.PI;
    group.add(cable);
  }
}

function addPyramids(group) {
  [[-0.65, 0.75], [0.35, 1.05], [1.05, 0.52]].forEach(([x, s]) => {
    const py = cone(s, s * 1.28, 0xd9b16f, 4);
    py.position.set(x, (s * 1.28) / 2, 0);
    py.rotation.y = Math.PI / 4;
    group.add(py);
  });
}

function addDesertOrSalt(group, salt = false) {
  const ground = new THREE.Mesh(new THREE.CircleGeometry(1.6, 44), new THREE.MeshStandardMaterial({ color: salt ? 0xe9f7ff : 0xd7a35c, roughness: salt ? 0.18 : 0.92 }));
  ground.rotation.x = -Math.PI / 2;
  group.add(ground);
  if (salt) {
    const mirror = cylinder(0.04, 1.1, 0x9bd8ff, 8);
    mirror.position.y = 0.55;
    group.add(mirror);
  } else {
    [-0.45, 0.35].forEach((x) => {
      const dune = new THREE.Mesh(new THREE.SphereGeometry(0.78, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.48), new THREE.MeshStandardMaterial({ color: 0xcf9555, roughness: 0.9 }));
      dune.scale.set(1.35, 0.38, 0.7);
      dune.position.set(x, 0.1, 0);
      group.add(dune);
    });
  }
}

function addWaterfall(group) {
  const cliff = box(1.45, 1.5, 0.42, 0x5d6b59);
  cliff.position.y = 0.78;
  group.add(cliff);
  const water = box(0.5, 1.42, 0.08, 0x72d7f2);
  water.position.set(0.26, 0.76, 0.26);
  group.add(water);
  const pool = new THREE.Mesh(new THREE.CircleGeometry(1.0, 32), new THREE.MeshStandardMaterial({ color: 0x2bb8c8, roughness: 0.24 }));
  pool.rotation.x = -Math.PI / 2;
  pool.position.y = 0.06;
  group.add(pool);
}

function addMesa(group, item) {
  const color = item.includes("大峽谷") ? 0xb56349 : item.includes("烏魯魯") ? 0xb65f3c : 0x6c7568;
  const mesa = box(item.includes("桌山") ? 2.1 : 1.55, item.includes("大峽谷") ? 1.1 : 1.35, item.includes("桌山") ? 1.2 : 1.0, color);
  mesa.position.y = 0.62;
  group.add(mesa);
  if (item.includes("大峽谷")) {
    const cut = box(0.28, 0.9, 1.22, 0x5e3b32);
    cut.position.set(0.12, 0.62, 0.04);
    group.add(cut);
  }
}

function addSavanna(group) {
  const plain = new THREE.Mesh(new THREE.CircleGeometry(1.5, 34), new THREE.MeshStandardMaterial({ color: 0xb8b767, roughness: 0.8 }));
  plain.rotation.x = -Math.PI / 2;
  group.add(plain);
  const tree = cylinder(0.06, 0.8, 0x7a5539, 8);
  tree.position.y = 0.4;
  const crown = new THREE.Mesh(new THREE.SphereGeometry(0.42, 18, 12), new THREE.MeshStandardMaterial({ color: 0x7aa663 }));
  crown.position.y = 0.92;
  group.add(tree, crown);
}

function addLiberty(group) {
  const base = box(0.72, 0.46, 0.72, 0x9b8e79);
  base.position.y = 0.24;
  const body = cone(0.38, 1.55, 0x75a99d, 12);
  body.position.y = 1.0;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), new THREE.MeshStandardMaterial({ color: 0x88b6a9 }));
  head.position.y = 1.82;
  const torch = box(0.08, 1.0, 0.08, 0xffd76a);
  torch.position.set(0.38, 1.78, 0);
  torch.rotation.z = -0.32;
  group.add(base, body, head, torch);
}

function addHalfDome(group) {
  const dome = new THREE.Mesh(new THREE.SphereGeometry(1.05, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.58), new THREE.MeshStandardMaterial({ color: 0x8d8b7a, roughness: 0.78 }));
  dome.scale.set(1, 1.32, 0.72);
  dome.position.y = 0.54;
  group.add(dome);
  const cliff = box(0.28, 1.1, 1.1, 0x6d6a61);
  cliff.position.set(0.72, 0.56, 0);
  group.add(cliff);
}

function addOldTown(group) {
  for (let i = 0; i < 5; i += 1) {
    const house = box(0.46, 0.45 + (i % 2) * 0.22, 0.42, [0xe0a46f, 0xd85f4f, 0xe8d4a4, 0x70a6a5, 0xc77f5b][i]);
    house.position.set(-0.9 + i * 0.45, 0.28 + (i % 2) * 0.11, Math.sin(i) * 0.28);
    group.add(house);
  }
}

function addMachuPicchu(group) {
  for (let i = 0; i < 5; i += 1) {
    const terrace = box(2.2 - i * 0.35, 0.16, 1.2 - i * 0.12, 0x8aa06d);
    terrace.position.y = 0.08 + i * 0.18;
    group.add(terrace);
  }
  const ruin = box(0.55, 0.45, 0.38, 0x9f9b82);
  ruin.position.set(0.4, 1.0, 0.1);
  group.add(ruin);
}

function addChristStatue(group) {
  const body = cylinder(0.18, 1.55, 0xe2e0d6, 16);
  body.position.y = 0.86;
  const arm = box(1.55, 0.12, 0.12, 0xe2e0d6);
  arm.position.y = 1.38;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), new THREE.MeshStandardMaterial({ color: 0xe2e0d6 }));
  head.position.y = 1.72;
  group.add(body, arm, head);
}

function addSydneyOpera(group) {
  for (let i = 0; i < 4; i += 1) {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 12, 0, Math.PI, 0, Math.PI * 0.78), new THREE.MeshStandardMaterial({ color: 0xf5f1e5, roughness: 0.48 }));
    shell.scale.set(0.72, 1.18 + i * 0.1, 0.26);
    shell.position.set(-0.72 + i * 0.44, 0.58 + i * 0.06, 0);
    shell.rotation.z = -0.45 + i * 0.18;
    group.add(shell);
  }
  const base = box(2.1, 0.22, 0.9, 0xd8c8a8);
  base.position.y = 0.12;
  group.add(base);
}

function addFjord(group) {
  const water = box(0.56, 0.08, 2.35, 0x2bb8c8);
  water.position.y = 0.08;
  const left = cone(0.78, 1.85, 0x596e5a, 5);
  left.position.set(-0.62, 0.84, 0);
  const right = cone(0.72, 1.6, 0x4d6554, 5);
  right.position.set(0.62, 0.76, 0.15);
  group.add(water, left, right);
}

function addMoai(group) {
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.92, 8, 18), new THREE.MeshStandardMaterial({ color: 0x7f766a, roughness: 0.92 }));
  head.position.y = 0.85;
  head.scale.set(0.72, 1.08, 0.58);
  const nose = box(0.08, 0.28, 0.08, 0x655e55);
  nose.position.set(0, 0.94, 0.22);
  group.add(head, nose);
}

function addIce(group, fjord = false) {
  if (fjord) {
    const water = box(0.5, 0.08, 2.0, 0x5bbde0);
    water.position.y = 0.08;
    group.add(water);
  }
  [-0.5, 0.15, 0.7].forEach((x, i) => {
    const ice = cone(0.42 + i * 0.08, 1.05 + i * 0.22, 0xd8f4ff, 5);
    ice.position.set(x, 0.52 + i * 0.09, Math.sin(i) * 0.4);
    group.add(ice);
  });
}

function addGenericByType(group, item) {
  if (item.type === "city") return addNeedleTower(group, 3.2, 0x9fc7de);
  if (item.type === "mountain") return addMountain(group, item.place);
  if (item.type === "water") return addThermalPool(group);
  if (item.type === "desert") return addDesertOrSalt(group);
  if (item.type === "ice") return addIce(group);
  if (item.type === "sacred") return addTajMahal(group);
  addSavanna(group);
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

function makePhotoCard(item, color) {
  const cardCanvas = document.createElement("canvas");
  cardCanvas.width = 640;
  cardCanvas.height = 430;
  const ctx = cardCanvas.getContext("2d");
  drawPhotoCardPlaceholder(ctx, item, color, "載入真實參考圖...");

  const texture = new THREE.CanvasTexture(cardCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0, depthTest: false }));
  sprite.position.y = 13.2;
  sprite.scale.set(11.4, 7.65, 1);
  sprite.renderOrder = 29;
  sprite.userData = { isPhotoCard: true, place: item.place, floatBase: 13.2, floatPhase: Math.random() * Math.PI * 2 };
  photoSprites.push(sprite);
  loadWikiPhoto(item, cardCanvas, ctx, texture, color);
  return sprite;
}

async function loadWikiPhoto(item, cardCanvas, ctx, texture, color) {
  try {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wikiTitle)}`;
    const response = await fetch(endpoint, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const imageUrl = data.thumbnail?.source || data.originalimage?.source;
    if (!imageUrl) throw new Error("No thumbnail");
    const image = await loadCrossOriginImage(imageUrl.replace(/\/\d+px-/, "/640px-"));
    drawPhotoCard(ctx, item, color, image);
    texture.needsUpdate = true;
  } catch (error) {
    drawPhotoCardPlaceholder(ctx, item, color, "真實圖載入失敗，請稍後重整");
    texture.needsUpdate = true;
  }
}

function loadCrossOriginImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function drawPhotoCard(ctx, item, color, image) {
  ctx.clearRect(0, 0, 640, 430);
  ctx.fillStyle = "rgba(5, 13, 23, 0.9)";
  roundRect(ctx, 20, 16, 600, 398, 26);
  ctx.fill();
  ctx.strokeStyle = `#${color.getHexString()}`;
  ctx.lineWidth = 5;
  ctx.stroke();

  const frame = { x: 42, y: 40, w: 556, h: 282 };
  ctx.save();
  roundRect(ctx, frame.x, frame.y, frame.w, frame.h, 18);
  ctx.clip();
  drawCoverImage(ctx, image, frame.x, frame.y, frame.w, frame.h);
  ctx.restore();

  ctx.fillStyle = "rgba(5, 13, 23, 0.72)";
  ctx.fillRect(42, 274, 556, 48);
  ctx.fillStyle = "#f4f9ff";
  ctx.font = '700 34px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.place, 320, 298, 512);
  ctx.fillStyle = `#${color.getHexString()}`;
  ctx.font = '700 22px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.fillText("Wikipedia / Wikimedia 真實參考圖", 320, 362, 520);
}

function drawPhotoCardPlaceholder(ctx, item, color, message) {
  ctx.clearRect(0, 0, 640, 430);
  ctx.fillStyle = "rgba(5, 13, 23, 0.9)";
  roundRect(ctx, 20, 16, 600, 398, 26);
  ctx.fill();
  ctx.strokeStyle = `#${color.getHexString()}`;
  ctx.lineWidth = 5;
  ctx.stroke();
  const gradient = ctx.createLinearGradient(42, 40, 598, 322);
  gradient.addColorStop(0, "rgba(80, 120, 160, 0.42)");
  gradient.addColorStop(1, "rgba(20, 36, 56, 0.78)");
  ctx.fillStyle = gradient;
  roundRect(ctx, 42, 40, 556, 282, 18);
  ctx.fill();
  ctx.fillStyle = "#f4f9ff";
  ctx.font = '700 36px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.place, 320, 170, 500);
  ctx.fillStyle = `#${color.getHexString()}`;
  ctx.font = '700 24px "Microsoft JhengHei", "Noto Sans TC", sans-serif';
  ctx.fillText(message, 320, 360, 520);
}

function drawCoverImage(ctx, image, x, y, width, height) {
  const scale = Math.max(width / image.width, height / image.height);
  const sw = width / scale;
  const sh = height / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
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
  const length = cameraGoal.position.length();
  if (length < MIN_CAMERA_RADIUS) cameraGoal.position.setLength(MIN_CAMERA_RADIUS);
  if (length > MAX_CAMERA_RADIUS) cameraGoal.position.setLength(MAX_CAMERA_RADIUS);
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
  const nearSurface = Math.max(1, cameraGoal.position.length() - EARTH_RADIUS);
  const step = Math.max(0.34, Math.min(distance * 0.08, nearSurface * 0.34)) * wheelScale * speedMultiplier;
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
  const droneGroundPoint = camera.position.clone().normalize().multiplyScalar(EARTH_RADIUS);
  labelSprites.forEach((label) => {
    const parent = label.parent;
    const worldPosition = new THREE.Vector3();
    parent.getWorldPosition(worldPosition);
    const surfaceDistance = droneGroundPoint.distanceTo(worldPosition.clone().setLength(EARTH_RADIUS));
    const overhead = surfaceDistance < LABEL_SURFACE_DISTANCE && camera.position.length() < EARTH_RADIUS + 42;
    const near = overhead || selected?.place === label.userData.place;
    label.material.opacity = THREE.MathUtils.lerp(label.material.opacity, near ? 1 : 0, 0.12);
    label.position.y = label.userData.floatBase + Math.sin(clock.elapsedTime * 1.8 + label.userData.floatPhase) * 0.22;
  });
  photoSprites.forEach((card) => {
    const parent = card.parent;
    const worldPosition = new THREE.Vector3();
    parent.getWorldPosition(worldPosition);
    const surfaceDistance = droneGroundPoint.distanceTo(worldPosition.clone().setLength(EARTH_RADIUS));
    const selectedCard = selected?.place === card.userData.place;
    const overhead = surfaceDistance < PHOTO_SURFACE_DISTANCE && camera.position.length() < EARTH_RADIUS + 30;
    const near = overhead || selectedCard;
    card.material.opacity = THREE.MathUtils.lerp(card.material.opacity, near ? 1 : 0, 0.1);
    card.position.y = card.userData.floatBase + Math.sin(clock.elapsedTime * 1.25 + card.userData.floatPhase) * 0.18;
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
