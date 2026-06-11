// Configuration (optional): set API_KEY and CHANNEL_ID to fetch latest automatically.
const CONFIG = {
  API_KEY: 'AIzaSyADX9vquIZU4Wb7BifYgrYkXgp_UNmP9oo',
  CHANNEL_ID: 'UCUcbceZxb_OnDpgSJAOsXEA', // provided by user
  CHANNEL_NAME: 'Alex Benjamin Kyeyune'
};

function buildYouTubeChannelUrl(name, channelId){
  if(channelId) return `https://www.youtube.com/channel/${channelId}`;
  if(!name) return 'https://www.youtube.com/';
  const handle = name.trim().replace(/\s+/g,'');
  return `https://www.youtube.com/@${encodeURIComponent(handle)}`;
}

function populateYouTubeLinks(){
  const url = buildYouTubeChannelUrl(CONFIG.CHANNEL_NAME);
  document.querySelectorAll('.youtube-link').forEach(a=>{ a.href = url; a.target = '_blank'; a.rel = 'noopener'; });
}

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

async function loadSampleVideos(){
  try{
    const res = await fetch('data/videos.json');
    const arr = await res.json();
    renderVideos(arr);
  }catch(e){
    document.getElementById('videos-list').textContent = 'Unable to load videos.';
  }
}

function renderVideos(videos){
  const container = document.getElementById('videos-list');
  container.innerHTML = '';
  videos.forEach(v=>{
    const card = document.createElement('div');
    card.className = 'video-card';
    card.innerHTML = `
      <div class="embed">
        <iframe src="https://www.youtube.com/embed/${v.id}" title="${escapeHtml(v.title)}" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="video-title">${escapeHtml(v.title)}</div>
    `;
    container.appendChild(card);
  });
}

function escapeHtml(s){
  return (s||'').replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;' }[c]));
}

function parseDuration(iso){
  // Parse ISO 8601 duration e.g. PT1M30S → seconds
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if(!m) return 0;
  return (parseInt(m[1]||0)*3600)+(parseInt(m[2]||0)*60)+(parseInt(m[3]||0));
}

function renderShorts(videos){
  const container = document.getElementById('shorts-list');
  if(!container) return;
  container.innerHTML = '';
  if(!videos.length){ container.textContent = 'No Shorts yet.'; return; }
  videos.forEach(v=>{
    const card = document.createElement('div');
    card.className = 'short-card';
    card.innerHTML = `
      <div class="short-embed">
        <iframe src="https://www.youtube.com/embed/${v.id}" title="${escapeHtml(v.title)}" allowfullscreen loading="lazy"></iframe>
      </div>
      <div class="video-title">${escapeHtml(v.title)}</div>
    `;
    container.appendChild(card);
  });
}

async function fetchFromYouTube(){
  if(!CONFIG.API_KEY || !CONFIG.CHANNEL_ID) return false;
  try{
    // Fetch recent videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.API_KEY}&channelId=${CONFIG.CHANNEL_ID}&part=snippet,id&order=date&maxResults=20&type=video`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    if(!searchData.items) return false;

    const ids = searchData.items.map(i=>i.id.videoId).join(',');
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${CONFIG.API_KEY}&id=${ids}&part=contentDetails,snippet`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();
    if(!detailsData.items) return false;

    const shorts = [];
    const longform = [];
    detailsData.items.forEach(v=>{
      const secs = parseDuration(v.contentDetails.duration);
      const item = {id: v.id, title: v.snippet.title};
      if(secs <= 60) shorts.push(item);
      else longform.push(item);
    });

    renderShorts(shorts.slice(0,6));
    renderVideos(longform.slice(0,6));
    return true;
  }catch(e){
    console.error('YouTube fetch failed',e);
  }
  return false;
}

async function loadLocalConfig(){
  try{
    const res = await fetch('js/config.json', {cache: 'no-store'});
    if(!res.ok) return;
    const obj = await res.json();
    if(obj.API_KEY) CONFIG.API_KEY = obj.API_KEY;
    if(obj.CHANNEL_ID) CONFIG.CHANNEL_ID = obj.CHANNEL_ID;
    if(obj.CHANNEL_NAME) CONFIG.CHANNEL_NAME = obj.CHANNEL_NAME;
  }catch(e){
    // no local config
  }
}

(async function init(){
  await loadLocalConfig();
  const ok = await fetchFromYouTube();
  if(!ok) await loadSampleVideos();
  populateYouTubeLinks();
})();

// Floating particles
(function spawnParticles(){
  const container = document.getElementById('particles');
  if(!container) return;
  const colors = ['rgba(255,77,77,0.6)','rgba(255,149,0,0.5)','rgba(255,77,77,0.3)','rgba(255,200,100,0.4)'];
  for(let i = 0; i < 28; i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:-10px;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*12+8}s;
      animation-delay:${Math.random()*10}s;
      filter:blur(${Math.random()*1.5}px);
    `;
    container.appendChild(p);
  }
})();

// Scroll reveal
(function scrollReveal(){
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.15});
  els.forEach(el=>io.observe(el));
})();
