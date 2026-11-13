/* ╔══════════════════════════════════════════════════════════╗
   ║  assemble.js — Multi-cursor "live build" intro           ║
   ║  เคอร์เซอร์หลายอันช่วยกันประกอบหน้า Hero ตอนเปิดเว็บ       ║
   ╚══════════════════════════════════════════════════════════╝ */
(() => {
    'use strict';

    const root = document.documentElement;
    // head script จะใส่ class นี้ให้ (ถ้าผู้ใช้ปิด animation จะไม่ใส่ = ข้ามทั้งหมด)
    if (!root.classList.contains('assembling')) return;

    /* ───────────── ตั้งค่าได้ที่นี่ ───────────── */
    const small = window.innerWidth < 700;
    const CFG = {
        cursors: small ? 3 : 5,      // จำนวนเคอร์เซอร์
        tempo: small ? 0.8 : 1,      // ยิ่งน้อยยิ่งเร็ว (คูณกับทุก duration)
        hardTimeout: 9000            // กันพลาด: ครบเวลานี้แสดงหน้าเว็บเต็มทันที
    };
    const PEOPLE = [
        ['neo', '#00ff41'],
        ['trinity', '#00d4ff'],
        ['morpheus', '#ff006e'],
        ['cipher', '#a56bff'],
        ['tank', '#ffd60a']
    ];

    /* ───────────── ตัวช่วย ───────────── */
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const R = el => el.getBoundingClientRect();
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);
    const ease = {
        io: t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
        out: t => 1 - Math.pow(1 - t, 3),
        lin: t => t
    };
    const state = { dead: false };
    const pending = [];
    const sleep = ms => new Promise(r => setTimeout(r, ms * CFG.tempo));

    function tween(ms, fn, e = ease.io) {
        ms *= CFG.tempo;
        return new Promise(res => {
            const t0 = performance.now();
            (function frame(now) {
                const p = clamp((now - t0) / ms, 0, 1);
                fn(e(p), p);
                if (p < 1 && !state.dead) requestAnimationFrame(frame);
                else res();
            })(t0);
        });
    }

    /* ───────────── Overlay layer + HUD ───────────── */
    const layer = document.createElement('div');
    layer.className = 'asm-layer';
    layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML =
        '<div class="asm-hud"><span>ASSEMBLING</span>' +
        '<span class="bar"><i></i></span><span class="pct">0%</span></div>' +
        '<button class="asm-skip" type="button">SKIP ▸</button>';
    document.body.appendChild(layer);
    const hudBar = layer.querySelector('.bar i');
    const hudPct = layer.querySelector('.pct');
    const hudLabel = layer.querySelector('.asm-hud span');

    /* ───────────── เคอร์เซอร์ ───────────── */
    const ARROW =
        '<svg viewBox="0 0 24 24"><path d="M3 2 L3 19 L8 14.5 L11.5 22 L14.5 20.7 L11.2 13.3 L18 13 Z" ' +
        'fill="var(--c)" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg>';

    class Cur {
        constructor(i) {
            [this.name, this.color] = PEOPLE[i % PEOPLE.length];
            this.el = document.createElement('div');
            this.el.className = 'asm-cursor';
            this.el.style.setProperty('--c', this.color);
            this.el.innerHTML = ARROW + '<span>' + this.name + '</span>';
            layer.appendChild(this.el);

            // เริ่มจากนอกจอ คนละฝั่ง
            const w = innerWidth, h = innerHeight, side = i % 4;
            this.x = side === 0 ? -50 : side === 1 ? w + 50 : rand(0, w);
            this.y = side === 2 ? -50 : side === 3 ? h + 50 : rand(0, h);
            this.draw();
        }
        draw() {
            this.el.style.transform = 'translate3d(' + (this.x - 3) + 'px,' + (this.y - 2) + 'px,0)';
        }
        // เคลื่อนที่เป็นเส้นโค้งแบบมือคน
        move(x, y) {
            const x0 = this.x, y0 = this.y, dx = x - x0, dy = y - y0;
            const d = Math.hypot(dx, dy) || 1;
            const ms = clamp(170 + d * 0.55, 230, 720);
            const bend = (Math.random() - .5) * Math.min(180, d * .45);
            const cx = (x0 + x) / 2 - (dy / d) * bend;
            const cy = (y0 + y) / 2 + (dx / d) * bend;
            return tween(ms, p => {
                const q = 1 - p;
                this.x = q * q * x0 + 2 * q * p * cx + p * p * x;
                this.y = q * q * y0 + 2 * q * p * cy + p * p * y;
                this.draw();
            });
        }
        click() {
            const r = document.createElement('div');
            r.className = 'asm-ripple';
            r.style.setProperty('--c', this.color);
            r.style.left = this.x + 'px';
            r.style.top = this.y + 'px';
            layer.appendChild(r);
            setTimeout(() => r.remove(), 520);
            this.el.classList.add('press');
            setTimeout(() => this.el.classList.remove('press'), 160);
        }
    }

    /* ───────────── กรอบ selection ───────────── */
    function makeSel(color) {
        const s = document.createElement('div');
        s.className = 'asm-sel';
        s.style.setProperty('--c', color);
        s.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
        layer.appendChild(s);
        return s;
    }
    function placeSel(s, x1, y1, x2, y2) {
        const w = Math.max(0, x2 - x1), h = Math.max(0, y2 - y1);
        s.style.transform = 'translate(' + x1 + 'px,' + y1 + 'px)';
        s.style.width = w + 'px';
        s.style.height = h + 'px';
        s.lastChild.textContent = Math.round(w) + ' × ' + Math.round(h);
    }
    function dropSel(s) {
        s.classList.add('out');
        setTimeout(() => s.remove(), 350);
    }

    /* ───────────── รายการสิ่งที่ต้อง "ประกอบ" ───────────── */
    const ALL = new Set();
    const visible = el => getComputedStyle(el).display !== 'none';
    const show = el => el.classList.add('asm-done');

    const tasks = [];
    function add(type, selector, opts = {}) {
        $$(selector).filter(visible).forEach(el => {
            ALL.add(el);
            tasks.push(Object.assign({ type, els: [el] }, opts));
        });
        return tasks[tasks.length - 1];
    }

    // ลำดับในคิว = ลำดับที่เคอร์เซอร์ว่างๆ จะมาหยิบงานไปทำ
    const bgEls = $$('.cyber-grid, .digital-rain, .code-particles');
    bgEls.forEach(el => ALL.add(el));
    tasks.push({ type: 'fade', els: bgEls });

    add('drag', '.hero-header .terminal-window', { pad: 8, ms: 900, isFrame: true });
    const frame = tasks[tasks.length - 1];

    add('drag', '.hero-img', { pad: 10, ms: 850 });
    add('wipe', '.hero-text h1', { ms: 700 });
    add('wipe', '.hero-text .tagline', { ms: 600 });
    add('drag', '.hero-text > p', { pad: 6, ms: 800 });
    add('wipe', '.hero-header .logo', { ms: 500, dep: frame });
    add('pop', '.hero-header nav ul li', { dep: frame });
    add('pop', '.hero-header .togglebtn', { dep: frame });
    add('pop', '.hero-text .btn');
    add('pop', '.hero-text .social a');

    tasks.forEach(t => { t.done = new Promise(r => { t.resolve = r; }); });
    const total = tasks.length;
    let doneCount = 0;

    function progress() {
        doneCount++;
        const pct = Math.round((doneCount / total) * 100);
        hudBar.style.width = pct + '%';
        hudPct.textContent = pct + '%';
    }

    /* ───────────── ท่าทางการประกอบแต่ละแบบ ───────────── */
    const actions = {
        // คลิกพื้นหลังแล้วค่อยๆ ติด (grid / matrix rain)
        async fade(t, c) {
            await c.move(innerWidth * rand(.3, .7), innerHeight * rand(.3, .6));
            c.click();
            t.els.forEach(el => {
                show(el);
                const to = getComputedStyle(el).opacity;
                const a = el.animate([{ opacity: 0 }, { opacity: to }],
                    { duration: 800 * CFG.tempo, easing: 'ease-out' });
                pending.push(a.finished.catch(() => {}));
            });
        },

        // ลากกรอบสี่เหลี่ยมจากมุมซ้ายบนไปขวาล่าง แล้วของข้างในค่อยๆ โผล่ตามกรอบ
        async drag(t, c) {
            const el = t.els[0], pad = t.pad || 6;
            const r0 = R(el);
            const sel = makeSel(c.color);
            const clip = (p, w, h) =>
                'inset(-30px ' + ((1 - p) * (w + 30) - 30) + 'px ' + ((1 - p) * (h + 30) - 30) + 'px -30px)';

            await c.move(r0.left - pad, r0.top - pad);
            c.click();
            el.style.clipPath = clip(0, r0.width, r0.height);
            show(el);

            await tween(t.ms, p => {
                const q = R(el);
                el.style.clipPath = clip(p, q.width, q.height);
                c.x = q.left + q.width * p;
                c.y = q.top + q.height * p;
                c.draw();
                placeSel(sel, q.left - pad, q.top - pad, c.x + pad, c.y + pad);
            });
            el.style.clipPath = '';
            dropSel(sel);
        },

        // เคอร์เซอร์ "พิมพ์" ไปตามบรรทัด ข้อความโผล่ตามหลัง
        async wipe(t, c) {
            const el = t.els[0];
            const r0 = R(el);
            const rg = document.createRange();
            rg.selectNodeContents(el);
            let tb = rg.getBoundingClientRect();
            if (tb.width < 40) tb = r0;
            const offset = tb.left - r0.left;

            await c.move(tb.left - 2, tb.top + tb.height * .55);
            c.click();
            el.style.clipPath = 'inset(-20px ' + r0.width + 'px -20px -20px)';
            show(el);

            await tween(t.ms, p => {
                const q = R(el);
                const x = q.left + offset + tb.width * p;
                el.style.clipPath = 'inset(-20px ' + Math.max(0, q.right - x) + 'px -20px -20px)';
                c.x = x + 2;
                c.y = q.top + q.height * .55;
                c.draw();
            }, ease.lin);
            el.style.clipPath = '';
        },

        // ชี้แล้วคลิก ปุ่ม/ไอคอนเด้งขึ้นมา
        async pop(t, c) {
            const el = t.els[0], r = R(el);
            await c.move(r.left + r.width * rand(.35, .65), r.top + r.height * rand(.35, .65));
            c.click();
            show(el);
            const a = el.animate([
                { opacity: 0, transform: 'scale(.55)', filter: 'blur(5px)' },
                { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' }
            ], { duration: 340 * CFG.tempo, easing: 'cubic-bezier(.2,1.5,.4,1)' });
            pending.push(a.finished.catch(() => {}));
        }
    };

    /* ───────────── ตัวรันงาน ───────────── */
    const inView = r => r.bottom > 0 && r.top < innerHeight * 0.97 && r.right > 0 && r.left < innerWidth;

    async function runTask(t, c) {
        if (t.dep) await t.dep.done;
        if (state.dead) return t.resolve();
        // element ที่อยู่นอกจอ (เช่นบนมือถือ) ไม่ต้องเสียเวลาให้เคอร์เซอร์ไปหา
        if (t.type !== 'fade' && !inView(R(t.els[0]))) {
            t.els.forEach(show);
        } else {
            await actions[t.type](t, c);
        }
        progress();
        t.resolve();
    }

    const queue = tasks.slice();

    async function worker(c, delay) {
        await sleep(delay);
        let t;
        while (!state.dead && (t = queue.shift())) {
            await runTask(t, c);
            await sleep(rand(30, 140));
        }
        // งานหมดแล้ว → เคอร์เซอร์ "ออกจากห้อง"
        c.el.classList.add('bye');
        await c.move(c.x < innerWidth / 2 ? -60 : innerWidth + 60, c.y + rand(-80, 80));
        c.el.remove();
    }

    /* ───────────── จบงาน ───────────── */
    let ended = false;
    function end() {
        if (ended) return;
        ended = true;
        clearTimeout(window.__asmFailsafe);
        ALL.forEach(el => { el.style.clipPath = ''; show(el); });
        root.classList.remove('assembling');
        layer.classList.add('fade');
        setTimeout(() => layer.remove(), 700);
        window.dispatchEvent(new CustomEvent('assembly:done'));
    }
    function skip() {
        state.dead = true;
        end();
    }
    layer.querySelector('.asm-skip').addEventListener('click', skip);
    setTimeout(skip, CFG.hardTimeout);

    /* ───────────── เริ่ม! ───────────── */
    async function start() {
        const workers = Array.from({ length: CFG.cursors }, (_, i) => worker(new Cur(i), i * 140));
        await Promise.all(workers);
        if (state.dead) return;
        await Promise.all(pending);
        hudLabel.textContent = 'BUILD COMPLETE';
        hudBar.style.width = '100%';
        hudPct.textContent = '100%';
        await new Promise(r => setTimeout(r, 450));
        end();
    }

    // รอฟอนต์สั้นๆ ให้ขนาดตัวอักษรนิ่งก่อน (ไม่เกิน 500ms)
    Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise(r => setTimeout(r, 500))
    ]).then(() => requestAnimationFrame(start));
})();
