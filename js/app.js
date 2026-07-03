import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const ui = {
  app: document.querySelector(".flight-app"),
  loading: document.querySelector("#loadingState"),
  navToggle: document.querySelector("#navToggle"),
  cityList: document.querySelector("#cityList"),
  landmarkCount: document.querySelector("#landmarkCount"),
  speedRange: document.querySelector("#speedRange"),
  terrainRange: document.querySelector("#terrainRange"),
  tourButton: document.querySelector("#tourButton"),
  homeButton: document.querySelector("#homeButton"),
  nightButton: document.querySelector("#nightButton")
};

const landmarks = [
  { region: "亞洲", icon: "🏔️", place: "珠穆朗瑪峰", country: "尼泊爾/中國", lat: 27.9881, lon: 86.925, type: "mountain", wikiTitle: "Mount Everest" },
  { region: "亞洲", icon: "🧱", place: "萬里長城", country: "中國", lat: 40.4319, lon: 116.5704, type: "ancient", wikiTitle: "Great Wall of China" },
  { region: "亞洲", icon: "🌋", place: "富士山", country: "日本", lat: 35.3606, lon: 138.7274, type: "mountain", wikiTitle: "Mount Fuji" },
  { region: "亞洲", icon: "🕌", place: "泰姬瑪哈陵", country: "印度", lat: 27.1751, lon: 78.0421, type: "sacred", wikiTitle: "Taj Mahal" },
  { region: "亞洲", icon: "🛕", place: "吳哥窟", country: "柬埔寨", lat: 13.4125, lon: 103.867, type: "ancient", wikiTitle: "Angkor Wat" },
  { region: "亞洲", icon: "⛵", place: "下龍灣", country: "越南", lat: 20.9101, lon: 107.1839, type: "water", wikiTitle: "Hạ Long Bay" },
  { region: "亞洲", icon: "🏛️", place: "佩特拉古城", country: "約旦", lat: 30.3285, lon: 35.4444, type: "ancient", wikiTitle: "Petra" },
  { region: "亞洲", icon: "🌊", place: "帕穆卡麗棉堡", country: "土耳其", lat: 37.9137, lon: 29.1187, type: "water", wikiTitle: "Pamukkale" },
  { region: "亞洲", icon: "🏙️", place: "台北 101", country: "台灣", lat: 25.0339, lon: 121.5645, type: "city", wikiTitle: "Taipei 101" },
  { region: "亞洲", icon: "🗼", place: "東京晴空塔", country: "日本", lat: 35.7101, lon: 139.8107, type: "city", wikiTitle: "Tokyo Skytree" },
  { region: "亞洲", icon: "🛕", place: "婆羅浮屠", country: "印尼", lat: -7.6079, lon: 110.2038, type: "sacred", wikiTitle: "Borobudur" },
  { region: "亞洲", icon: "🏙️", place: "杜拜哈里發塔", country: "阿聯", lat: 25.1972, lon: 55.2744, type: "city", wikiTitle: "Burj Khalifa" },
  { region: "歐洲", icon: "🗼", place: "艾菲爾鐵塔", country: "法國", lat: 48.8584, lon: 2.2945, type: "city", wikiTitle: "Eiffel Tower" },
  { region: "歐洲", icon: "🏟️", place: "羅馬競技場", country: "義大利", lat: 41.8902, lon: 12.4922, type: "ancient", wikiTitle: "Colosseum" },
  { region: "歐洲", icon: "⛪", place: "聖家堂", country: "西班牙", lat: 41.4036, lon: 2.1744, type: "sacred", wikiTitle: "Sagrada Família" },
  { region: "歐洲", icon: "🪨", place: "巨石陣", country: "英國", lat: 51.1789, lon: -1.8262, type: "ancient", wikiTitle: "Stonehenge" },
  { region: "歐洲", icon: "🏛️", place: "雅典衛城", country: "希臘", lat: 37.9715, lon: 23.7257, type: "ancient", wikiTitle: "Acropolis of Athens" },
  { region: "歐洲", icon: "⛪", place: "聖瓦西里主教座堂", country: "俄羅斯", lat: 55.7525, lon: 37.6231, type: "sacred", wikiTitle: "Saint Basil's Cathedral" },
  { region: "歐洲", icon: "💧", place: "冰島藍湖", country: "冰島", lat: 63.8804, lon: -22.4495, type: "water", wikiTitle: "Blue Lagoon (geothermal spa)" },
  { region: "歐洲", icon: "🏔️", place: "馬特洪峰", country: "瑞士/義大利", lat: 45.9763, lon: 7.6586, type: "mountain", wikiTitle: "Matterhorn" },
  { region: "歐洲", icon: "🏰", place: "新天鵝堡", country: "德國", lat: 47.5576, lon: 10.7498, type: "ancient", wikiTitle: "Neuschwanstein Castle" },
  { region: "歐洲", icon: "🌉", place: "布拉格查理大橋", country: "捷克", lat: 50.0865, lon: 14.4114, type: "city", wikiTitle: "Charles Bridge" },
  { region: "非洲", icon: "🔺", place: "吉薩金字塔", country: "埃及", lat: 29.9792, lon: 31.1342, type: "ancient", wikiTitle: "Giza pyramid complex" },
  { region: "非洲", icon: "🏜️", place: "撒哈拉沙漠", country: "北非", lat: 23.4162, lon: 25.6628, type: "desert", wikiTitle: "Sahara" },
  { region: "非洲", icon: "💦", place: "維多利亞瀑布", country: "尚比亞/辛巴威", lat: -17.9243, lon: 25.8572, type: "water", wikiTitle: "Victoria Falls" },
  { region: "非洲", icon: "🏔️", place: "乞力馬扎羅山", country: "坦尚尼亞", lat: -3.0674, lon: 37.3556, type: "mountain", wikiTitle: "Mount Kilimanjaro" },
  { region: "非洲", icon: "⛰️", place: "桌山", country: "南非", lat: -33.9628, lon: 18.4098, type: "mountain", wikiTitle: "Table Mountain" },
  { region: "非洲", icon: "🌾", place: "塞倫蓋蒂草原", country: "坦尚尼亞", lat: -2.3333, lon: 34.8333, type: "nature", wikiTitle: "Serengeti" },
  { region: "非洲", icon: "🏙️", place: "馬拉喀什傑馬夫納廣場", country: "摩洛哥", lat: 31.6258, lon: -7.9892, type: "city", wikiTitle: "Jemaa el-Fnaa" },
  { region: "北美洲", icon: "🗽", place: "自由女神像", country: "美國", lat: 40.6892, lon: -74.0445, type: "city", wikiTitle: "Statue of Liberty" },
  { region: "北美洲", icon: "🏜️", place: "大峽谷", country: "美國", lat: 36.1069, lon: -112.1129, type: "desert", wikiTitle: "Grand Canyon" },
  { region: "北美洲", icon: "🌈", place: "黃石大稜鏡溫泉", country: "美國", lat: 44.5251, lon: -110.8382, type: "water", wikiTitle: "Grand Prismatic Spring" },
  { region: "北美洲", icon: "⛰️", place: "優勝美地半圓頂", country: "美國", lat: 37.746, lon: -119.5329, type: "mountain", wikiTitle: "Half Dome" },
  { region: "北美洲", icon: "🌉", place: "金門大橋", country: "美國", lat: 37.8199, lon: -122.4783, type: "city", wikiTitle: "Golden Gate Bridge" },
  { region: "北美洲", icon: "💦", place: "尼加拉瀑布", country: "美國/加拿大", lat: 43.0962, lon: -79.0377, type: "water", wikiTitle: "Niagara Falls" },
  { region: "北美洲", icon: "🛕", place: "奇琴伊察", country: "墨西哥", lat: 20.6843, lon: -88.5678, type: "ancient", wikiTitle: "Chichen Itza" },
  { region: "北美洲", icon: "🏙️", place: "哈瓦那舊城", country: "古巴", lat: 23.1367, lon: -82.3589, type: "city", wikiTitle: "Old Havana" },
  { region: "南美洲", icon: "🏛️", place: "馬丘比丘", country: "秘魯", lat: -13.1631, lon: -72.545, type: "ancient", wikiTitle: "Machu Picchu" },
  { region: "南美洲", icon: "✝️", place: "基督救世主像", country: "巴西", lat: -22.9519, lon: -43.2105, type: "sacred", wikiTitle: "Christ the Redeemer (statue)" },
  { region: "南美洲", icon: "💦", place: "伊瓜蘇瀑布", country: "巴西/阿根廷", lat: -25.6953, lon: -54.4367, type: "water", wikiTitle: "Iguazu Falls" },
  { region: "南美洲", icon: "🪞", place: "烏尤尼鹽沼", country: "玻利維亞", lat: -20.1338, lon: -67.4891, type: "desert", wikiTitle: "Salar de Uyuni" },
  { region: "南美洲", icon: "🌋", place: "加拉巴哥群島", country: "厄瓜多", lat: -0.9538, lon: -90.9656, type: "nature", wikiTitle: "Galápagos Islands" },
  { region: "南美洲", icon: "🏔️", place: "巴塔哥尼亞菲茨羅伊峰", country: "阿根廷", lat: -49.2712, lon: -73.0433, type: "mountain", wikiTitle: "Monte Fitz Roy" },
  { region: "大洋洲", icon: "🎭", place: "雪梨歌劇院", country: "澳洲", lat: -33.8568, lon: 151.2153, type: "city", wikiTitle: "Sydney Opera House" },
  { region: "大洋洲", icon: "⛰️", place: "烏魯魯", country: "澳洲", lat: -25.3444, lon: 131.0369, type: "desert", wikiTitle: "Uluru" },
  { region: "大洋洲", icon: "🐠", place: "大堡礁", country: "澳洲", lat: -18.2871, lon: 147.6992, type: "water", wikiTitle: "Great Barrier Reef" },
  { region: "大洋洲", icon: "🏞️", place: "米佛峽灣", country: "紐西蘭", lat: -44.6414, lon: 167.8974, type: "water", wikiTitle: "Milford Sound" },
  { region: "大洋洲", icon: "🗿", place: "復活節島摩艾", country: "智利", lat: -27.1127, lon: -109.3497, type: "ancient", wikiTitle: "Moai" },
  { region: "極地", icon: "🧊", place: "南極冰原", country: "南極洲", lat: -75.2509, lon: 0.0714, type: "ice", wikiTitle: "Antarctic ice sheet" },
  { region: "極地", icon: "🧊", place: "格陵蘭冰峽灣", country: "格陵蘭", lat: 69.2198, lon: -51.0986, type: "ice", wikiTitle: "Ilulissat Icefjord" }
];

