import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

/* Local planet texture images (downloaded into ./images/).
   Procedural fallbacks below are used if any image fails to load. */
const TEX_BASE = './images/';

/* ============================================================
   CONTENT
   ============================================================ */
const PLANETS = {
  about: {
    name: "About", texture:"mercury", tint: 0xB9C4CF, radius: 42, size: 3.4, speed: 0.9,
    real: { map:'mercurymap.jpg', bump:'mercurybump.jpg' },
    html: `
      <div class="detail-eyebrow">// ABOUT · PLANET MERCURY</div>
      <h2>Dileep Choudhary</h2>
      <p style="color:var(--text-muted); line-height:1.7; margin-bottom:14px;">
      Full Stack Developer · AI & Web Engineering · Entrepreneur · Open to Global Opportunities
      </p>
      <div class="entry">
        <p>Entrepreneurial full-stack developer and B.E. Information Science Engineering student (1st year, CGPA 8.3/10) at VTU, with a track record of building scalable AI-powered web platforms and leading international tech projects. Founder & CEO of Express Your Thoughts, and Lead Developer at Naviguide (France).</p>
      </div>
      <div class="chip-row">
        <span class="chip">AIVENTRA Hackathon Winner</span>
        <span class="chip">Top 10 · lablab.ai</span>
        <span class="chip">5th · ACT IN SPACE 2026</span>
        <span class="chip">Microsoft Student Ambassador</span>
      </div>
    `
  },
  experience: {
    name: "Experience", texture:"venus", tint: 0xE8C27A, radius: 66, size: 4.6, speed: 0.65,
    real: { map:'venusmap.jpg', bump:'venusbump.jpg' },
    html: `
      <div class="detail-eyebrow">// WORK HISTORY · PLANET VENUS</div>
      <h2>Experience</h2>
      <div class="entry">
        <div class="entry-title">Founder & CEO — Express Your Thoughts</div>
        <div class="entry-sub">Bengaluru, India · Sept 2025 – Present</div>
        <ul>
          <li>Founded and architected a full-stack idea-sharing platform (expressyourthoughts.live) using Firebase auth and Cloud Firestore, scaling to a growing global user base within the first year.</li>
          <li>Curated 100+ hackathons, internships, and innovation opportunities, driving week-over-week engagement and retention.</li>
          <li>Led end-to-end product strategy, UI/UX, and solo engineering sprints — concept to production in under 3 months.</li>
        </ul>
      </div>
      <div class="entry">
        <div class="entry-title">Intern — Page Launch</div>
        <div class="entry-sub">Vancouver, BC (Remote) · April 2026 – Present</div>
        <ul>
          <li>Built AI-discoverable websites for professionals and small businesses, optimizing visibility across ChatGPT, Gemini, and Perplexity alongside traditional search.</li>
          <li>Delivered production-ready client websites on accelerated timelines, improving visibility and inbound leads.</li>
          <li>Implemented AI-first discoverability strategies cross-functionally with technical stakeholders.</li>
        </ul>
      </div>
      <div class="entry">
        <div class="entry-title">Lead Developer / Web Developer — Naviguide</div>
        <div class="entry-sub">Berry-Mappemonde, France · New Caledonia (Remote) · Nov 2025 – Present</div>
        <ul>
          <li>Promoted to Lead Developer within 5 months; led production deployment of a smart maritime navigation platform — real-time ocean data, storm avoidance, waypoint optimization for a 24-month Pacific expedition.</li>
          <li>Built and launched the full web infrastructure on OVH Cloud, enabling live mid-Pacific sailboat tracking connecting French overseas territories.</li>
          <li>Contributed to hackathon recognition: Top 10 at lablab.ai Complete.dev AI Agents Hackathon; 5th place at ACT IN SPACE 2026.</li>
        </ul>
      </div>
      <div class="entry">
        <div class="entry-title">Mathematics Teacher — SKPS</div>
        <div class="entry-sub">Tonk, Rajasthan, India · July 2024 – November 2024</div>
        <ul>
          <li>Designed and delivered secondary-level math curriculum, improving average assessment scores via inquiry-based instruction.</li>
          <li>Maintained 90%+ attendance while independently building full-stack development skills in parallel.</li>
          <li>Transitioned into software engineering within the same academic year.</li>
        </ul>
      </div>
    `
  },
  projects: {
    name: "Projects", texture:"earth", tint: 0x5FA8D3, radius: 92, size: 5.4, speed: 0.5,
    real: { map:'earthmap1k.jpg', bump:'earthbump1k.jpg', spec:'earthspec1k.jpg', clouds:true, moon:true },
    html: `
      <div class="detail-eyebrow">// SELECTED WORK · PLANET EARTH</div>
      <h2>Projects</h2>
      <div class="entry">
        <div class="entry-title">Express Your Thoughts</div>
        <div class="entry-sub">expressyourthoughts.live</div>
        <p>Full-stack idea-sharing platform built on Firebase Authentication and Cloud Firestore. Curates hackathons, internships, and innovation opportunities for a growing global user base.</p>
        <div class="chip-row"><span class="chip">Firebase</span><span class="chip">Firestore</span><span class="chip">React</span></div>
      </div>
      <div class="entry">
        <div class="entry-title">Naviguide — Maritime Navigation Platform</div>
        <div class="entry-sub">Naviguide, France / New Caledonia</div>
        <p>Smart maritime navigation platform integrating real-time ocean data, storm avoidance, and waypoint optimization, deployed for a 24-month Pacific expedition with live sailboat tracking.</p>
        <div class="chip-row"><span class="chip">OVH Cloud</span><span class="chip">Real-time Data</span><span class="chip">Node.js</span></div>
      </div>
      <div class="entry">
        <div class="entry-title">AI-Discoverable Client Websites</div>
        <div class="entry-sub">Page Launch</div>
        <p>Production websites optimized for discoverability across ChatGPT, Gemini, and Perplexity in addition to traditional search engines, improving inbound leads for small business clients.</p>
        <div class="chip-row"><span class="chip">AI SEO</span><span class="chip">Web Dev</span></div>
      </div>
      <div class="entry">
        <div class="entry-title">RAG-Based Knowledge Graph Framework</div>
        <div class="entry-sub">Independent Research</div>
        <p>Retrieval-augmented generation combined with knowledge graphs for intent-driven innovation mapping and AI-powered innovation discovery.</p>
        <div class="chip-row"><span class="chip">RAG</span><span class="chip">Knowledge Graphs</span><span class="chip">GenAI</span></div>
      </div>
    `
  },
  skills: {
    name: "Skills", texture:"mars", tint: 0xC1524B, radius: 118, size: 4.3, speed: 0.4,
    real: { map:'marsmap1k.jpg', bump:'marsbump1k.jpg' },
    html: `
      <div class="detail-eyebrow">// TECHNICAL SKILLS · PLANET MARS</div>
      <h2>Skills</h2>
      <div class="skill-group"><h4>LANGUAGES</h4><div class="chip-row"><span class="chip">Python</span><span class="chip">C</span><span class="chip">JavaScript</span></div></div>
      <div class="skill-group"><h4>WEB DEVELOPMENT</h4><div class="chip-row"><span class="chip">HTML5</span><span class="chip">CSS3</span><span class="chip">React.js</span><span class="chip">Node.js</span><span class="chip">Django</span></div></div>
      <div class="skill-group"><h4>MOBILE & APP DEV</h4><div class="chip-row"><span class="chip">Android Studio</span><span class="chip">Mobile App Development</span></div></div>
      <div class="skill-group"><h4>DATABASES</h4><div class="chip-row"><span class="chip">MongoDB</span><span class="chip">Firebase Firestore</span></div></div>
      <div class="skill-group"><h4>CLOUD & DEVOPS</h4><div class="chip-row"><span class="chip">Firebase</span><span class="chip">OVH Cloud</span><span class="chip">Docker</span><span class="chip">Git</span><span class="chip">VS Code</span></div></div>
      <div class="skill-group"><h4>AI & ANALYTICS</h4><div class="chip-row"><span class="chip">Generative AI</span><span class="chip">RAG</span><span class="chip">Predictive Analytics</span><span class="chip">Knowledge Graphs</span></div></div>
      <div class="skill-group"><h4>OTHER</h4><div class="chip-row"><span class="chip">REST APIs</span><span class="chip">Linux/Ubuntu</span><span class="chip">AI-Discoverability Optimization</span><span class="chip">Project Management</span></div></div>
    `
  },
  hackathons: {
    name: "Hackathons", texture:"jupiter", tint: 0xD98A3D, radius: 152, size: 8.4, speed: 0.28,
    real: { map:'jupitermap.jpg' },
    html: `
      <div class="detail-eyebrow">// AWARDS & RESEARCH · PLANET JUPITER</div>
      <h2>Hackathons & Awards</h2>
      <div class="entry"><div class="entry-title">Awards</div>
        <ul>
          <li>AIVENTRA Hackathon Winner — Chennai</li>
          <li>Top 10 Finalist — lablab.ai Complete.dev AI Agents Hackathon</li>
          <li>5th Place — ACT IN SPACE 2026, New Caledonia</li>
          <li>Microsoft Student Ambassador (2025 – Present)</li>
          <li>Science Day Project Winner</li>
        </ul>
      </div>
      <div class="entry"><div class="entry-title">Research</div>
        <p>RAG-Based Knowledge Graph Framework for Intent-Driven Innovation Mapping — retrieval-augmented generation and knowledge graphs for AI-powered innovation discovery.</p>
      </div>
      <div class="entry"><div class="entry-title">Certifications</div>
        <ul>
          <li>Fundamentals of Predictive Project Management (PMI)</li>
          <li>AIVENTRA Certification</li>
          <li>GenAI Powered Data Analytics Job Simulation (Tata)</li>
          <li>Cybersecurity Analyst Job Simulation (Tata)</li>
          <li>Complete AI Hackathon Certificate</li>
          <li>Ocean Sessions – Water Pollution</li>
        </ul>
      </div>
    `
  },
  education: {
    name: "Education", texture:"saturn", tint: 0xE0C77A, radius: 186, size: 7, speed: 0.2, ring:true,
    real: { map:'saturnmap.jpg' },
    html: `
      <div class="detail-eyebrow">// EDUCATION · PLANET SATURN</div>
      <h2>Education</h2>
      <div class="entry">
        <div class="entry-title">Visvesvaraya Technological University (VTU)</div>
        <div class="entry-sub">Bengaluru, India · 2025 – 2029</div>
        <p>Bachelor of Engineering — Information Science Engineering · 1st Year CGPA: 8.3 / 10</p>
      </div>
      <div class="entry">
        <div class="entry-title">Maharshi Dayanand Saraswati University (MDSU)</div>
        <div class="entry-sub">Ajmer, India · June 2023 – September 2025</div>
        <p>Bachelor of Science</p>
      </div>
    `
  },
  contact: {
    name: "Contact", texture:"neptune", tint: 0x5B7FDE, radius: 216, size: 4.9, speed: 0.16,
    real: { map:'neptunemap.jpg' },
    html: `
      <div class="detail-eyebrow">// GET IN TOUCH · PLANET NEPTUNE</div>
      <h2>Contact</h2>
      <div class="contact-line"><span class="k">phone</span><a href="tel:+918000246368">+91-8000246368</a></div>
      <div class="contact-line"><span class="k">email</span><a href="mailto:dileepchoudhary1008@gmail.com">dileepchoudhary1008@gmail.com</a></div>
      <div class="contact-line"><span class="k">linkedin</span><a href="https://www.linkedin.com/in/dileep-choudhary-a01699270/" target="_blank" rel="noopener">linkedin.com/in/dileep-choudhary</a></div>
      <div class="contact-line"><span class="k">github</span><a href="https://github.com/dileep53matrix" target="_blank" rel="noopener">github.com/dileep53matrix</a></div>
      <div class="contact-line"><span class="k">about.me</span><a href="https://about.me/dileepchoudhary" target="_blank" rel="noopener">about.me/dileepchoudhary</a></div>
    `
  }
};

