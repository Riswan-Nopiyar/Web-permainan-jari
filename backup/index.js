(function(){
  // ─── STATE ───────────────────────────────────────────────
  let difficulty = 1; // 1=easy, 2=medium, 3=hard
  let S = { p1l:1, p1r:1, p2l:1, p2r:1, turn:1, sel:null, over:false };

  // ─── DOM HELPERS ─────────────────────────────────────────
  const $ = id => document.getElementById(id);
  const elems = {
    sec1:$('sec1'), sec2:$('sec2'),
    turn:$('turnPill'), msg:$('msg'),
    sp1l:$('sp1l'), sp1r:$('sp1r'),
    botThinking:$('botThinking'),
    p1hp:$('p1hp'), p2hp:$('p2hp')
  };

  // ─── SVG HAND GENERATOR ──────────────────────────────────
  // Player (bottom) = palm at bottom, fingers extend UPWARD  (isBot=false)
  // Bot   (top)     = palm at top,    fingers extend DOWNWARD (isBot=true)
  function makeHandSVG(val, isBot) {
    if (val >= 5) {
      return `<svg viewBox="0 0 60 70" width="60" height="70">
        <ellipse cx="30" cy="32" rx="18" ry="20" fill="#1e293b" stroke="#334155" stroke-width="2"/>
        <circle cx="22" cy="28" r="5" fill="#0f172a"/><circle cx="38" cy="28" r="5" fill="#0f172a"/>
        <circle cx="22" cy="28" r="2" fill="#475569"/><circle cx="38" cy="28" r="2" fill="#475569"/>
        <path d="M24 42 L28 38 L32 42 L36 38" stroke="#334155" stroke-width="2" fill="none"/>
        <rect x="15" y="48" width="7" height="4" rx="1" fill="#1e293b" stroke="#334155"/>
        <rect x="26" y="48" width="7" height="4" rx="1" fill="#1e293b" stroke="#334155"/>
        <rect x="37" y="48" width="7" height="4" rx="1" fill="#1e293b" stroke="#334155"/>
        <text x="30" y="66" text-anchor="middle" font-size="8" fill="#475569" font-family="Syne,sans-serif" font-weight="700">MATI</text>
      </svg>`;
    }
    const fc = isBot ? '#ef4444' : '#00f5d4';
    const pc = isBot ? '#7f1d1d' : '#0f3d3a';
    const sc = isBot ? '#dc2626' : '#00d4b8';
    const uid = isBot ? 'b' : 'p';

    // Finger x-positions spread across hand
    const fxList = [[14],[14,22],[14,22,30],[10,18,28,38],[10,17,25,33,41]];
    const fxArr = fxList[val-1];

    let fingers = '';
    if (isBot) {
      // BOT: palm near top (cy=28), fingers hang DOWN below palm
      const palmY = 28;
      fxArr.forEach(fx => {
        fingers += `<ellipse cx="${fx}" cy="52" rx="5.5" ry="10" fill="${fc}" stroke="${sc}" stroke-width="1.5" opacity="0.9"/>`;
      });
      return `<svg viewBox="0 0 50 75" width="58" height="80">
        <defs><filter id="g${uid}"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter></defs>
        ${fingers}
        <ellipse cx="26" cy="${palmY}" rx="20" ry="15" fill="${pc}" stroke="${sc}" stroke-width="2" filter="url(#g${uid})"/>
      </svg>`;
    } else {
      // PLAYER: palm near bottom (cy=52), fingers extend UP above palm
      const palmY = 52;
      fxArr.forEach(fx => {
        fingers += `<ellipse cx="${fx}" cy="22" rx="5.5" ry="10" fill="${fc}" stroke="${sc}" stroke-width="1.5" opacity="0.9"/>`;
      });
      return `<svg viewBox="0 0 50 75" width="58" height="80">
        <defs><filter id="g${uid}"><feGaussianBlur stdDeviation="1.5" result="b"/><feComposite in="SourceGraphic" in2="b" operator="over"/></filter></defs>
        ${fingers}
        <ellipse cx="26" cy="${palmY}" rx="20" ry="15" fill="${pc}" stroke="${sc}" stroke-width="2" filter="url(#g${uid})"/>
      </svg>`;
    }
  }

  // ─── STATE ACCESSORS ─────────────────────────────────────
  // get/set work on LIVE state S
  function get(p, h) { return p===1 ? (h==='left'?S.p1l:S.p1r) : (h==='left'?S.p2l:S.p2r); }
  function set(p, h, v) {
    if(p===1){ if(h==='left') S.p1l=v; else S.p1r=v; }
    else     { if(h==='left') S.p2l=v; else S.p2r=v; }
  }
  function alive(p, h) { return get(p,h) < 5; }
  function dead(p) { return get(p,'left')>=5 && get(p,'right')>=5; }

  // get/set on a snapshot object
  function getS(st, p, h) { return p===1 ? (h==='left'?st.p1l:st.p1r) : (h==='left'?st.p2l:st.p2r); }
  function setS(st, p, h, v) {
    if(p===1){ if(h==='left') st.p1l=v; else st.p1r=v; }
    else     { if(h==='left') st.p2l=v; else st.p2r=v; }
  }
  function aliveS(st, p, h) { return getS(st,p,h) < 5; }
  function deadS(st, p) { return getS(st,p,'left')>=5 && getS(st,p,'right')>=5; }

  // ─── UI RENDER ───────────────────────────────────────────
  function render() {
    [
      [1,'left','svg1l','cnt1l','p1l'],
      [1,'right','svg1r','cnt1r','p1r'],
      [2,'left','svg2l','cnt2l','p2l'],
      [2,'right','svg2r','cnt2r','p2r']
    ].forEach(([p,h,svgId,cntId,cardId])=>{
      const v = get(p,h);
      $(svgId).innerHTML = makeHandSVG(v, p===2);
      $(cntId).textContent = v>=5 ? '✕' : v;
      $(cardId).classList.toggle('dead', v>=5);
    });

    elems.p1hp.textContent = `${(S.p1l<5?1:0)+(S.p1r<5?1:0)} hidup`;
    elems.p2hp.textContent = `${(S.p2l<5?1:0)+(S.p2r<5?1:0)} hidup`;

    elems.sec1.className = `player-section mb-5${S.turn===1&&!S.over?' active':''}`;
    elems.sec2.className = `player-section mb-3${S.turn===2&&!S.over?' bot-active':''}`;

    if (!S.over) {
      elems.turn.textContent = S.turn===1 ? 'GILIRAN KAMU' : 'GILIRAN BOT';
      elems.turn.className   = `turn-pill${S.turn===2?' bot':''}`;
    } else {
      elems.turn.textContent = '— SELESAI —';
      elems.turn.className   = 'turn-pill';
    }

    // Selection highlights
    ['p1l','p1r','p2l','p2r'].forEach(id => $(id).classList.remove('selected','target-hint'));
    if (S.sel && !S.over) {
      $(`p${S.sel.p}${S.sel.h[0]}`).classList.add('selected');
      const opp = S.sel.p===1 ? 2 : 1;
      ['left','right'].forEach(h => { if(alive(opp,h)) $(`p${opp}${h[0]}`).classList.add('target-hint'); });
    }

    // Split buttons (player 1 only)
    updateSplitBtn('sp1l',1,'left');
    updateSplitBtn('sp1r',1,'right');

    elems.botThinking.classList.toggle('hidden', !(S.turn===2 && !S.over));
  }

  function updateSplitBtn(btnId, p, h) {
    const btn = $(btnId);
    if (S.over || S.turn!==p) { btn.disabled=true; return; }
    const v=get(p,h), oh=h==='left'?'right':'left', ov=get(p,oh);
    btn.disabled = !((v===2||v===4) && ov>=5);
  }

  function showMsg(text, type='') {
    elems.msg.textContent = text;
    elems.msg.className = `msg-bar${type?' '+type:''}`;
  }

  // ─── EFFECTS ─────────────────────────────────────────────
  function floatEffect(cardEl, text, color) {
    const el = document.createElement('div');
    el.className = 'float-dmg';
    el.style.cssText = `color:${color};top:10px;left:50%;transform:translateX(-50%)`;
    el.textContent = text;
    cardEl.style.position = 'relative';
    cardEl.appendChild(el);
    setTimeout(()=>el.remove(), 800);
  }

  function animateAttack(attackerEl, targetEl, cb) {
    const ar = attackerEl.getBoundingClientRect();
    const tr = targetEl.getBoundingClientRect();
    const dx = tr.left + tr.width/2  - (ar.left + ar.width/2);
    const dy = tr.top  + tr.height/2 - (ar.top  + ar.height/2);
    attackerEl.style.setProperty('--attack-translate', `translate(${dx}px,${dy}px) scale(1.15)`);
    attackerEl.classList.add('attacking');
    setTimeout(()=>{
      attackerEl.classList.remove('attacking');
      attackerEl.style.removeProperty('--attack-translate');
      cb();
    }, 520);
  }

  // ─── CORE MOVE LOGIC ─────────────────────────────────────
  // Execute an attack: attacker (ap,ah) → target (tp,th), then call cb()
  function execAttack(ap, ah, tp, th, cb) {
    const aEl = $(`p${ap}${ah[0]}`), tEl = $(`p${tp}${th[0]}`);
    const av = get(ap,ah), tv = get(tp,th);
    const raw = av + tv;
    const nv  = raw % 5 === 0 ? 5 : raw % 5;

    animateAttack(aEl, tEl, ()=>{
      set(tp, th, nv);
      floatEffect(tEl, nv>=5?'💀':`+${av}`, nv>=5?'#f87171':'#fbbf24');
      S.sel = null;
      if (dead(tp)) {
        S.over = true;
        showMsg(ap===1 ? '🏆 Kamu menang! Bot kalah!' : '😵 Bot menang! Coba lagi.', ap===1?'win':'lose');
      } else {
        S.turn = ap===1 ? 2 : 1;
        showMsg(ap===1
          ? `⚔️ Kamu serang (${av}) → bot jadi ${nv}`
          : `🤖 Bot serang (${av}) → tanganmu jadi ${nv}`
        );
      }
      render();
      if (cb) cb();
    });
  }

  // Execute a split for player p on hand h (other hand must be dead)
  function execSplit(p, h) {
    if (S.over || S.turn!==p) return false;
    const v  = get(p,h);
    const oh = h==='left'?'right':'left';
    const ov = get(p,oh);
    if ((v!==2 && v!==4) || ov<5) return false;

    if (v===2) { set(p,h,1); set(p,oh,1); showMsg(`✂️ Split 2 → 1 + 1`); }
    else       { set(p,h,2); set(p,oh,2); showMsg(`✂️ Split 4 → 2 + 2`); }

    // Split does NOT change turn — same player goes again
    S.sel = null;
    render();

    // If bot just split, schedule next bot move
    if (!S.over && S.turn===2) setTimeout(botPlay, 600);
    return true;
  }

  // ─── MINIMAX AI ──────────────────────────────────────────
  function cloneSt(st) { return Object.assign({}, st); }

  // All legal actions for player p given snapshot st
  function getActions(st, p) {
    const opp = p===1 ? 2 : 1;
    const actions = [];

    // Attacks: my alive hand → opponent's alive hand
    ['left','right'].forEach(ah => {
      if (!aliveS(st,p,ah)) return;
      ['left','right'].forEach(th => {
        if (!aliveS(st,opp,th)) return;
        actions.push({ type:'attack', ah, th });
      });
    });

    // Split: one of my hands is 2 or 4, other is dead
    ['left','right'].forEach(h => {
      const v  = getS(st,p,h);
      const oh = h==='left'?'right':'left';
      const ov = getS(st,p,oh);
      if ((v===2||v===4) && ov>=5) actions.push({ type:'split', h });
    });

    return actions;
  }

  // Apply action to snapshot, return new snapshot
  function applyAction(st, p, action) {
    const ns  = cloneSt(st);
    const opp = p===1 ? 2 : 1;
    if (action.type==='split') {
      const v  = getS(ns,p,action.h);
      const oh = action.h==='left'?'right':'left';
      if (v===2) { setS(ns,p,action.h,1); setS(ns,p,oh,1); }
      else       { setS(ns,p,action.h,2); setS(ns,p,oh,2); }
      // split keeps turn on same player
      ns.turn = p;
    } else {
      const av  = getS(ns,p,action.ah);
      const tv  = getS(ns,opp,action.th);
      const raw = av + tv;
      const nv  = raw%5===0 ? 5 : raw%5;
      setS(ns, opp, action.th, nv);
      ns.turn = opp;
    }
    return ns;
  }

  function evalState(st) {
    const p1a = (st.p1l<5?1:0)+(st.p1r<5?1:0);
    const p2a = (st.p2l<5?1:0)+(st.p2r<5?1:0);
    if (p2a===0) return -9999;
    if (p1a===0) return  9999;
    let score = (p2a - p1a) * 60;
    // prefer higher finger counts on bot (harder to hit exactly 5)
    ['p2l','p2r'].forEach(k=>{ const v=st[k]; if(v>0&&v<5) score += v*4; });
    // penalize opponent having high counts (they're strong)
    ['p1l','p1r'].forEach(k=>{ const v=st[k]; if(v>0&&v<5) score -= v*3; });
    // bonus for being able to kill next turn
    ['left','right'].forEach(ah=>{
      if(!aliveS(st,2,ah)) return;
      ['left','right'].forEach(th=>{
        if(!aliveS(st,1,th)) return;
        const raw = getS(st,2,ah)+getS(st,1,th);
        if(raw%5===0) score += 30; // killing move available
      });
    });
    return score;
  }

  function minimax(st, depth, isMaximizing, alpha, beta) {
    if (deadS(st,1)) return  9999;
    if (deadS(st,2)) return -9999;
    if (depth === 0) return evalState(st);

    const p = isMaximizing ? 2 : 1;
    const actions = getActions(st, p);
    if (!actions.length) return evalState(st);

    if (isMaximizing) {
      let best = -Infinity;
      for (const a of actions) {
        const ns = applyAction(st, p, a);
        // after split, same player moves — still maximizing
        const nextMax = a.type==='split' ? true : false;
        const v = minimax(ns, depth-1, nextMax, alpha, beta);
        if (v > best) best = v;
        if (v > alpha) alpha = v;
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const a of actions) {
        const ns = applyAction(st, p, a);
        const nextMax = a.type==='split' ? false : true;
        const v = minimax(ns, depth-1, nextMax, alpha, beta);
        if (v < best) best = v;
        if (v < beta) beta = v;
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  function botPlay() {
    if (S.over || S.turn!==2) return;
    const actions = getActions(S, 2);
    if (!actions.length) return;

    // Difficulty: easy=random, medium=depth3, hard=depth6
    if (difficulty === 1) {
      // Easy: mostly random, occasionally picks a kill
      const killMoves = actions.filter(a => {
        if (a.type!=='attack') return false;
        const av=get(2,a.ah), tv=get(1,a.th);
        return (av+tv)%5===0;
      });
      const chosen = (killMoves.length && Math.random()<0.5)
        ? killMoves[Math.floor(Math.random()*killMoves.length)]
        : actions[Math.floor(Math.random()*actions.length)];
      executeBotAction(chosen);
      return;
    }

    const depth = difficulty === 2 ? 3 : 6;
    let bestScore = -Infinity, bestAction = null;
    for (const a of actions) {
      const ns = applyAction(S, 2, a);
      const nextMax = a.type==='split' ? true : false;
      const v = minimax(ns, depth, nextMax, -Infinity, Infinity);
      // Medium: add noise so it's not perfect
      const score = difficulty === 2 ? v + (Math.random()-0.5)*20 : v;
      if (score > bestScore) { bestScore = score; bestAction = a; }
    }
    if (!bestAction) bestAction = actions[0];
    executeBotAction(bestAction);
  }

  function executeBotAction(action) {
    if (action.type==='split') {
      execSplit(2, action.h);
    } else {
      execAttack(2, action.ah, 1, action.th, null);
    }
  }

  // ─── PLAYER INPUT HANDLERS ───────────────────────────────
  function handleHandClick(e) {
    const card = e.currentTarget;
    const p = parseInt(card.dataset.player);
    const h = card.dataset.hand;

    if (S.over) { showMsg('Tekan RESET untuk main lagi.'); return; }
    if (S.turn !== 1) { showMsg('Tunggu giliran kamu.'); return; }
    if (!alive(p,h)) { showMsg('Tangan ini sudah mati.'); return; }

    if (p === 1) {
      // Select / deselect own hand
      if (S.sel && S.sel.p===1 && S.sel.h===h) {
        S.sel = null;
        showMsg('Pilihan dibatalkan.');
      } else {
        S.sel = { p:1, h };
        showMsg(`Tangan ${h==='left'?'kiri':'kanan'} dipilih — klik tangan lawan.`);
      }
      render();
    } else if (p === 2 && S.sel && S.sel.p===1) {
      // Attack bot's hand
      execAttack(1, S.sel.h, 2, h, ()=>{
        if (!S.over && S.turn===2) setTimeout(botPlay, 700);
      });
    } else {
      showMsg('Pilih tanganmu dulu, lalu klik tangan lawan (bot).');
    }
  }

  // Difficulty buttons
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      difficulty = parseInt(btn.dataset.diff);
    });
  });

  ['p1l','p1r','p2l','p2r'].forEach(id => $(id).addEventListener('click', handleHandClick));

  elems.sp1l.addEventListener('click', ()=>execSplit(1,'left'));
  elems.sp1r.addEventListener('click', ()=>execSplit(1,'right'));

  // ─── INIT ────────────────────────────────────────────────
  function startGame() {
    const firstTurn = Math.random() < 0.5 ? 1 : 2;
    S = { p1l:1, p1r:1, p2l:1, p2r:1, turn:firstTurn, sel:null, over:false };
    showMsg(firstTurn===1 ? '🎲 Kamu duluan! Pilih tangan lalu klik tangan lawan.' : '🎲 Bot duluan!');
    render();
    if (firstTurn===2) setTimeout(botPlay, 900);
  }

  $('resetBtn').addEventListener('click', startGame);

  startGame();
})();