 const hexCanvas = document.getElementById('hexCanvas');
    const hexCtx = hexCanvas.getContext('2d');
    let W, H, DPR;
    let hexagons = [];
    let circles = [];

    function resizeHexCanvas(){
      W = window.innerWidth; 
      H = window.innerHeight;
      DPR = window.devicePixelRatio || 1;
      hexCanvas.width = W * DPR; 
      hexCanvas.height = H * DPR;
      hexCtx.setTransform(DPR,0,0,DPR,0,0);
      initShapes();
    }

    function initShapes(){
      hexagons = [];
      circles = [];
      const hexCount = 120;
      for(let i=0; i<hexCount; i++){
        hexagons.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 15 + Math.random() * 30,
          opacity: 0.1 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4
        });
      }
      const circleCount = 80;
      for(let i=0; i<circleCount; i++){
        circles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          rad: 1 + Math.random() * 6,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3
        });
      }
    }

    function hexVerts(x, y, r){
      const verts = [];
      for(let i=0; i<6; i++){
        const a = Math.PI/3 * i + Math.PI/6;
        verts.push({x: x + r * Math.cos(a), y: y + r * Math.sin(a)});
      }
      return verts;
    }

    function updateHex(){
      for(const h of hexagons){
        h.x += h.vx; 
        h.y += h.vy;
        if(h.x < -h.r) h.x = W + h.r;
        if(h.x > W + h.r) h.x = -h.r;
        if(h.y < -h.r) h.y = H + h.r;
        if(h.y > H + h.r) h.y = -h.r;
      }
      for(const c of circles){
        c.x += c.vx; 
        c.y += c.vy;
        if(c.x < -c.rad*3) c.x = W + c.rad*3;
        if(c.x > W + c.rad*3) c.x = -c.rad*3;
        if(c.y < -c.rad*3) c.y = H + c.rad*3;
        if(c.y > H + c.rad*3) c.y = -c.rad*3;
      }
    }

    function drawHex(){
      hexCtx.clearRect(0,0,W,H);
      hexCtx.fillStyle = '#03060a';
      hexCtx.fillRect(0,0,W,H);
      
      for(const h of hexagons){
        hexCtx.beginPath();
        const verts = hexVerts(h.x, h.y, h.r);
        verts.forEach((v,j)=>{
          if(j===0) hexCtx.moveTo(v.x, v.y); 
          else hexCtx.lineTo(v.x, v.y);
        });
        hexCtx.closePath();
        hexCtx.strokeStyle = `rgba(0,180,255,${h.opacity})`;
        hexCtx.lineWidth = 1;
        hexCtx.stroke();
      }
      
      for(const c of circles){
        const grad = hexCtx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rad*3);
        grad.addColorStop(0, `rgba(0,200,255,0.8)`);
        grad.addColorStop(1, 'rgba(0,200,255,0)');
        hexCtx.fillStyle = grad;
        hexCtx.beginPath();
        hexCtx.arc(c.x, c.y, c.rad*3, 0, Math.PI*2);
        hexCtx.fill();
      }
    }

    function animateHex(){
      updateHex();
      drawHex();
      requestAnimationFrame(animateHex);
    }

    // Initialize hex background
    resizeHexCanvas();
    window.addEventListener('resize', resizeHexCanvas);
    requestAnimationFrame(animateHex);

    // ---- PromptFi Application Code ----
    const RECIPIENT = "C8X7hd8xD36kX3Ddh2qf3NNDYaFgQBrjtJVJpU5DHEAr";
    const PRICES = { p0: 0.00, p1: 0.30, p2: 0.12, p3: 0.40, p4: 0.18, p5: 0.22, p6: 0.25 };
    const DATA = [
      {
        id: 'p0',
        title: 'FREE: Graphic design prompt',
        cat: 'Content',
        model: 'Gemeni/GPT/Google',
        lang: 'EN',
        price: PRICES.p0,
        full: 'Ultra-detailed professional design of (SUBJECT), created in a cinematic digital art style. Rendered with 8K resolution, photorealistic textures, hyper-detailed lighting, and dynamic depth of field. The composition should emphasize symmetry, balance, and visual hierarchy suitable for commercial use. Use color theory principles (contrasting complementary palette, gradient harmonies) to draw focus toward the central subject. Integrate vector-based sharp edges layered with soft atmospheric effects for depth. Include intricate geometric patterns and abstract design motifs woven subtly into the background to give the artwork a sense of complexity and refinement. Deliver in scalable formats (SVG/PNG) with transparent background, optimized for both digital branding and high-quality print. Style references: futuristic graphic design posters, Swiss typography precision, cyber-aesthetic glow accents. The output must be clean, minimal clutter, yet striking enough to work as marketing material, social media branding, or product packaging',
        preview: 'Try PromptFi with a free starter pack of an advanced graphic design prompt.'
      },
      {
        id: 'p1',
        title: 'Pro Graphic Design Prompt',
        cat: 'Design',
        model: 'Midjourney/GPT',
        lang: 'EN',
        price: PRICES.p1,
        full: 'You are an award-winning brand designer tasked with creating a complete professional logo design brief for (SUBJECT). The concept must reflect a futuristic yet minimal aesthetic, incorporating constraints such as scalability, brand adaptability, and commercial usability. Define the creative direction through mood boards, color palette specifications (with hex values), and typography guidelines (primary and secondary typefaces with usage rules). Outline the intended emotional response, design hierarchy, and visual balance. Deliver clear export specifications including vector-based formats (SVG/AI) and raster assets (PNG/JPG) optimized for both print and digital applications. Ensure the final outcome is versatile enough for logos, social media branding, and product packaging.',
        preview: 'Generate a professional logo brief for (SUBJECT) with creative direction, color palette, typography, and export specs.'
      },
      {
        id: 'p2',
        title: 'Viral X Thread Prompt',
        cat: 'Marketing',
        model: 'Any',
        lang: 'EN',
        price: PRICES.p2,
        full: 'Act as a professional viral ghostwriter specializing in growth marketing. Write a 10-post X (Twitter) thread on (SUBJECT) designed to maximize reach, engagement, and conversions. Provide 3 alternative hook options optimized for curiosity, controversy, or authority positioning. Structure the pacing to maintain reader retention with varied sentence lengths, cliffhangers, and embedded value drops. Incorporate meme-worthy moments, relatable analogies, and shareable phrasing to increase repost potential. End with a clear, measurable call-to-action (CTA) aligned with the objective—whether driving followers, clicks, or conversions. Deliver the output in a polished format ready to post, with optional hashtags and suggested visuals.',
        preview: 'Produce a viral-ready 10-post X thread on (SUBJECT) with strong hooks, engaging pacing, and a clear CTA.'
      },
      {
        id: 'p3',
        title: 'DeFi Whitepaper Outline',
        cat: 'Crypto',
        model: 'GPT',
        lang: 'EN',
        price: PRICES.p3,
        full: 'You are a professional DeFi strategist tasked with creating a rigorous whitepaper outline for (SUBJECT). The outline should include: problem statement, protocol design, tokenomics structure, governance model, risk analysis, key performance indicators (KPIs), and development roadmap. Ensure the framework is investor-ready, technically sound, and structured for both technical and non-technical audiences. The final output must provide clarity, credibility, and scalability potential for (SUBJECT) within the DeFi ecosystem.',
        preview: 'Develop a complete DeFi whitepaper outline for (SUBJECT), covering problem, design, tokenomics, risks, KPIs, and roadmap.'
      },
      {
        id: 'p4',
        title: 'YouTube Script Prompt',
        cat: 'Content',
        model: 'GPT',
        lang: 'EN',
        price: PRICES.p4,
        full: 'You are a senior YouTube scriptwriter tasked with creating a high-retention 7-minute script on (SUBJECT). The script must include: a powerful opening hook, an open loop to sustain attention, three structured content segments that deliver value and engagement, and multiple call-to-action (CTA) variations tailored for subscriptions, comments, and shares. Ensure pacing is optimized for audience retention, with natural transitions, conversational tone, and storytelling techniques. Deliver the script in a polished, ready-to-record format suitable for professional YouTube content creation.',
        preview: 'Create a 7-minute YouTube script on (SUBJECT) with a strong hook, open loop, structured segments, and CTA variations.'
      },
      {
        id: 'p5',
        title: 'Landing Page Copy Prompt',
        cat: 'Marketing',
        model: 'GPT',
        lang: 'EN',
        price: PRICES.p5,
        full: 'Act as a senior conversion copywriter tasked with writing high-performing landing page copy for (SUBJECT). Produce a complete framework including: a compelling hero section, clear value propositions, social proof elements, objection handling, and multiple call-to-action (CTA) variants. Provide tone sliders ranging from casual to professional, and A/B test-ready hook variations. Ensure the copy aligns with user psychology, emphasizes benefits over features, and is optimized for maximum conversion across desktop and mobile.',
        preview: 'Write optimized landing page copy for (SUBJECT) with hero, value props, social proof, and CTA variants ready for A/B testing.'
      },
      {
        id: 'p6',
        title: 'Strategy: DeFi Growth Plan',
        cat: 'Crypto',
        model: 'GPT',
        lang: 'EN',
        price: PRICES.p6,
        full: 'You are a DeFi growth lead tasked with creating a comprehensive 30-day growth strategy for (SUBJECT). The plan must define clear objectives and measurable KPIs, identify acquisition and retention channels, and outline key marketing experiments. Include community growth tactics, influencer or partnership outreach, and user incentive structures. Provide a detailed reporting cadence for tracking performance, along with contingency adjustments based on early results. Ensure the plan balances short-term traction with long-term sustainability within the DeFi ecosystem.',
        preview: 'Design a 30-day DeFi growth plan for (SUBJECT) with KPIs, channels, experiments, and reporting cadence.'
      }
    ];

    let connection = null;
    let provider = null;
    let walletPubkey = null;

    const $ = (s) => document.querySelector(s);
    const $ = (s) => Array.from(document.querySelectorAll(s));

    const toast = (m) => {
      const t = $('#toast');
      t.textContent = m;
      t.style.display = 'block';
      setTimeout(() => t.style.display = 'none', 2400);
    };

    const priceLabel = (n) => (n <= 0 ? 'FREE' : (Math.round(n * 100) / 100).toFixed(2) + ' SOL');

    const card = (p) =>
      `<article class="card prompt-card">
        <div style="height:160px;border-bottom:1px solid var(--b);background:
          radial-gradient(80px 80px at 20% 30%, rgba(168,85,247,.25), transparent 60%),
          radial-gradient(80px 80px at 80% 40%, rgba(6,182,212,.25), transparent 60%);"></div>
        <div class="card-body">
          <div class="kv">
            <div>
              <strong>${p.title}</strong>
              <div class="muted">${p.cat} • ${p.model} • ${p.lang}</div>
            </div>
            <span class="badge">${priceLabel(p.price)}</span>
          </div>
          <p class="muted" style="margin-top:8px;min-height:44px">${p.preview}</p>
          <div style="display:flex;gap:8px;margin-top:10px">
            <button class="btn" data-view="${p.id}">Personalize</button>
            <button class="btn glow" data-buy="${p.id}">${p.price <= 0 ? 'Get Free' : 'Buy'}</button>
          </div>
        </div>
      </article>`;

    function renderGrid(list) {
      const grid = $('#grid');
      grid.innerHTML = list.map(card).join('');
      $('[data-view]').forEach(b => b.addEventListener('click', () => openModal(b.getAttribute('data-view'))));
      $('[data-buy]').forEach(b => b.addEventListener('click', () => buyPrompt(b.getAttribute('data-buy'))));
    }

    function applyFilters() {
      const q = $('#q').value.toLowerCase().trim();
      const cat = $('#cat_val').dataset.value || '';
      const sort = $('#sort_val').dataset.value || 'default';

      let list = DATA.filter(p => {
        const hay = (p.title + ' ' + p.cat).toLowerCase();
        if (cat && p.cat !== cat) return false;
        return !q || hay.includes(q);
      });

      if (sort === 'priceAsc') list.sort((a, b) => a.price - b.price);
      if (sort === 'priceDesc') list.sort((a, b) => b.price - a.price);
      if (sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));

      renderGrid(list);
    }

    function dropdown(rootId, items) {
      const root = document.getElementById(rootId);
      const val = root.querySelector('.value');
      const menu = root.querySelector('.menu');

      menu.innerHTML = items.map(([key, text]) => `<button data-k="${key}">${text}</button>`).join('');

      menu.addEventListener('click', (e) => {
        const k = e.target?.dataset?.k;
        if (!k) return;
        val.dataset.value = k === '__all' ? '' : k;
        val.textContent = items.find(x => x[0] === k)?.[1] || items[0][1];
        menu.style.display = 'none';
        root.removeAttribute('open');
        applyFilters();
      });
    }

    function openModal(id, unlocked = false, sig = null) {
      const p = DATA.find(x => x.id === id);
      if (!p) return;

      $('#mTitle').textContent = p.title + (unlocked ? ' — Unlocked' : ' — Preview');
      $('#mMeta').textContent = `${p.cat} • ${p.model} • ${p.lang} — ${priceLabel(p.price)}`;

      const owned = localStorage.getItem('pf_owned_' + id) === '1' || unlocked;
      const brief = $('#uBrief').value.trim();
      const contact = $('#uContact').value.trim();

      $('#mText').textContent = owned ? p.full : (brief ? ('Preview with your brief: ' + brief.slice(0,160) + '…') : p.preview);
      $('#copyBtn').classList.toggle('hidden', !owned);

      const a = $('#txLink');
      if (sig) {
        a.href = 'https://solscan.io/tx/' + sig;
        a.classList.remove('hidden');
      } else a.classList.add('hidden');

      $('#modal').style.display = 'flex';
      $('#buyNow').textContent = p.price <= 0 ? 'Get Free' : 'Buy & Unlock';
      $('#buyNow').onclick = () => buyPrompt(id);
    }

    $('#copyBtn').onclick = () => {
      navigator.clipboard.writeText($('#mText').textContent);
      toast('Copied');
    };

    window.closeModal = () => { $('#modal').style.display = 'none'; };

    function savePurchase(id, sig, brief, contact) {
      const now = new Date().toISOString();
      const rec = { id, sig, at: now, brief, contact };
      const list = JSON.parse(localStorage.getItem('pf_purchases') || '[]');
      list.unshift(rec);
      localStorage.setItem('pf_purchases', JSON.stringify(list));
      localStorage.setItem('pf_owned_' + id, '1');
      renderPurchases();
    }

    function renderPurchases() {
      const box = $('#purchasesList');
      const list = JSON.parse(localStorage.getItem('pf_purchases') || '[]');

      if (!list.length) { box.textContent = 'No purchases yet.'; return; }

      box.innerHTML = list.map(r => {
        const p = DATA.find(x => x.id === r.id);
        const title = p ? p.title : r.id;
        const linkA = r.sig && r.sig !== 'FREE'
          ? `<a class="underline" href="https://solscan.io/tx/${r.sig}" target="_blank">Solscan</a>`
          : '<span class="muted">Free</span>';
        const brief = r.brief ? `<div class="muted" style="margin-top:4px">Brief: ${r.brief.slice(0,140)}</div>` : '';
        const contact = r.contact ? `<div class="muted">Contact: ${r.contact}</div>` : '';

        return `<div class="kv" style="padding:12px 0;border-bottom:1px solid var(--b)">
          <div>
            <div><strong>${title}</strong></div>
            <div class="muted">${new Date(r.at).toLocaleString()}</div>${brief}${contact}
          </div>
          <div style="display:flex;gap:8px">
            ${linkA}<button class="btn" data-reopen="${r.id}">View</button>
          </div>
        </div>`;
      }).join('');

      $('[data-reopen]').forEach(b => b.addEventListener('click', () => openModal(b.getAttribute('data-reopen'), true)));
    }

    // Wallet functions
    async function getProvider() {
      return window.solana ?? window.phantom?.solana ?? null;
    }

    async function connectWallet() {
      provider = await getProvider();
      if (!provider || !provider.isPhantom) { toast('Phantom not found. Install Phantom.'); return; }
      const resp = await provider.connect();
      walletPubkey = resp.publicKey;
      $('#addr').textContent = 'Wallet: ' + walletPubkey.toBase58().slice(0, 4) + '…' + walletPubkey.toBase58().slice(-4);
      $('#walletBtn').textContent = 'Disconnect Wallet';
      toast('Wallet connected');
    }

    async function disconnectWallet() {
      try { await provider?.disconnect(); } catch (e) {}
      walletPubkey = null;
      $('#addr').textContent = 'Wallet: not connected';
      $('#walletBtn').textContent = 'Connect Wallet';
      toast('Wallet disconnected');
    }

    async function toggleWallet() { if (walletPubkey) return disconnectWallet(); else return connectWallet(); }

    // Buy prompt function
    async function buyPrompt(id) {
      try {
        const p = DATA.find(x => x.id === id);
        if (!p) return;

        const brief = $('#uBrief').value.trim();
        const contact = $('#uContact').value.trim();

        if (brief.length < 3) return toast('Please enter a short brief.');
        if (!contact) return toast('Add your contact (email or Telegram).');

        // FREE flow
        if (p.price <= 0) {
          savePurchase(id, 'FREE', brief, contact);
          openModal(id, true, null);
          toast('Unlocked (free) ✓');
          return;
        }

        if (!walletPubkey) { await connectWallet(); if (!walletPubkey) return; }

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
        toast('Unlocked ✓');
      } catch (e) {
        console.error(e);
        toast('Payment failed or cancelled');
      }
    }

    window.addEventListener('load', async () => {
      try { 
        connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed'); 
      }
      catch (e) { 
        console.error(e); 
        toast('Failed to init Solana SDK'); 
      }

      // Render
      renderGrid(DATA);
      renderPurchases();

      // Dropdowns
      dropdown('cat', [['__all', 'All'], ['Design', 'Design'], ['Marketing', 'Marketing'], ['Crypto', 'Crypto'], ['Content', 'Content']]);
      dropdown('sort', [['default', 'Default'], ['priceAsc', 'Price ↑'], ['priceDesc', 'Price ↓'], ['alpha', 'A → Z']]);

      // Events
      $('#q').addEventListener('input', applyFilters);
      $('#walletBtn').onclick = toggleWallet;
      applyFilters();