/* ============================================================
   RENDERER / SCENE
   ============================================================ */
const container = document.getElementById('scene-container');
const labelLayer = document.getElementById('label-layer');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 26000);
const CAM_HOME = new THREE.Vector3(0, 110, 300);
const TARGET_HOME = new THREE.Vector3(0, 0, 0);
camera.position.copy(CAM_HOME);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);
const maxAniso = renderer.capabilities.getMaxAnisotropy();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 45;
controls.maxDistance = 8000;
controls.zoomSpeed = 1.3;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.25;
controls.target.copy(TARGET_HOME);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.75, 0.5, 0.22);
composer.addPass(bloomPass);

/* ---------- Loading ---------- */
const loadingManager = new THREE.LoadingManager();
const texLoader = new THREE.TextureLoader(loadingManager);
texLoader.setCrossOrigin('anonymous');
let loadingHidden = false;
function hideLoading(){
  if (loadingHidden) return;
  loadingHidden = true;
  const el = document.getElementById('loading');
  el.style.opacity = '0';
  setTimeout(()=> el.style.display='none', 800);
}
loadingManager.onLoad = hideLoading;
setTimeout(hideLoading, 4000);

function prepColorTex(t){ t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = maxAniso; return t; }

/* ============================================================
   PROCEDURAL FALLBACK TEXTURES (only used if a local image fails)
   ============================================================ */
