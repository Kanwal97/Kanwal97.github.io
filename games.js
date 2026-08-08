/* ═══════════════════════════════════════════════════════════
   Games — Snake, 2048, Memory Match, Tic-Tac-Toe
   No libraries. Each game exposes { title, foot, mount(root) }
   and mount() returns a destroy() function.
   ═══════════════════════════════════════════════════════════ */

(function (global) {
  'use strict';

  /* ── storage helpers (private mode can throw) ────────────── */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem('ks_' + key);
        return v === null ? fallback : JSON.parse(v);
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem('ks_' + key, JSON.stringify(value)); } catch (_) {}
    }
  };

  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* Swipe detection — returns a cleanup fn */
  function onSwipe(node, handler) {
    let x0 = 0, y0 = 0, active = false;
    const MIN = 24;

    const start = (e) => {
      const t = e.changedTouches[0];
      x0 = t.clientX; y0 = t.clientY; active = true;
    };
    const end = (e) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - x0, dy = t.clientY - y0;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < MIN) return;
      if (Math.abs(dx) > Math.abs(dy)) handler(dx > 0 ? 'right' : 'left');
      else handler(dy > 0 ? 'down' : 'up');
    };
    const move = (e) => { if (active) e.preventDefault(); };

    node.addEventListener('touchstart', start, { passive: true });
    node.addEventListener('touchmove', move, { passive: false });
    node.addEventListener('touchend', end, { passive: true });

    return () => {
      node.removeEventListener('touchstart', start);
      node.removeEventListener('touchmove', move);
      node.removeEventListener('touchend', end);
    };
  }

  /* ═════════════════════════ SNAKE ═════════════════════════ */
  const snake = {
    title: 'Snake 🐍',
    bestKey: 'best_snake',
    bestLabel: (v) => 'Best: ' + v,
    foot: '<kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or swipe · <kbd>Space</kbd> to pause',

    mount(root, onBest) {
      const COLS = 20, ROWS = 20, CELL = 18;
      const W = COLS * CELL, H = ROWS * CELL;

      root.appendChild(el('div', 'g-bar', `
        <div class="g-stat"><span>Score</span><b id="snScore">0</b></div>
        <div class="g-stat"><span>Best</span><b id="snBest">0</b></div>
        <div class="g-stat"><span>Speed</span><b id="snSpeed">1</b></div>
      `));

      const wrap = el('div', 'snake-wrap');
      const canvas = el('canvas');
      canvas.id = 'snakeCanvas';
      canvas.width = W;
      canvas.height = H;
      canvas.setAttribute('role', 'img');
      canvas.setAttribute('aria-label', 'Snake game board');
      wrap.appendChild(canvas);

      const overlay = el('div', 'g-overlay', `
        <h3>Ready?</h3>
        <p>Eat the apples. Don't hit yourself.</p>
        <button class="g-btn on" id="snStart" type="button">Start game</button>
      `);
      wrap.appendChild(overlay);
      root.appendChild(wrap);

      const msg = el('p', 'g-msg');
      root.appendChild(msg);

      const ctx = canvas.getContext('2d');
      const scoreOut = root.querySelector('#snScore');
      const bestOut = root.querySelector('#snBest');
      const speedOut = root.querySelector('#snSpeed');
      const startBtn = root.querySelector('#snStart');

      let best = store.get(snake.bestKey, 0);
      bestOut.textContent = best;

      let body, dir, nextDir, apple, score, alive, paused, running;
      let stepMs, acc = 0, last = 0, raf = null;

      const css = (name) => getComputedStyle(document.documentElement)
        .getPropertyValue(name).trim();

      function reset() {
        body = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
        dir = { x: 1, y: 0 };
        nextDir = { x: 1, y: 0 };
        score = 0;
        stepMs = 130;
        acc = 0;
        alive = true;
        paused = false;
        scoreOut.textContent = '0';
        speedOut.textContent = '1';
        msg.textContent = '';
        msg.className = 'g-msg';
        placeApple();
      }

      function placeApple() {
        const free = [];
        for (let y = 0; y < ROWS; y++)
          for (let x = 0; x < COLS; x++)
            if (!body.some((s) => s.x === x && s.y === y)) free.push({ x, y });
        apple = free.length
          ? free[Math.floor(Math.random() * free.length)]
          : null;
      }

      function step() {
        if (nextDir.x !== -dir.x || nextDir.y !== -dir.y) dir = nextDir;

        const head = { x: body[0].x + dir.x, y: body[0].y + dir.y };

        if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS ||
            body.some((s) => s.x === head.x && s.y === head.y)) {
          return die();
        }

        body.unshift(head);

        if (apple && head.x === apple.x && head.y === apple.y) {
          score += 10;
          scoreOut.textContent = score;
          if (score > best) {
            best = score;
            bestOut.textContent = best;
            store.set(snake.bestKey, best);
            if (onBest) onBest(best);
          }
          if (stepMs > 65) stepMs -= 3;
          speedOut.textContent = Math.min(9, Math.floor((130 - stepMs) / 8) + 1);
          placeApple();
        } else {
          body.pop();
        }
      }

      function die() {
        alive = false;
        running = false;
        msg.textContent = `Game over — you scored ${score}.`;
        msg.className = 'g-msg lose';
        overlay.innerHTML = `
          <h3>Game over</h3>
          <p>Score ${score}${score >= best && score > 0 ? ' — new best!' : ''}</p>
          <button class="g-btn on" id="snStart" type="button">Play again</button>`;
        overlay.hidden = false;
        overlay.querySelector('#snStart').addEventListener('click', begin);
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);

        // grid
        ctx.strokeStyle = css('--line') || 'rgba(255,255,255,.1)';
        ctx.lineWidth = 1;
        for (let i = 1; i < COLS; i++) {
          ctx.beginPath();
          ctx.moveTo(i * CELL + .5, 0);
          ctx.lineTo(i * CELL + .5, H);
          ctx.stroke();
        }
        for (let i = 1; i < ROWS; i++) {
          ctx.beginPath();
          ctx.moveTo(0, i * CELL + .5);
          ctx.lineTo(W, i * CELL + .5);
          ctx.stroke();
        }

        // apple
        if (apple) {
          ctx.fillStyle = css('--game-food') || '#ffffff';
          roundRect(apple.x * CELL + 3, apple.y * CELL + 3, CELL - 6, CELL - 6, 5);
          ctx.fill();
        }

        // snake
        const bodyHue = css('--orange') || '#ff6f00';
        const headHue = css('--orange-lt') || '#ff9d31';
        body.forEach((seg, i) => {
          ctx.fillStyle = i === 0 ? headHue : bodyHue;
          ctx.globalAlpha = i === 0 ? 1 : Math.max(.4, 1 - i / (body.length + 6));
          roundRect(seg.x * CELL + 2, seg.y * CELL + 2, CELL - 4, CELL - 4, 5);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
      }

      function roundRect(x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
      }

      function loop(ts) {
        if (!running) return;
        if (!last) last = ts;
        const dt = ts - last;
        last = ts;

        if (!paused && alive) {
          acc += dt;
          while (acc >= stepMs) {
            acc -= stepMs;
            step();
            if (!alive) break;
          }
        }
        draw();
        raf = requestAnimationFrame(loop);
      }

      function begin() {
        reset();
        overlay.hidden = true;
        running = true;
        last = 0;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(loop);
      }

      function turn(d) {
        const map = {
          up: { x: 0, y: -1 }, down: { x: 0, y: 1 },
          left: { x: -1, y: 0 }, right: { x: 1, y: 0 }
        };
        if (map[d]) nextDir = map[d];
      }

      const keys = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right'
      };

      function onKey(e) {
        const d = keys[e.key];
        if (d) { e.preventDefault(); turn(d); return; }
        if (e.key === ' ' && running && alive) {
          e.preventDefault();
          paused = !paused;
          msg.textContent = paused ? 'Paused' : '';
        }
      }

      startBtn.addEventListener('click', begin);
      document.addEventListener('keydown', onKey);
      const unswipe = onSwipe(canvas, turn);

      reset();
      draw();

      return function destroy() {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
        unswipe();
      };
    }
  };

  /* ═════════════════════════ 2048 ══════════════════════════ */
  const g2048 = {
    title: '2048 🧩',
    bestKey: 'best_2048',
    bestLabel: (v) => 'Best: ' + v,
    foot: '<kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> or swipe to slide tiles',

    mount(root, onBest) {
      const N = 4;

      root.appendChild(el('div', 'g-bar', `
        <div class="g-stat"><span>Score</span><b id="tScore">0</b></div>
        <div class="g-stat"><span>Best</span><b id="tBest">0</b></div>
        <button class="g-btn" id="tNew" type="button">New game</button>
      `));

      const board = el('div', 'tile-board');
      for (let i = 0; i < N * N; i++) board.appendChild(el('div', 'cell'));
      const layer = el('div');
      layer.style.cssText = 'position:absolute;inset:0';
      board.appendChild(layer);
      root.appendChild(board);

      const msg = el('p', 'g-msg');
      root.appendChild(msg);

      const scoreOut = root.querySelector('#tScore');
      const bestOut = root.querySelector('#tBest');

      let grid, score, best = store.get(g2048.bestKey, 0), over, won;
      bestOut.textContent = best;

      /* Positioning: board has 10px padding and 10px gaps.
         size = (100% - 2*10 - 3*10) / 4 = (100% - 50px) / 4 */
      const SIZE = '((100% - 50px) / 4)';
      const pos = (i) => `calc(10px + ${i} * (${SIZE} + 10px))`;

      function reset() {
        grid = Array.from({ length: N }, () => Array(N).fill(0));
        score = 0;
        over = false;
        won = false;
        scoreOut.textContent = '0';
        msg.textContent = '';
        msg.className = 'g-msg';
        addTile();
        addTile();
        render(true);
      }

      function addTile() {
        const free = [];
        for (let r = 0; r < N; r++)
          for (let c = 0; c < N; c++)
            if (!grid[r][c]) free.push([r, c]);
        if (!free.length) return null;
        const [r, c] = free[Math.floor(Math.random() * free.length)];
        grid[r][c] = Math.random() < 0.9 ? 2 : 4;
        return [r, c];
      }

      function render(fresh, spawned, merged) {
        layer.textContent = '';
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            const v = grid[r][c];
            if (!v) continue;
            const t = el('div', 'tile t' + Math.min(v, 2048));
            t.textContent = v;
            t.style.width = `calc(${SIZE})`;
            t.style.height = `calc(${SIZE})`;
            t.style.left = pos(c);
            t.style.top = pos(r);
            t.style.fontSize = v > 999 ? 'clamp(.9rem, 4.4vw, 1.35rem)'
                             : v > 99 ? 'clamp(1.1rem, 5.2vw, 1.6rem)'
                             : 'clamp(1.3rem, 6vw, 1.9rem)';
            if (fresh || (spawned && spawned[0] === r && spawned[1] === c)) t.classList.add('new');
            else if (merged && merged.some(([mr, mc]) => mr === r && mc === c)) t.classList.add('pop');
            layer.appendChild(t);
          }
        }
      }

      /* Slide+merge one row to the left. Returns {row, gained, merges} */
      function collapse(row) {
        const vals = row.filter((v) => v);
        const out = [];
        const merges = [];
        let gained = 0;

        for (let i = 0; i < vals.length; i++) {
          if (vals[i] === vals[i + 1]) {
            const v = vals[i] * 2;
            out.push(v);
            merges.push(out.length - 1);
            gained += v;
            i++;
          } else {
            out.push(vals[i]);
          }
        }
        while (out.length < N) out.push(0);
        return { row: out, gained, merges };
      }

      const rotateCW = (g) =>
        g[0].map((_, c) => g.map((r) => r[c]).reverse());

      /* Rotate so that any direction becomes "slide left" */
      function rotate(g, times) {
        let out = g;
        for (let i = 0; i < ((times % 4) + 4) % 4; i++) out = rotateCW(out);
        return out;
      }

      function move(dir) {
        if (over) return;

        // turns needed to make `dir` behave as left
        const turns = { left: 0, up: 3, right: 2, down: 1 }[dir];
        if (turns === undefined) return;

        const before = JSON.stringify(grid);
        let work = rotate(grid, turns);
        let gained = 0;
        const mergedCells = [];

        work = work.map((row, r) => {
          const { row: next, gained: g, merges } = collapse(row);
          gained += g;
          merges.forEach((c) => mergedCells.push([r, c]));
          return next;
        });

        // rotate back
        grid = rotate(work, 4 - turns);
        // merge coords need the same inverse rotation
        const mapped = mergedCells.map(([r, c]) => unrotate(r, c, turns));

        if (JSON.stringify(grid) === before) return;

        score += gained;
        scoreOut.textContent = score;
        if (score > best) {
          best = score;
          bestOut.textContent = best;
          store.set(g2048.bestKey, best);
          if (onBest) onBest(best);
        }

        const spawned = addTile();
        render(false, spawned, mapped);

        if (!won && grid.some((row) => row.some((v) => v >= 2048))) {
          won = true;
          msg.textContent = 'You hit 2048! Keep going for a bigger tile.';
          msg.className = 'g-msg win';
        }
        if (!canMove()) {
          over = true;
          msg.textContent = `No moves left — final score ${score}.`;
          msg.className = 'g-msg lose';
        }
      }

      /* Map a coordinate from rotated space back to grid space */
      function unrotate(r, c, turns) {
        let y = r, x = c;
        for (let i = 0; i < ((4 - turns) % 4); i++) {
          const ny = x;
          const nx = N - 1 - y;
          y = ny; x = nx;
        }
        return [y, x];
      }

      function canMove() {
        for (let r = 0; r < N; r++)
          for (let c = 0; c < N; c++) {
            if (!grid[r][c]) return true;
            if (c < N - 1 && grid[r][c] === grid[r][c + 1]) return true;
            if (r < N - 1 && grid[r][c] === grid[r + 1][c]) return true;
          }
        return false;
      }

      const keys = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right'
      };

      function onKey(e) {
        const d = keys[e.key];
        if (!d) return;
        e.preventDefault();
        move(d);
      }

      document.addEventListener('keydown', onKey);
      const unswipe = onSwipe(board, move);
      root.querySelector('#tNew').addEventListener('click', reset);

      reset();

      return function destroy() {
        document.removeEventListener('keydown', onKey);
        unswipe();
      };
    }
  };

  /* ══════════════════════ MEMORY MATCH ═════════════════════ */
  const memory = {
    title: 'Memory Match 🃏',
    bestKey: 'best_memory',
    bestLabel: (v) => 'Best: ' + v + ' moves',
    foot: 'Flip two cards. Match them all in as few moves as you can.',

    mount(root, onBest) {
      const FACES = ['🌞', '🌵', '🌊', '🌸', '🍋', '🔥', '🌙', '⭐'];

      root.appendChild(el('div', 'g-bar', `
        <div class="g-stat"><span>Moves</span><b id="mMoves">0</b></div>
        <div class="g-stat"><span>Pairs</span><b id="mPairs">0/8</b></div>
        <button class="g-btn" id="mNew" type="button">New game</button>
      `));

      const board = el('div', 'mem-board');
      root.appendChild(board);

      const msg = el('p', 'g-msg');
      root.appendChild(msg);

      const movesOut = root.querySelector('#mMoves');
      const pairsOut = root.querySelector('#mPairs');

      let deck, first, second, lock, moves, pairs;
      let best = store.get(memory.bestKey, null);
      let timer = null;

      function shuffle(arr) {
        const a = arr.slice();
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      }

      function reset() {
        if (timer) { clearTimeout(timer); timer = null; }
        deck = shuffle(FACES.concat(FACES));
        first = second = null;
        lock = false;
        moves = 0;
        pairs = 0;
        movesOut.textContent = '0';
        pairsOut.textContent = '0/8';
        msg.textContent = best ? `Your best: ${best} moves` : '';
        msg.className = 'g-msg';

        board.textContent = '';
        deck.forEach((face, i) => {
          const card = el('button', 'mem-card');
          card.type = 'button';
          card.dataset.face = face;
          card.dataset.i = i;
          card.setAttribute('aria-label', 'Hidden card');
          card.innerHTML = `
            <span class="mem-inner">
              <span class="mem-face mem-back" aria-hidden="true">?</span>
              <span class="mem-face mem-front" aria-hidden="true">${face}</span>
            </span>`;
          card.addEventListener('click', () => flip(card));
          board.appendChild(card);
        });
      }

      function flip(card) {
        if (lock || card === first || card.classList.contains('done')) return;

        card.classList.add('flip');
        card.setAttribute('aria-label', 'Card showing ' + card.dataset.face);

        if (!first) { first = card; return; }

        second = card;
        moves++;
        movesOut.textContent = moves;
        lock = true;

        if (first.dataset.face === second.dataset.face) {
          timer = setTimeout(() => {
            first.classList.add('done');
            second.classList.add('done');
            first = second = null;
            lock = false;
            pairs++;
            pairsOut.textContent = pairs + '/8';
            if (pairs === FACES.length) finish();
          }, 320);
        } else {
          timer = setTimeout(() => {
            first.classList.remove('flip');
            second.classList.remove('flip');
            first.setAttribute('aria-label', 'Hidden card');
            second.setAttribute('aria-label', 'Hidden card');
            first = second = null;
            lock = false;
          }, 780);
        }
      }

      function finish() {
        const isBest = best === null || moves < best;
        if (isBest) {
          best = moves;
          store.set(memory.bestKey, best);
          if (onBest) onBest(best);
        }
        msg.textContent = isBest
          ? `Cleared in ${moves} moves — new personal best!`
          : `Cleared in ${moves} moves. Your best is ${best}.`;
        msg.className = 'g-msg win';
      }

      root.querySelector('#mNew').addEventListener('click', reset);
      reset();

      return function destroy() {
        if (timer) clearTimeout(timer);
      };
    }
  };

  /* ═══════════════════ TIC-TAC-TOE (minimax) ═══════════════ */
  const ttt = {
    title: 'Tic-Tac-Toe 🤖',
    bestKey: 'best_ttt',
    bestLabel: (v) => 'Wins: ' + v,
    foot: 'You are <b>X</b>. On Hard the AI plays perfectly — a draw is a win.',

    mount(root, onBest) {
      const LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];

      root.appendChild(el('div', 'ttt-levels', `
        <button class="g-btn" data-lvl="easy" type="button">Easy</button>
        <button class="g-btn" data-lvl="medium" type="button">Medium</button>
        <button class="g-btn on" data-lvl="hard" type="button">Hard</button>
      `));

      root.appendChild(el('div', 'g-bar', `
        <div class="g-stat"><span>Wins</span><b id="wW">0</b></div>
        <div class="g-stat"><span>Draws</span><b id="wD">0</b></div>
        <div class="g-stat"><span>Losses</span><b id="wL">0</b></div>
      `));

      const board = el('div', 'ttt-board');
      board.setAttribute('role', 'grid');
      root.appendChild(board);

      const msg = el('p', 'g-msg');
      root.appendChild(msg);

      const newBtn = el('button', 'g-btn', 'New round');
      newBtn.type = 'button';
      const holder = el('div');
      holder.style.cssText = 'text-align:center;margin-top:14px';
      holder.appendChild(newBtn);
      root.appendChild(holder);

      const wOut = root.querySelector('#wW');
      const dOut = root.querySelector('#wD');
      const lOut = root.querySelector('#wL');

      let cells, board_, busy, done, level = 'hard';
      let timer = null;
      const tally = store.get('ttt_tally', { w: 0, d: 0, l: 0 });

      function paintTally() {
        wOut.textContent = tally.w;
        dOut.textContent = tally.d;
        lOut.textContent = tally.l;
      }
      paintTally();

      function winner(b) {
        for (const [a, c, d] of LINES)
          if (b[a] && b[a] === b[c] && b[a] === b[d]) return { mark: b[a], line: [a, c, d] };
        return b.every((v) => v) ? { mark: 'draw', line: [] } : null;
      }

      /* minimax — 'O' is the AI (maximizing) */
      function minimax(b, isAI, depth) {
        const res = winner(b);
        if (res) {
          if (res.mark === 'O') return 10 - depth;
          if (res.mark === 'X') return depth - 10;
          return 0;
        }

        const scores = [];
        for (let i = 0; i < 9; i++) {
          if (b[i]) continue;
          b[i] = isAI ? 'O' : 'X';
          scores.push({ i, s: minimax(b, !isAI, depth + 1) });
          b[i] = '';
        }
        return isAI
          ? Math.max(...scores.map((x) => x.s))
          : Math.min(...scores.map((x) => x.s));
      }

      function bestMove(b) {
        let best = -Infinity, pick = -1;
        for (let i = 0; i < 9; i++) {
          if (b[i]) continue;
          b[i] = 'O';
          const s = minimax(b, false, 0);
          b[i] = '';
          if (s > best) { best = s; pick = i; }
        }
        return pick;
      }

      function randomMove(b) {
        const free = b.map((v, i) => (v ? null : i)).filter((v) => v !== null);
        return free[Math.floor(Math.random() * free.length)];
      }

      function aiMove() {
        const b = board_.slice();
        if (level === 'easy') return randomMove(b);
        if (level === 'medium') return Math.random() < 0.5 ? randomMove(b) : bestMove(b);
        return bestMove(b);
      }

      function reset() {
        if (timer) { clearTimeout(timer); timer = null; }
        board_ = Array(9).fill('');
        busy = false;
        done = false;
        msg.textContent = 'Your turn — you play X.';
        msg.className = 'g-msg';

        board.textContent = '';
        cells = [];
        for (let i = 0; i < 9; i++) {
          const c = el('button', 'ttt-cell');
          c.type = 'button';
          c.setAttribute('aria-label', 'Square ' + (i + 1) + ', empty');
          c.addEventListener('click', () => play(i));
          board.appendChild(c);
          cells.push(c);
        }
      }

      function mark(i, who) {
        board_[i] = who;
        const c = cells[i];
        c.textContent = who;
        c.classList.add(who.toLowerCase(), 'mark');
        c.disabled = true;
        c.setAttribute('aria-label', 'Square ' + (i + 1) + ', ' + who);
      }

      function play(i) {
        if (busy || done || board_[i]) return;

        mark(i, 'X');
        if (check()) return;

        busy = true;
        msg.textContent = 'Thinking…';
        timer = setTimeout(() => {
          const move = aiMove();
          if (move !== undefined && move >= 0) mark(move, 'O');
          busy = false;
          if (!check()) msg.textContent = 'Your turn.';
        }, 320);
      }

      function check() {
        const res = winner(board_);
        if (!res) return false;

        done = true;
        cells.forEach((c) => { c.disabled = true; });
        res.line.forEach((i) => cells[i].classList.add('win'));

        if (res.mark === 'X') {
          tally.w++;
          msg.textContent = 'You win! 🎉';
          msg.className = 'g-msg win';
        } else if (res.mark === 'O') {
          tally.l++;
          msg.textContent = 'The AI got you. Rematch?';
          msg.className = 'g-msg lose';
        } else {
          tally.d++;
          msg.textContent = level === 'hard'
            ? "Draw — that's the best anyone can do on Hard."
            : 'Draw.';
          msg.className = 'g-msg';
        }

        store.set('ttt_tally', tally);
        store.set(ttt.bestKey, tally.w);
        if (onBest) onBest(tally.w);
        paintTally();
        return true;
      }

      root.querySelectorAll('[data-lvl]').forEach((btn) => {
        btn.addEventListener('click', () => {
          level = btn.dataset.lvl;
          root.querySelectorAll('[data-lvl]').forEach((b) => b.classList.toggle('on', b === btn));
          reset();
        });
      });

      newBtn.addEventListener('click', reset);
      reset();

      return function destroy() {
        if (timer) clearTimeout(timer);
      };
    }
  };

  global.GAMES = { snake, '2048': g2048, memory, ttt };

})(window);
