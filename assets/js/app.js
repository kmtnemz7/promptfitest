// ---- Config ----
const RECIPIENT = "C8X7hd8xD36kX3Ddh2qf3NNDYaFgQBrjtJVJpU5DHEAr";
const PRICES = { p0: 0.00, p1: 0.30, p2: 0.12, p3: 0.40, p4: 0.18, p5: 0.22, p6: 0.25 };
const DATA = [
  {id:'p0', title:'FREE: Prompt Starter Pack', cat:'Content', model:'Any', lang:'EN', price:PRICES.p0,
    full:'Starter pack with 5 versatile prompts: 1) Write a concise product description with USP and CTA. 2) Create a tweet thread outline with 3 hook options. 3) Draft a landing page hero line with 3 value props. 4) Produce a YouTube video outline with hook and segment beats. 5) Generate a growth experiment idea with KPI and hypothesis.',
    preview:'Try PromptFi with a free starter pack of 5 versatile prompts (copy, thread, hero, YT, growth).'},
  {id:'p1', title:'Pro Graphic Design Prompt', cat:'Design', model:'Midjourney/GPT', lang:'EN', price:PRICES.p1,
    full:'You are an award-winning brand designer... Create a futuristic, minimal logo brief with constraints, mood, palette, typography, and export specs.',
    preview:'Create a futuristic, minimal logo brief with constraints, mood, palette...'},
  {id:'p2', title:'Viral X Thread Prompt', cat:'Marketing', model:'Any', lang:'EN', price:PRICES.p2,
    full:'Act as a viral ghostwriter... Output a 10-tweet thread with 3 hook variants, pacing, meme moments, and measurable CTA.',
    preview:'Output a 10-tweet thread with 3 hook variants, pacing, meme moments...'},
  {id:'p3', title:'DeFi Whitepaper Outline', cat:'Crypto', model:'GPT', lang:'EN', price:PRICES.p3,
    full:'You are a DeFi strategist... Produce a rigorous whitepaper outline: problem, protocol design, tokenomics, risk, KPIs, and roadmap.',
    preview:'Produce a rigorous whitepaper outline: problem, design, tokenomics...'},
  {id:'p4', title:'YouTube Script Prompt', cat:'Content', model:'GPT', lang:'EN', price:PRICES.p4,
    full:'You are a senior YouTube scriptwriter... Write a 7-minute script with hook, open loop, 3 segments, and strong CTA variations.',
    preview:'Write a 7-minute script with hook, open loop, 3 segments...'},
  {id:'p5', title:'Landing Page Copy Prompt', cat:'Marketing', model:'GPT', lang:'EN', price:PRICES.p5,
    full:'Act as a senior conversion copywriter... Produce hero, value props, and CTA variants with tone sliders and A/B test hooks.',
    preview:'Produce hero, value props, and CTA variants with tone sliders...'},
  {id:'p6', title:'Strategy: DeFi Growth Plan', cat:'Crypto', model:'GPT', lang:'EN', price:PRICES.p6,
    full:'You are a DeFi growth lead... Create a 30-day growth plan with KPIs, channels, experiments, and reporting cadence.',
    preview:'Create a 30-day growth plan with KPIs, channels, experiments...'}
];

let connection = null;
let provider = null;
let walletPubkey = null;
let currentRoute = '';

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const toast=(m)=>{const t=$('#toast'); t.textContent=m; t.style.display='block'; setTimeout(()=>t.style.display='none',2400)};
const priceLabel=(n)=> (n<=0? 'FREE' : (Math.round(n*100)/100).toFixed(2)+' SOL');

// ---- Router ----
const routes = {
  '': 'home',
  'home': 'home',
  'explore': 'explore', 
  'creators': 'creators',
  'purchases': 'purchases'
};

function getRoute() {
  const hash = window.location.hash.slice(1) || '';
  const route = hash.split('/')[0];
  return routes[route] || routes[''];
}

function navigateTo(path) {
  if (path.startsWith('#')) path = path.slice(1);
  window.location.hash = '#' + path;
}