function blob(ctx, x, y, r, colorInner, colorOuter){
  const g = ctx.createRadialGradient(x,y,0,x,y,r);
  g.addColorStop(0, colorInner);
  g.addColorStop(1, colorOuter);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.ellipse(x,y,r,r*(0.6+Math.random()*0.5),Math.random()*Math.PI,0,Math.PI*2); ctx.fill();
}
function baseCanvas(w=512,h=256){
  const c = document.createElement('canvas'); c.width=w; c.height=h;
  return { c, ctx: c.getContext('2d') };
}
function craterTexture(base1, base2, craterDark, craterLight){
  const {c, ctx} = baseCanvas();
  const g = ctx.createLinearGradient(0,0,0,256);
  g.addColorStop(0, base1); g.addColorStop(1, base2);
  ctx.fillStyle = g; ctx.fillRect(0,0,512,256);
  for(let i=0;i<140;i++){
    const x = Math.random()*512, y = Math.random()*256, r = 3+Math.random()*14;
    blob(ctx, x, y, r, craterDark, 'rgba(0,0,0,0)');
    blob(ctx, x-r*0.3, y-r*0.3, r*0.5, craterLight, 'rgba(0,0,0,0)');
  }
  return new THREE.CanvasTexture(c);
}
function terrestrialTexture(ocean1, ocean2, land, landDark, cloud){
  const {c, ctx} = baseCanvas();
  const g = ctx.createLinearGradient(0,0,0,256);
  g.addColorStop(0, ocean1); g.addColorStop(0.5, ocean2); g.addColorStop(1, ocean1);
  ctx.fillStyle = g; ctx.fillRect(0,0,512,256);
  for(let i=0;i<22;i++){
    const x = Math.random()*512, y = 40+Math.random()*176, r = 18+Math.random()*46;
    blob(ctx, x, y, r, land, 'rgba(0,0,0,0)');
    blob(ctx, x+r*0.2, y+r*0.15, r*0.5, landDark, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(0,0,512,14); ctx.fillRect(0,242,512,14);
  if (cloud){
    for(let i=0;i<26;i++){
      const x = Math.random()*512, y = Math.random()*256, r = 10+Math.random()*30;
      blob(ctx, x, y, r, cloud, 'rgba(255,255,255,0)');
    }
  }
  return new THREE.CanvasTexture(c);
}
function rockyTexture(base1, base2, patchDark, patchLight){
  const {c, ctx} = baseCanvas();
  const g = ctx.createLinearGradient(0,0,0,256);
  g.addColorStop(0, base1); g.addColorStop(0.5, base2); g.addColorStop(1, base1);
  ctx.fillStyle = g; ctx.fillRect(0,0,512,256);
  for(let i=0;i<50;i++){
    const x = Math.random()*512, y = Math.random()*256, r = 10+Math.random()*40;
    blob(ctx, x, y, r, patchDark, 'rgba(0,0,0,0)');
  }
  for(let i=0;i<24;i++){
    const x = Math.random()*512, y = Math.random()*256, r = 4+Math.random()*10;
    blob(ctx, x, y, r, patchLight, 'rgba(0,0,0,0)');
  }
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillRect(0,0,512,8); ctx.fillRect(0,248,512,8);
  return new THREE.CanvasTexture(c);
}
function bandedTexture(colors, spotColor){
  const {c, ctx} = baseCanvas();
  const bands = colors.length;
  for(let i=0;i<bands;i++){
    ctx.fillStyle = colors[i];
    ctx.fillRect(0, (i/bands)*256, 512, 256/bands + 1);
  }
  for(let i=0;i<180;i++){
    const y = Math.random()*256;
    ctx.strokeStyle = `rgba(255,255,255,${0.02+Math.random()*0.05})`;
    ctx.lineWidth = 1+Math.random()*2;
    ctx.beginPath();
    ctx.moveTo(0,y);
    for(let x=0;x<=512;x+=32){ ctx.lineTo(x, y + Math.sin(x*0.03+i)*6); }
    ctx.stroke();
  }
  if (spotColor){ blob(ctx, 340, 150, 26, spotColor, 'rgba(0,0,0,0)'); }
  return new THREE.CanvasTexture(c);
}
function planetTexture(type){
  switch(type){
    case 'mercury': return craterTexture('#9a9a9d', '#5f5f63', 'rgba(40,40,42,0.5)', 'rgba(200,200,205,0.35)');
    case 'venus':   return bandedTexture(['#f4d99b','#e9c17e','#f0cf8c','#e3b06a','#f4d99b'], null);
    case 'earth':   return terrestrialTexture('#0b3d68','#1c6fa8','#2f7a3a','#1e5226','rgba(255,255,255,0.35)');
    case 'mars':    return rockyTexture('#a8481f','#7a2f14','rgba(70,25,10,0.5)','rgba(220,150,110,0.35)');
    case 'jupiter': return bandedTexture(['#d9a066','#c47f4a','#e8c99a','#b5673a','#e0b784','#c47f4a','#d9a066'], '#b5451f');
    case 'saturn':  return bandedTexture(['#e8d9a8','#dfcb92','#ecdfb0','#d6c286','#e8d9a8'], null);
    case 'neptune': return bandedTexture(['#2a4d8f','#3763ad','#2f5a9e','#3f6fbb','#2a4d8f'], '#1c3567');
    default: return craterTexture('#999','#666','#333','#bbb');
  }
}

/* ---------- Milky Way skybox ---------- */
const skyMat = new THREE.MeshBasicMaterial({ side: THREE.BackSide, depthWrite:false });
const sky = new THREE.Mesh(new THREE.SphereGeometry(12000, 64, 64), skyMat);
sky.renderOrder = -1;
scene.add(sky);
texLoader.load(TEX_BASE + 'galaxy_starfield.png', (t) => {
  skyMat.map = prepColorTex(t);
  skyMat.needsUpdate = true;
});

/* ---------- Stars ---------- */
function buildStars(count, spread, size, color){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const r = spread * (0.4 + Math.random()*0.6);
    const theta = Math.random()*Math.PI*2;
    const phi = Math.acos((Math.random()*2)-1);
    pos[i*3]   = r*Math.sin(phi)*Math.cos(theta);
    pos[i*3+1] = r*Math.cos(phi)*0.5;
    pos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ color, size, transparent:true, opacity:0.8, sizeAttenuation:true });
  return new THREE.Points(geo, mat);
}
scene.add(buildStars(4000, 1400, 1.3, 0xffffff));
scene.add(buildStars(1000, 900, 2.2, 0x9fd8ff));
scene.add(buildStars(6000, 7500, 2.4, 0xffffff));
scene.add(buildStars(2000, 6000, 3.4, 0xbcd4ff));