const groupedRegions = ["亞洲", "歐洲", "非洲", "北美洲", "南美洲", "大洋洲", "極地"];
const mapStyle = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    "esri-imagery": {
      type: "raster",
      tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics, and the GIS User Community"
    },
    "aws-terrain": {
      type: "raster-dem",
      tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
      encoding: "terrarium",
      tileSize: 256,
      maxzoom: 15,
      attribution: "Elevation tiles © AWS Open Data / Mapzen"
    }
  },
  layers: [
    {
      id: "background-space",
      type: "background",
      paint: { "background-color": "#020812" }
    },
    {
      id: "esri-imagery",
      type: "raster",
      source: "esri-imagery",
      paint: {
        "raster-saturation": 0.08,
        "raster-contrast": 0.18,
        "raster-brightness-min": 0.02,
        "raster-brightness-max": 0.95
      }
    },
    {
      id: "terrain-hillshade",
      type: "hillshade",
      source: "aws-terrain",
      paint: {
        "hillshade-shadow-color": "rgba(8, 21, 28, 0.52)",
        "hillshade-highlight-color": "rgba(244, 238, 210, 0.34)",
        "hillshade-accent-color": "rgba(53, 87, 90, 0.28)"
      }
    }
  ],
  terrain: {
    source: "aws-terrain",
    exaggeration: 1.45
  }
};