function hideAllSections() {
  const sectionsToHide = ['home', 'how', 'market', 'creators', 'purchases'];
  sectionsToHide.forEach(id => {
    const el = $('#' + id);
    if (el) el.style.display = 'none';
  });
  const heroBg = $('.hero-bg');
  if (heroBg) heroBg.style.display = 'none';
}
  const filters = $('.filters');
  if (filters) filters.style.display = 'none';
}

function showRoute(route) {
  hideAllSections();
  currentRoute = route;
  
  switch(route) {
    case 'home':
      showHome();
      break;
    case 'explore':
      showExplore(); 
      break;
    case 'creators':
      showCreators();
      break;
    case 'purchases':
      showPurchases();
      break;
    default:
      showHome();
      break;
  }
}

function showHome() {
  const heroSection = $('#home');
  const howSection = $('#how');
  if (heroSection) heroSection.style.display = 'block';
  if (howSection) howSection.style.display = 'block';
}

function showExplore() {
  const filtersSection = $('.filters');
  const marketSection = $('#market');
  
  if (filtersSection) filtersSection.style.display = 'block';
  if (marketSection) marketSection.style.display = 'block';
  
  renderGrid(DATA);
  applyFilters();
}

function showCreators() {
  const creatorsSection = $('#creators');
  if (creatorsSection) creatorsSection.style.display = 'block';
}

function showPurchases() {
  const purchasesSection = $('#purchases');
  if (purchasesSection) purchasesSection.style.display = 'block';
  renderPurchases();
}

// ---- Dropdown Menu ----
function initDropdownMenu() {
  const menuTrigger = $('#menu-trigger');
  const menuDropdown = $('#menu-dropdown');
  
  if (!menuTrigger || !menuDropdown) return;
  
  let isOpen = false;
  
  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    menuDropdown.style.display = 'block';
    menuTrigger.setAttribute('aria-expanded', 'true');
    
    const firstItem = menuDropdown.querySelector('a');
    if (firstItem) firstItem.focus();
  }
  
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;
    menuDropdown.style.display = 'none';
    menuTrigger.setAttribute('aria-expanded', 'false');
    menuTrigger.focus();
  }
  
  menuTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOpen) closeMenu();
    else openMenu();
  });
  
  menuDropdown.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        navigateTo(href.slice(1));
      }
      closeMenu();
    }
  });
  
  document.addEventListener('click', (e) => {
    if (isOpen && !menuTrigger.contains(e.target) && !menuDropdown.contains(e.target)) {
      closeMenu();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closeMenu();
    }
  });
  
  menuDropdown.addEventListener('keydown', (e) => {
    const items = Array.from(menuDropdown.querySelectorAll('a'));
    const currentIndex = items.indexOf(document.activeElement);
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        items[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault(); 
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        items[prevIndex].focus();
        break;
      case 'Tab':
        if (e.shiftKey && currentIndex === 0) {
          closeMenu();
        } else if (!e.shiftKey && currentIndex === items.length - 1) {
          closeMenu();
        }
        break;
    }
  });
}

// ---- Card and Grid Functions ----
const card=(p)=>`
  <article class="card prompt-card" style="display: flex; flex-direction: column;">
    <div style="height:160px;border-bottom:1px solid var(--b);background:
      radial-gradient(80px 80px at 20% 30%, rgba(168,85,247,.25), transparent 60%),
      radial-gradient(80px 80px at 80% 40%, rgba(6,182,212,.25), transparent 60%);"></div>
    <div class="card-body" style="display: flex; flex-direction: column; flex: 1;">
      <div class="kv"><div><strong>${p.title}</strong><div class="muted">${p.cat} • ${p.model} • ${p.lang}</div></div><span class="badge">${priceLabel(p.price)}</span></div>
      <p class="muted" style="margin-top:8px;min-height:44px;flex:1">${p.preview}</p>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn" data-view="${p.id}">Personalize</button>
        <button class="btn glow" data-buy="${p.id}">${p.price<=0?'Get Free':'Buy'}</button>
      </div>
    </div>
  </article>`;