/* ---------- Home spiral galaxy (zoom all the way out to see it) ---------- */
function buildSpiralGalaxy(count, radius, arms, spin, position, tiltX, colorInsideHex, colorOutsideHex){
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(count*3);
  const col = new Float32Array(count*3);
  const colorInside = new THREE.Color(colorInsideHex);
  const colorOutside = new THREE.Color(colorOutsideHex);
  for(let i=0;i<count;i++){
    const r = Math.pow(Math.random(), 0.7) * radius;
    const branch = (i % arms) / arms * Math.PI * 2;
    const spinAngle = r * spin;
    const spread = 0.35 * (1 - r/radius) + 0.08;
    const randX = (Math.random()-0.5) * spread * r;
    const randY = (Math.random()-0.5) * spread * r * 0.25;
    const randZ = (Math.random()-0.5) * spread * r;
    const angle = branch + spinAngle;
    pos[i*3]   = Math.cos(angle) * r + randX;
    pos[i*3+1] = randY;
    pos[i*3+2] = Math.sin(angle) * r + randZ;
    const mixed = colorInside.clone().lerp(colorOutside, Math.min(r/radius,1));
    col[i*3]=mixed.r; col[i*3+1]=mixed.g; col[i*3+2]=mixed.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
  geo.setAttribute('color', new THREE.BufferAttribute(col,3));
  const mat = new THREE.PointsMaterial({ size:7, sizeAttenuation:true, vertexColors:true, transparent:true, opacity:0.9, blending:THREE.AdditiveBlending, depthWrite:false });
  const points = new THREE.Points(geo, mat);
  points.position.copy(position);
  points.rotation.x = tiltX;
  return points;
}
scene.add(buildSpiralGalaxy(9000, 3400, 4, 4.2, new THREE.Vector3(600, -900, -5200), 0.55, '#fff2cf', '#5b8fe0'));

/* distant galaxy glows for depth */
function makeGalaxyGlowTexture(hex){
  const c = document.createElement('canvas'); c.width=256; c.height=256;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(128,128,0,128,128,128);
  g.addColorStop(0, hex+'CC'); g.addColorStop(0.35, hex+'66'); g.addColorStop(1, hex+'00');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
}
const distantGalaxies = [
  { pos:[3200, 900, -3800], color:'#b98cff', scale:420 },
  { pos:[-4200, -600, 2600], color:'#7fdbff', scale:520 },
  { pos:[2600, -1400, 4200], color:'#ff9d8a', scale:360 },
  { pos:[-3000, 1600, -2200], color:'#8affc1', scale:300 },
];
distantGalaxies.forEach(g => {
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGalaxyGlowTexture(g.color), transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.8 }));
  sprite.position.set(...g.pos);
  sprite.scale.set(g.scale, g.scale*0.6, 1);
  scene.add(sprite);
});