const map = new maplibregl.Map({
  container: "earthMap",
  style: mapStyle,
  center: [104, 26],
  zoom: 1.55,
  pitch: 0,
  bearing: 0,
  maxPitch: 85,
  maxZoom: 16.8,
  minZoom: 0.5,
  attributionControl: false,
  antialias: true
});

map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

const markerByPlace = new Map();
const labelByPlace = new Map();
let selected = null;
let popup = null;
let autoTour = false;
let tourIndex = 0;
let tourTimer = null;
let isNight = false;
let terrainExaggeration = Number(ui.terrainRange.value);
let speedMultiplier = Number(ui.speedRange.value);

function init() {
  renderCityList();
  createMarkers();
  bindUi();
  bindKeyboard();
  map.on("load", () => {
    map.setProjection({ type: "globe" });
    map.setTerrain({ source: "aws-terrain", exaggeration: terrainExaggeration });
    ui.loading.classList.add("hidden");
    updateVisibleLabels();
  });
  map.on("move", updateVisibleLabels);
  map.on("zoom", updateVisibleLabels);
}

function createMarkers() {
  landmarks.forEach((item) => {
    const element = document.createElement("button");
    element.type = "button";
    element.className = `landmark-marker marker-${item.type}`;
    element.title = `${item.place}・${item.country}`;
    element.innerHTML = `<span class="marker-core"></span><span class="marker-label">${item.icon} ${item.place}</span>`;
    element.addEventListener("click", (event) => {
      event.stopPropagation();
      focusLandmark(item);
    });
    const marker = new maplibregl.Marker({ element, anchor: "center" })
      .setLngLat([item.lon, item.lat])
      .addTo(map);
    markerByPlace.set(item.place, marker);
    labelByPlace.set(item.place, element);
  });
}

