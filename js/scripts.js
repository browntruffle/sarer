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

async function fetchFromYouTube(){
  if(!CONFIG.API_KEY || !CONFIG.CHANNEL_ID) return false;
  try{
    const url = `https://www.googleapis.com/youtube/v3/search?key=${CONFIG.API_KEY}&channelId=${CONFIG.CHANNEL_ID}&part=snippet,id&order=date&maxResults=6`;
    const res = await fetch(url);
    const data = await res.json();
    if(data.items){
      const videos = data.items.filter(i=>i.id.kind==='youtube#video').map(i=>({id:i.id.videoId,title:i.snippet.title}));
      renderVideos(videos);
      return true;
    }
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