/* ---------- Lighting ---------- */
scene.add(new THREE.AmbientLight(0x8a97b8, 1.15));
const sunLight = new THREE.PointLight(0xffe0ab, 3.2, 3000, 1.1);
scene.add(sunLight);

/* ---------- Sun (real sun map) ---------- */
function makeSunTexture(){
  const {c, ctx} = baseCanvas(512,512);
  const g = ctx.createRadialGradient(256,256,20,256,256,256);
  g.addColorStop(0, '#fff3d6'); g.addColorStop(0.4, '#ffcf7a'); g.addColorStop(0.75, '#ff9d4d'); g.addColorStop(1, '#e8712b');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,512);
  return new THREE.CanvasTexture(c);
}
const sunGroup = new THREE.Group();
scene.add(sunGroup);
const sunMat = new THREE.MeshBasicMaterial({ map: makeSunTexture() });
const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(18, 64, 64), sunMat);
sunGroup.add(sunMesh);
texLoader.load(TEX_BASE + 'sunmap.jpg', (t) => {
  sunMat.map = prepColorTex(t);
  sunMat.needsUpdate = true;
});

function makeGlowTexture(hex){
  const {c, ctx} = baseCanvas(256,256);
  const g = ctx.createRadialGradient(128,128,0,128,128,128);
  g.addColorStop(0, hex+'AA'); g.addColorStop(0.4, hex+'55'); g.addColorStop(1, hex+'00');
  ctx.fillStyle = g; ctx.fillRect(0,0,256,256);
  return new THREE.CanvasTexture(c);
}
const sunGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('#ffcf7a'), transparent:true, blending: THREE.AdditiveBlending, depthWrite:false }));
sunGlow.scale.set(90,90,1);
sunGroup.add(sunGlow);

/* ---------- Black hole ---------- */
const BH_POS = new THREE.Vector3(-480, 130, -620);
const CAM_WATCH = new THREE.Vector3(BH_POS.x + 290, BH_POS.y + 170, BH_POS.z + 350);

const blackHoleGroup = new THREE.Group();
blackHoleGroup.position.copy(BH_POS);
scene.add(blackHoleGroup);

const bhCore = new THREE.Mesh(new THREE.SphereGeometry(46,48,48), new THREE.MeshBasicMaterial({ color:0x000000 }));
blackHoleGroup.add(bhCore);