function renderCityList() {
  ui.landmarkCount.textContent = `(${landmarks.length})`;
  ui.cityList.innerHTML = "";
  groupedRegions.forEach((region) => {
    const regionItems = landmarks.filter((item) => item.region === region);
    if (!regionItems.length) return;
    const heading = document.createElement("div");
    heading.className = "region-heading";
    heading.textContent = `${region}（${regionItems.length}）`;
    ui.cityList.append(heading);
    regionItems.forEach((item) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "city-button";
      button.dataset.place = item.place;
      button.innerHTML = `<span class="county-chip">${item.icon}</span><span class="place-name">${item.place}</span>`;
      button.addEventListener("click", () => focusLandmark(item));
      ui.cityList.append(button);
    });
  });
}

function focusLandmark(item, fromTour = false) {
  selected = item;
  if (!fromTour) stopTour();
  updateActiveCity();
  showPopup(item);
  map.flyTo({
    center: [item.lon, item.lat],
    zoom: targetZoom(item),
    pitch: targetPitch(item),
    bearing: bearingFor(item),
    speed: 0.55 * speedMultiplier,
    curve: 1.25,
    essential: true
  });
  updateVisibleLabels();
}

function targetZoom(item) {
  if (["city", "sacred", "ancient"].includes(item.type)) return 14.2;
  if (["mountain", "desert", "ice"].includes(item.type)) return 11.1;
  if (item.type === "water") return 11.8;
  return 12.4;
}

function targetPitch(item) {
  return item.type === "city" ? 72 : 76;
}

function bearingFor(item) {
  return ((item.lon * 3.7 + item.lat * 5.1) % 360 + 360) % 360;
}

function goHome() {
  selected = null;
  stopTour();
  closePopup();
  updateActiveCity();
  map.flyTo({
    center: [104, 26],
    zoom: window.innerWidth < 700 ? 1.0 : 1.55,
    pitch: 0,
    bearing: 0,
    speed: 0.7,
    curve: 1.35,
    essential: true
  });
  updateVisibleLabels();
}

function updateActiveCity() {
  document.querySelectorAll(".city-button").forEach((button) => {
    button.classList.toggle("active", selected?.place === button.dataset.place);
  });
}

function updateVisibleLabels() {
  const center = map.getCenter();
  const zoom = map.getZoom();
  landmarks.forEach((item) => {
    const element = labelByPlace.get(item.place);
    if (!element) return;
    const closeToCenter = distanceKm(center.lat, center.lng, item.lat, item.lon) < nearKmForZoom(zoom);
    const active = selected?.place === item.place;
    element.classList.toggle("active", active);
    element.classList.toggle("show-label", active || closeToCenter);
  });
}

function nearKmForZoom(zoom) {
  if (zoom < 5) return 0;
  return Math.max(2, 2100 / Math.pow(2, zoom - 4));
}

