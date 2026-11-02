// The Twenty3FX plug-in, drawn in HTML and playable.
window.Twenty3FX = (camera) => {
  camera.classList.add('v2');
  camera.innerHTML = `
        <div class="plug" id="plug">
          <div class="dimmable">
            <div class="frame"><div class="lcd">
              <small style="left:16px;top:17px">FX</small>
              <div class="name" data-name>ECHO</div>
              <button type="button" class="badge" data-badge>AUTO</button>
              <canvas id="scope"></canvas>
              <div class="bpm" data-bpm>140.0</div>
              <small style="left:136px;top:174px">BPM</small>
              <small style="left:16px;top:193px">L</small><div class="meter" style="left:28px;top:192px;width:104px"><i data-l></i></div>
              <small style="left:16px;top:205px">R</small><div class="meter" style="left:28px;top:204px;width:104px"><i data-r></i></div>
              <div class="val" data-val>428.571</div>
              <small data-unit style="left:262px;top:170px">ms</small>
              <small data-vallab style="left:178px;top:192px">TIME</small>
            </div></div>

            <button type="button" class="arrow" data-prev style="left:71px" aria-label="Shorter">&lt;</button>
            <small class="t" data-divlab style="top:322px;font-size:8px">DIVISION</small>
            <div class="t divval" data-div>1/4</div>
            <button type="button" class="arrow" data-next style="left:266px" aria-label="Longer">&gt;</button>
            <small class="t" style="top:355px;font-size:6.5px">FX BAND</small>
            <button type="button" class="band" data-band="3" style="left:72px">ALL</button>
            <button type="button" class="band" data-band="0" style="left:135px">LOW</button>
            <button type="button" class="band" data-band="1" style="left:196px">MID</button>
            <button type="button" class="band" data-band="2" style="left:257px">HI</button>
            <button type="button" class="auto" data-auto>AUTO</button>
            <button type="button" class="tap" data-tap>TAP</button>

            <small class="t" style="top:476px;font-size:8px">FX SELECT</small>
            <div data-dial></div>
            <div class="well" style="left:104px;top:550px;width:176px;height:176px"></div>
            <div class="knob" data-knob="fx" role="slider" tabindex="0" aria-label="FX Select" style="left:135px;top:581px;width:114px;height:114px"><div class="needle"></div></div>

            <small class="t" style="top:808px;font-size:8px">TIME</small>
            <div class="well" style="left:137px;top:822px;width:110px;height:110px"></div>
            <div class="knob" data-knob="time" role="slider" tabindex="0" aria-label="Time" style="left:156px;top:841px;width:72px;height:72px"><div class="needle"></div></div>

            <small class="t" style="top:952px;font-size:8px">LEVEL / DEPTH</small>
            <div class="well" style="left:137px;top:966px;width:110px;height:110px"></div>
            <div class="knob" data-knob="level" role="slider" tabindex="0" aria-label="Level and depth" style="left:156px;top:985px;width:72px;height:72px"><div class="needle"></div></div>

            <small class="t" style="top:1094px;font-size:8px">COLOR</small>
            <svg class="arc" width="130" height="110" viewBox="0 0 130 110" style="left:127px;top:1112px" fill="none" stroke="currentColor" stroke-width="1"><path d="M23 102 A58 58 0 1 1 107 102" opacity=".55"/><path d="M65 3v8M9 45l7 3M121 45l-7 3M23 102l-7 7M107 102l7 7" opacity=".7"/></svg>
            <div class="well" style="left:159px;top:1140px;width:66px;height:66px"></div>
            <div class="knob" data-knob="color" role="slider" tabindex="0" aria-label="Color" style="left:171px;top:1152px;width:42px;height:42px"><div class="needle"></div></div>
            <small style="left:133px;top:1215px;font-size:6px">LPF</small><small style="left:237px;top:1215px;font-size:6px">HPF</small>

            <small style="left:68px;top:1248px;font-size:9px">THEME</small>
            <button type="button" class="big" data-theme-btn style="left:24px;width:120px">CLASSIC BLACK</button>
            <button type="button" class="power" data-power aria-pressed="false">OFF</button>
            <small style="left:283px;top:1248px;font-size:9px">PRESET</small>
            <button type="button" class="big" data-preset-btn style="left:240px;width:120px">INIT</button>
          </div>

          <div class="menu" data-menu="style" role="radiogroup" aria-label="Reverb style" style="left:32px;top:640px;width:322px;height:240px"><h4>REVERB STYLE</h4></div>
          <div class="menu" data-menu="preset" role="radiogroup" aria-label="Presets" style="left:32px;top:322px;width:322px;height:560px"><h4>PRESETS</h4></div>
        </div>
`;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const plug = camera.querySelector('#plug');
  const $ = (name) => plug.querySelector(`[data-${name}]`);

  // Same order as dialOrder in Source/Parameters.h, clockwise.
  const fx = [
    ['FLANGER', 'A short swept delay with feedback: the jet-plane whoosh, one sweep per division.'],
    ['PHASER', 'Notches moving through the mids, locked to the beat.'],
    ['REVERB', 'A room you size with Time, in four styles.'],
    ['ROBOT', 'A tuned 110 Hz resonance that turns anything metallic.'],
    ['CHORUS', 'Thickens the sound with a detuned copy that moves with the tempo.'],
    ['ROLL', 'Records one division from the moment you hit it, then loops it.'],
    ['REV ROLL', 'The same loop, played backwards.'],
    ['SND/RTN', 'Sends the sound to a built-in dub echo and a big reverb.'],
    ['DELAY', 'A few clean repeats, on the beat.'],
    ['ECHO', 'Repeats with a longer tail that fades away.'],
    ['REV DLY', 'Echoes that play backwards, swelling into the beat.'],
    ['PAN', 'Moves the sound from left to right in time.'],
    ['GATE', 'Chops the sound on and off, half a division at a time.'],
    ['FILTER', 'A resonant low-pass that opens and closes once per division.'],
    ['PITCH', 'Raises the pitch by up to an octave with Level / Depth.'],
    ['VORTEX', 'Heavy repeats that get darker on every pass.'],
    ['INFINITE', 'Almost endless repeats that take over from the dry sound.'],
    ['MOBIUS', 'A comb sweep that seems to rise forever.'],
    ['BRAKE', 'Slows down to a stop over one division, like a turntable.'],
    ['ECHO OUT', 'Fades the track and leaves only its echoes: made for exits.'],
  ];
  const fxIndex = (name) => fx.findIndex(([n]) => n === name);
  const divisions = ['1/32', '1/16', '1/8', '1/4', '1/2', '3/4', '1/1', '2/1', '4/1', '8/1', '16/1'];
  const divisionBeats = [.125, .25, .5, 1, 2, 3, 4, 8, 16, 32, 64];
  const styles = [['STANDARD', 'REVERB'], ['WIDE', 'RVB WIDE'], ['HALL', 'RVB HALL'], ['PLATE', 'RVB PLATE']];
  const themes = [['classic', 'CLASSIC BLACK'], ['midnight', 'MIDNIGHT'], ['copper', 'COPPER'], ['emerald', 'EMERALD'], ['platinum', 'PLATINUM']];
  // From factoryPresets in Source/PluginEditor.cpp: effect, division, band, style, level, room size, color.
  const presets = [
    ['Dub Echo', 'ECHO', 5, 3, 0, .6, 50, -.25], ['Slap Delay', 'DELAY', 2, 3, 0, .45, 50, 0],
    ['Big Hall', 'REVERB', 3, 3, 2, .7, 90, 0], ['Plate Vocal', 'REVERB', 3, 2, 3, .45, 40, .15],
    ['Build-up Filter', 'FILTER', 6, 3, 0, .9, 50, 0], ['Trance Gate', 'GATE', 2, 3, 0, .85, 50, 0],
    ['Roll Drop', 'ROLL', 2, 3, 0, 1, 50, 0], ['Vinyl Brake', 'BRAKE', 6, 3, 0, 1, 50, 0],
    ['Mobius Rise', 'MOBIUS', 4, 3, 0, .9, 50, 0], ['Space Send', 'SND/RTN', 3, 3, 0, .7, 50, .2],
  ];

  const state = { fx: fxIndex('ECHO'), div: 3, band: 3, style: 0, level: .5, size: 50, color: 0, bpm: 140, auto: true, on: false, theme: 0, preset: 'INIT', menu: null };
  const angleOf = (i) => -135 + i * 270 / (fx.length - 1);

  // Dial labels and notches, placed and tilted like the plug-in's.
  const dial = $('dial');
  const labels = fx.map(([name], i) => {
    const a = angleOf(i), rad = a * Math.PI / 180;
    const notch = document.createElement('div');
    notch.className = 'notch';
    notch.style.transform = `rotate(${a}deg) translate(0, -96px)`;
    dial.append(notch);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'lab';
    b.textContent = name;
    b.setAttribute('role', 'radio');
    b.style.left = `${192 + 128 * Math.sin(rad)}px`;
    b.style.top = `${638 - 128 * Math.cos(rad)}px`;
    b.style.setProperty('--r', `${a > 0 ? a - 90 : a + 90}deg`);
    b.addEventListener('click', () => { hands(); pickFx(i, true); });
    dial.append(b);
    return b;
  });

  // Menus
  const menuRows = (menu, items, top, step, onPick) => items.map((label, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'row-m';
    b.setAttribute('role', 'radio');
    b.textContent = label;
    b.style.top = `${top + i * step}px`;
    b.addEventListener('click', () => { hands(); onPick(i); });
    menu.append(b);
    return b;
  });
  const styleMenu = plug.querySelector('[data-menu="style"]'), presetMenu = plug.querySelector('[data-menu="preset"]');
  const styleRows = menuRows(styleMenu, styles.map((s) => s[0]), 52, 44, (i) => { state.style = i; openMenu(null); paint(); });
  const presetRows = menuRows(presetMenu, presets.map((p) => p[0]), 70, 44, (i) => { applyPreset(i); openMenu(null); });
  const factoryCap = document.createElement('small');
  factoryCap.className = 'cap'; factoryCap.style.top = '52px'; factoryCap.textContent = 'FACTORY';
  presetMenu.append(factoryCap);

  function openMenu(name) { state.menu = name; paint(); }
  function pickFx(i, fromUser) {
    state.fx = i;
    if (fromUser && fx[i][0] === 'REVERB') state.menu = 'style';
    paint();
  }
  function applyPreset(i) {
    const [name, effect, div, band, style, level, size, color] = presets[i];
    Object.assign(state, { preset: name, fx: fxIndex(effect), div, band, style, level, size, color });
    paint();
  }

  const knobAngle = (v, lo, hi) => -135 + (v - lo) / (hi - lo) * 270;
  const setNeedle = (name, a) => { plug.querySelector(`[data-knob="${name}"] .needle`).style.transform = `rotate(${a}deg)`; };
  const liveName = document.querySelector('[data-live-name]'), liveDesc = document.querySelector('[data-live-desc]');

  // Numbers: the division rolls to its new value and the time counts to it.
  let lastDivKey = null, lastDivAmount = 0, valShown = null, valFrame = 0;
  function rollDivision(text, amount) {
    const box = $('div');
    if (text === lastDivKey) return;
    const dir = amount >= lastDivAmount ? 1 : -1;
    const first = lastDivKey === null;
    lastDivKey = text; lastDivAmount = amount;
    if (first) box.textContent = '';
    [...box.children].slice(0, -1).forEach((n) => n.remove());
    const old = box.lastElementChild;
    const next = document.createElement('span');
    next.textContent = text;
    box.append(next);
    if (first || calm) { if (old) old.remove(); return; }
    const timing = { duration: 320, easing: 'cubic-bezier(.16, 1, .3, 1)' };
    next.animate([{ transform: `translateY(${dir * 100}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], timing);
    if (old) old.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-dir * 100}%)`, opacity: 0 }], { ...timing, fill: 'forwards' }).finished.then(() => old.remove()).catch(() => {});
  }
  let bpmShown = null, bpmFrame = 0;
  function countBpm(target) {
    const el = $('bpm');
    cancelAnimationFrame(bpmFrame);
    if (bpmShown === null || calm) { bpmShown = target; el.textContent = target.toFixed(1); return; }
    const from = bpmShown, start = performance.now();
    const step = (now) => {
      const x = Math.min(1, (now - start) / 320), e = 1 - (1 - x) ** 4;
      bpmShown = from + (target - from) * e;
      el.textContent = bpmShown.toFixed(1);
      if (x < 1) bpmFrame = requestAnimationFrame(step);
    };
    if (target !== from) bpmFrame = requestAnimationFrame(step);
  }
  function countValue(target, decimals) {
    const el = $('val');
    cancelAnimationFrame(valFrame);
    if (valShown === null || calm) { valShown = target; el.textContent = target.toFixed(decimals); return; }
    const from = valShown, start = performance.now();
    const step = (now) => {
      const x = Math.min(1, (now - start) / 320), e = 1 - (1 - x) ** 4;
      valShown = from + (target - from) * e;
      el.textContent = valShown.toFixed(decimals);
      if (x < 1) valFrame = requestAnimationFrame(step);
    };
    if (target !== from) valFrame = requestAnimationFrame(step);
  }

  // Same sums as the plug-in's screen: 1/4 at 140 BPM reads 428.571 ms.
  function paint() {
    const reverb = fx[state.fx][0] === 'REVERB';
    const name = reverb ? styles[state.style][1] : fx[state.fx][0];
    $('name').textContent = name;
    countBpm(state.bpm);
    $('badge').textContent = state.auto ? 'AUTO' : 'MANUAL';
    $('badge').classList.toggle('off', !state.auto);
    $('auto').classList.toggle('off', !state.auto);
    $('divlab').textContent = reverb ? 'REVERB SIZE' : 'DIVISION';
    rollDivision(reverb ? `${state.size} %` : divisions[state.div], reverb ? state.size : state.div);
    countValue(reverb ? state.size : divisionBeats[state.div] * 60000 / state.bpm, reverb ? 0 : 3);
    $('unit').textContent = reverb ? '%' : 'ms';
    $('vallab').textContent = reverb ? 'REVERB SIZE' : 'TIME';
    plug.querySelectorAll('[data-band]').forEach((b) => b.setAttribute('aria-pressed', +b.dataset.band === state.band));
    labels.forEach((b, i) => b.setAttribute('aria-checked', i === state.fx));
    setNeedle('fx', angleOf(state.fx));
    setNeedle('time', reverb ? knobAngle(state.size, 10, 100) : knobAngle(state.div, 0, divisions.length - 1));
    setNeedle('level', knobAngle(state.level, 0, 1));
    setNeedle('color', knobAngle(state.color, -1, 1));
    $('power').textContent = state.on ? 'ON' : 'OFF';
    $('power').setAttribute('aria-pressed', state.on);
    $('theme-btn').textContent = themes[state.theme][1];
    $('preset-btn').textContent = state.preset;
    plug.classList.toggle('dimmed', !!state.menu);
    styleMenu.classList.toggle('open', state.menu === 'style');
    presetMenu.classList.toggle('open', state.menu === 'preset');
    styleRows.forEach((b, i) => b.setAttribute('aria-checked', i === state.style));
    presetRows.forEach((b, i) => b.setAttribute('aria-checked', presets[i][0] === state.preset));
    if (liveName) { liveName.textContent = name; liveDesc.textContent = fx[state.fx][1]; }
  }

  const step = (by) => {
    if (fx[state.fx][0] === 'REVERB') state.size = Math.max(10, Math.min(100, state.size + by * 10));
    else state.div = Math.max(0, Math.min(divisions.length - 1, state.div + by));
    paint();
  };

  const onClick = (name, fn) => $(name).addEventListener('click', () => { hands(); fn(); });
  onClick('prev', () => step(-1));
  onClick('next', () => step(1));
  plug.querySelectorAll('[data-band]').forEach((b) => b.addEventListener('click', () => { hands(); state.band = +b.dataset.band; paint(); }));
  const backToAuto = () => { state.auto = true; state.bpm = 140; taps = []; paint(); };
  onClick('auto', backToAuto);
  onClick('badge', backToAuto);
  let taps = [];
  onClick('tap', () => {
    const now = performance.now();
    taps = taps.filter((t) => now - t < 2000).concat(now);
    if (taps.length > 1) {
      state.bpm = Math.max(40, Math.min(240, 60000 * (taps.length - 1) / (now - taps[0])));
      state.auto = false;
      paint();
    }
  });
  onClick('power', () => { state.on = !state.on; paint(); });
  onClick('preset-btn', () => openMenu(state.menu === 'preset' ? null : 'preset'));
  onClick('theme-btn', () => setTheme((state.theme + 1) % themes.length));
  // A click outside an open menu closes it, as in the plug-in.
  plug.addEventListener('click', (e) => { if (state.menu && !e.target.closest('.menu, [data-preset-btn], .lab')) openMenu(null); });

  // Knobs: the big dial turns with the pointer, the others drag up and down.
  plug.querySelectorAll('[data-knob]').forEach((knob) => {
    const kind = knob.dataset.knob;
    let startY = 0, startV = 0;
    const read = () => kind === 'time' ? (fx[state.fx][0] === 'REVERB' ? state.size : state.div) : state[kind];
    const write = (v) => {
      if (kind === 'time') { if (fx[state.fx][0] === 'REVERB') state.size = Math.round(Math.max(10, Math.min(100, v)) / 10) * 10; else state.div = Math.round(Math.max(0, Math.min(divisions.length - 1, v))); }
      else if (kind === 'level') state.level = Math.max(0, Math.min(1, v));
      else if (kind === 'color') state.color = Math.max(-1, Math.min(1, v));
      paint();
    };
    const range = () => kind === 'time' ? (fx[state.fx][0] === 'REVERB' ? 90 : divisions.length - 1) : kind === 'color' ? 2 : 1;
    const dialFrom = (e) => {
      const r = knob.getBoundingClientRect();
      const a = Math.atan2(e.clientX - r.left - r.width / 2, r.top + r.height / 2 - e.clientY) * 180 / Math.PI;
      state.fx = Math.round((Math.max(-135, Math.min(135, a)) + 135) / 270 * (fx.length - 1));
      paint();
    };
    knob.addEventListener('pointerdown', (e) => {
      hands();
      knob.setPointerCapture(e.pointerId);
      startY = e.clientY;
      if (kind === 'fx') dialFrom(e); else startV = read();
    });
    knob.addEventListener('pointermove', (e) => {
      if (!knob.hasPointerCapture(e.pointerId)) return;
      if (kind === 'fx') dialFrom(e); else write(startV + (startY - e.clientY) / 150 * range());
    });
    knob.addEventListener('keydown', (e) => {
      const by = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!by) return;
      e.preventDefault();
      hands();
      if (kind === 'fx') { state.fx = Math.max(0, Math.min(fx.length - 1, state.fx + by)); paint(); }
      else write(read() + by * (kind === 'time' ? (fx[state.fx][0] === 'REVERB' ? 10 : 1) : range() / 20));
    });
  });

  // Theme change, as in the plug-in: the new look opens in a circle from the
  // Theme button. The browser animates a picture of the new page, plug-in and
  // text together, so nothing is repainted during the wipe.
  let scopeColor = '';
  const readScopeColor = () => { scopeColor = getComputedStyle(scope).color; };
  function setTheme(i, keep = false) {
    const root = document.documentElement;
    const id = themes[i][0];
    state.theme = i;
    // A theme the visitor chose follows them to the other pages.
    if (keep) { try { localStorage.setItem('t3-theme', id); } catch (e) {} }
    api.onTheme(i);
    const apply = () => {
      plug.dataset.theme = id;
      root.dataset.theme = id;
      paint();
      readScopeColor();
    };
    if (calm || !document.startViewTransition) { apply(); return; }

    const b = $('theme-btn').getBoundingClientRect();
    const x = Math.max(0, Math.min(innerWidth, b.left + b.width / 2));
    const y = Math.max(0, Math.min(innerHeight, b.top + b.height / 2));
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    root.classList.add('theme-switching');
    const wipe = document.startViewTransition(apply);
    wipe.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 550, easing: 'cubic-bezier(.33, 1, .68, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
    wipe.finished.finally(() => root.classList.remove('theme-switching'));
  }

  // Screen: L/R meters and a small scope, a stylised picture of what each effect does.
  const scope = plug.querySelector('#scope'), sc = scope.getContext('2d');
  scope.width = 798; scope.height = 252;
  sc.scale(3, 3);
  const mod1 = (v) => v - Math.floor(v);
  const kick = (u) => Math.exp(-mod1(u) * 4) * (Math.floor(u) % 2 ? .72 : 1);
  const repeats = (u, d, fb, n, dry = 1) => { let v = dry * kick(u), g = fb; for (let k = 1; k <= n; k++) { v = Math.max(v, g * kick(u - k * d)); g *= fb; } return v; };
  const shapes = {
    'FLANGER': (u, d, x, t) => kick(u) * (.62 + .38 * Math.sin(x * 40 + Math.sin(t / d) * 9)),
    'PHASER': (u, d, x, t) => kick(u) * (.68 + .32 * Math.sin(x * 16 + t * 2 / d)),
    'REVERB': (u) => Math.max(kick(u), .3 + .2 * Math.sin(u * 2.1)) * (.86 + .14 * Math.sin(u * 37)),
    'ROBOT': (u) => kick(u) * (Math.sin(u * 60) > 0 ? 1 : .3),
    'CHORUS': (u, d, x, t) => kick(u) * (.75 + .15 * Math.sin(x * 9 + t) + .1 * Math.sin(x * 23 - t * 1.4)),
    'ROLL': (u, d) => kick(mod1(u / d) * Math.min(d, 1)),
    'REV ROLL': (u, d) => kick((1 - mod1(u / d)) * Math.min(d, 1) * .98),
    'SND/RTN': (u, d) => Math.max(repeats(u, d, .6, 5), .22 + .1 * Math.sin(u * 3)),
    'DELAY': (u, d) => repeats(u, d, .35, 3),
    'ECHO': (u, d) => repeats(u, d, .6, 6),
    'REV DLY': (u, d) => Math.max(kick(u), .75 * (1 - Math.exp(-mod1(u / d) * 3)) * Math.exp(-mod1(u) * .6)),
    'PAN': (u, d, x, t, ch) => kick(u) * (.5 + .5 * ch * Math.sin(Math.PI * 2 * u / d)),
    'GATE': (u, d) => kick(u) * (mod1(u / d) < .5 ? 1 : .05),
    'FILTER': (u, d) => kick(u) * (.25 + .75 * (.5 - .5 * Math.cos(Math.PI * 2 * u / d))),
    'PITCH': (u) => kick(u * 2),
    'VORTEX': (u, d) => repeats(u, d, .8, 9) * (.8 + .2 * Math.sin(u * 19)),
    'INFINITE': (u, d) => repeats(u, d, .95, 14, .2) * .85,
    'MOBIUS': (u, d, x, t) => kick(u) * (.6 + .4 * Math.sin(x * 30 - t * 5)),
    'BRAKE': (u, d, x) => kick(u * (1 - x * .75)) * (1 - x * .9),
    'ECHO OUT': (u, d) => repeats(u, d, .7, 7, .08),
  };
  const meterL = $('l'), meterR = $('r');
  let stageVisible = true;
  function drawScope(now) {
    const t = now * .001 * state.bpm / 60;
    const shape = state.on ? shapes[fx[state.fx][0]] : (u) => kick(u);
    const d = Math.max(.25, Math.min(8, divisionBeats[state.div]));
    sc.clearRect(0, 0, 266, 84);
    sc.fillStyle = scopeColor;
    for (let px = 0; px < 266; px += 3) {
      const x = px / 266, u = x * 4 + t;
      const l = Math.max(.02, Math.min(1, shape(u, d, x, t, -1))), r = Math.max(.02, Math.min(1, shape(u, d, x, t, 1)));
      sc.fillRect(px, 42 - l * 42, 1.5, (l + r) * 42);
    }
    meterL.style.transform = `scaleX(${Math.min(1, shape(t, d, .5, t, -1))})`;
    meterR.style.transform = `scaleX(${Math.min(1, shape(t, d, .5, t, 1) * .94)})`;
    if (!calm && stageVisible) requestAnimationFrame(drawScope);
  }

  // Scale and centre the plug-in in its stage, on the part between y0 and y1.
  function aim(stage, y0 = 0, y1 = 1320) {
    const w = stage.clientWidth, h = stage.clientHeight, pad = 28;
    const span = y1 - y0;
    const s = Math.min((h - pad * 2) / span, (w - 8) / 386, 2.2);
    camera.style.transform = `translate(${(w - 386 * s) / 2}px, ${(h - span * s) / 2 - y0 * s}px) scale(${s})`;
  }

  function hands() { api.onTouch(); }
  const api = {
    plug, state, paint, setTheme, readScopeColor, applyPreset, setNeedle, aim, calm, fx, fxIndex, styles, themes, presets,
    onTouch() {}, onTheme() {},
    setVisible(v) { const was = stageVisible; stageVisible = v; if (v && !was && !calm) requestAnimationFrame(drawScope); },
  };

  state.theme = Math.max(0, themes.findIndex(([id]) => id === document.documentElement.dataset.theme));
  plug.dataset.theme = themes[state.theme][0];
  readScopeColor();
  paint();
  requestAnimationFrame(drawScope);
  return api;
};