function makeDiskTexture(){
  const {c, ctx} = baseCanvas(512,64);
  const g = ctx.createLinearGradient(0,0,512,0);
  g.addColorStop(0.00,'rgba(255,140,60,0)');
  g.addColorStop(0.15,'rgba(255,160,70,0.9)');
  g.addColorStop(0.5,'rgba(180,140,255,0.95)');
  g.addColorStop(0.85,'rgba(100,180,255,0.9)');
  g.addColorStop(1.00,'rgba(100,180,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,512,64);
  return new THREE.CanvasTexture(c);
}
const disk = new THREE.Mesh(
  new THREE.RingGeometry(58, 130, 128),
  new THREE.MeshBasicMaterial({ map: makeDiskTexture(), side: THREE.DoubleSide, transparent:true, blending: THREE.AdditiveBlending, depthWrite:false })
);
disk.rotation.x = Math.PI/2.4;
blackHoleGroup.add(disk);

const bhGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('#7fa8ff'), transparent:true, blending: THREE.AdditiveBlending, depthWrite:false, opacity:0.7 }));
bhGlow.scale.set(260,260,1);
blackHoleGroup.add(bhGlow);

const bhFlash = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeGlowTexture('#ffffff'), transparent:true, blending: THREE.AdditiveBlending, depthWrite:false, opacity:0 }));
bhFlash.scale.set(10,10,1);
blackHoleGroup.add(bhFlash);

/* ---------- Asteroid belt (between Mars and Jupiter orbits) ---------- */
const beltCount = 850;
const belt = new THREE.InstancedMesh(
  new THREE.DodecahedronGeometry(1, 0),
  new THREE.MeshStandardMaterial({ color: 0x9a938c, roughness: 1, metalness: 0 }),
  beltCount
);
{
  const dummy = new THREE.Object3D();
  for(let i=0;i<beltCount;i++){
    const a = Math.random()*Math.PI*2;
    const r = 128 + Math.random()*18;
    dummy.position.set(Math.cos(a)*r, (Math.random()-0.5)*7, Math.sin(a)*r);
    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    dummy.scale.setScalar(0.14 + Math.random()*0.5);
    dummy.updateMatrix();
    belt.setMatrixAt(i, dummy.matrix);
  }
}
scene.add(belt);

/* ---------- Orbit rings + planets ---------- */
const orbitLines = [];
const orbiters = {}; // key -> { mesh, pivot, radius, speed, extras }

function makeOrbitLine(radius){
  const points = [];
  const seg = 128;
  for(let i=0;i<=seg;i++){
    const a = (i/seg)*Math.PI*2;
    points.push(new THREE.Vector3(Math.cos(a)*radius, 0, Math.sin(a)*radius));
  }
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  const mat = new THREE.LineBasicMaterial({ color: 0x3a4a66, transparent:true, opacity:0.35 });
  const line = new THREE.LineLoop(geo, mat);
  orbitLines.push(line);
  return line;
}

function buildSaturnRing(size){
  const inner = size*1.45, outer = size*2.35;
  const geo = new THREE.RingGeometry(inner, outer, 96, 1);
  const pos = geo.attributes.position, uv = geo.attributes.uv;
  const v = new THREE.Vector3();
  for(let i=0;i<pos.count;i++){
    v.fromBufferAttribute(pos,i);
    uv.setXY(i, (v.length()-inner)/(outer-inner), 1);
  }
  const mat = new THREE.MeshBasicMaterial({ color: 0xd8c08a, side: THREE.DoubleSide, transparent:true, opacity:0.9 });
  const ring = new THREE.Mesh(geo, mat);
  texLoader.load(TEX_BASE + 'saturnringcolor.jpg', (t) => {
    mat.map = prepColorTex(t); mat.color.set(0xffffff); mat.needsUpdate = true;
  });
  texLoader.load(TEX_BASE + 'saturnringpattern.gif', (t) => {
    mat.alphaMap = t; mat.needsUpdate = true;
  });
  ring.rotation.x = Math.PI/2.2;
  return ring;
}