function renderGrid(list){
  const grid = $('#grid'); 
  if (!grid) return;
  
  const skeleton = $('#skeleton');
  if (skeleton) skeleton.style.display = 'none';
  
  grid.innerHTML = list.map(card).join('');
  $$('[data-view]').forEach(b=>b.addEventListener('click', ()=>openModal(b.getAttribute('data-view'))));
  $$('[data-buy]').forEach(b=>b.addEventListener('click', ()=>buyPrompt(b.getAttribute('data-buy'))));
}

function applyFilters(){
  const q = $('#q');
  const catVal = $('#cat_val');
  const sortVal = $('#sort_val');
  
  if (!q || !catVal || !sortVal) return;
  
  const query = q.value.toLowerCase().trim();
  const cat = catVal.dataset.value || '';
  const sort = sortVal.dataset.value || 'default';
  
  let list = DATA.filter(p => {
    const hay = (p.title+' '+p.cat).toLowerCase();
    if (cat && p.cat!==cat) return false;
    return !query || hay.includes(query);
  });
  
  if (sort === 'priceAsc') list.sort((a,b)=>a.price-b.price);
  if (sort === 'priceDesc') list.sort((a,b)=>b.price-a.price);
  if (sort === 'alpha') list.sort((a,b)=>a.title.localeCompare(b.title));
  renderGrid(list);
}

// ---- FIXED DROPDOWN FUNCTION ----
function dropdown(rootId, items){
  const root = document.getElementById(rootId);
  if (!root) return;
  
  const summary = root.querySelector('summary');
  const val = root.querySelector('.value');
  const menu = root.querySelector('.menu');
  if (!val || !menu || !summary) return;
  
  // Populate menu items
  menu.innerHTML = items.map(([key, text])=>`<button data-k="${key}">${text}</button>`).join('');
  
  // Handle summary click to toggle dropdown
  summary.addEventListener('click', (e) => {
    e.preventDefault();
    if (root.hasAttribute('open')) {
      root.removeAttribute('open');
    } else {
      root.setAttribute('open', '');
    }
  });
  
  // Handle menu item selection
  menu.addEventListener('click', (e) => {
    const k = e.target?.dataset?.k;
    if (!k) return;
    
    // Update the selected value
    val.dataset.value = k === '__all' ? '' : k;
    val.textContent = items.find(x => x[0] === k)?.[1] || items[0][1];
    
    // Close the dropdown
    root.removeAttribute('open');
    
    // Apply filters
    applyFilters();
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      root.removeAttribute('open');
    }
  });
  
  // Handle keyboard navigation
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      root.removeAttribute('open');
      summary.focus();
    }
  });
  
  // Handle keyboard navigation within menu
  menu.addEventListener('keydown', (e) => {
    const buttons = Array.from(menu.querySelectorAll('button'));
    const currentIndex = buttons.indexOf(e.target);
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        const nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        buttons[nextIndex].focus();
        break;
      case 'ArrowUp':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        buttons[prevIndex].focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        e.target.click();
        break;
    }
  });
}

// ---- Modal Functions ----
function openModal(id, unlocked=false, sig=null){
  const p = DATA.find(x=>x.id===id); if(!p) return;
  const mTitle = $('#mTitle');
  const mMeta = $('#mMeta');
  const mText = $('#mText');
  const copyBtn = $('#copyBtn');
  const txLink = $('#txLink');
  const modal = $('#modal');
  
  if (!mTitle || !mMeta || !mText || !modal) return;
  
  mTitle.textContent = p.title + (unlocked ? ' — Unlocked' : ' — Preview');
  mMeta.textContent = `${p.cat} • ${p.model} • ${p.lang} — ${priceLabel(p.price)}`;
  
  const owned = localStorage.getItem('pf_owned_'+id)==='1' || unlocked;
  const brief = $('#uBrief')?.value?.trim() || '';
  
  mText.textContent = owned ? p.full : (brief ? (`Preview with your brief: `+brief.slice(0,160)+'…') : p.preview);
  
  if (copyBtn) copyBtn.classList.toggle('hidden', !owned);
  if (txLink) {
    if (sig) {
      txLink.href = 'https://solscan.io/tx/'+sig;
      txLink.classList.remove('hidden');
    } else {
      txLink.classList.add('hidden');
    }
  }
  
  modal.style.display = 'flex';
  
  const buyNow = $('#buyNow');
  if (buyNow) {
    buyNow.textContent = p.price<=0? 'Get Free' : 'Buy & Unlock';
    buyNow.onclick = ()=>buyPrompt(id);
  }
}

