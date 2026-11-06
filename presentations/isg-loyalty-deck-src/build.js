// DigiDelight → ISG: DigiCRM Loyalty & Offer Orchestration deck
// Shapes named "A<n><f|r|w|z>|label" get an entrance animation (group n) from animate.py.
const fs = require('fs');
const path = require('path');
const pptxgen = require('pptxgenjs');
const sharp = require('sharp');
const React = require('react');
const RDS = require('react-dom/server');
const lu = require('react-icons/lu');
const art = require('./art');
const { applyTheme } = require('./apply_theme.js');

const OUT = process.argv[2] || 'deck_raw.pptx';
const LOGO = 'C:/DigiDelight/website/frontend/public/logo.png';

const THEME = {
  name: 'ISG x DigiCRM',
  headFontFace: 'Calibri',
  bodyFontFace: 'Calibri',
  colors: {
    dk1: '020817', lt1: 'FFFFFF', dk2: '0369A1', lt2: 'F3F6FB',
    accent1: '223A87', accent2: '009FE0', accent3: 'E83C37',
    accent4: '047857', accent5: 'B45309', accent6: '64748B',
    hlink: '0369A1', folHlink: '223A87',
  },
};

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = 'DigiDelight';
pres.company = 'DigiDelight';
pres.title = 'DigiCRM Loyalty and Offer Orchestration for ISG';
const C = pres.SchemeColor;
const K = { navy: C.accent1, sky: C.accent2, red: C.accent3, green: C.accent4, amber: C.accent5, slate: C.accent6, ink: C.text1, deep: C.text2, white: C.background1, light: C.background2 };
const ROLE = { DigiCRM: 'green', ISG: 'navy', Partner: 'deep', Roadmap: 'amber', Live: 'green', Partial: 'amber' };

// ---------- asset helpers ----------
const png = async (svg, width) =>
  'image/png;base64,' + (await sharp(Buffer.from(svg)).resize({ width }).png().toBuffer()).toString('base64');
const iconCache = {};
async function icon(name, hex = 'FFFFFF') {
  const key = name + hex;
  if (!iconCache[key]) {
    const I = lu[name];
    if (!I) throw new Error('missing icon ' + name);
    const svg = RDS.renderToStaticMarkup(React.createElement(I, { size: 256, strokeWidth: 2 })).replace(/currentColor/g, '#' + hex);
    iconCache[key] = await png(svg, 256);
  }
  return iconCache[key];
}
const shadow = () => ({ type: 'outer', color: '0B1A4A', opacity: 0.13, blur: 10, offset: 3, angle: 90 });
const nm = (a, label = '') => (a ? `A${a}|${label}` : label || undefined);

// ---------- drawing helpers (all positions in inches) ----------
function box(s, { x, y, w, h, fill = K.white, tr, line, r = 0.12, sh = true, a, label }) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: r,
    fill: tr == null ? { color: fill } : { color: fill, transparency: tr },
    line: line ? { color: line, width: 1 } : { type: 'none' },
    shadow: sh ? shadow() : undefined,
    objectName: nm(a, label || 'card'),
  });
}
function txt(s, text, o) {
  const { a, label, ...rest } = o;
  s.addText(text, { margin: 0, isTextBox: true, color: K.ink, fontSize: 14, valign: 'top', objectName: nm(a, label || 'text'), ...rest });
}
async function iconDot(s, x, y, d, name, { fill = 'navy', tr, ic = 'FFFFFF', a } = {}) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: tr == null ? { color: K[fill] } : { color: K[fill], transparency: tr }, line: { type: 'none' }, objectName: nm(a, 'icon bg') });
  const p = d * 0.25;
  s.addImage({ data: await icon(name, ic), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p, objectName: nm(a, 'icon ' + name), altText: '' });
}
function chip(s, x, y, label, role, a, fs = 9) {
  const w = 0.22 + label.length * fs * 0.0075;
  s.addText(label, {
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.11, x, y, w, h: 0.24,
    fill: { color: K[ROLE[role] || role] }, color: K.white, fontSize: fs, bold: true,
    align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: nm(a, 'chip ' + label),
  });
  return w;
}
function arrowR(s, x, y, w = 0.4, h = 0.34, a, color = 'sky') {
  s.addShape(pres.shapes.RIGHT_ARROW, { x, y, w, h, fill: { color: K[color] }, line: { type: 'none' }, objectName: nm(a, 'arrow') });
}
function line(s, x1, y1, x2, y2, { color = 'slate', width = 1.5, a, dash, arrow = true } = {}) {
  s.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: K[color], width, endArrowType: arrow ? 'triangle' : undefined, dashType: dash },
    objectName: nm(a, 'connector'),
  });
}
function bullets(items, o = {}) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < items.length - 1, paraSpaceAfter: o.gap ?? 5 } }));
}