function distanceKm(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(value) {
  return value * Math.PI / 180;
}

async function showPopup(item) {
  closePopup();
  const placeholder = popupHtml(item, "");
  popup = new maplibregl.Popup({ closeButton: true, closeOnClick: false, maxWidth: "340px", offset: 28 })
    .setLngLat([item.lon, item.lat])
    .setHTML(placeholder)
    .addTo(map);
  try {
    const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wikiTitle)}`);
    const data = response.ok ? await response.json() : null;
    const image = data?.thumbnail?.source || data?.originalimage?.source || "";
    const summary = data?.extract || `${item.place} 位於 ${item.country}，此處使用真實衛星影像與全球高程圖磚呈現。`;
    if (popup && selected?.place === item.place) popup.setHTML(popupHtml(item, image, summary));
  } catch {
    if (popup && selected?.place === item.place) popup.setHTML(popupHtml(item, "", `${item.place} 位於 ${item.country}。`));
  }
}

function popupHtml(item, image, summary = "正在載入真實參考圖...") {
  const img = image ? `<img src="${image}" alt="${item.place} 真實參考圖" />` : "";
  return `
    <article class="landmark-popup">
      ${img}
      <div class="popup-tag">${item.country}</div>
      <h3>${item.icon} ${item.place}</h3>
      <p>${summary}</p>
    </article>
  `;
}

function closePopup() {
  if (popup) {
    popup.remove();
    popup = null;
  }
}

function toggleNight() {
  isNight = !isNight;
  map.setPaintProperty("esri-imagery", "raster-brightness-min", isNight ? 0 : 0.02);
  map.setPaintProperty("esri-imagery", "raster-brightness-max", isNight ? 0.48 : 0.95);
  map.setPaintProperty("esri-imagery", "raster-saturation", isNight ? -0.38 : 0.08);
  ui.app.classList.toggle("night-mode", isNight);
  ui.nightButton.classList.toggle("active", isNight);
}

function startTour() {
  if (autoTour) return;
  autoTour = true;
  ui.tourButton.classList.add("active");
  tourIndex = Math.max(0, selected ? landmarks.findIndex((item) => item.place === selected.place) : tourIndex);
  runTourStep();
}

function stopTour() {
  autoTour = false;
  ui.tourButton.classList.remove("active");
  if (tourTimer) {
    clearTimeout(tourTimer);
    tourTimer = null;
  }
}

function runTourStep() {
  if (!autoTour) return;
  const item = landmarks[tourIndex % landmarks.length];
  tourIndex = (tourIndex + 1) % landmarks.length;
  focusLandmark(item, true);
  const delay = Math.max(3500, 8500 / speedMultiplier);
  tourTimer = window.setTimeout(runTourStep, delay);
}

function bindUi() {
  ui.homeButton.addEventListener("click", goHome);
  ui.navToggle.addEventListener("click", () => {
    const collapsed = ui.app.classList.toggle("nav-collapsed");
    ui.navToggle.setAttribute("aria-expanded", String(!collapsed));
    ui.navToggle.title = collapsed ? "展開地景清單" : "收合地景清單";
  });
  ui.nightButton.addEventListener("click", toggleNight);
  ui.tourButton.addEventListener("click", () => (autoTour ? stopTour() : startTour()));
  ui.speedRange.addEventListener("input", () => {
    speedMultiplier = Number(ui.speedRange.value);
  });
  ui.terrainRange.addEventListener("input", () => {
    terrainExaggeration = Number(ui.terrainRange.value);
    map.setTerrain({ source: "aws-terrain", exaggeration: terrainExaggeration });
  });
}

function bindKeyboard() {
  window.addEventListener("keydown", (event) => {
    const step = 140 / Math.max(1, map.getZoom());
    if (["ArrowUp", "KeyW"].includes(event.code)) {
      event.preventDefault();
      map.panBy([0, -step], { duration: 80 });
    } else if (["ArrowDown", "KeyS"].includes(event.code)) {
      event.preventDefault();
      map.panBy([0, step], { duration: 80 });
    } else if (["ArrowLeft", "KeyA"].includes(event.code)) {
      event.preventDefault();
      map.panBy([-step, 0], { duration: 80 });
    } else if (["ArrowRight", "KeyD"].includes(event.code)) {
      event.preventDefault();
      map.panBy([step, 0], { duration: 80 });
    } else if (event.code === "KeyQ") {
      event.preventDefault();
      map.zoomTo(map.getZoom() - 0.45, { duration: 160 });
    } else if (event.code === "KeyE") {
      event.preventDefault();
      map.zoomTo(map.getZoom() + 0.45, { duration: 160 });
    }
  });
}

init();