// ---- Purchase Functions ----
function savePurchase(id, sig, brief, contact){
  const now = new Date().toISOString();
  const rec = { id, sig, at: now, brief, contact };
  const list = JSON.parse(localStorage.getItem('pf_purchases')||'[]');
  list.unshift(rec);
  localStorage.setItem('pf_purchases', JSON.stringify(list));
  localStorage.setItem('pf_owned_'+id, '1');
  renderPurchases();
}

function renderPurchases(){
  const box = $('#purchasesList');
  if (!box) return;
  
  const list = JSON.parse(localStorage.getItem('pf_purchases')||'[]');
  if (!list.length) { box.textContent = 'No purchases yet.'; return; }
  
  box.innerHTML = list.map(r => {
    const p = DATA.find(x=>x.id===r.id);
    const title = p? p.title : r.id;
    const linkA = r.sig && r.sig!=='FREE' ? `<a class="underline" href="https://solscan.io/tx/${r.sig}" target="_blank">Solscan</a>` : '<span class="muted">Free</span>';
    const brief = r.brief ? `<div class="muted" style="margin-top:4px">Brief: ${r.brief.slice(0,140)}</div>` : '';
    const contact = r.contact ? `<div class="muted">Contact: ${r.contact}</div>` : '';
    return `<div class="kv" style="padding:12px 0;border-bottom:1px solid var(--b)">
        <div><div><strong>${title}</strong></div>
        <div class="muted">${new Date(r.at).toLocaleString()}</div>${brief}${contact}</div>
        <div style="display:flex;gap:8px">
          ${linkA}<button class="btn" data-reopen="${r.id}">View</button>
        </div>
      </div>`;
  }).join('');
  
  $$('[data-reopen]').forEach(b=>b.addEventListener('click', ()=>openModal(b.getAttribute('data-reopen'), true)));
}

// ---- Wallet Functions ----
async function getProvider(){
  return window.solana ?? window.phantom?.solana ?? null;
}

async function connectWallet(){
  try {
    provider = await getProvider();
    if (!provider || !provider.isPhantom) { toast('Phantom not found. Install Phantom.'); return; }
    const resp = await provider.connect();
    walletPubkey = resp.publicKey;
    const addr = $('#addr');
    const walletBtn = $('#walletBtn');
    if (addr) addr.textContent = 'Wallet: ' + walletPubkey.toBase58().slice(0,4)+'…'+walletPubkey.toBase58().slice(-4);
    if (walletBtn) walletBtn.textContent = 'Disconnect Wallet';
    toast('Wallet connected');
  } catch(e) {
    console.error('Wallet connection failed:', e);
    toast('Wallet connection failed');
  }
}

async function disconnectWallet(){
  try { 
    if (provider) await provider.disconnect(); 
  } catch(e){
    console.error('Wallet disconnect failed:', e);
  }
  walletPubkey = null;
  const addr = $('#addr');
  const walletBtn = $('#walletBtn');
  if (addr) addr.textContent = 'Wallet: not connected';
  if (walletBtn) walletBtn.textContent = 'Connect Wallet';
  toast('Wallet disconnected');
}

async function toggleWallet(){ 
  if (walletPubkey) return disconnectWallet(); 
  else return connectWallet(); 
}