async function main() {
  const bgDark = await png(art.bgDark, 1920);
  const bgLight = await png(art.bgLight, 1920);
  const hero = await png(art.hero, 1350);
  const phoneHub = await png(art.phoneHub, 780);
  const phoneCode = await png(art.phoneCode, 780);
  const wa = await png(art.whatsapp, 840);
  const shieldImg = await png(art.shield, 660);
  const logo = 'image/png;base64,' + fs.readFileSync(LOGO).toString('base64');

  // ---------- layouts ----------
  pres.defineSlideMaster({ title: 'DARK', background: { data: bgDark }, objects: [] });
  pres.defineSlideMaster({
    title: 'CONTENT',
    background: { data: bgLight },
    objects: [
      { placeholder: { options: { name: 'eyebrow', type: 'body', x: 0.6, y: 0.34, w: 10, h: 0.28, fontSize: 12, bold: true, color: K.deep, charSpacing: 2, margin: 0, valign: 'middle' }, text: '' } },
      { placeholder: { options: { name: 'title', type: 'title', x: 0.6, y: 0.64, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: K.navy, margin: 0, valign: 'top', align: 'left' }, text: '' } },
      { image: { data: logo, x: 0.6, y: 7.04, w: 0.22, h: 0.22 } },
      { text: { text: 'DigiDelight  ·  DigiCRM Loyalty and Offer Orchestration  ·  Prepared for ISG', options: { x: 0.9, y: 7.0, w: 8, h: 0.3, fontSize: 9, color: K.slate, margin: 0, valign: 'middle' } } },
    ],
    slideNumber: { x: 12.1, y: 7.0, w: 0.6, h: 0.3, fontSize: 9, color: '64748B', align: 'right' },
  });

  let section = '';
  const sec = (t) => { section = t; pres.addSection({ title: t }); };
  const content = (eyebrow, title) => {
    const s = pres.addSlide({ masterName: 'CONTENT', sectionTitle: section });
    s.addText(eyebrow.toUpperCase(), { placeholder: 'eyebrow' });
    s.addText(title, { placeholder: 'title' });
    return s;
  };

  // =====================================================================
  // 1. Title
  sec('Introduction');
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: section });
    s.addImage({ data: logo, x: 0.6, y: 0.55, w: 0.44, h: 0.44, objectName: 'DigiDelight logo', altText: 'DigiDelight logo' });
    txt(s, 'DigiDelight', { x: 1.15, y: 0.55, w: 3, h: 0.44, fontSize: 18, bold: true, color: K.white, valign: 'middle' });
    s.addText('Prepared for In-Solutions Global (ISG)', {
      shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.21, x: 9.05, y: 0.56, w: 3.68, h: 0.42,
      fill: { color: K.white, transparency: 86 }, line: { color: K.white, width: 0.75, transparency: 50 },
      color: K.white, fontSize: 12, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'A1f|prepared for',
    });
    txt(s, 'DIGICRM  ·  LOYALTY & OFFER ORCHESTRATION', { x: 0.6, y: 1.9, w: 6.6, h: 0.3, fontSize: 13, bold: true, color: K.white, charSpacing: 3, a: '1r' });
    txt(s, 'One governed layer for every offer on ISG’s card programmes', { x: 0.6, y: 2.3, w: 6.5, h: 2.15, fontSize: 40, bold: true, color: K.white, fontFace: THEME.headFontFace, a: '2r', label: 'title' });
    txt(s, 'Bring in, manage, target, deliver and measure offers and coupons of every format — while ISG keeps the offer ledger.', { x: 0.6, y: 4.55, w: 6.3, h: 0.9, fontSize: 17, color: K.white, a: '3r', label: 'subtitle' });
    let x = 0.6;
    for (const t of ['10 offer formats', 'Ledger stays with ISG', 'Live demo today']) {
      const w = 0.4 + t.length * 0.085;
      s.addText(t, { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.18, x, y: 5.75, w, h: 0.38, fill: { color: K.red }, color: K.white, fontSize: 12, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: 'A4r|pill' });
      x += w + 0.18;
    }
    txt(s, 'Product demo and discussion', { x: 0.6, y: 6.6, w: 6, h: 0.3, fontSize: 12, color: K.white, a: '4f' });
    s.addImage({ data: hero, x: 7.05, y: 1.05, w: 5.9, h: 4.98, objectName: 'A2z|hero illustration', altText: 'Bank cards with offer tag, coins and a cashback-confirmed badge' });
    s.addNotes('Open: DigiDelight builds DigiCRM. Today we show how DigiCRM can be the central offer layer ISG asked for in section 4A — and, importantly, how it respects ISG’s decision to keep the offer ledger.');
  }

  // 2. The brief
  {
    const s = content('The brief', 'What ISG asked for');
    txt(s, 'A central layer to bring in, manage, target, deliver and measure offers and coupons of every format across bank card programmes — with a clear split of what is native, what comes from partners and what ISG provides.', { x: 0.6, y: 1.55, w: 11.6, h: 0.75, fontSize: 16, color: K.ink, a: '1f' });
    const steps = [
      ['LuDownload', 'Bring in', 'Brand portal, partner APIs, network feeds, bank team, bulk files'],
      ['LuLayers', 'Manage', 'One standard record, approvals, versions and code pools'],
      ['LuTarget', 'Target', 'Eligibility, budgets, stacking and explainable ranking'],
      ['LuSend', 'Deliver', 'Journeys, app hub, WhatsApp, email, SMS and push'],
      ['LuChartBar', 'Measure', 'Redemption, reconciliation and lift against holdouts'],
    ];
    const w = 2.22, g = 0.25;
    for (let i = 0; i < 5; i++) {
      const x = 0.6 + i * (w + g), y = 2.6, a = String(2 + i) + 'r';
      box(s, { x, y, w, h: 2.2, a });
      await iconDot(s, x + 0.25, y + 0.28, 0.72, steps[i][0], { fill: i % 2 ? 'sky' : 'navy', a });
      txt(s, '0' + (i + 1), { x: x + w - 0.75, y: y + 0.3, w: 0.5, h: 0.4, fontSize: 18, bold: true, color: K.slate, align: 'right', a });
      txt(s, steps[i][1], { x: x + 0.25, y: y + 1.12, w: w - 0.45, h: 0.38, fontSize: 19, bold: true, color: K.navy, a });
      txt(s, steps[i][2], { x: x + 0.25, y: y + 1.5, w: w - 0.42, h: 0.62, fontSize: 12, color: K.slate, a });
      if (i < 4) await iconDot(s, x + w - 0.06, y + 0.92, 0.37, 'LuArrowRight', { fill: 'white', ic: '009FE0', a: String(3 + i) + 'f' });
    }
    box(s, { x: 0.6, y: 5.15, w: 12.1, h: 1.55, fill: K.navy, tr: 93, sh: false, a: '7r' });
    await iconDot(s, 0.9, 5.47, 0.9, 'LuLandmark', { fill: 'red', a: '7r' });
    txt(s, 'ISG’s ownership principle', { x: 2.05, y: 5.35, w: 7, h: 0.4, fontSize: 18, bold: true, color: K.navy, a: '7r' });
    txt(s, 'ISG keeps the system of record for eligibility, budgets, redemption and benefit payout. The partner platform provides content, ranking and delivery, connected to the ISG ledger through APIs.', { x: 2.05, y: 5.75, w: 7.2, h: 0.8, fontSize: 14, color: K.ink, a: '7r' });
    txt(s, 'DigiCRM is built to work exactly this way →', { x: 9.5, y: 5.5, w: 3.0, h: 0.85, fontSize: 18, bold: true, color: K.red, valign: 'middle', a: '8z' });
    s.addNotes('Section 4A asks for one layer across five verbs, and asks us to be explicit about who provides what. The ownership principle is the key design constraint — we agree with it, and our product has a mode built for it.');
  }

  // 3. Architecture
  sec('The fit');
  {
    const s = content('Our answer', 'DigiCRM orchestrates — ISG’s ledger decides');
    txt(s, 'OFFER SOURCES', { x: 0.6, y: 1.55, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: K.slate, charSpacing: 1, a: '1f' });
    const src = [['LuStore', 'Brand & merchant portal'], ['LuPlug', 'Partner APIs & network feeds'], ['LuUsers', 'Bank offers team'], ['LuFileSpreadsheet', 'CSV / SFTP bulk upload'], ['LuDatabase', 'ISG internal catalogue']];
    for (let i = 0; i < 5; i++) {
      const y = 1.95 + i * 0.66;
      box(s, { x: 0.6, y, w: 2.6, h: 0.52, r: 0.26, a: '1r' });
      await iconDot(s, 0.68, y + 0.07, 0.38, src[i][0], { fill: 'navy', tr: 88, ic: '223A87', a: '1r' });
      txt(s, src[i][1], { x: 1.12, y, w: 2.05, h: 0.52, fontSize: 12, valign: 'middle', a: '1r' });
    }
    arrowR(s, 3.28, 3.38, 0.36, 0.34, '2w');
    // core
    box(s, { x: 3.72, y: 1.55, w: 5.55, h: 3.95, fill: K.navy, r: 0.16, a: '3z', label: 'DigiCRM core' });
    s.addImage({ data: logo, x: 3.97, y: 1.75, w: 0.36, h: 0.36, objectName: 'A3z|logo' });
    txt(s, 'DigiCRM Offer Orchestration', { x: 4.43, y: 1.73, w: 4.6, h: 0.4, fontSize: 18, bold: true, color: K.white, valign: 'middle', a: '3z' });
    const tiles = [['LuLayers', 'Standard offer record & lifecycle'], ['LuImage', 'Content, creative & approvals'], ['LuFilter', 'Eligibility, ranking & conflicts'], ['LuWorkflow', 'Journeys & multichannel delivery']];
    for (let i = 0; i < 4; i++) {
      const x = 3.95 + (i % 2) * 2.62, y = 2.3 + Math.floor(i / 2) * 1.12, a = String(4 + i) + 'f';
      box(s, { x, y, w: 2.5, h: 0.98, fill: K.white, tr: 86, sh: false, r: 0.1, a });
      await iconDot(s, x + 0.15, y + 0.27, 0.44, tiles[i][0], { fill: 'sky', a });
      txt(s, tiles[i][1], { x: x + 0.7, y, w: 1.72, h: 0.98, fontSize: 13, bold: true, color: K.white, valign: 'middle', a });
    }
    box(s, { x: 3.95, y: 4.62, w: 5.12, h: 0.62, fill: K.white, tr: 86, sh: false, r: 0.1, a: '8f' });
    txt(s, 'Code vault  ·  Reconciliation  ·  Consent  ·  Audit trail', { x: 3.95, y: 4.62, w: 5.12, h: 0.62, fontSize: 13, bold: true, color: K.white, align: 'center', valign: 'middle', a: '8f' });
    arrowR(s, 9.35, 3.38, 0.36, 0.34, '9w');
    txt(s, 'CARDHOLDER CHANNELS', { x: 9.82, y: 1.55, w: 2.9, h: 0.3, fontSize: 11, bold: true, color: K.slate, charSpacing: 1, a: '10f' });
    const ch = [['LuSmartphone', 'Bank app Offers Hub'], ['LuMessageCircle', 'WhatsApp'], ['LuMail', 'Email'], ['LuMessageSquare', 'SMS + landing page'], ['LuBell', 'Push & in-app']];
    for (let i = 0; i < 5; i++) {
      const y = 1.95 + i * 0.66;
      box(s, { x: 9.82, y, w: 2.9, h: 0.52, r: 0.26, a: '10r' });
      await iconDot(s, 9.9, y + 0.07, 0.38, ch[i][0], { fill: 'sky', tr: 85, ic: '0369A1', a: '10r' });
      txt(s, ch[i][1], { x: 10.34, y, w: 2.3, h: 0.52, fontSize: 12, valign: 'middle', a: '10r' });
    }
    // ledger row
    s.addShape(pres.shapes.UP_DOWN_ARROW, { x: 6.27, y: 5.56, w: 0.32, h: 0.46, fill: { color: K.red }, line: { type: 'none' }, objectName: 'A12z|api arrow' });
    txt(s, 'APIs: activate · confirm · budget · redemption events', { x: 6.68, y: 5.58, w: 3.6, h: 0.42, fontSize: 11, bold: true, color: K.red, valign: 'middle', a: '12f' });
    box(s, { x: 0.6, y: 6.08, w: 2.6, h: 0.78, fill: K.white, line: K.navy, sh: false, a: '11r' });
    txt(s, 'ISG switch & settlement files', { x: 0.7, y: 6.08, w: 2.4, h: 0.78, fontSize: 12, bold: true, color: K.navy, align: 'center', valign: 'middle', a: '11r' });
    arrowR(s, 3.28, 6.3, 0.36, 0.34, '11r', 'navy');
    box(s, { x: 3.72, y: 6.08, w: 5.55, h: 0.78, fill: K.sky, r: 0.12, a: '11r' });
    txt(s, [{ text: 'ISG Offer Ledger — system of record', options: { bold: true, fontSize: 15, breakLine: true } }, { text: 'Eligibility · budgets · redemption · benefit payout', options: { fontSize: 12 } }], { x: 3.72, y: 6.08, w: 5.55, h: 0.78, color: K.white, align: 'center', valign: 'middle', a: '11r' });
    arrowR(s, 9.35, 6.3, 0.36, 0.34, '11r', 'navy');
    box(s, { x: 9.82, y: 6.08, w: 2.9, h: 0.78, fill: K.white, line: K.navy, sh: false, a: '11r' });
    txt(s, [{ text: 'Bank CMS posts payout', options: { breakLine: true } }, { text: 'with maker-checker' }], { x: 9.9, y: 6.08, w: 2.75, h: 0.78, fontSize: 12, bold: true, color: K.navy, align: 'center', valign: 'middle', a: '11r' });
    s.addNotes('Read left to right: offers come in from any source, DigiCRM turns them into one standard record, decides who sees what, and delivers it. Read top to bottom: every money-touching decision — activation, budget, redemption, payout — is confirmed by ISG’s ledger through APIs. DigiCRM never posts to card accounts.');
  }

  // 4. Ledger modes
  {
    const s = content('Built for ISG’s ownership model', 'The ledger owner is set per programme');
    const modes = [
      ['A', 'Offer orchestration', 'External ledger — ISG', 'ISG owns eligibility, budgets, redemption and payout. DigiCRM creates, governs, personalises, delivers and observes.', true],
      ['B', 'Full loyalty', 'Owned ledger — DigiCRM', 'DigiCRM runs a double-entry points and cashback ledger, for engagement programmes where a bank prefers it.', false],
      ['C', 'Hybrid', 'Ledger chosen per programme', 'ISG-ledger card offers and DigiCRM-run engagement rewards side by side, each recorded separately.', false],
    ];
    for (let i = 0; i < 3; i++) {
      const [L, t, sub, d, hi] = modes[i];
      const x = 0.6 + i * 4.125, y = 1.7, a = String(1 + i) + 'r';
      box(s, { x, y, w: 3.85, h: 3.2, fill: hi ? K.navy : K.white, a });
      s.addText(L, { shape: pres.shapes.OVAL, x: x + 0.3, y: y + 0.32, w: 0.66, h: 0.66, fill: { color: hi ? K.red : K.navy, transparency: hi ? 0 : 88 }, color: hi ? K.white : K.navy, fontSize: 24, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: nm(a, 'mode letter') });
      txt(s, t, { x: x + 0.3, y: y + 1.12, w: 3.3, h: 0.42, fontSize: 20, bold: true, color: hi ? K.white : K.navy, a });
      txt(s, sub, { x: x + 0.3, y: y + 1.54, w: 3.3, h: 0.32, fontSize: 13, bold: true, color: hi ? K.white : K.deep, a });
      txt(s, d, { x: x + 0.3, y: y + 1.95, w: 3.3, h: 1.1, fontSize: 14, color: hi ? K.white : K.ink, a });
      if (hi) chip(s, x + 1.95, y + 0.5, 'Recommended for ISG', 'red', '4z', 11);
    }
    const g = [
      ['LuLock', 'Locked once live', 'A programme’s ledger mode can’t be switched after it goes active.'],
      ['LuStamp', 'Stamped on every activity', 'Each activation and reward records which ledger owns it.'],
      ['LuHourglass', 'Pending until ISG confirms', 'Timeouts and errors stay pending — never shown as success.'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.125, y = 5.35, a = String(5 + i) + 'f';
      await iconDot(s, x, y + 0.05, 0.62, g[i][0], { fill: 'sky', a });
      txt(s, g[i][1], { x: x + 0.78, y, w: 3.05, h: 0.36, fontSize: 15, bold: true, color: K.navy, a });
      txt(s, g[i][2], { x: x + 0.78, y: y + 0.38, w: 3.05, h: 0.75, fontSize: 12.5, color: K.slate, a });
    }
    s.addNotes('Mode A is the ISG answer: DigiCRM is the orchestration layer, ISG is the ledger. The mode is locked once a programme is live and stamped on every activity, and an activation only turns active on an affirmative confirmation from ISG — a timeout stays pending. Modes B and C exist for banks that want DigiCRM-run engagement rewards alongside.');
  }

  // 5. Offer types
  sec('How it works');
  {
    const s = content('Offer formats', 'Every offer format, one standard record');
    const types = [
      ['LuTicket', 'Unique single-use code', 'Code from a pool, one per cardholder, revealed on request', ['DigiCRM']],
      ['LuQrCode', 'Generic code', 'One shared code; eligibility checked at payment', ['DigiCRM', 'ISG']],
      ['LuLink', 'Commerce link', 'Tracked deep link into the merchant site or app', ['Roadmap']],
      ['LuCreditCard', 'Card-linked offer', 'ISG matches the transaction; DigiCRM targets and activates', ['ISG', 'DigiCRM']],
      ['LuPercent', 'Instant discount', 'Applied at checkout via the payment gateway', ['ISG', 'DigiCRM']],
      ['LuCoins', 'Cashback / multiplier', 'ISG posts the benefit; DigiCRM sets rules and informs', ['ISG', 'DigiCRM']],
      ['LuCalendarClock', 'Brand / no-cost EMI', 'ISG converts the EMI; DigiCRM targets and explains', ['ISG', 'DigiCRM']],
      ['LuGift', 'Gift card / e-voucher', 'From a supplier catalogue, for points or cash', ['Partner', 'Roadmap']],
      ['LuGlobe', 'Network offers', 'Ingested from network feeds, then targeted', ['Partner', 'Roadmap']],
      ['LuHand', 'Activation / opt-in', 'Cardholder taps Activate before the benefit applies', ['DigiCRM']],
    ];
    const w = 2.26, g = 0.2, h = 2.3;
    for (let i = 0; i < 10; i++) {
      const col = i % 5, row = Math.floor(i / 5);
      const x = 0.6 + col * (w + g), y = 1.6 + row * (h + 0.22), a = String(1 + i) + 'r';
      box(s, { x, y, w, h, a });
      await iconDot(s, x + 0.2, y + 0.2, 0.58, types[i][0], { fill: i % 2 ? 'sky' : 'navy', a });
      txt(s, types[i][1], { x: x + 0.2, y: y + 0.88, w: w - 0.35, h: 0.32, fontSize: 14, bold: true, color: K.navy, a });
      txt(s, types[i][2], { x: x + 0.2, y: y + 1.22, w: w - 0.35, h: 0.62, fontSize: 11, color: K.slate, a });
      let cx = x + 0.2;
      for (const r of types[i][3]) cx += chip(s, cx, y + h - 0.38, r, r, a) + 0.08;
    }
    let lx = 0.6;
    txt(s, 'Who provides it:', { x: lx, y: 6.64, w: 1.3, h: 0.24, fontSize: 10, bold: true, color: K.slate, valign: 'middle', a: '11f' });
    lx = 1.9;
    for (const [r, d] of [['DigiCRM', 'native today'], ['ISG', 'ISG / payment rails'], ['Partner', 'brands, networks, aggregators'], ['Roadmap', 'DigiCRM roadmap']]) {
      lx += chip(s, lx, 6.64, r, r, '11f') + 0.08;
      txt(s, d, { x: lx, y: 6.64, w: 2.1, h: 0.24, fontSize: 10, color: K.slate, valign: 'middle', a: '11f' });
      lx += 0.12 + d.length * 0.068;
    }
    s.addNotes('All ten formats ISG listed become one standard offer record in DigiCRM. Chips show the honest split: unique codes, generic codes and activation offers run natively today; card-linked, instant-discount, cashback and EMI offers rely on ISG rails for matching and posting, with DigiCRM handling targeting, activation and messaging. Commerce links, gift-card catalogues and network feed intake are roadmap items.');
  }

  // 6. Lifecycle
  {
    const s = content('Governance', 'Offer lifecycle — governed from draft to archive');
    const st = [
      ['LuPencil', 'Draft', 'slate'], ['LuBadgeCheck', 'Business / brand approved', 'navy'], ['LuShieldCheck', 'Bank compliance approved', 'navy'],
      ['LuCalendarClock', 'Scheduled', 'sky'], ['LuRadio', 'Live', 'green'], ['LuPause', 'Paused', 'amber'], ['LuTimerOff', 'Expired', 'slate'], ['LuArchive', 'Archived', 'slate'],
    ];
    const cx0 = 1.15, step = 1.58, d = 0.9, cy = 2.25;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: cx0 + step - 0.75, y: 1.6, w: step + 1.5, h: 0.36, rectRadius: 0.18, fill: { color: K.amber, transparency: 85 }, line: { type: 'none' }, objectName: 'A3f|maker checker band' });
    txt(s, 'Maker-checker: the requester can’t approve', { x: cx0 + step - 0.75, y: 1.6, w: step + 1.5, h: 0.36, fontSize: 11, bold: true, color: K.amber, align: 'center', valign: 'middle', a: '3f' });
    for (let i = 0; i < 8; i++) {
      const x = cx0 + i * step - d / 2, a = String(1 + i) + 'z';
      if (i < 7) line(s, x + d + 0.06, cy + d / 2, x + step - 0.06, cy + d / 2, { color: 'sky', width: 2, a: String(2 + i) + 'w' });
      await iconDot(s, x, cy, d, st[i][0], { fill: st[i][2], a });
      txt(s, st[i][1], { x: x - 0.32, y: cy + d + 0.12, w: d + 0.64, h: 0.6, fontSize: 12, bold: true, color: K.navy, align: 'center', a });
    }
    const cards = [
      ['LuLock', 'Sealed versions', 'A live offer can’t be silently edited. Changes clone to a new version and go back through approval; redemptions are judged against the terms in force at the time.'],
      ['LuUserCheck', 'Maker-checker', 'The requester can’t approve their own offer, and one person can’t sign both the business and the compliance step.'],
      ['LuClipboardCheck', 'Every change recorded', 'Who changed what, when and why — every state change, approval, pause and edit lands in an immutable audit trail.'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.125, y = 4.1, a = String(9 + i) + 'r';
      box(s, { x, y, w: 3.85, h: 2.05, a });
      await iconDot(s, x + 0.25, y + 0.25, 0.55, cards[i][0], { fill: 'navy', a });
      txt(s, cards[i][1], { x: x + 0.95, y: y + 0.3, w: 2.8, h: 0.45, fontSize: 17, bold: true, color: K.navy, valign: 'middle', a });
      txt(s, cards[i][2], { x: x + 0.25, y: y + 0.95, w: 3.4, h: 1.0, fontSize: 12.5, color: K.ink, a });
    }
    txt(s, 'Live today: business → compliance approval steps. A dedicated brand-approval step and approval routing by source, funder or risk arrive with the brand portal (roadmap).', { x: 0.6, y: 6.32, w: 12.1, h: 0.5, fontSize: 11, italic: true, color: K.slate, a: '12f' });
    s.addNotes('This is ISG’s lifecycle from 4A.2, end to end. DigiCRM enforces it in code: published versions are sealed, edits go through a new version and re-approval, and every transition is audited. Be clear that today the two approval steps are business and bank compliance; the brand-approval step comes with the brand portal.');
  }

  // 7. Intake
  {
    const s = content('Bringing offers in', 'Any source → one standard offer record → checks');
    txt(s, 'SOURCES', { x: 0.6, y: 1.55, w: 2.4, h: 0.3, fontSize: 11, bold: true, color: K.slate, charSpacing: 1, a: '1f' });
    const src = [['LuStore', 'Brand & merchant portal'], ['LuPlug', 'Partner & network feeds'], ['LuUsers', 'Bank offers team'], ['LuFileSpreadsheet', 'CSV / SFTP bulk'], ['LuDatabase', 'ISG catalogue']];
    for (let i = 0; i < 5; i++) {
      const y = 1.95 + i * 0.78;
      box(s, { x: 0.6, y, w: 2.45, h: 0.6, r: 0.3, a: '1r' });
      await iconDot(s, 0.68, y + 0.09, 0.42, src[i][0], { fill: 'navy', tr: 88, ic: '223A87', a: '1r' });
      txt(s, src[i][1], { x: 1.16, y, w: 1.85, h: 0.6, fontSize: 12, valign: 'middle', a: '1r' });
    }
    arrowR(s, 3.13, 3.6, 0.4, 0.36, '2w');
    box(s, { x: 3.62, y: 1.55, w: 5.6, h: 4.6, a: '3z', label: 'record card' });
    await iconDot(s, 3.87, 1.75, 0.5, 'LuLayers', { fill: 'navy', a: '3z' });
    txt(s, 'Standard offer record', { x: 4.5, y: 1.75, w: 4.5, h: 0.5, fontSize: 18, bold: true, color: K.navy, valign: 'middle', a: '3z' });
    const fields = ['Offer ID & version', 'Funder & funder type', 'MID / TID, MCC, UPI VPA, domains', 'Offer type & redemption method', 'Benefit, cap & minimum spend', 'Validity & time-of-day rules', 'Banks, products, BINs, networks', 'Channels & geography', 'Limits per card / offer / budget', 'Stacking group & priority', 'Code pool or link template', 'Creative, T&C, languages, audit'];
    for (let i = 0; i < 12; i++) {
      const x = 3.87 + (i % 2) * 2.6, y = 2.45 + Math.floor(i / 2) * 0.5;
      s.addText(fields[i], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.08, x, y, w: 2.5, h: 0.4, fill: { color: K.sky, transparency: 90 }, color: K.ink, fontSize: 11, align: 'left', valign: 'middle', margin: 5, isTextBox: true, objectName: 'A4f|field' });
    }
    txt(s, 'One record so offers from every source behave the same way.', { x: 3.87, y: 5.5, w: 5.1, h: 0.45, fontSize: 12, italic: true, color: K.slate, valign: 'middle', a: '4f' });
    arrowR(s, 9.3, 3.6, 0.4, 0.36, '5w');
    txt(s, 'INTAKE CHECKS', { x: 9.82, y: 1.55, w: 2.9, h: 0.3, fontSize: 11, bold: true, color: K.slate, charSpacing: 1, a: '6f' });
    const checks = ['De-duplicate across sources', 'Schema & business rules', 'Merchant IDs vs ISG merchant data', 'Auto expiry & withdrawal', 'Alert when a source feed fails'];
    for (let i = 0; i < 5; i++) {
      const y = 1.95 + i * 0.78, a = String(6 + i) + 'f';
      await iconDot(s, 9.82, y + 0.1, 0.4, 'LuCheck', { fill: 'green', a });
      txt(s, checks[i], { x: 10.35, y, w: 2.4, h: 0.6, fontSize: 12.5, valign: 'middle', a });
    }
    chip(s, 0.6, 6.33, 'Live', 'Live', '11f', 10);
    txt(s, 'Offer builder, versioned record, eligibility, budget, stacking, channels, T&C, bulk code import', { x: 1.25, y: 6.27, w: 5.2, h: 0.5, fontSize: 11, color: K.ink, valign: 'middle', a: '11f' });
    chip(s, 6.6, 6.33, 'Roadmap', 'Roadmap', '12f', 10);
    txt(s, 'Partner & network feeds, CSV/SFTP intake, dedupe, merchant master, multi-funder allocation', { x: 7.45, y: 6.27, w: 5.3, h: 0.5, fontSize: 11, color: K.ink, valign: 'middle', a: '12f' });
    s.addNotes('Every source lands in the same standard record using ISG’s minimum field list from 4A.2. Today offers are created in the Offers Studio builder and coupon codes come in by bulk import; the automated intake pipeline for partner feeds and files, de-duplication, merchant master validation and multi-funder records is Phase 1 of the roadmap.');
  }

  // 8. Eligibility pipeline
  {
    const s = content('Targeting', 'Rules first, then ranking — always explainable');
    const stages = [
      ['Consent & purpose', 'Default-deny for marketing; checked per channel'],
      ['Eligibility', 'Bank · product · BIN · network · segment · card status'],
      ['Suppression', 'Section 3 suppression rules override every offer'],
      ['Validity', 'Window, time-of-day, expiry'],
      ['Limits & budget', 'Per card, per offer and total budget'],
      ['Stacking', 'Exclusivity — no two cashbacks on one transaction'],
      ['Ranking', 'Relevance · funder economics · fatigue'],
      ['Explained winner', 'Decision trace saved for audit'],
    ];
    for (let i = 0; i < 8; i++) {
      const w = 7.6 - i * 0.34, y = 1.6 + i * 0.6, a = String(1 + i) + 'w';
      const fill = i === 7 ? K.red : i === 6 ? K.sky : K.navy;
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y, w, h: 0.5, rectRadius: 0.1, fill: { color: fill, transparency: i < 6 ? i * 6 : 0 }, line: { type: 'none' }, objectName: nm(a, 'stage bar') });
      txt(s, `${i + 1}  ${stages[i][0]}`, { x: 0.78, y, w: 2.3, h: 0.5, fontSize: 13, bold: true, color: K.white, valign: 'middle', a });
      txt(s, stages[i][1], { x: 3.1, y, w: w - 2.6, h: 0.5, fontSize: 11.5, color: K.white, valign: 'middle', a });
    }
    box(s, { x: 8.55, y: 1.6, w: 4.15, h: 4.7, a: '9r', label: 'simulator' });
    await iconDot(s, 8.8, 1.82, 0.56, 'LuFlaskConical', { fill: 'red', a: '9r' });
    txt(s, 'Offer simulator', { x: 9.5, y: 1.82, w: 3, h: 0.56, fontSize: 18, bold: true, color: K.navy, valign: 'middle', a: '9r' });
    txt(s, 'Run any cardholder through the real production pipeline and see exactly why an offer qualifies or fails.', { x: 8.8, y: 2.5, w: 3.7, h: 0.75, fontSize: 12.5, color: K.ink, a: '9r' });
    const tr = [
      [true, 'Consent: WhatsApp marketing'], [true, 'Eligible: Platinum credit, BIN in list'], [true, 'Not suppressed'],
      [false, 'Budget: cap reached → next offer'], [true, 'Winner: Dining 10% cashback'],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 3.4 + i * 0.55, a = String(10 + i) + 'f';
      await iconDot(s, 8.85, y + 0.06, 0.34, tr[i][0] ? 'LuCheck' : 'LuX', { fill: tr[i][0] ? 'green' : 'red', a });
      txt(s, tr[i][1], { x: 9.32, y, w: 3.3, h: 0.46, fontSize: 12, color: K.ink, valign: 'middle', a });
    }
    txt(s, 'Ranking today is deterministic and explainable. ML next-best-offer scoring is on the roadmap.', { x: 0.6, y: 6.5, w: 12.1, h: 0.32, fontSize: 11, italic: true, color: K.slate, a: '15f' });
    s.addNotes('Every candidate offer passes the same ordered gates: consent before anything, then eligibility, then ISG’s Section 3 suppression rules, validity, limits and budget, then stacking. Only survivors are ranked, and the winner is stored with a trace of why. The simulator runs this exact pipeline in a rolled-back transaction, so what it says is what production will do.');
  }

  // 9. Code vault
  {
    const s = content('Code inventory', 'Codes are assigned at reveal — never at send');
    const steps = [
      ['LuSend', 'Message goes out with no code inside', 'Campaigns, journeys and WhatsApp carry the offer, not the code.'],
      ['LuFingerprint', 'Cardholder opens a trusted session', 'Authenticated app session or a single-use link tied to that cardholder.'],
      ['LuRefreshCcw', 'Eligibility re-checked live', 'Consent, limits, budget and validity checked again at the moment of reveal.'],
      ['LuKeyRound', 'One code allocated atomically', 'Two parallel taps can never receive the same code; one per cardholder.'],
      ['LuEye', 'Reveal, copy and redemption logged', 'Every event recorded and reconciled against redemptions.'],
    ];
    s.addShape(pres.shapes.LINE, { x: 0.88, y: 1.95, w: 0, h: 3.7, line: { color: K.sky, width: 2, dashType: 'dash' }, objectName: 'A1f|timeline' });
    for (let i = 0; i < 5; i++) {
      const y = 1.6 + i * 0.95, a = String(1 + i) + 'r';
      await iconDot(s, 0.6, y, 0.56, steps[i][0], { fill: i === 3 ? 'red' : 'navy', a });
      txt(s, steps[i][1], { x: 1.35, y: y - 0.02, w: 4.9, h: 0.36, fontSize: 15, bold: true, color: K.navy, a });
      txt(s, steps[i][2], { x: 1.35, y: y + 0.34, w: 4.9, h: 0.5, fontSize: 12, color: K.slate, a });
    }
    const stats = [['0', 'codes inside any message'], ['1', 'code per eligible cardholder'], ['Encrypted', 'at rest, with key rotation'], ['Rate-limited', 'claims per session & IP']];
    for (let i = 0; i < 4; i++) {
      const y = 1.6 + i * 1.2, a = String(6 + i) + 'z';
      box(s, { x: 6.55, y, w: 2.5, h: 1.05, a });
      txt(s, stats[i][0], { x: 6.7, y: y + 0.08, w: 2.2, h: 0.55, fontSize: stats[i][0].length > 2 ? 20 : 32, bold: true, color: K.red, valign: 'middle', a });
      txt(s, stats[i][1], { x: 6.7, y: y + 0.62, w: 2.25, h: 0.35, fontSize: 11.5, color: K.slate, a });
    }
    s.addImage({ data: phoneCode, x: 9.65, y: 1.5, w: 2.75, h: 5.29, objectName: 'A5z|phone code reveal', altText: 'Phone showing a revealed single-use code with key conditions beside the benefit' });
    txt(s, 'Roadmap: device and bot signals, revocation and reissue, customer-managed keys in ISG’s KMS.', { x: 0.6, y: 6.45, w: 8.6, h: 0.35, fontSize: 11, italic: true, color: K.slate, a: '10f' });
    s.addNotes('This is the strongest part of the product for 4A.4. The code is only bound to a cardholder at reveal time, inside an authenticated session, after a live eligibility re-check — so codes aren’t wasted on unread messages and can’t be harvested. Allocation is atomic under concurrency, codes are encrypted at rest and never logged in plain text.');
  }

  // 10. Card-linked swimlane
  {
    const s = content('End to end', 'A card-linked cashback offer, step by step');
    const lanes = [['Cardholder', 'LuSmartphone', 'sky'], ['DigiCRM', 'LuLayers', 'green'], ['ISG ledger & switch', 'LuLandmark', 'navy'], ['Bank CMS', 'LuBuilding2', 'slate']];
    const ly = 1.55, lh = 1.18, lx = 0.6, lw = 12.1, labW = 1.6;
    for (let i = 0; i < 4; i++) {
      const y = ly + i * lh;
      s.addShape(pres.shapes.RECTANGLE, { x: lx, y, w: lw, h: lh - 0.08, fill: { color: K[lanes[i][2]], transparency: 92 }, line: { type: 'none' }, objectName: 'A1f|lane' });
      s.addShape(pres.shapes.RECTANGLE, { x: lx, y, w: labW, h: lh - 0.08, fill: { color: K[lanes[i][2]] }, line: { type: 'none' }, objectName: 'A1f|lane label' });
      s.addImage({ data: await icon(lanes[i][1]), x: lx + 0.62, y: y + 0.14, w: 0.36, h: 0.36, objectName: 'A1f|lane icon' });
      txt(s, lanes[i][0], { x: lx + 0.08, y: y + 0.52, w: labW - 0.16, h: 0.5, fontSize: 12, bold: true, color: K.white, align: 'center', valign: 'middle', a: '1f' });
    }
    const steps = [
      [0, 'Sees offer, taps Activate'], [1, 'Checks rules, records Pending'], [2, 'Confirms activation'], [0, 'Pays at an enrolled merchant'],
      [2, 'Matches the txn from switch & settlement'], [3, 'Posts cashback after maker‑checker'], [1, 'Shows benefit, notifies, tracks progress'], [2, 'Refund? Clawback event, reconciled'],
    ];
    const colW = (lw - labW - 0.1) / 8, bw = 1.12, bh = 0.9;
    const pos = steps.map(([lane], i) => ({ x: lx + labW + 0.1 + i * colW + (colW - bw) / 2, y: ly + lane * lh + (lh - 0.08 - bh) / 2 }));
    for (let i = 0; i < 8; i++) {
      const { x, y } = pos[i], a = String(2 + i) + 'z', fill = K[lanes[steps[i][0]][2]];
      if (i > 0) {
        const p = pos[i - 1];
        line(s, p.x + bw, p.y + bh / 2, x, y + bh / 2, { color: 'slate', width: 1.5, a: String(1 + i) + 'f' });
      }
      box(s, { x, y, w: bw, h: bh, fill: K.white, line: fill, sh: true, r: 0.08, a });
      txt(s, steps[i][1], { x: x + 0.06, y: y + 0.1, w: bw - 0.12, h: bh - 0.14, fontSize: 10.5, color: K.ink, align: 'center', valign: 'middle', a });
      s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: x - 0.12, y: y - 0.12, w: 0.28, h: 0.28, fill: { color: K.red }, color: K.white, fontSize: 10, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: nm(a, 'step no') });
    }
    txt(s, 'DigiCRM never posts to card accounts and never shows a benefit as earned before ISG’s ledger confirms it.', { x: 0.6, y: 6.32, w: 12.1, h: 0.5, fontSize: 14, bold: true, color: K.red, valign: 'middle', a: '10r' });
    s.addNotes('Walk the numbers. 1–3: activation is pending in DigiCRM until ISG confirms. 4–6: the purchase is matched on ISG’s switch and settlement data and the benefit is posted by the bank CMS with maker-checker. 7: DigiCRM receives the redemption event and tells the cardholder. 8: refunds and reversals flow back as clawback events and appear in reconciliation.');
  }

  // 11. Delivery
  {
    const s = content('Delivery surfaces', 'Deliver offers wherever cardholders are');
    s.addImage({ data: phoneHub, x: 0.85, y: 1.5, w: 2.75, h: 5.29, objectName: 'A1z|phone offers hub', altText: 'Bank app Offers Hub with search, categories and activate / reveal buttons' });
    const tiles = [
      ['LuSmartphone', 'Bank app Offers Hub', 'Personalised list: save, activate, reveal code, expiry reminders. Hosted today; embeddable SDK on the roadmap.', 'Live'],
      ['LuWorkflow', 'Campaigns & journeys', 'Transaction-triggered offers — e.g. a related merchant’s offer right after a purchase.', 'Live'],
      ['LuMessageCircle', 'WhatsApp', 'Rich templates with header image and buttons, previewed before approval.', 'Live'],
      ['LuMail', 'Email offer blocks', 'Builder blocks with dynamic benefit, expiry and progress fields.', 'Live'],
      ['LuMessageSquare', 'SMS + landing page', 'Offer landing pages today; TRAI-whitelisted ISG/bank redirect domain on the roadmap.', 'Partial'],
      ['LuBell', 'Push & in-app', 'Rich push and in-app banners and cards.', 'Live'],
    ];
    for (let i = 0; i < 6; i++) {
      const x = 4.2 + (i % 2) * 4.3, y = 1.6 + Math.floor(i / 2) * 1.62, a = String(2 + i) + 'r';
      box(s, { x, y, w: 4.1, h: 1.45, a });
      await iconDot(s, x + 0.2, y + 0.22, 0.56, tiles[i][0], { fill: i % 2 ? 'sky' : 'navy', a });
      txt(s, tiles[i][1], { x: x + 0.9, y: y + 0.2, w: 2.2, h: 0.4, fontSize: 15, bold: true, color: K.navy, valign: 'middle', a });
      chip(s, x + 4.1 - 0.2 - (0.22 + tiles[i][3].length * 0.0675), y + 0.28, tiles[i][3], tiles[i][3], a);
      txt(s, tiles[i][2], { x: x + 0.9, y: y + 0.64, w: 3.05, h: 0.75, fontSize: 11.5, color: K.slate, a });
    }
    s.addNotes('Same offer, every surface. The Offers Hub is hosted today with save, activate and reveal; ISG asked for an SDK component, which is on the roadmap. Journeys can fire an offer straight after a transaction event. For SMS, ISG requires links on a TRAI-whitelisted bank or ISG domain — the redirect service for that is a roadmap item.');
  }

  // 12. Content & creative
  {
    const s = content('Content and creative', 'Multimodal content, governed end to end');
    const rows = [
      ['LuImage', 'One asset library', 'Images, GIFs, short video, carousels, HTML email blocks, WhatsApp templates, banners and rich push.'],
      ['LuLanguages', 'Variants by channel, tone and language', 'Copy variants per segment, including Indian languages — every variant goes through approval.'],
      ['LuSparkles', 'Dynamic fields at send time', 'Benefit, expiry, milestone progress and last-4 digits filled only from approved data.'],
      ['LuSplit', 'A/B and multivariate testing', 'Creative and copy tested against holdout groups, not just against each other.'],
      ['LuBot', 'AI with a human in the loop', 'AI-drafted copy needs human approval; no cardholder data is sent to outside AI services.'],
    ];
    for (let i = 0; i < 5; i++) {
      const y = 1.6 + i * 0.98, a = String(1 + i) + 'r';
      await iconDot(s, 0.6, y + 0.05, 0.62, rows[i][0], { fill: i % 2 ? 'sky' : 'navy', a });
      txt(s, rows[i][1], { x: 1.45, y, w: 6.6, h: 0.38, fontSize: 16, bold: true, color: K.navy, a });
      txt(s, rows[i][2], { x: 1.45, y: y + 0.38, w: 6.6, h: 0.55, fontSize: 12.5, color: K.slate, a });
    }
    txt(s, 'Roadmap: automatic resizing and format checks to each channel’s specification.', { x: 0.6, y: 6.5, w: 7.6, h: 0.32, fontSize: 11, italic: true, color: K.slate, a: '6f' });
    s.addImage({ data: wa, x: 8.85, y: 1.45, w: 3.25, h: 5.46, objectName: 'A3z|whatsapp preview', altText: 'WhatsApp offer message with header image, conditions and Activate button' });
    s.addNotes('4A.3 is largely platform capability we already ship: asset library, channel and language variants with approval, dynamic fields from approved data, A/B against holdouts, and AI drafting behind human approval with a privacy boundary. The phone shows a real template style: the key conditions sit next to the benefit, and the reply after Activate does not promise cashback before the bank posts it.');
  }

  // 13. Budgets, conflicts, reconciliation
  {
    const s = content('Money controls', 'Budgets, conflicts and reconciliation');
    txt(s, 'Example offer budget (illustrative)', { x: 0.6, y: 1.55, w: 6, h: 0.3, fontSize: 12, bold: true, color: K.slate, a: '1f' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.95, w: 12.1, h: 0.46, rectRadius: 0.23, fill: { color: K.navy, transparency: 90 }, line: { type: 'none' }, objectName: 'A1f|budget track' });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.95, w: 12.1 * 0.62, h: 0.46, rectRadius: 0.23, fill: { color: K.green }, line: { type: 'none' }, objectName: 'A2w|redeemed' });
    s.addShape(pres.shapes.RECTANGLE, { x: 0.6 + 12.1 * 0.62 - 0.1, y: 1.95, w: 12.1 * 0.16 + 0.1, h: 0.46, fill: { color: K.amber }, line: { type: 'none' }, objectName: 'A3w|reserved' });
    txt(s, 'Redeemed — 62%', { x: 0.8, y: 1.95, w: 3, h: 0.46, fontSize: 12, bold: true, color: K.white, valign: 'middle', a: '2w' });
    txt(s, 'Reserved — 16%', { x: 0.6 + 12.1 * 0.62 + 0.1, y: 1.95, w: 1.8, h: 0.46, fontSize: 12, bold: true, color: K.white, valign: 'middle', a: '3w' });
    s.addShape(pres.shapes.LINE, { x: 12.6, y: 1.8, w: 0, h: 0.8, line: { color: K.red, width: 2.5 }, objectName: 'A4f|cap marker' });
    txt(s, 'Cap reached → offer auto-pauses', { x: 9.6, y: 2.55, w: 3.1, h: 0.3, fontSize: 12, bold: true, color: K.red, align: 'right', a: '4f' });
    const cards = [
      ['LuGauge', 'Budgets', ['Every redemption reserves budget first — no overspend, even under concurrency', 'Live tracking per offer', 'Auto-pause when the budget is exhausted'], 'Pacing (even, front-loaded, by event): roadmap'],
      ['LuShuffle', 'Stacking & exclusivity', ['Stacking groups, exclusivity and priority', 'Deterministic tie-break with a traced winner', 'Section 3 suppression overrides every offer'], 'Conflict rules apply in the simulator too'],
      ['LuInbox', 'Reconciliation queue', ['Issued-not-redeemed and redeemed-not-posted', 'Late reversals and duplicate redemptions', 'Refunds and partial refunds claw the benefit back'], 'Nightly ledger drift check'],
    ];
    for (let i = 0; i < 3; i++) {
      const x = 0.6 + i * 4.125, y = 3.15, a = String(5 + i) + 'r';
      box(s, { x, y, w: 3.85, h: 3.4, a });
      await iconDot(s, x + 0.25, y + 0.25, 0.56, cards[i][0], { fill: i === 1 ? 'sky' : 'navy', a });
      txt(s, cards[i][1], { x: x + 0.95, y: y + 0.25, w: 2.0, h: 0.56, fontSize: 17, bold: true, color: K.navy, valign: 'middle', a });
      chip(s, x + 3.85 - 0.62, y + 0.41, 'Live', 'Live', a);
      txt(s, bullets(cards[i][2], { gap: 6 }), { x: x + 0.25, y: y + 1.0, w: 3.4, h: 1.75, fontSize: 12.5, color: K.ink, a });
      txt(s, cards[i][3], { x: x + 0.25, y: y + 2.8, w: 3.4, h: 0.4, fontSize: 11, italic: true, color: K.slate, a });
    }
    s.addNotes('Budgets are reserved before a benefit is granted, so two simultaneous redemptions can’t overspend, and the offer pauses itself when the cap is hit. Pacing strategies are roadmap. Stacking and exclusivity are enforced with a deterministic winner. The reconciliation queue surfaces mismatches between issued codes, redemptions and postings.');
  }

  // 14. Security & governance
  {
    const s = content('Trust', 'Bank-grade security and governance');
    s.addImage({ data: shieldImg, x: 5.32, y: 1.75, w: 2.7, h: 3.07, objectName: 'A1z|shield', altText: 'Security shield with lock' });
    const L = [
      ['LuBuilding2', 'Isolation per bank', 'Each bank is its own tenant; joining syndicated offers never exposes its data.'],
      ['LuUserCheck', 'Maker-checker everywhere', 'Offer approvals and ledger adjustments; no self-approval.'],
      ['LuKeyRound', 'Codes encrypted, no PAN', 'Tokens only; codes encrypted at rest with key rotation.'],
      ['LuShieldCheck', 'Consent first', 'Default-deny marketing; separate consent at claim when a brand needs data.'],
    ];
    const R = [
      ['LuClipboardCheck', 'Immutable audit trail', 'Every change, approval and decision trace is recorded.'],
      ['LuFileCheck', 'Versioned T&C', 'Approved T&C per offer; key conditions shown beside the benefit.'],
      ['LuEye', 'Data minimisation', 'Decision traces strip restricted fields; brands get no cardholder data.'],
      ['LuBot', 'AI guardrails', 'Human approval for AI copy; no cardholder data to outside models.'],
    ];
    for (const [side, items, x0] of [[0, L, 0.6], [1, R, 8.2]]) {
      for (let i = 0; i < 4; i++) {
        const y = 1.6 + i * 1.18, a = String(2 + i) + 'r';
        box(s, { x: x0, y, w: 4.5, h: 1.05, a });
        await iconDot(s, x0 + 0.2, y + 0.24, 0.56, items[i][0], { fill: side ? 'sky' : 'navy', a });
        txt(s, items[i][1], { x: x0 + 0.92, y: y + 0.12, w: 3.45, h: 0.34, fontSize: 14, bold: true, color: K.navy, a });
        txt(s, items[i][2], { x: x0 + 0.92, y: y + 0.46, w: 3.45, h: 0.55, fontSize: 11.5, color: K.slate, a });
      }
    }
    chip(s, 5.95, 5.12, 'Roadmap', 'Roadmap', '6f', 10);
    txt(s, 'Misleading-claim and dark-pattern checks, EMI cost disclosures, network brand-use rules', { x: 5.3, y: 5.45, w: 2.74, h: 0.9, fontSize: 11, color: K.slate, align: 'center', a: '6f' });
    s.addNotes('A bank risk team will probe these first. Tenant isolation is a hard gate in our test suite, which is what makes cross-bank syndication safe: participating never grants access to another bank’s data. Maker-checker covers offers and ledger adjustments. Be explicit that the CCPA dark-pattern checks and EMI disclosure templates from 4A.10 are roadmap.');
  }

  // 15. Responsibility matrix
  sec('Coverage and path');
  {
    const s = content('Who provides what', 'A clear split between DigiCRM, partners and ISG');
    const hdr = (t, fill) => ({ text: t, options: { bold: true, color: K.white, fill: { color: fill }, fontSize: 12, align: 'center', valign: 'middle' } });
    const cell = (t, role) => ({ text: t, options: { color: role ? K[ROLE[role]] : K.slate, bold: !!role, fontSize: 11, align: 'center', valign: 'middle' } });
    const cap = (t) => ({ text: t, options: { color: K.ink, fontSize: 11.5, bold: true, valign: 'middle' } });
    const rows = [
      [{ text: 'Capability', options: { bold: true, color: K.white, fill: { color: K.ink }, fontSize: 12, valign: 'middle' } }, hdr('DigiCRM', K.green), hdr('Partner', K.deep), hdr('ISG', K.navy)],
      [cap('Offer content, creative & approvals'), cell('● Native', 'DigiCRM'), cell('—'), cell('Bank compliance sign-off', 'ISG')],
      [cap('Standard offer record & lifecycle'), cell('● Native', 'DigiCRM'), cell('—'), cell('—')],
      [cap('Eligibility, ranking & conflict rules'), cell('● Native (pre-check)', 'DigiCRM'), cell('—'), cell('● Final financial eligibility', 'ISG')],
      [cap('Journeys & channel delivery'), cell('● Native', 'DigiCRM'), cell('WhatsApp BSP, SMS gateway', 'Partner'), cell('—')],
      [cap('Code vault & reveal'), cell('● Native', 'DigiCRM'), cell('Brands supply code pools', 'Partner'), cell('—')],
      [cap('Offer ledger: budgets & redemption'), cell('Mirrors status'), cell('—'), cell('● System of record', 'ISG')],
      [cap('Transaction matching'), cell('Consumes events'), cell('—'), cell('● Switch & settlement', 'ISG')],
      [cap('Benefit payout'), cell('Never posts'), cell('—'), cell('● Via CMS, maker-checker', 'ISG')],
      [cap('Network & aggregator offer feeds'), cell('◐ Intake — roadmap', 'Roadmap'), cell('● Networks, aggregators', 'Partner'), cell('—')],
      [cap('Trusted redirect & S2S tracking'), cell('◐ Service — roadmap', 'Roadmap'), cell('—'), cell('● Whitelisted domain', 'ISG')],
      [cap('Funder settlement & invoicing'), cell('Reconciliation data'), cell('—'), cell('● Settles funders', 'ISG')],
      [cap('Brand & funder portal'), cell('◐ Roadmap', 'Roadmap'), cell('Brands self-serve'), cell('—')],
    ];
    s.addTable(rows, {
      x: 0.6, y: 1.55, w: 12.1, colW: [4.3, 2.6, 2.6, 2.6], rowH: 0.37,
      border: { type: 'solid', pt: 0.75, color: 'E2E8F0' }, fill: { color: K.white }, margin: [0.03, 0.1, 0.03, 0.12],
      objectName: 'responsibility matrix',
    });
    txt(s, '●  provides it    ◐  DigiCRM roadmap    —  no role', { x: 0.6, y: 6.5, w: 8, h: 0.3, fontSize: 11, color: K.slate, a: '1f' });
    s.addNotes('This answers ISG’s explicit question: what is native, what comes from partners and what ISG provides. The pattern: DigiCRM owns content, targeting and delivery; ISG owns every money-touching system of record; partners supply codes, feeds and channel transport. The half-filled rows are DigiCRM roadmap.');
  }

  // 16. Coverage chart
  {
    const s = content('Where we stand', 'Coverage against ISG section 4A');
    const cats = ['4A.1 Offer types', '4A.2 Ingestion', '4A.3 Content & creative', '4A.4 Code inventory', '4A.5 Links & tracking', '4A.6 Eligibility & budgets', '4A.7 Delivery surfaces', '4A.8 Redemption & recon', '4A.9 Brand portal', '4A.10 Governance'];
    s.addChart(pres.charts.BAR, [
      { name: 'Live in DigiCRM today', labels: cats, values: [3, 2, 5, 4, 0, 3, 3, 2, 1, 2] },
      { name: 'ISG / partner, by design', labels: cats, values: [4, 0, 0, 0, 1, 0, 0, 3, 0, 0] },
      { name: 'DigiCRM roadmap', labels: cats, values: [3, 2, 1, 1, 4, 1, 1, 1, 2, 3] },
    ], {
      x: 0.5, y: 1.5, w: 8.4, h: 5.0, barDir: 'bar', barGrouping: 'stacked', barGapWidthPct: 40,
      chartColors: ['047857', '223A87', 'B45309'],
      showValue: true, dataLabelPosition: 'ctr', dataLabelColor: 'FFFFFF', dataLabelFontSize: 10, dataLabelFontBold: true, dataLabelFormatCode: '0;;;', dataLabelFontFace: '+mn-lt',
      catAxisLabelColor: '334155', catAxisLabelFontSize: 11, catAxisLabelFontFace: '+mn-lt', catAxisOrientation: 'maxMin', catAxisLineShow: false,
      valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      showLegend: true, legendPos: 'b', legendFontSize: 11, legendFontFace: '+mn-lt', legendColor: '334155',
      objectName: 'coverage chart',
    });
    const st = [['25', 'line items live in DigiCRM today', 'green'], ['8', 'handled by ISG or partners, by design', 'navy'], ['19', 'on the DigiCRM roadmap', 'amber']];
    for (let i = 0; i < 3; i++) {
      const y = 1.6 + i * 1.55, a = String(1 + i) + 'z';
      box(s, { x: 9.25, y, w: 3.45, h: 1.35, a });
      txt(s, st[i][0], { x: 9.45, y: y + 0.12, w: 1.3, h: 1.1, fontSize: 48, bold: true, color: K[st[i][2]], valign: 'middle', a });
      txt(s, st[i][1], { x: 10.65, y: y + 0.12, w: 1.9, h: 1.1, fontSize: 13, color: K.ink, valign: 'middle', a });
    }
    txt(s, 'DigiDelight self-assessment of the 52 line items in ISG’s section 4A, to be validated together in a workshop.', { x: 0.6, y: 6.55, w: 12.1, h: 0.3, fontSize: 11, italic: true, color: K.slate, a: '4f' });
    s.addNotes('Honest scorecard. The live items cluster where the risk is highest — code security, eligibility, lifecycle governance, consent and delivery. The roadmap clusters on the supply side (intake, links and tracking, brand portal) and on a few compliance checks. Offer it as a working draft to validate with ISG.');
  }

  // 17. Roadmap
  {
    const s = content('Path to go-live', 'From pilot to full section 4A coverage');
    const ph = [
      ['Phase 0', 'Pilot on what is live', 'green', ['One bank tenant, Mode A programme', 'ISG ledger API contract: activate, confirm, budget, redemption', 'Codes, activation and cashback offers', 'Offers Hub, WhatsApp, email, journeys']],
      ['Phase 1', 'Supply side', 'navy', ['Partner and network feeds, CSV/SFTP intake', 'De-duplication and merchant master validation', 'Multi-funder offer record', 'Approval routing by source, funder and risk']],
      ['Phase 2', 'Links and experience', 'deep', ['Redirect service on ISG / bank domain', 'Opaque tokens and server-to-server postbacks', 'Hub SDK with search and categories', 'Budget pacing, fraud and bot signals']],
      ['Phase 3', 'Ecosystem and intelligence', 'red', ['Brand and funder portal, min-group reporting', 'Incrementality and ROI by funder', 'ML next-best-offer ranking', 'Dark-pattern checks and EMI disclosures']],
    ];
    for (let i = 0; i < 4; i++) {
      const x = 0.6 + i * 3.0, a = String(1 + i) + 'r';
      s.addShape(i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, { x, y: 1.65, w: 3.1, h: 0.95, fill: { color: K[ph[i][2]] }, line: { type: 'none' }, objectName: nm(a, 'phase arrow') });
      txt(s, [{ text: ph[i][0], options: { fontSize: 12, bold: true, breakLine: true } }, { text: ph[i][1], options: { fontSize: 15, bold: true } }], { x: x + (i ? 0.5 : 0.25), y: 1.65, w: 2.3, h: 0.95, color: K.white, valign: 'middle', a });
      box(s, { x: x + 0.05, y: 2.9, w: 2.8, h: 3.3, a });
      txt(s, bullets(ph[i][3], { gap: 10 }), { x: x + 0.22, y: 3.1, w: 2.5, h: 3.0, fontSize: 13.5, color: K.ink, a });
    }
    txt(s, 'Scope and sequencing to be finalised with ISG in a joint workshop.', { x: 0.6, y: 6.45, w: 12.1, h: 0.32, fontSize: 11, italic: true, color: K.slate, a: '5f' });
    s.addNotes('Phase 0 is a pilot that uses only what is live today plus the ISG ledger API integration — it proves the ownership model end to end. Phases 1 to 3 close the roadmap items from the scorecard. No dates on this slide: sequencing should be agreed with ISG.');
  }

  // 18. Demo plan
  {
    const s = content('Live demo', 'What you will see today');
    const d = [
      ['Two programmes, two ledgers', 'Card-linked cashback on an external ledger beside DigiCRM-run rewards.'],
      ['Build, simulate and approve an offer', 'Maker-checker approval and the simulator explaining eligibility, caps and stacking.'],
      ['Activate a card-linked offer', 'Stays pending until the ledger confirms — never shown as earned too early.'],
      ['Reveal a single-use code', 'Assigned only on authenticated reveal; two parallel reveals get two different codes.'],
      ['WhatsApp offer and journey', 'Rich template with image and buttons, triggered by a transaction event.'],
      ['Reconciliation and audit', 'Exception queue, immutable ledger journal and full audit trail.'],
    ];
    for (let i = 0; i < 6; i++) {
      const col = i % 3, row = Math.floor(i / 3);
      const x = 0.6 + col * 4.125, y = 1.65 + row * 2.6, a = String(1 + i) + 'r';
      box(s, { x, y, w: 3.85, h: 2.4, a });
      txt(s, '0' + (i + 1), { x: x + 0.28, y: y + 0.18, w: 1.2, h: 0.7, fontSize: 40, bold: true, color: K.red, a });
      txt(s, d[i][0], { x: x + 0.28, y: y + 0.92, w: 3.35, h: 0.4, fontSize: 16, bold: true, color: K.navy, a });
      txt(s, d[i][1], { x: x + 0.28, y: y + 1.36, w: 3.35, h: 0.9, fontSize: 14, color: K.slate, a });
    }
    s.addNotes('Demo script, about 20 minutes. Uses the Nivaan Bank sample tenant (synthetic data). Keep the partner-confirmation step visible in step 3 — it is the clearest proof of the ownership principle.');
  }

  // 19. Close
  {
    const s = pres.addSlide({ masterName: 'DARK', sectionTitle: section });
    txt(s, 'NEXT STEPS', { x: 0.6, y: 0.9, w: 6, h: 0.3, fontSize: 13, bold: true, color: K.white, charSpacing: 3, a: '1r' });
    txt(s, 'Let’s build ISG’s offer layer together', { x: 0.6, y: 1.3, w: 6.6, h: 1.4, fontSize: 38, bold: true, color: K.white, a: '1r' });
    const n = [
      ['Validate the split', 'Joint workshop on the responsibility matrix and 4A scorecard.'],
      ['Agree the ledger API', 'Activate, confirm, budget and redemption events with ISG’s ledger.'],
      ['Pick a pilot', 'One bank and a first set of offers on what is live today.'],
    ];
    for (let i = 0; i < 3; i++) {
      const y = 3.05 + i * 1.08, a = String(2 + i) + 'r';
      s.addText(String(i + 1), { shape: pres.shapes.OVAL, x: 0.6, y, w: 0.62, h: 0.62, fill: { color: K.red }, color: K.white, fontSize: 20, bold: true, align: 'center', valign: 'middle', margin: 0, isTextBox: true, objectName: nm(a, 'num') });
      txt(s, n[i][0], { x: 1.45, y: y - 0.04, w: 5.6, h: 0.38, fontSize: 18, bold: true, color: K.white, a });
      txt(s, n[i][1], { x: 1.45, y: y + 0.34, w: 5.6, h: 0.4, fontSize: 13, color: K.white, a });
    }
    s.addImage({ data: hero, x: 7.4, y: 1.0, w: 5.3, h: 4.47, objectName: 'A1z|hero', altText: 'Bank cards and offer illustration' });
    s.addImage({ data: logo, x: 7.9, y: 5.85, w: 0.6, h: 0.6, objectName: 'A5f|logo', altText: 'DigiDelight logo' });
    txt(s, [{ text: 'Thank you', options: { fontSize: 24, bold: true, breakLine: true } }, { text: 'DigiDelight  ·  digidelight.com', options: { fontSize: 13 } }], { x: 8.65, y: 5.75, w: 4.1, h: 0.85, color: K.white, valign: 'middle', a: '5f' });
    s.addNotes('Close with three concrete asks. The responsibility matrix and scorecard are working drafts — invite ISG to correct them.');
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log('wrote', OUT);
}

main().catch((e) => { console.error(e); process.exit(1); });