Object.entries(PLANETS).forEach(([key, p]) => {
  scene.add(makeOrbitLine(p.radius));

  const pivot = new THREE.Object3D();
  pivot.rotation.y = Math.random()*Math.PI*2;
  scene.add(pivot);

  const mat = new THREE.MeshPhongMaterial({ map: planetTexture(p.texture), shininess: 14, bumpScale: 0.05 });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.size, 64, 64), mat);
  mesh.position.set(p.radius, 0, 0);
  mesh.userData.key = key;
  pivot.add(mesh);

  // Real surface maps swap in when loaded
  if (p.real.map){
    texLoader.load(TEX_BASE + p.real.map, (t) => { mat.map = prepColorTex(t); mat.needsUpdate = true; });
  }
  if (p.real.bump){
    texLoader.load(TEX_BASE + p.real.bump, (t) => { t.anisotropy = maxAniso; mat.bumpMap = t; mat.needsUpdate = true; });
  }
  if (p.real.spec){
    texLoader.load(TEX_BASE + p.real.spec, (t) => { mat.specularMap = t; mat.specular = new THREE.Color(0x666666); mat.shininess = 26; mat.needsUpdate = true; });
  }

  const extras = {};
  // Earth: drifting cloud layer + orbiting Moon
  if (p.real.clouds){
    const cloudMat = new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(p.size*1.03, 48, 48), cloudMat);
    texLoader.load(TEX_BASE + 'earthcloudmap.jpg', (t) => { cloudMat.alphaMap = t; cloudMat.needsUpdate = true; });
    mesh.add(clouds);
    extras.clouds = clouds;
  }
  if (p.real.moon){
    const moonPivot = new THREE.Object3D();
    mesh.add(moonPivot);
    const moonMat = new THREE.MeshPhongMaterial({ map: craterTexture('#b0b0b4','#77777b','rgba(40,40,42,0.5)','rgba(210,210,215,0.4)'), bumpScale: 0.04 });
    const moon = new THREE.Mesh(new THREE.SphereGeometry(p.size*0.27, 32, 32), moonMat);
    texLoader.load(TEX_BASE + 'moonmap1k.jpg', (t) => { moonMat.map = prepColorTex(t); moonMat.needsUpdate = true; });
    texLoader.load(TEX_BASE + 'moonbump1k.jpg', (t) => { moonMat.bumpMap = t; moonMat.needsUpdate = true; });
    moon.position.set(p.size*2.3, p.size*0.3, 0);
    moonPivot.add(moon);
    extras.moonPivot = moonPivot;
  }
  if (p.ring){
    mesh.add(buildSaturnRing(p.size));
  }

  // soft atmosphere glow
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('#' + p.tint.toString(16).padStart(6,'0')),
    transparent:true, blending: THREE.AdditiveBlending, depthWrite:false, opacity: 0.32
  }));
  atmo.scale.set(p.size*3.4, p.size*3.4, 1);
  mesh.add(atmo);

  orbiters[key] = { mesh, pivot, radius: p.radius, speed: p.speed, extras };

  const label = document.createElement('div');
  label.className = 'planet-label';
  label.dataset.testid = `planet-label-${key}`;
  label.innerHTML = `<span class="dot" style="background:#${p.tint.toString(16).padStart(6,'0')}"></span>${p.name}`;
  label.addEventListener('click', () => openDetail(key));
  labelLayer.appendChild(label);
  p._labelEl = label;
});

/* ============================================================
   BLACK HOLE SHOW — click empty space: every planet visibly
   spirals into the black hole, flash, then all return.
   ============================================================ */
let suck = null; // { phase:'in'|'hold'|'out', elapsed }
const SUCK_IN = 2.8, SUCK_HOLD = 1.0, SUCK_OUT = 2.8;

function smoothstep(t){ return t*t*(3-2*t); }

function startSuck(){
  if (suck || overlay.classList.contains('open')) return;
  suck = { phase:'in', elapsed:0 };
  controls.enabled = false;
  controls.autoRotate = false;
  labelLayer.style.opacity = '0';
  labelLayer.style.pointerEvents = 'none';
  Object.values(orbiters).forEach(o => {
    const wp = new THREE.Vector3();
    o.mesh.getWorldPosition(wp);
    scene.attach(o.mesh);
    o.suckR0 = Math.hypot(wp.x - BH_POS.x, wp.z - BH_POS.z);
    o.suckA0 = Math.atan2(wp.z - BH_POS.z, wp.x - BH_POS.x);
    o.suckY0 = wp.y - BH_POS.y;
  });
}

function finishSuck(){
  Object.values(orbiters).forEach(o => {
    o.pivot.attach(o.mesh);
    o.mesh.position.set(o.radius, 0, 0);
    o.mesh.scale.setScalar(1);
    o.mesh.visible = true;
  });
  bhGlow.material.opacity = 0.7;
  bhGlow.scale.set(260,260,1);
  bhFlash.material.opacity = 0;
  bhFlash.scale.set(10,10,1);
  suck = null;
  controls.autoRotate = true;
  controls.enabled = true;
  labelLayer.style.opacity = '1';
  labelLayer.style.pointerEvents = 'auto';
}