// ---- Buy Function ----
async function buyPrompt(id){
  try {
    const p = DATA.find(x=>x.id===id);
    if (!p) return;
    
    const briefEl = $('#uBrief');
    const contactEl = $('#uContact');
    const brief = briefEl?.value?.trim() || '';
    const contact = contactEl?.value?.trim() || '';
    
    if (brief.length < 3) return toast('Please enter a short brief.');
    if (!contact) return toast('Add your contact (email or Telegram).');

    if (p.price <= 0) {
      savePurchase(id, 'FREE', brief, contact);
      openModal(id, true, null);
      toast('Unlocked (free) ✅');
      return;
    }

    if (!walletPubkey) { await connectWallet(); if(!walletPubkey) return; }
    
    const amount = p.price;
    toast('Preparing transaction…');
    const lamports = Math.round(amount * solanaWeb3.LAMPORTS_PER_SOL);
    const tx = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: walletPubkey,
        toPubkey: new solanaWeb3.PublicKey(RECIPIENT),
        lamports
      })
    );
    tx.feePayer = walletPubkey;
    const latest = await connection.getLatestBlockhash('finalized');
    tx.recentBlockhash = latest.blockhash;
    toast('Waiting for signature…');
    const signed = await provider.signTransaction(tx);
    const sig = await connection.sendRawTransaction(signed.serialize());
    toast('Confirming (finalized)…');
    await connection.confirmTransaction({ signature: sig }, 'finalized');
    savePurchase(id, sig, brief, contact);
    openModal(id, true, sig);
    toast('Unlocked ✅');
  } catch(e) {
    console.error('Payment error:', e);
    toast('Payment failed or cancelled');
  }
}

// ---- Event Handlers ----
function setupEventHandlers() {
  const copyBtn = $('#copyBtn');
  if (copyBtn) {
    copyBtn.onclick = () => { 
      const mText = $('#mText');
      if (mText && navigator.clipboard) {
        navigator.clipboard.writeText(mText.textContent); 
        toast('Copied'); 
      }
    };
  }
  
  window.closeModal = () => { 
    const modal = $('#modal');
    if (modal) modal.style.display = 'none'; 
  };
  
  const walletBtn = $('#walletBtn');
  if (walletBtn) walletBtn.onclick = toggleWallet;
  
  const searchInput = $('#q');
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
      e.preventDefault();
      const href = e.target.getAttribute('href').slice(1);
      navigateTo(href);
    }
  });
  
  window.addEventListener('hashchange', () => {
    const route = getRoute();
    showRoute(route);
  });
}

// ---- Initialization ----
window.addEventListener('load', async () => {
  try { 
    if (window.solanaWeb3) {
      connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed'); 
    }
  } catch(e){ 
    console.error('Solana connection failed:', e); 
    toast('Failed to init Solana SDK'); 
  }

  dropdown('cat', [['__all','All'], ['Design','Design'], ['Marketing','Marketing'], ['Crypto','Crypto'], ['Content','Content']]);
  dropdown('sort', [['default','Default'], ['priceAsc','Price ↑'], ['priceDesc','Price ↓'], ['alpha','A → Z']]);

  setupEventHandlers();
  initDropdownMenu();
  
  const initialRoute = getRoute();
  showRoute(initialRoute);
  
  renderPurchases();
});
// --- Page loader (3s on first load and route changes) ---
// --- Page loader (duration control) ---
(function () {
  const loader = document.getElementById('pageLoader');
  if (!loader) return;

  function hideLoader(){ loader.classList.add('is-hidden'); }
  function showLoader(ms=1650){
    loader.classList.remove('is-hidden');
    return new Promise(res => setTimeout(() => { hideLoader(); res(); }, ms));
  }

  // Initial load: keep visible, then hide after 3s
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 1650));
  } else {
    setTimeout(hideLoader, 1650);
  }

  // Show loader when navigating via internal links (class="internal-link")
// Handle internal links: paths AND hashes (/#explore, #how, etc.)
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;

  const href = a.getAttribute('href') || '';

  // same-page hash (e.g. "#explore") or root+# ("/#explore")
  if (href.startsWith('#') || href.startsWith('/#')) {
    e.preventDefault();
    const hash = href.startsWith('/#') ? href.slice(1) : href; // normalize to "#id"
    showLoader(LOAD_MS).then(() => {
      // update the URL hash without reloading
      history.pushState(null, '', hash);
      // optional: jump to target after loader hides
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return;
  }

  // same-origin path navigation (e.g. "/explore")
  if (href.startsWith('/')) {
    e.preventDefault();
    showLoader(LOAD_MS).then(() => { window.location.href = href; });
  }
});

  // Expose for manual use if you add a client router later
  window.PFLoader = { show: showLoader, hide: hideLoader };
})();