function updateSuck(dt){
  suck.elapsed += dt;
  if (suck.phase === 'in'){
    const t = Math.min(suck.elapsed/SUCK_IN, 1);
    const e = smoothstep(t);        // camera easing
    const g = Math.pow(t, 1.8);     // gravity accelerates the pull
    camera.position.lerpVectors(CAM_HOME, CAM_WATCH, e);
    controls.target.lerpVectors(TARGET_HOME, BH_POS, e);
    Object.values(orbiters).forEach(o => {
      const r = Math.max(o.suckR0*(1-g), 0.001);
      const ang = o.suckA0 + g*7.0;
      o.mesh.position.set(BH_POS.x + Math.cos(ang)*r, BH_POS.y + o.suckY0*(1-g), BH_POS.z + Math.sin(ang)*r);
      o.mesh.scale.setScalar(Math.max(1-g, 0.02));
      o.mesh.rotation.y += dt*(4 + 18*g);
    });
    orbitLines.forEach(l => l.material.opacity = 0.35*(1-t));
    disk.rotation.z += dt*2.5*g;
    if (t >= 1){
      suck.phase = 'hold'; suck.elapsed = 0;
      Object.values(orbiters).forEach(o => o.mesh.visible = false);
    }
  } else if (suck.phase === 'hold'){
    const t = Math.min(suck.elapsed/SUCK_HOLD, 1);
    const pulse = Math.sin(t*Math.PI);
    bhGlow.material.opacity = 0.7 + pulse*0.3;
    bhGlow.scale.setScalar(260 + pulse*260);
    bhFlash.material.opacity = pulse*0.9;
    bhFlash.scale.setScalar(60 + pulse*480);
    disk.rotation.z += dt*3*pulse;
    if (t >= 1){
      suck.phase = 'out'; suck.elapsed = 0;
      bhFlash.material.opacity = 0;
      Object.values(orbiters).forEach(o => { o.mesh.visible = true; o.mesh.scale.setScalar(0.02); });
    }
  } else { // out — planets spiral back out to their orbits
    const t = Math.min(suck.elapsed/SUCK_OUT, 1);
    const e = smoothstep(t);
    camera.position.lerpVectors(CAM_WATCH, CAM_HOME, e);
    controls.target.lerpVectors(BH_POS, TARGET_HOME, e);
    Object.values(orbiters).forEach(o => {
      const r = o.suckR0*(1-e);
      const ang = o.suckA0 + (1-e)*7.0;
      o.mesh.position.set(BH_POS.x + Math.cos(ang)*r, BH_POS.y + o.suckY0*(1-e), BH_POS.z + Math.sin(ang)*r);
      o.mesh.scale.setScalar(0.02 + e*0.98);
      o.mesh.rotation.y += dt*(18*(1-e) + 4);
    });
    orbitLines.forEach(l => l.material.opacity = 0.35*t);
    if (t >= 1) finishSuck();
  }
}

/* ============================================================
   PANEL OPEN / CLOSE — click a planet, get its details
   ============================================================ */
const overlay = document.getElementById('detail-overlay');
const detailContent = document.getElementById('detail-content');
const detailPanel = document.getElementById('detail-panel');
document.getElementById('detail-close').addEventListener('click', closeDetail);
document.getElementById('detail-scrim').addEventListener('click', closeDetail);

function openDetail(key){
  if (suck) return;
  const p = PLANETS[key];
  detailContent.innerHTML = p.html;
  const hex = '#' + p.tint.toString(16).padStart(6,'0');
  detailPanel.style.setProperty('--panel-accent', hex);
  detailPanel.style.setProperty('--panel-glow', hex + '40');
  overlay.classList.add('open');
}
function closeDetail(){
  overlay.classList.remove('open');
}
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeDetail(); });

/* ============================================================
   RAYCAST CLICK — planet = details, empty space = black hole
   ============================================================ */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let downX = 0, downY = 0;
renderer.domElement.addEventListener('pointerdown', (e) => { downX = e.clientX; downY = e.clientY; });
renderer.domElement.addEventListener('click', (e) => {
  if (overlay.classList.contains('open') || suck) return;
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return; // was a drag, not a click
  mouse.x = (e.clientX/window.innerWidth)*2 - 1;
  mouse.y = -(e.clientY/window.innerHeight)*2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(Object.values(orbiters).map(o=>o.mesh), false);
  if (hits.length){
    openDetail(hits[0].object.userData.key);
  } else {
    startSuck();
  }
});

/* ============================================================
   RESIZE
   ============================================================ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================================
   ANIMATE
   ============================================================ */
const tmpVec = new THREE.Vector3();
const clock = new THREE.Clock();

function updateLabels(){
  Object.entries(orbiters).forEach(([key, o]) => {
    const p = PLANETS[key];
    o.mesh.getWorldPosition(tmpVec);
    const proj = tmpVec.clone().project(camera);
    const behind = proj.z > 1;
    const x = (proj.x*0.5+0.5)*window.innerWidth;
    const y = (-proj.y*0.5+0.5)*window.innerHeight;
    const el = p._labelEl;
    if (behind || x < -100 || x > window.innerWidth+100){
      el.style.display = 'none';
    } else {
      el.style.display = 'block';
      el.style.left = x + 'px';
      el.style.top = y + 'px';
    }
  });
}

function animate(){
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);

  sunMesh.rotation.y += dt*0.05;
  sky.rotation.y += dt*0.002;
  belt.rotation.y += dt*0.02;
  disk.rotation.z += dt*0.12;

  if (!suck){
    Object.values(orbiters).forEach(o => {
      o.pivot.rotation.y += dt*0.06*o.speed;
      o.mesh.rotation.y += dt*0.4;
      if (o.extras.clouds) o.extras.clouds.rotation.y += dt*0.12;
      if (o.extras.moonPivot) o.extras.moonPivot.rotation.y += dt*0.6;
    });
  } else {
    updateSuck(dt);
  }

  controls.update();
  updateLabels();
  composer.render();
}

animate();
